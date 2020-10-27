<template>
  <v-main>
    <v-card class="topCard">
      <v-row class="v-row-group">
        <v-col cols="6">
          <UnhandledDates @datePressed="dateChanged"/>
        </v-col>
        <v-row>
          <v-btn depressed color="primary" class="buttonstyle" @click="approveLog()">Godkänn log</v-btn>
          <MailDialogue :errors="getErrors()" :enabled="hasChosenChannel"/>
        </v-row>
      </v-row>
    </v-card>

    <v-card class="channelCard">
      <PGChannels :channels="channelInfo" @onChannelPressed="channelChanged"/>
    </v-card>
    <v-row v-if="requiresOverride">
      <v-col/>
      <v-col>
        <v-btn @click="overrideLog">Override</v-btn>
      </v-col>
      <v-col/>
    </v-row>

    <v-row class="generalSpacing">
      <v-col cols="5">
        <v-toolbar height="20px" color="#075CA4" dark>
          <v-spacer/>
          <v-toolbar-title class="toolbar">PG logg</v-toolbar-title>
          <v-spacer/>
        </v-toolbar>
        <v-toolbar class="toolbar" height="20px" color="#177CC4" dark>
          <v-row>
            <v-col v-for="title in tvToolbarTitles" :key="title">{{title}}</v-col>
          </v-row>
        </v-toolbar>
      </v-col>
      <v-col cols="6.5" class="alignright">
        <v-toolbar height="20px" color="#075CA4" dark>
          <v-spacer/>
          <v-toolbar-title class="toolbar">Tablå</v-toolbar-title>
          <v-spacer/>
        </v-toolbar>
        <v-toolbar height="20px" class="toolbar" color="#177CC4" dark>
          <v-row>
            <v-col v-for="title in epgToolbarTitles" :key="title">{{title}}</v-col>
          </v-row>
        </v-toolbar>
      </v-col>
    </v-row>

    <vue-context ref="epgMenu">
      <li>
        <a href="#" @click.prevent="addEmptyEntry">Lägg till rad efter</a>
      </li>
      <li>
        <a href="#" @click.prevent="sortList">Sortera</a>
      </li>
    </vue-context>
    <v-list class="contentText">
      <v-list-item :class="requiresOverride ? 'disabled' : ''" v-for="(entry, i) in pgEpgEntries" :key="entry.changed"
                   @contextmenu.prevent="$refs.epgMenu.open" :disabled="requiresOverride">

        <v-overlay
                :absolute="true"
                :opacity="0.4"
                :value="requiresOverride"
                color="red"
                z-index="5"
        />
        <v-overlay
                :absolute="true"
                :opacity="0.4"
                :value="selectedChannel.state === 'Approved'"
                color="green"
                z-index="5"
        />
        <PgEpgEntry :data="entry" :index="i" :pg-col-width="pgColWidth" :epg-col-width="epgColWidth"
                    @onErrors="pgEntryErrors" @onRemoveEpgEntry="onRemovePgEntry" :save-log="updateEntries"
                    :is-empty="entry.isEmpty" :logState="selectedChannel.state"/>
      </v-list-item>
    </v-list>

  </v-main>
</template>

