<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" width="1000px">
      <template v-slot:activator="{on}">
        <v-btn elevation="0" color="white" @click="activateDialog()">
          <v-icon color="blue">mdi-square-edit-outline</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="searchProgram">Sök efter Program</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="3" sm="6" md="3">
                <v-text-field v-model="searchTitle" label="Programtitel..."></v-text-field>
              </v-col>
              <br/>
              <v-col cols="3" sm="6" md="3">
                <v-text-field v-model="searchSeason" label="Säsong..."></v-text-field>
              </v-col>
              <br/>
              <v-col cols="3">
                <v-text-field v-model="searchEpisode" label="Episod..."></v-text-field>
              </v-col>

              <CreateNewProgram :channel="channel.channelID" @createProgram="createProgram"/>
            </v-row>
            <span v-for="(program, i) in programList" :key="i" no-action>
              <v-list>
                <v-list-item>
                  <v-list-item-content class="pa-0" id="fonts">
                    <v-row>
                      <v-col cols="1">{{program.channelName ? program.channelName : '?'}}</v-col>
                      <v-col cols="2">{{program.originalTitle ? program.originalTitle : '?'}}</v-col>
                      <v-col cols="1">
                        <v-row>
                          <v-col cols="6" class="pa-0">{{program.season ? program.season :'?'}}</v-col>
                          <v-col cols="6" class="pa-0">{{program.episode ? program.episode :'?' }}</v-col>
                        </v-row>
                      </v-col>
                      <v-col cols="2">{{program.genre1Name? program.genre1Name :'?' }}</v-col>
                      <v-col cols="2">{{program.genre2Name ? program.genre2Name :'?'}}</v-col>
                      <v-col cols="2">{{program.genre3Name ? program.genre3Name : '?' }}</v-col>
                      <v-col cols="2">
                        <v-btn @click="onSelectProgram(program)">Välj</v-btn>
                      </v-col>
                    </v-row>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </span>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <button class="btnDialogCancel" text @click="onClose()">STÄNG</button>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
  import CreateNewProgram from "../../Program/CreateNewProgram";
  import api from "../../../services/BroadcastApiService";

  export default {
    name: "SearchProgramDialogue",
    props: ["channel"],
    components: {
      CreateNewProgram,
    },
    data() {
      return {
        dialog: false,
        isVisible: true,
        programList: [],
        maxEntries: 10,
        searchTitle: "",
        searchSeason: "",
        searchEpisode: "",
        isTyping: false,
        broadcastProgramObject: {},
        timeout: null
      };
    },
    methods: {
      onClose() {
        this.dialog = false;
      },
      onSelectProgram(program) {
        this.$emit("onSelectedProgram", program)
        this.onClose();
      },
      createNewBroadcast(value) {
        this.broadcast.metaProgramID = value.metaProgramID;
        this.broadcast.startDate = this.match.startDate;
        this.broadcast.endDate = this.match.endDate;
        this.broadcast.logID = this.match.logID;
        this.broadcast.programCode = value.programCode;
        this.broadcast.channelID = this.match.channelID;
        this.match.originalTitle = value.programTitle;
        this.match.season = value.season;
        this.match.episode = value.episode;

        this.$emit("selectedNewMatch", {
          metaBroadcastID: this.match.metaBroadcastID,
          broadcast: this.broadcast
        });
        this.dialog = false;
      },
      createProgram(value) {
        let program = {};
        program.originalTitle = value.originalTitle;
        program.territoryCode = value.territoryCode;
        program.targetGroupCode = value.targetGroupCode;
        program.programTitle = value.originalTitle;
        program.programShortTitle = value.originalTitle;
        program.channelID = this.channel.channelID;
        program.channelName = this.channel.channelName;
        program.season = value.season;
        program.episode = value.episode;
        program.genre1Name = value.genre1Name;
        program.genre2Name = value.genre2Name;
        program.genre3Name = value.genre3Name;
        program.genre1ID = value.genre1ID;
        program.genre2ID = value.genre2ID;
        program.genre3ID = value.genre3ID;
        this.$emit("onSelectedProgram", program)

        this.onClose();
      },
      getPrograms() {
        api
          .get("api/Programs?searchTitle=" + this.searchTitle + "&channelID=" + this.channel.channelID)
          .then(response => {
            this.programList = response.slice(0, this.maxEntries);
          })
          .catch(error => alert("Error - " + error));
      },
      activateDialog() {
        this.dialog = true;
      }
    },
    mounted() {
    },
    watch: {
      searchTitle: function (val) {
        if (this.timeout != null) {
          window.clearTimeout(this.timeout);
        }
        if (val.length > 3) {
          this.timeout = setTimeout(() => {
            this.getPrograms();
          }, 1000);
        }
      }
    }
  };
</script>

<style scoped>
  .searchProgram {
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    font-weight: 100;
  }

  .btnDialogAccept,
  .btnDialogCancel, .btnDialogueOpen {
    border-radius: 5px;
    margin-right: 10px;
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    font-weight: 100;
    transition: 0.3s;
  }

  .btnDialogueOpen {
    padding: 8px 20px;
    background-color: #177cc4 !important;
    color: cornsilk;

  }

  .btnDialogAccept {
    padding: 8px 34px;
    background-color: #177cc4;
    color: cornsilk;
  }

  .btnDialogCancel {
    padding: 8px 34px;
    border: 1px solid #177cc4;
    color: #177cc4;
  }

  #fonts {
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    font-weight: normal;
    color: #4a4c4e;
  }

  .extraContent {
    width: 98%;
    margin-left: 1%;
    background-color: red;
  }

  .v-list {
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.4);
    margin-bottom: 7px;
    border-radius: 5px;
    font-size: 13px;
    padding: 0px !important;
  }

  .v-sheet .v-sheet--title .theme--light .v-toolbar {
    border-radius: 4px;
  }

  .flex.offset-sm3 {
    margin-left: 5%;
  }
</style>
