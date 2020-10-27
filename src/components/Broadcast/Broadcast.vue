<template>
    <v-layout row>
        <v-col cols="8">
            <v-card>
                <v-toolbar color="#177CC4" height="50px">
                    <v-row>
                        <v-col cols="3">
                            <p class="toolbarFont">Kanal</p>
                        </v-col>
                        <v-col cols="2">
                            <v-row>
                                <v-col class="pa-0" cols="6">
                                    <p class="toolbarFont">Start</p>
                                </v-col>
                                <v-col class="pa-0" cols="6">
                                    <p class="toolbarFont">Slut</p>
                                </v-col>
                            </v-row>
                        </v-col>
                        <v-col cols="4">
                            <p class="toolbarFont">Programnamn</p>
                        </v-col>
                        <v-col cols="2">
                            <p class="toolbarFont">Datum</p>
                        </v-col>
                    </v-row>
                </v-toolbar>

                <span v-for="(broadcast,i) in mainFilterChannel()" :key="i" no-action >
                 <div class="DateDiv" v-if="i != 0 && dateToyymmddFormat(mainFilterChannel()[i - 1].startDate) != dateToyymmddFormat(broadcast.startDate)">
                   <hr class="hrleft">
                   <p class="datep">{{dateToyymmddFormat(broadcast.startDate)}}</p>
                   <hr class="hrright">
                 </div>
                 
                <v-list  class="test" v-bind:class="{Errors: (broadcast.validationErrors.length > 0)}" >
                    <v-list-item>
                        <v-list-item-content class="pa-0" id="fonts" v-model="broadcastChecked">
                            <v-row>
                                <v-col id="channelN" cols="3">{{broadcast.channelName}}</v-col>
                                <v-col cols="2">
                                    <v-row>
                                        <v-col class="pa-0" cols="6">{{dateToTimeStamp(broadcast.startDate)}}</v-col>
                                        <v-col class="pa-0" cols="6">{{dateToTimeStamp(broadcast.endDate)}}</v-col>
                                    </v-row>
                                </v-col>
                                <v-col cols="4">{{broadcast.programTitle}}
                                </v-col>
                                <v-col cols="2">{{dateToyymmddFormat(broadcast.startDate)}}
                                   
                                </v-col>
                                <v-col cols="1">
                                    <BroadcastDialogue :Broadcast="broadcast"/>
                                </v-col>
                            </v-row>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
                {{setValue(broadcast.startDate)}}
                </span>
            </v-card>
        </v-col>
        <v-col cols="4">
            <sidebar :listdata="getUniqueChannel()" :listdataerrors="getUniqueErrorChannels()"
                     @checkedChannel="setCheckedChannel" @activeChanged="setActiveChanged"
                     @dateChanged="setDateChanged" left-button-text="Alla loggar" right-button-text="Alla felloggar"/>
        </v-col>
    </v-layout>
</template>

