<template>
    <div>
        <v-toolbar color="#177CC4" :width="width" :height="toolbarHeight">


            <v-btn :height="toolbarHeight" width="30" min-width="30" dark color="#173CA4" class="left-align"
                   @click="changeCurrentWeek(-1)">
                {{leftText}}
            </v-btn>
            <v-spacer></v-spacer>
            <v-toolbar-title class="toolbar-title">
                <div v-if="previousMonth !== ''">{{previousMonth}} -</div>
                {{getNextMonth()}} {{getYear()}}
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn :height="toolbarHeight" width="30" min-width="30" dark color="#173CA4" class="right-align"
                   @click="changeCurrentWeek(1)">
                {{rightText}}
            </v-btn>
        </v-toolbar>
        <v-card :height="cardHeight" :width="width">
            <v-row style="padding-left: 15px">
                <v-col v-for="day in weekDaysShort" class="weekday-column" :key="day">{{day}}</v-col>
            </v-row>
            <v-row style="padding-left: 15px">
                <v-col v-for="day in dateDayPreviousWeek" :key="day" class="weekday-column">{{day}}</v-col>
            </v-row>
            <v-row style="padding-left: 15px">
                <v-col v-for="day in dateDay" :key="day" class="weekday-column">{{day}}</v-col>
            </v-row>
        </v-card>
    </div>
</template>

<script>
  export default {
    name: "DatePicker",
    data() {
      return {
        toolbarHeight: 45,
        leftText: '<',
        rightText: '>',
        weekDays: ['Söndag', 'Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lördag'],
        weekDaysShort: ['Sön', 'Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör'],
        todaysDate: new Date(),
        activeDate: new Date(),
        dateDay: [],
        dateDayPreviousWeek: [],
        weeksFromCurrentDate: 0,
        overTwoMonths: false,
        lastSunday: new Date(),
      }
    },
    props: {
      width: Number,
      height: Number,
    },
    computed: {
      cardHeight() {
        return this.height - this.toolbarHeight;
      },
      previousMonth() {
        if (!this.overTwoMonths)
          return '';

        let date = new Date(this.lastSunday.getTime() - 7 * this.timeMultiplier)
        let dateString = date.toLocaleString('sv-SE', {month: 'long',}).toString();
        dateString = dateString[0].toUpperCase() + dateString.slice(1);
        return dateString;
      },
      timeMultiplier() {
        return 24 * 3600 * 1000;
      }

    },
    mounted() {
      this.setToLastSundayAndFillList();
      this.calculateLastSunday();
    },
    methods: {
      calculateLastSunday() {
        var Sunday = new Date(this.activeDate.getTime() - this.activeDate.getDay() * this.timeMultiplier + 7 * this.timeMultiplier);

        this.lastSunday.setTime(Sunday.getTime() - 7 * this.timeMultiplier);
      },
      setToLastSundayAndFillList() {

        this.calculateLastSunday();

        this.dateDay.length = 0;
        this.dateDayPreviousWeek.length = 0;

        let prevDate = new Date(this.lastSunday);
        prevDate.setTime(prevDate.getTime() - 7 * this.timeMultiplier);

        let lastDate = new Date(this.lastSunday);
        lastDate.setTime(lastDate.getTime() + 6 * this.timeMultiplier);
        console.log(prevDate.getDate() + ' - ' + lastDate.getDate());

        this.overTwoMonths = prevDate.getDate() > lastDate.getDate();
        console.log(this.overTwoMonths);

        for (let i = 0; i < 7; ++i) {
          let newDate = new Date(this.lastSunday);
          newDate.setDate(this.lastSunday.getDate() + i);
          this.dateDay.push(newDate.getDate());
        }
        for (let i = -7; i < 0; ++i) {
          let newDate = new Date(this.lastSunday);
          newDate.setDate(this.lastSunday.getDate() + i);
          this.dateDayPreviousWeek.push(newDate.getDate());
        }
      },
      changeCurrentWeek(value) {
        this.weeksFromCurrentDate += value;
        this.activeDate.setTime(this.todaysDate.getTime() + this.weeksFromCurrentDate * 7 * 24 * 3600 * 1000);

        // this.activeDate.setDate(this.todaysDate.getDate() + (this.currentWeek * 7) );
        console.log('activeDate: ' + this.activeDate);
        this.setToLastSundayAndFillList();
      },
      getNextMonth() {
        let date = new Date(this.lastSunday.getTime() + 6 * this.timeMultiplier)

        let dateString = date.toLocaleString('sv-SE', {month: 'long',}).toString();
        dateString = dateString[0].toUpperCase() + dateString.slice(1);
        return dateString;
      },
      getYear() {
        return this.activeDate.getFullYear();
      }
    }
  }
</script>

<style scoped>

    .right-align {
        position: absolute;
        right: 0px;
        border: 3px solid #73AD21;
    }

    .left-align {
        position: absolute;
        left: 0px;
        border: 3px solid #73AD21;

    }

    .toolbar-title {
        color: white;
        text-align: center;
    }


    .weekday-column {
        padding: 0;
        margin: 0;
    }
</style>