<template>
  <v-row class="row">
    <span v-for="(date, i) in datesToHandle" :key="i" no-action>
      <v-col cols="3" class="buttonColumn">
        <v-btn  :class="['dateButton', getActiveClassBasedOnName(date)]" @click="dateButtonClicked(date)">{{date}}</v-btn>
      </v-col>
    </span>
  </v-row>
</template>

<script>
  import api from "../../../services/BroadcastApiService";

  export default {
    name: "UnhandledDates",
    data() {
      return {
        datesToHandle: [],
        active : "startvalue"
      }
    },
    methods: {
      dateButtonClicked(date) {
        this.active = date;
        this.$emit('datePressed', date);

      },

      getNonApprovedLogs(from, to) {
        api
          .get("/api/Front/NonApprovedLogs?from=" + from + "&to=" + to)
          .then(response => {
            this.datesToHandle = this.convertToApiDates(response);
          })
          .catch(error => console.log(error));
      },
      convertToApiDates(data) {
        let dates = [];
        
        // Convert each long date string to the type we need
        for (let i = 0; i < data.length; ++i) {
          dates.push(this.$helpers.convertToApiDate(data[i].ValidFor));
        }

        return [...new Set(dates.map(x => x))]; // Make the dates Unique
      },
      getActiveClassBasedOnName(name) {
        if (name === this.active){
          return 'active'
        } else {
          return ''
        }
      }
    },
    mounted() {
      // todo: use relative dates
      this.getNonApprovedLogs("20200525", "20200531");
    }
  }
</script>

<style scoped>
  .buttonColumn .dateButton {
    /*padding-left: 30px;*/
    /*padding-right: 30px;*/
    font-size: 12px;
    margin-left: 0;
    padding-left: 0;

    text-align: center;
    justify-content: center;
    display: inline-block;
    vertical-align: auto;
  }

  .buttonColumn {
    padding: 5px 0 0 15px;
  }

  .row {
    width: 100%;
  }
  .v-btn.v-btn--contained.theme--light.v-size--default.dateButton.active {
    border-width: 2px;
    background-color: #00550055;
    border-color: green;
    border-style: solid;
  }
</style>