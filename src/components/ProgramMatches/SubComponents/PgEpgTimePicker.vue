<template>
  <v-menu v-model="menu"
          :close-on-content-click="false"
          offset-x>
    <template v-slot:activator="{ on, attrs }">

      <v-btn class="timePicker"
             :color="color" width="50px" height="25px"
             v-bind="attrs"
             v-on="on">
        {{time}}
      </v-btn>
    </template>
    <v-list>
      <v-list-item>
        <v-time-picker
                v-model="time"
                @click:hour="hoursChanged"
                @click:minute="minutesChanged"
                scrollable
                format="24hr"
                class="timePicker"
        ></v-time-picker>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
  export default {
    name: "PgEpgTimePicker",
    props: ['dateTime', 'reset'],
    data() {
      return {
        menu: false,
        time: this.$helpers.dateToTimeStamp(this.dateTime),
        hour: 0,
        minute: 0,
        color: "white"
      }
    },
    methods: {
      hoursChanged(value){
        this.hour = value;
      },
      minutesChanged(value){
        this.minute = value;
        let newDate = new Date(this.dateTime);
        newDate.setHours(this.hour, this.minute);
        
        this.$emit('onTimeChanged', newDate);
        this.checkDifferencesInTime(newDate);
      },
      checkDifferencesInTime(newTime){
        if (this.$helpers.dateToTimeStamp(newTime) !== this.$helpers.dateToTimeStamp(this.dateTime))
          this.color = "blue";
        else
          this.color = "white";
      }
      
    },
    watch: {
      dateTime(newVal){
        this.time = this.$helpers.dateToTimeStamp(newVal);
        
      },
      reset(newVal, oldVal){
        if (newVal !== oldVal){
          this.color = "white";
        }
      }
    }
  }
</script>

<style scoped>

  .timePicker  {
    margin-top: -5px;
    margin-bottom: 10px;
  }
</style>