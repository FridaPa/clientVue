<template>
    <div>
        <v-col cols="6">
            <v-row>
                <v-col cols="6">
                    <v-menu>
                        <template v-slot:activator="{on}">
                            <v-text-field v-on="on" :value="dateFrom" label="Datum från"></v-text-field>
                        </template>
                        <v-date-picker @change="onDateChange()" v-model="dateFrom"></v-date-picker>
                    </v-menu>
                </v-col>
                <v-col cols="6">
                    <v-menu>
                        <template v-slot:activator="{on}">
                            <v-text-field v-on="on" :value="dateto" label="Datum till"></v-text-field>
                        </template>

                        <v-date-picker @change="onDateChange()" v-model="dateto"></v-date-picker>
                    </v-menu>
                </v-col>
            </v-row>
        </v-col>

        <button
                class="ButtonLogAlla"
                v-bind:class="{ activeButton: (this.active == 'ButtonLogAlla') }"
                v-on:click="makeActive('ButtonLogAlla')"
        >{{leftButtonText}}
        </button>
        <button 
                class="ButtonLogFel"
                v-bind:class="{ activeButton: (this.active == 'ButtonLogFel') }"
                v-on:click="makeActive('ButtonLogFel')"
        >{{rightButtonText}}
        </button>
        <v-list
                v-for="(channel,i) in activeList"
                :key="i">
            <v-list-item class="channelList">
                <v-col cols="2">
                    <input :checked="currentChannel === channel" type="radio" name="radio"
                           @click="changeChannelName(channel)" v-bind:id="channel" class="checkbox">
                </v-col>
                <v-col cols="2">
                    <v-list-item-title class="fonts"> {{channel}}</v-list-item-title>
                </v-col>
            </v-list-item>
        </v-list>
    </div>

</template>


<script>
  export default {
    name: "sidebar",
    props: {
      listdata: {
        type: Array,
        required: true
      },
      listdataerrors: {
        type: Array,
      },
      leftButtonText: String,
      rightButtonText: String,
      useSecondButton: Boolean,
    },
    data() {
      return {
        active: "ButtonLogAlla",
        currentChannel: "Alla",
        dateFrom: "",
        dateto: ""
      }
    },

    methods: {
      makeActive(item) {
        this.active = item;
        this.$emit('activeChanged', {
          active: this.active,
        });
      },

      changeChannelName: function (channelName) {
        this.currentChannel = channelName;
        console.log(this.currentChannel);
        this.$emit('checkedChannel', {
          checkedChannel: this.currentChannel
        });

      },

      onDateChange: function () {
        if (this.dateFrom != "" && this.dateto != "") {
          this.$emit('dateChanged', {
            dateRangeFrom: this.dateFrom,
            dateRangeTo: this.dateto
          });
        }
      },

    },

    computed: {
      activeList() {
        if (this.active == 'ButtonLogAlla' || this.listdataerrors.length === 0) {
          return this.listdata;
        } else {
          console.log(this.listdataerrors)
          return this.listdataerrors;
        }
      }
    }


  }

</script>


<style scoped>
    .channelList {
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.4);
        border-radius: 5px;
        width: 300px;
    }

    .fonts {
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        font-weight: normal;
        display: inline-block;
        color: #4a4c4e;
    }

    .ButtonLogAlla,
    .ButtonLogFel {
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.4);
        padding: 8px 32px;
        border-radius: 5px;
        margin-right: 10px;
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        font-weight: normal;
        transition: 0.3s;
        color: #4a4c4e;
    }

    .activeButton {
        background-color: #177cc4;
        color: cornsilk;
    }

    .ButtonLogAlla:hover,
    .ButtonLogFel:hover {
        background-color: #177cc4;
        color: cornsilk;
    }

    .v-list {
        padding: 4px 0px;
    }
</style>

