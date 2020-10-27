<template>
    <div>
        <v-row>
            <v-col cols="8">
                <h6>{{logsReceived}} av {{totalLogs}} loggar har kommit in</h6>
            </v-col>
          
        </v-row>
        <v-row>
            <v-progress-linear class="progress-bar" rounded striped height="10" :value="percentageOfLogs"></v-progress-linear>
        </v-row>
    </div>
</template>


<script>
  import api from "@/services/BroadcastApiService";


  export default {
    name: "ReceivedLogBar",

    created() {
      // this.$messageHub.$on("userLoggedIn", this.onUserLoggedIn);
      this.$messageHub.$on("logReceived", this.logReceived)
    },
    beforeDestroy() {
      // Make sure to cleanup SignalR event handlers when removing the component
      this.$messageHub.$off("logReceived", this.logReceived)

    },
    mounted() {

      let date = new Date();
      date.setDate(date.getDate() - 1);
      if(date.getDay() === 0)
      {
        let friday = date.getFullYear() + ('0' + (date.getMonth()+1)).slice(-2) + ('0' + (date.getDate() -2)).slice(-2);
        let sunday = date.getFullYear() + ('0' + (date.getMonth()+1)).slice(-2) + ('0' + date.getDate()).slice(-2);
        this.getReceivedLogCount(friday, sunday);
      }else 
      {
        let yesterday = date.getFullYear() + ('0' + (date.getMonth()+1)).slice(-2) + ('0' + date.getDate()).slice(-2);
        this.getReceivedLogCount(yesterday, yesterday);
      }
 
    },
    data() {
      return {
        totalLogs: 0,
        logsReceived: 0,
      }
    },
    methods: {
      logReceived(value) {
        this.logsReceived = value; 
      },

      getReceivedLogCount(from, to) {
        api.get("api/front/NumberOfReceivedLogs/" + from + "/" + to)
          .then(response => {
            this.totalLogs = response.expectedNumberOfLogs;
            this.logsReceived = response.receivedLogs;
          })
          .catch(error => console.log(error));
      }
    },
    computed: {
      percentageOfLogs() {
        return (this.logsReceived / this.totalLogs * 100);
      }
    }
  }
</script>

<style scoped>
    .progress-bar {
        width: 85%;
        left: 10px;
    }
</style>