<script>
  import sidebar from "../Sidebar/sidebar";
  import BroadcastDialogue from "./BroadcastDialogue";
  import api from "../../services/BroadcastApiService";
  import {AuthenticationContext} from "vue-adal";

  export default {
    name: "Broadcast",
    components: {
      BroadcastDialogue,
      sidebar
    },

    data() {
      return {
        prependIcon: "mdi-drag-horizontal-variant",
        previousBroadcast: null,
        previous: false,
        broadcasts: [],
        broadcastChecked: null,
        broadcastActive: {active: 'ButtonLogAlla'},
      };
    },
    created() {
      // this.$messageHub.$on("userLoggedIn", this.onUserLoggedIn);
    },
    beforeDestroy() {
      // Make sure to cleanup SignalR event handlers when removing the component
      // this.$messageHub.$off("userLoggedIn", this.onUserLoggedIn);
    },
    methods: {
      title: function () {
        return this.broadcast.Title;
      },
      dateToTimeStamp(item) {
        let date = new Date(item);
        return date.toLocaleTimeString("sv-SE", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false
        });
      },
      setValue(item) {
        this.previousBroadcast = item;
      },
      getValue(item){
        if(this.previousBroadcast != item){
           return true;
        }
        else
        return false;
         },
      mainFilterChannel() {
        //console.log('checkedChanneL: ' + this.broadcastChecked?.checkedChannel);
       // console.log(this.broadcasts);
        if (this.broadcastChecked == null) return this.broadcasts;
        if (this.broadcastActive.active == "ButtonLogAlla") {
          if (this.broadcastChecked.checkedChannel == "Alla") {
            return this.broadcasts;
          }
          return this.broadcasts.filter(
            channel => channel.channelName == this.broadcastChecked.checkedChannel
          );
        } else {
          if (this.broadcastChecked.checkedChannel == "Alla") {
            return this.broadcasts.filter(
              channel => channel.validationErrors.length > 0
            );
          }
          return this.broadcasts.filter(
            channel =>
              channel.channelName == this.broadcastChecked.checkedChannel &&
              channel.validationErrors.length > 0
          );
        }
      },

      setCheckedChannel(value) {
        this.broadcastChecked = value;
      },
      setActiveChanged(value) {
        this.broadcastActive = value;
      },
      setDateChanged(value) {
        if (value.dateRangeFrom != "" && value.dateRangeTo != "") {
          api
            .get(
              "api/front/" + value.dateRangeFrom + "/" + value.dateRangeTo + ""
            )
            .then(response => (this.broadcasts = response.sort(function(a, b) {
            var dateA = new Date(a.startDate), dateB = new Date(b.startDate);
             return dateA - dateB;
         })))
            .catch(error => alert("Error - " + error));
        }
      },

      getUniqueChannel() {
        return [
          "Alla",
          ...new Set(this.broadcasts.map(data => data.channelName))
        ]
      },
      getUniqueErrorChannels() {
        return [
          "Alla",
          ...new Set(
            this.broadcasts
              .filter(data => data.validationErrors.length > 0)
              .map(data => data.channelName)
          )
        ]
      },

      getBroadcastWithFromToDate(from, to) {
        api
          .get("api/front/" + from + "/" + to)
          .then(response => (this.broadcasts = response.sort(function(a, b) {
            var dateA = new Date(a.startDate), dateB = new Date(b.startDate);
             return dateA - dateB;

         })))
          .catch(error => alert("Error - " + error));
      }
    },

    mounted() {
      this.getBroadcastWithFromToDate("2020-03-28", "2020-04-04");
    },

    computed: {
      userProfile: function () {
        return AuthenticationContext.user.profile;
      }
    }
  };
</script>

<style scoped>
    h1 {
        margin-left: 50px;
    }

    .extraContent {
        width: 98%;
        margin-left: 1%;
        background-color: red;
    }

    .test{
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.4);
        margin-bottom: 7px;
        border-radius: 5px;
        font-size: 13px;
    }

    .v-sheet .v-sheet--title .theme--light .v-toolbar {
        border-radius: 4px;
    }

    .v-card {
        box-shadow: none;
        margin-left: 20px;
    }

    .flex.offset-sm3 {
        margin-left: 5%;
    }

    #image {
        width: 40px;
        float: right;
    }

    #fonts {
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        font-weight: normal;
        color: #4a4c4e;
    }

    .toolbarFont {
        color: white;
    }

    .Errors {
        border: 1px solid  #ff8080 !important;
        box-shadow: 0 2px 5px rgba(247, 39, 39, 0.63);
    }
    .DateDiv {
      width: 100%;
      text-align: center;
    }
     .hrleft {
       vertical-align: middle;
       display: inline-block;
      border:0;
      margin-bottom:30px;
      width: 30%;
      margin-top: 30px;
      height: 1px;
      background-image: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4));
     }

       .hrright {
         vertical-align: middle;
        display: inline-block;
      border:0;
      margin-bottom:30px;
      width: 30%;
      margin-top: 30px;
      height: 1px;
      background-image: linear-gradient(to right, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0));
     }
.datep {
  display: inline-block;
 margin: 0px 15px 0px 15px;
  color: #4a4c4e;
  font-family:Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
  
}
     
    .v-application p {
        margin-bottom: 0;
    }
</style>