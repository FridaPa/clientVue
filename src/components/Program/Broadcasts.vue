<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="700px">
      <template v-slot:activator="{on}">
        <button class="btnDialogAccept" @click="dialog = true">Se sändningar</button>
      </template>
      <v-card>
        <v-card-title>
          <span class="getBroadcasts">Sändningar för {{title}} säsong {{season}} episod {{episode}}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-col cols="10">
              <button
                class="preliminary"
                v-bind:class="{ activeButton: (this.active == 'preliminary') }"
                v-on:click="makeActive('preliminary')"
              >Preliminära sändningar</button>
              <button
                class="actual"
                v-bind:class="{ activeButton: (this.active == 'actual') }"
                v-on:click="makeActive('actual')"
              >Faktiska sändningar</button>
              <v-toolbar class="toolbar" color="#177CC4" height="50px">
                <v-row>
                  <v-col cols="3">
                    <p class="toolbarFont">Kanal</p>
                  </v-col>
                  <v-col cols="3">
                    <p class="toolbarFont">Sändningsdag</p>
                  </v-col>
                  <v-col cols="3">
                    <p class="toolbarFont">Starttid</p>
                  </v-col>
                  <v-col cols="3">
                    <p class="toolbarFont">Sluttid</p>
                  </v-col>
                </v-row>
              </v-toolbar>
              <span v-for="(broadcast, i) in activeList" :key="i" no-action>
                <v-list class="test">
                  <v-list-item>
                    <v-list-item-content class="pa-0" id="fonts">
                      <v-row>
                        <v-col cols="3">{{broadcast.channelName ? broadcast.channelName : '?'}}</v-col>
                        <v-col cols="3">{{dateToyymmddFormat(broadcast.startDate) }}</v-col>
                        <v-col cols="3">{{dateToTimeStamp(broadcast.startDate)}}</v-col>
                        <v-col cols="3">{{dateToTimeStamp(broadcast.endDate)}}</v-col>
                      </v-row>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </span>
            </v-col>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <button class="btnDialogCancel" text @click="onClose()">STÄNG</button>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import api from "../../services/BroadcastApiService";
export default {
  name: "Broadcasts",
  props: ["program"],
  data() {
    return {
      active: "preliminary",
      preliminaryBroadcasts: "",
      actualBroadcasts: "",
      dialog: false,
      metaProgramID: this.program?.metaProgramID,
      title: this.program?.originalTitle,
      season: this.program?.season,
      episode: this.program?.episode,
      broadcastList: []
    };
  },
  methods: {
    makeActive(item) {
      this.active = item;
    },
    dateToTimeStamp(item) {
      let date = new Date(item);
      return date.toLocaleTimeString("sv-SE", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      });
    },
    dateToyymmddFormat(item) {
      let date = new Date(item);
      return date.toLocaleDateString("sv-SE", {});
    },
    onClose() {
      this.dialog = false;
    },
    getBroadcasts() {
      api
        .get("/api/programs/" + this.metaProgramID + "/broadcasts")
        .then(response => {
          this.preliminaryBroadcasts = response.filter(
            data => data.preliminary == true
          );
          this.actualBroadcasts = response.filter(
            data => data.preliminary == false
          );
        })
        .catch(error => alert(`Error: ${error}`));
    }
  },
  computed: {
    activeList() {
      if (this.active == "preliminary") {
        return this.preliminaryBroadcasts;
      } else {
        return this.actualBroadcasts;
      }
    }
  },
  mounted() {
    this.getBroadcasts();
  }
};
</script>


<style scoped>
.preliminary,
.actual {
  padding: 8px 34px;
  border-radius: 5px;
  margin-right: 10px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  font-weight: 100;
  transition: 0.3s;
  border: 1px solid #177cc4;
  color: #177cc4;
  margin-bottom: 15px;
}
.activeButton {
  background-color: #177cc4;
  color: cornsilk;
}

.toolbarFont {
  color: white;
}

.toolbar {
  border-radius: 5px;
}
#fonts {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  font-weight: normal;
  color: #4a4c4e;
}

.test {
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.4);
  margin-bottom: 7px;
  border-radius: 5px;
  font-size: 13px;
  padding: 0px !important;
}
.getBroadcasts {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  font-weight: 100;
}

.btnDialogAccept,
.btnDialogCancel {
  margin-left: 10px;
  padding: 8px 34px;
  border-radius: 5px;
  margin-right: 10px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  font-weight: 100;
  transition: 0.3s;
}
.btnDialogAccept {
  background-color: #177cc4;
  color: white;
}

.btnDialogCancel {
  border: 1px solid #177cc4;
  color: #177cc4;
}

.v-dialog {
  max-width: 700px;
}
</style>