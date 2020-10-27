<template>
  <v-main>
    <v-row>
      <v-col :cols="pgColWidth">
        <v-card :height="cardHeight" :class="[getClassBasedOnErrors('noPgEntry')]">
          <v-row v-if="pgEntry" class="entryRow">
            <v-col cols="3">
              <span>{{channelInfo.channel}}</span>
            </v-col>
            <v-col cols="3">
              <span>{{this.$helpers.dateToyymmddFormat(pgEntry.startTime)}}</span>
            </v-col>
            <v-col cols="3">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <span v-bind="attrs" v-on="on" :class="[getClassBasedOnErrors('title')]">{{pgEntry.programTitle ? pgEntry.programTitle : '?'}}</span>
                </template>
                <span>{{pgEntry.programTitle ? pgEntry.programTitle : '?'}}</span>
              </v-tooltip>
            </v-col>
            <v-col cols="1"/>
            <v-col cols="1">
              <v-btn width="50px" height="25px" disabled :class="[getClassBasedOnErrors('startTime'), 'timePicker']">
                <span>{{this.$helpers.dateToTimeStamp(pgEntry.startTime)}}</span>
              </v-btn>
              <v-btn width="50px" height="25px" disabled :class="[getClassBasedOnErrors('endTime'), 'timePicker']">
                {{this.$helpers.dateToTimeStamp(pgEntry.endTime)}}
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <v-col :cols="epgColWidth">
        <v-card :height="cardHeight" :class="[getClassBasedOnErrors('noEpgEntry')]">
          <v-row v-if="epgEntry" class="entryRow">
            <v-col cols="1.5">
              <PgEpgTimePicker :reset="reset" :date-time="timePickerStartDate" @onTimeChanged="startTimeChanged"/>
              <br>
              <PgEpgTimePicker :reset="reset" :date-time="timePickerEndDate" @onTimeChanged="endTimeChanged"/>
            </v-col>
            <v-col cols="4" @click="onNameColumnClicked">
              <v-card elevation="1" class="nameEntry" :height="cardHeight">
                <v-row class="programName">
                  <v-col cols="1">
                    <v-icon v-if="selectedName" color="green">mdi-check-bold</v-icon>
                  </v-col>
                  <v-col>
                    <span :class="[getClassBasedOnErrors('title')]">{{epgEntry.originalTitle ? epgEntry.originalTitle : epgEntry.programTitle}}</span>
                  </v-col>
                  <v-col cols="4" @click.prevent="onNameColumnClicked">
                    <SearchProgramDialogue :channel="channelInfo" @onSelectedProgram="onChangedProgram"/>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
            <v-col>
              <span>{{epgEntry.season}}</span>
            </v-col>
            <v-col>
              <span>{{epgEntry.episode}}</span>
            </v-col>
            <v-col>
              <span>{{this.$helpers.dateToyymmddFormat(epgEntry.startDate)}}</span>
            </v-col>
            <v-col cols="1">
              <v-row>
                <v-col cols="4">
                  <PgEpgRemoveDialogue @onRemoveEntry="onRemoveEntry"
                                       :name="epgEntry.originalTitle ? epgEntry.originalTitle : epgEntry.programTitle"/>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-row v-else class="createEpgEntry">
            <v-col/>
            <v-col>
              <SearchProgramDialogue :channel="channelInfo" @onSelectedProgram="onChangedProgram"/>
            </v-col>
            <v-col>
              <PgEpgRemoveDialogue @onRemoveEntry="onRemoveEntry" empty="true" name="Tomma rutan"/>
            </v-col>
            <v-col/>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

  </v-main>
</template>

