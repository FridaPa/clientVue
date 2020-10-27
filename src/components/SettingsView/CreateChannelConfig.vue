<template>
  <div>
    <v-dialog v-model="dialog" persistent max-width="600px">
      <template v-slot:activator="{on}">
        <v-btn depressed color="#177CC4" class="btnDialogue" @click="dialog = true">Lägg till ny</v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="newConfig">Lägg till ny info</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-col cols="6">
              <v-text-field label="Typ" v-model="configObject.configKey" required />
            </v-col>
            <v-col cols="6">
              <v-text-field label="Innehåll" v-model="configObject.configValue" required />
            </v-col>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <button class="btnDialogAccept" text @click="createChannelConfig()">Lägg till</button>
          <button class="btnDialogCancel" text @click="onClose()">STÄNG</button>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import {AuthenticationContext} from "vue-adal";
export default {
  name: "CreateChannelConfig", 
  data() {
    return {
      dialog: false,
      buttonText: "Välj Kanal",
      configObject: {
        configID: 0,
        channelID: 0,
        configKey: "",
        configValue: "",
        active: true,
        createdAt: "", 
        createdBy: ""
      }
    };
  },
  methods: {
    onClose() {
      this.dialog = false;
    },
    createChannelConfig() {
      this.configObject.createdBy = this.userProfile.name;
      this.$emit("createNewConfig", this.configObject);
      this.dialog = false;
    },
  },
   computed:{
     userProfile: function () {
        return AuthenticationContext.user.profile;
      }
  }
};
</script>
<style scoped>
.newConfig {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif !important;
  font-weight: 100 !important;
  font-size: 20px;
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
.btnDialogue {
  color: white !important;
  padding-left: 30px !important;
  padding-right: 30px !important;
  font-size: 12px !important;
}
.btnDialogCancel {
  border: 1px solid #177cc4;
  color: #177cc4;
}
.subtitle-1 {
  margin-bottom: 10px;
}
.v-card {
  box-shadow: none;
}

</style>