<template>
  <div>
    <v-row class="row">
    <span v-for="(channel, i) in getChannels()" :key="i">
      <v-col cols="3" class="buttonColumn">
        <v-btn :class="[getClassBasedOnState(channel.state), 'channelButton', getActiveClassBasedOnName(getLogFileExtension(channel))]" :id="channel.name"
               @click="channelButtonClicked(channel)">{{getLogFileExtension(channel)}}</v-btn>
      </v-col>
    </span>
    </v-row>
    <v-row class="showAllBtn" v-if="channels.length !== 0">
      <v-spacer/>
      <v-icon v-if="!showAll" @click="showAll = !showAll">mdi-menu-down</v-icon>
      <v-icon v-if="showAll" @click="showAll = !showAll">mdi-menu-up</v-icon>
      <v-spacer/>
    </v-row>
  </div>
</template>

<script>
  export default {
    name: "PGChannels",
    props: ["channels"],
    data() {
      return {
        sortedChannels: [],
        sortedChannelsSliced: [],
        showAll: false,
        active: "tempValueSoNothingGetsHere",
      }
    },
    methods: {
      channelButtonClicked(channel) {
        this.$emit('onChannelPressed', channel)
        this.active = this.getLogFileExtension(channel);
      },
      getClassBasedOnState(state) {
        if (state === null || state === undefined) {
          return 'missingState';
        } else if (state === 'Override' || state === 'Replaced' || state === 'TechnicalValidationOK') {
          return 'okState';
        } else if (state === 'Approved') {
          return 'approvedState'
        } else if (state === 'FailedTechnicalValidation') {
          return 'failedValidationState';
        }
      },
      getActiveClassBasedOnName(name){
        if (name === this.active){
          return 'active'
        } else {
          return 'inactive'
        }
      },
      filterChannels(channels) {
        this.sortedChannels = [];
        this.sortedChannels.push(...channels.filter(c => c.state === 'Override' || c.state === 'Replaced' || c.state === 'TechnicalValidationOK'));
        this.sortedChannels.push(...channels.filter(c => c.state === 'FailedTechnicalValidation'));
        this.sortedChannels.push(...channels.filter(c => c.state === null || c.state === undefined));
        this.sortedChannels.push(...channels.filter(c => c.state === 'Approved'));

        this.sortedChannelsSliced = this.sortedChannels.slice(0, 9);
      },
      getChannels() {
        if (this.showAll) {
          return this.sortedChannels;
        } else {
          return this.sortedChannelsSliced;
        }
      },
      getLogFileExtension(channel){
        let logFileName = channel.logFileName;
        if (!logFileName){
          return channel.channel.slice(0, 5);
        }
        let logFileLength = logFileName.length;
        return logFileName.slice(logFileLength - 3, logFileLength);
      }
    },
    watch: {
      channels(newVal) {
        this.filterChannels(newVal);
      },
    }
  }
</script>

<style scoped>

  .channelButton {
    padding-left: 5px;
    padding-right: 5px;
    width: 50px;
    margin: 0;
  }

  span {
    padding: 0
  }

  .v-btn.v-btn--contained.theme--light.v-size--default.approvedState.channelButton {
    background-color: green;
  }

  .v-btn.v-btn--contained.theme--light.v-size--default.missingState.channelButton {
    background-color: #22222277;
    color: #555555
  }

  .v-btn.v-btn--contained.theme--light.v-size--default.failedValidationState.channelButton {
    background-color: #aa0000;
  }

  .v-btn.v-btn--contained.theme--light.v-size--default.failedValidationState.channelButton.active{
    border-width: 2px;
    background-color: #cc0000;
    border-color: #FF5555;
    border-style: solid;
  }
  .v-btn.v-btn--contained.theme--light.v-size--default.okState.channelButton.active{
    border-width: 2px;
    background-color: #00550055;
    border-color: green;
    border-style: solid;
  }

  .v-btn.v-btn--contained.theme--light.v-size--default.missingState.channelButton.active{
    border-width: 2px;
    /*background-color: #00550055;*/
    border-color: #FF5555;
    border-style: solid;
  }
  .v-btn.v-btn--contained.theme--light.v-size--default.approvedState.channelButton.active{
    border-width: 2px;
    background-color: #00550055;
    border-color: green;
    border-style: solid;
  }
  
  .showAllBtn {
    align-self: center;
    align-content: center;
    align-items: center;
    alignment: center;
  }
</style>