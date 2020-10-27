<template>
  <div>
    <v-dialog v-model="dialog" persistent max-width="100%">
      <template v-slot:activator="{on}">
        <button class="channelbutton" @click="dialog = true">Välj Kanal</button>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">Välj Kanal</span>
        </v-card-title>
        <v-card-actions>
          <v-spacer />
          <button class="btnDialogCancel" text @click="onClose()">STÄNG</button>
        </v-card-actions>
      </v-card>
      <v-card>
        <v-row>
          <v-card
            v-for="channelHouse in localChannelHouses"
            :key="channelHouse.channelHouseName"
            width="25%">
            <v-card-title>
              <v-spacer />
              <v-btn color="primary">{{channelHouse.channelHouseName}}</v-btn>
              <v-spacer />
            </v-card-title>
            <v-card-text>
              <div v-for="channel in channelHouse.channels" :key="channel.channelID">
                <v-col cols="12">
                  <v-btn
                    @click=" onSelectionChangeChannel(channel.channelID, channel.channelName)"
                  >{{channel.channelName}}</v-btn>
                </v-col>
              </div>
            </v-card-text>
          </v-card>
        </v-row>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "ChannelDialogue",
  props: {
    buttonText: String,
    localChannelHouses: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      dialog: false,
      selectedID: "",
      selectedName: ""
    };
  },
  methods: {
    onClose() {
      this.dialog = false;
    },
    onSelectionChangeChannel(id, item) {
      this.selectedName = item;
      this.selectedID = id;
      this.$emit("onSelectionChangeChannel", {
        channelName: this.selectedName,
        channelID: this.selectedID
      });
      console.log(this.selectedName, this.selectedID);
      this.onClose();
    }
  }
};
</script>

<style scoped>
.channelbutton {
  margin-left: 10px;
  padding: 8px 34px;
  border-radius: 5px;
  margin-right: 10px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  font-weight: 100;
  border: 1px solid darkgrey;
}
</style>