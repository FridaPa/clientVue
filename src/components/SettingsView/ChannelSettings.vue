<template>
  <v-main>
    <v-navigation-drawer v-model="drawer" app>
      <v-list class="pa-0" v-for="(channel, i) in channels" :key="i" dense>
        <v-list-item id="listItem" @click="onSelectionChangedChannel(channel.channelID, channel.channel)" link>
          <v-list-item-content>
            <v-list-item-title>{{channel.channel}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar>
      <v-app-bar-nav-icon class="toolbarIcon" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title v-if="selectedChannel == ''" class="toolbarTitle">Välj Kanal</v-toolbar-title>
       <v-toolbar-title  class="toolbarTitle">{{channelName}}</v-toolbar-title>
      <v-spacer></v-spacer>
      <CreateChannelConfig v-if="selection" @createNewConfig="createNewConfig" />
    </v-toolbar>

    <v-row>
      <div v-if="settings.length > 0" class="listDiv">
        <v-toolbar class="toolbarMail" height="30px" color="#177CC4" dark>
          <v-spacer />
          <v-toolbar-title class="toolbar">Kontaktuppgifter</v-toolbar-title>
          <v-spacer />
        </v-toolbar>
        <v-list v-for="(setting, i) in settings" :key="i" id="contentList" class="pa-0">
          <v-list-item>
            <v-row>
              <v-col cols="6">
                <v-row>
                  <v-text-field class="textfield"
                    v-if="editConfigValue == settings[i].configID"
                    v-model="settings[i].configValue"
                    :label="setting.configKey"
                  ></v-text-field>
                  <p
                    class="vertical"
                    v-if="settings[i].configID != editConfigValue"
                  >{{setting.configKey}}: {{setting.configValue}}</p>
                </v-row>
              </v-col>
              <v-col v-if="settings[i].configID != editConfigValue" cols="4"></v-col>
              <v-col v-if="settings[i].configID == editConfigValue" cols="1"></v-col>
              <v-col cols="1.5">
                <v-row>
                  <v-icon
                    class="pa-0"
                    color="#177CC4"
                    @click="setEdit(settings[i].configID)"
                  >mdi-square-edit-outline</v-icon>
                  <DeleteConfigDialogue :config="setting" @deleteConfig="deleteConfig" />
                </v-row>
              </v-col>
              <v-col cols="3" v-if="settings[i].configID == editConfigValue">
                <button
                  class="buttonstyle"
                  @click="onSaveSettings(settings)"
                >SPARA</button>
              </v-col>
            </v-row>
          </v-list-item>
        </v-list>
      </div>
    </v-row>
  </v-main>
</template>

<script>
import api from "../../services/BroadcastApiService";
import CreateChannelConfig from "./CreateChannelConfig";
import DeleteConfigDialogue from "./DeleteConfigDialogue";
export default {
  name: "ChannelSettings",
  components: {
    CreateChannelConfig,
    DeleteConfigDialogue
  },
  data() {
    return {
      channelName: "",
      drawer: false,
      selectedChannel: "",
      selection: false,
      channels: [],
      editConfigValue: "",
      buttonText: "Välj Kanal",
      settings: []
    };
  },
  methods: {
    setEdit(value){
      this.editConfigValue = value;
    },
    deleteConfig(id) {
      api
        .delete("api/ChannelConfig/" + id)
        .then((this.settings = this.settings.filter(a => a.configID !== id)))
        .catch(error => console.error(error));
    },
    createNewConfig(value) {
      let timeStamp = new Date();
      timeStamp.toString();
      value.createdAt = timeStamp;
      value.channelID = this.selectedChannel;
      api
        .post("api/ChannelConfig", value)
        .then(this.settings.push(value))
       .catch(error => console.error(error));
    },
    getChannels(from) {
      api
        .get("api/Front/ChannelLogStatus/" + from + "/" + from)
        .then(response => {
          for (var i = 0; i < response.length; i++) {
            this.channels = response[i].info.missing;
            this.channels.sort((a, b) => a.channel.localeCompare(b.channel));
          }
        })
       .catch(error => console.error(error));
    },
    onSelectionChangedChannel(id, name) {
      this.channelName = name;
      this.selection = true;
      this.selectedChannel = id;
      this.settings = [];
      this.drawer = false;
      api
        .get("api/ChannelConfig/channel/" + id)
        .then(result => {
          this.settings = result;
        })
        .catch(error => console.error(error));
    },
    onSaveSettings(settings) {
      this.settings = settings;
      api
        .put("api/ChannelConfig", this.settings)
       .catch(error => console.error(error));
      this.edit = "";
    }
  },
  mounted() {
    let date = new Date();
    let currentDate =
      date.getFullYear() +
      ("0" + (date.getMonth() + 1)).slice(-2) +
      ("0" + date.getDate()).slice(-2);
    this.getChannels(currentDate, currentDate);
  }
};
</script>

<style scoped>
.toolbarIcon {
  margin-left: 0px !important;
}
.textfield {
  margin-left: 10px;
}
.buttonstyle {
  padding: 5px 30px 5px 30px;
  border-radius: 5px;
  font-size: 12px;
  color: white;
  background-color: #177CC4;
}
.toolbarMail {
  border-radius: 3px;
}
.channelSettings {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  font-weight: 100;
  margin-top: 20px;
  margin-bottom: 30px;
}
#contentList {
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.4);
  margin-bottom: 7px;
  border-radius: 5px;
  font-size: 13px;
  width: 550px;
}
.toolbar {
  font-size: 14px;
}
.listDiv {
  margin-bottom: 50px;
  margin-left: 30px;
  margin-top: 30px;
}
.vertical {
  margin-left: 10px;
}
.toolbarTitle {
  color:grey;
}
</style>