<script>
  import SearchProgramDialogue from "./SearchProgramDialogue";
  import PgEpgRemoveDialogue from "./PgEpgRemoveDialogue";
  import PgEpgTimePicker from "./PgEpgTimePicker";

  export default {
    name: "PgEpgEntry",
    props: ["data", "pgColWidth", "epgColWidth", "index", "saveLog", "isEmpty", "logState"],
    components: {
      PgEpgTimePicker,
      PgEpgRemoveDialogue,
      SearchProgramDialogue
    },
    data() {
      return {
        pgEntry: this.data.pg,
        initialPgEntry: this.data.pg,
        epgEntry: this.data.epg,
        channelInfo: this.data.channelInfo,
        hour: 0,
        minute: 0,
        menu: false,
        selectedName: '',
        reset: false,
        originalStartTime: this.$helpers.dateToTimeStamp(this.epgEntry?.startDate),
        originalEndTime: this.$helpers.dateToTimeStamp(this.epgEntry?.endDate),
        cardHeight: "65px",
        titleRegEx: /[`~!@#$%^&*()_|+\-=?;:'",.<>]/gi,
        errorList: {
          "noPgEntry": {
            name: "noPgEntry",
            message: "Is missing an entry",
            isError: false
          },
          "noEpgEntry": {
            name: "noEpgEntry",
            message: "Is missing an entry",
            isError: false
          },
          "startTime":
            {
              name: "startTime",
              message: "",
              isError: false
            },
          "endTime":
            {
              name: "endTime",
              message: "",
              isError: false
            },
          "title":
            {
              name: "title",
              message: "Title does not match with any TVGuide-title (OriginalTitle, programTitle, shortTitle)",
              isError: false
            },
          "entry":
            {
              name: "entry",
              message: "entry has error",
              isError: false
            }
        }
      }
    },
    methods: {
      diffInTime(start, end) {
        let diff = (new Date(end).getTime() - new Date(start).getTime()) / 1000 / 60;
        return Math.abs(Math.round(diff));
      },
      checkForErrors() {
        //Reset the errors so we can set them again
        this.resetErrors();
        if (this.logState === 'Approved') {
          return;
        }
        if (!this.pgEntry || !this.epgEntry) {
          this.errorList["noPgEntry"].isError = !this.pgEntry;
          this.errorList["noEpgEntry"].isError = !this.epgEntry;
          this.errorList["entry"].isError = true;
          this.errorList["entry"].message = "No Entry"
          this.emitErrors(this.errorList["entry"].message);
          return;
        }

        let title = this.pgEntry.programTitle?.toLowerCase();
        let hasError = false;
        if (this.getIfTitleHasError(title)) {
          this.errorList["title"].isError = true;
          hasError = true;
        }
        if (this.diffInTime(this.pgEntry.startTime, this.epgEntry.startDate) > 10) {
          this.errorList["startTime"].isError = true;
          hasError = true;
        }
        if (this.diffInTime(this.pgEntry.startTime, this.epgEntry.startDate) > 10) {
          this.errorList["endTime"].isError = true;
          hasError = true;
        }

        if (hasError) {
          this.errorList["entry"].isError = true;
          let lineBreak = "%0D%0A";
          this.errorList["entry"].message = this.pgEntry.programTitle + " - " + this.epgEntry.originalTitle + lineBreak +
            "Logg:  " + this.$helpers.dateToTimeStamp(this.pgEntry.startTime) + "-" + this.$helpers.dateToTimeStamp(this.pgEntry.endTime) + lineBreak +
            "Tablå: " + this.$helpers.dateToTimeStamp(this.epgEntry.startDate) + "-" + this.$helpers.dateToTimeStamp(this.epgEntry.endDate);
          this.emitErrors(this.errorList["entry"].message);
        }
      },
      emitErrors(error) {
        this.$emit("onErrors", error, this.index);
      },
      getIfTitleHasError(title) {
        // If we've chosen a title, there's no error
        if (this.selectedName) {
          return false;
        }
        // Compare all types of titles with the pg log title to see if any matches
        if (this.compareTitles(title, this.epgEntry.programShortTitle))
          return false;

        if (this.compareTitles(title, this.epgEntry.programTitle))
          return false;

        if (this.compareTitles(title, this.epgEntry.originalTitle))
          return false;

        return true;
      },
      compareTitles(pgTitle, epgTitle) {
        // Also uses regex to check against all removed special characters
        if (pgTitle && epgTitle) {
          if (pgTitle.toLowerCase() === epgTitle.toLowerCase() || pgTitle.toLowerCase() === epgTitle.replace(this.titleRegEx, '').toLowerCase() || epgTitle.replace(this.titleRegEx, '').toLowerCase().includes(pgTitle.toLowerCase())) {
            return true;
          }
        }
        return false;
      },
      resetErrors() {
        this.errorList["noPgEntry"].isError = false;
        this.errorList["noEpgEntry"].isError = false;
        this.errorList["startTime"].isError = false;
        this.errorList["endTime"].isError = false;
        this.errorList["title"].isError = false;
        this.errorList["entry"].isError = false;
      },
      getClassBasedOnErrors(errorName) {
        if (this.errorList[errorName].isError) {
          return 'errorState';
        } else {
          return 'goodState'
        }
      },
      onChangedProgram(program) {
        let tempProgram = this.epgEntry ?? this.pgEntry;
        this.epgEntry = program;
        this.epgEntry.createdAt = new Date();
        this.epgEntry.endDate = tempProgram.endDate ?? tempProgram.endTime;
        this.epgEntry.length = tempProgram.length;
        this.epgEntry.logID = tempProgram.logID;
        this.epgEntry.metaBroadcastID = tempProgram.metaBroadcastID;
        this.epgEntry.preliminary = 1;
        this.epgEntry.rerun = tempProgram.rerun;
        this.epgEntry.startDate = tempProgram.startDate ?? tempProgram.startTime;

        this.checkForErrors();
        this.copyEPGToPG();

      },
      onNameColumnClicked() {
        if (this.selectedName === this.epgEntry.originalTitle) {
          this.selectedName = null;
        } else {
          this.selectedName = this.epgEntry.originalTitle;
        }
        this.checkForErrors();
        this.copyEPGToPG();

      },
      onRemoveEntry(isEmpty) {
        if (isEmpty) {
          this.$emit('onRemoveEpgEntry', this.index);
          return;
        }
        this.epgEntry = null;
        this.checkForErrors();
      },
      startTimeChanged(date) {
        if (this.$helpers.dateToTimeStamp(date) === this.$helpers.dateToTimeStamp(this.epgEntry.startDate))
          this.epgEntry.startDate = this.originalStartTime;
        else
          this.epgEntry.startDate = date;

        this.emitUpdates();
        this.copyEPGToPG();
      },
      endTimeChanged(date) {
        if (this.$helpers.dateToTimeStamp(date) === this.$helpers.dateToTimeStamp(this.epgEntry.endDate))
          this.epgEntry.endDate = this.originalEndTime;
        else
          this.epgEntry.endDate = date;
        this.copyEPGToPG();
      },
      copyEPGToPG() {
        // Check if we have an empty pgObject,
        if (this.isEmpty) {
          // If we have no pg, then we copy the epg values
          this.pgEntry.programTitle = this.epgEntry.originalTitle ?? this.epgEntry.programTitle;
          this.pgEntry.startTime = this.epgEntry.startDate;
          this.pgEntry.endTime = this.epgEntry.endDate;
        }
      },
      emitUpdates(){
        this.$emit("ValuesUpdated", {pg: this.pg, epg: this.epg});
      }

    },
    watch: {
      data(newVal) {
        this.reset = !this.reset;
        this.pgEntry = newVal.pg;
        this.epgEntry = newVal.epg;
        this.channelInfo = newVal.channelInfo;
        this.checkForErrors();
      },
      saveLog(newVal) {
        if (newVal === true) {
          if (this.selectedName) {
            this.epgEntry.originalTitle = this.selectedName;
          }
        }
      },
    },
    mounted() {
      this.checkForErrors();
    },
    computed: {
      timePickerStartDate() {
        return this.epgEntry.startDate ?? this.channelInfo.validFor;
      },
      timePickerEndDate() {
        return this.epgEntry.endDate ?? this.channelInfo.validFor;
      }
    }
  }
</script>

<style scoped>

  .col {
    margin-top: 0;
    padding-top: 0;
  }

  .errorState,
  .v-btn.v-btn--contained.v-btn--disabled.theme--light.v-size--default.errorState.timePicker {
    background-color: #cc0000aa !important; /* have to use important here as important is used to set the color in vuetify*/ 
  }

  .goodState,
  .v-btn.v-btn--contained.v-btn--disabled.theme--light.v-size--default.goodState.timePicker {
    /*background-color: green !important; */
  }

  .HandleProgram {
    margin-top: -50px;
  }

  .centerText {
    text-align: center;
  }

  .entryRow {
    margin-left: 10px;
    padding-top: 10px;
  }

  .nameEntry {
    margin-top: -10px;
    margin-right: 20px;
    box-shadow: none;
  }

  .programName {
    padding-top: 10px;
  }

  .createEpgEntry {
    padding-top: 15px;
  }

  .timePicker {
    margin-top: -5px;
    margin-bottom: 10px;
  }
</style>