<script>
  import MailDialogue from "./SubComponents/MailDialogue";
  import {AuthenticationContext} from "vue-adal";
  import api from "../../services/BroadcastApiService";
  import UnhandledDates from "./SubComponents/UnhandledDates";
  import PGChannels from "./SubComponents/PGChannels";
  import PgEpgEntry from "./SubComponents/PgEpgEntry";
  import {VueContext} from 'vue-context';
  import 'vue-context/dist/css/vue-context.css';

  export default {
    name: "PgEpg",
    components: {
      PgEpgEntry,
      PGChannels,
      UnhandledDates,
     VueContext,
      MailDialogue
    },
    data() {
      return {
        channelInfo: [],
        pgEpgEntries: [],
        pgColWidth: 5,
        epgColWidth: 6.5,
        maxEntries: 0,
        errors: [],
        entries: [],
        updateEntries: false,
        hasChosenChannel: false,
        selectedDate: '',
        selectedChannel: null,
        requiresOverride: false,
        tvToolbarTitles: ["Kanal", "Sändningsdag", "Titel", "Start/sluttid"],
        epgToolbarTitles: [
          "Start/sluttid",
          "",
          "Program",
          "",
          "Säsong",
          "Episod",
          "Sändningsdag",
          "",
        ]
      };
    },
    methods: {
      dateChanged(date) {
        this.selectedDate = date;
        this.loadChannelsForDate(date);
      },
      loadChannelsForDate(date) {
        api
          .get("/api/Front/ChannelLogStatus/" + date + "/" + date)
          .then(response => {
            if (response.length > 0) {
              // todo: change this when the API is changed to only take a single date
              this.channelInfo = response[0].info.received;
              this.channelInfo.push(...response[0].info.missing);
            } else {
              console.error("Something went wrong when getting channel logs");
            }
          })
          .catch(error => console.error(error));
      },
      channelChanged(channel) {
        this.selectedChannel = channel;

        this.requiresOverride = !channel.state || channel.state === 'FailedTechnicalValidation';

        if (!channel.state)
        {
          this.clearEpgEntries();
          this.addEmptyEntry();
          this.hasChosenChannel = true;
          this.errors = [];
          return;
        }
        
        let date = this.$helpers.convertToApiDate(channel.validFor);

        
        // Saving these until I fix the entries
        api
          .get("api/broadcasts/PgEpg/" + channel.channelID + "/" + date)
          .then(response => {
            // check which list is the longest
            this.clearEpgEntries();
            let maxEntries = response.epgEntries.length >= response.pgEntries.length ?
              response.epgEntries.length : response.pgEntries.length;
            
            for (let i = 0; i < maxEntries; i++) {
              let entry = {
                pg: response.pgEntries ? response.pgEntries[i] : null,
                epg: response.epgEntries ? response.epgEntries[i] : null,
                channelInfo: channel,
                changed: (i + 1) * 1000,
              }
              this.addEntryToPgEpg(entry)
            }

            this.hasChosenChannel = true;
            this.errors = [];
          })
          .catch(error => console.error(error));
      },
      clearEpgEntries() {
        this.pgEpgEntries = [];
      },

      addEntryToPgEpg(entry) {
        if (!entry.pg && !entry.epg && entry.channelInfo) {
          console.error("Entry lacks information");
          console.error(entry);
          return;
        }
        this.pgEpgEntries.push(entry);
      },
      addEmptyEntry() {
        let entry = {
          pg: {},
          epg: {},
          channelInfo: this.selectedChannel,
          changed: ((this.pgEpgEntries.length ?? 1) + 100) * 1000,
          isEmpty: true
        };
        this.pgEpgEntries.push(entry);
      },
      approveLog() {
        this.updateEntries = true;
        let entriesToSave = [];
        for (let i = 0; i < this.pgEpgEntries.length; ++i) {
          entriesToSave.push(this.pgEpgEntries[i].epg);
        }
        api
          .put("api/Broadcasts/ApproveLog/" + this.selectedDate + "/Erik", entriesToSave) // todo sätt rätt namn
          .catch(error => {
            console.error(error);
          });
      },
      saveLog() {
        this.updateEntries = true;
        let entriesToSave = [];
        for (let i = 0; i < this.pgEpgEntries.length; ++i) {
          entriesToSave.push(this.pgEpgEntries[i].epg);
        }
        api
          .put("api/Broadcasts/", entriesToSave)
          .catch(error => {
            console.error(error);
          });
      },
      getErrors() {
        return this.errors;
      },
      pgEntryErrors(errors, index) {
        this.errors = this.errors.filter(x => x.index !== index);
        this.errors.push({index: index, error: errors});
      },
      onRemovePgEntry(index) {
        if (this.pgEpgEntries[index].isEmpty) { // Was Created without pg match, so we just remove both completely
          for (let i = index; i < this.pgEpgEntries.length - 1; ++i) {
            this.pgEpgEntries[i] = this.pgEpgEntries[i + 1];
          }
          this.pgEpgEntries.pop();
        } else {
          for (let i = index; i < this.pgEpgEntries.length; ++i) {
            if (this.pgEpgEntries[i + 1]?.epg) {
              this.pgEpgEntries[i].epg = this.pgEpgEntries[i + 1].epg;
            } else {
              this.pgEpgEntries[i].epg = null;
            }
            this.pgEpgEntries[i].changed += 1;
          }
        }
      },
      overrideLog() {
        api.put('/api/Broadcasts/Override/' + this.selectedChannel.logID)
          .then(() => {
            this.selectedChannel.state = 'Override';
            this.requiresOverride = false;
          })
          .catch(error => console.error(error));
        
      },
      sortList() {
        this.pgEpgEntries.sort((a, b) => {
          if (!a.epg || !b.epg) {
            return 1;
          }
          let aDate = new Date(a.epg.startDate);
          let aHours = aDate.getHours();
          aHours = aHours - 2;
          if (aHours < 0) {
            aHours += 24;
          }
          aDate.setHours(aHours);

          let bDate = new Date(b.epg.startDate);
          let bHours = bDate.getHours();
          bHours = bHours - 2;
          if (bHours < 0) {
            bHours += 24;
          }
          bDate.setHours(bHours);

          let varA = this.$helpers.dateToTimeStamp(aDate);
          let varB = this.$helpers.dateToTimeStamp(bDate);

          if (varA > varB)
            return 1
          else if (varA === varB)
            return 0
          else
            return -1
        })
      }
    },
    mounted() {
    },
    computed: {
      userProfile: function () {
        return AuthenticationContext.user.profile;
      }
    }

  };
</script>

<style scoped>
  .topCard, .channelCard {
    width: 96%;
    margin: 0 2% 10px 2%;
    padding-left: 20px;
    padding-right: 20px;
  }

  .contentText {
    border-radius: 5px;
    font-size: 13px;
    padding: 0px;
    margin-left: 6px;
    margin-right: 6px;
  }

  .toolbar {
    font-size: 14px;

  }

  .generalSpacing {
    margin-left: 10px;
    margin-right: 10px;
    margin-bottom: -12px;
  }

</style>