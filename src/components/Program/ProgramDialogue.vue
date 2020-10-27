<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="700px">
      <template v-slot:activator="{on}">
        <v-icon class="pa-0" color="#177CC4" @click="dialog = true">mdi-square-edit-outline</v-icon>
      </template>
      <v-card>
        <v-card-title>
          <span class="editProgram">Redigera program</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="6">
                <v-text-field label="Typ" v-model="ProgramTitle" required />
              </v-col>
              <v-col cols="6">
                <v-text-field label="Säsong" v-model="Season" type="number" required />
              </v-col>
              <v-col cols="6">
                <v-text-field label="Episod" v-model="Episode" type="number" required />
              </v-col>
              <v-col cols="6">
                <v-text-field label="Genre 1" v-model="genre1Name" required />
              </v-col>
              <v-col cols="6">
                <v-text-field label="Genre 2" v-model="genre2Name" required />
              </v-col>
              <v-col cols="6">
                <v-text-field label="Genre 3" v-model="genre3Name" required />
              </v-col>
              <v-col cols="6">
                <v-row>
                  <Genre @selectedGenre="setSelectedGenre" />
                   <TargetGroup @selectedCountryAndTarget="setSelectedCountryAndTarget" />
                </v-row>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <button class="btnDialogCancel" text @click="onClose()">STÄNG</button>
          <button class="btnDialogAccept" text @click="saveBroadcast()">SPARA</button>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import TargetGroup from "./TargetGroup.vue";
import Genre from "./Genre.vue";
import api from "../../services/BroadcastApiService";
export default {
  name: "ProgramDialogue",
  props: ["program"],
  components: { Genre, TargetGroup},
  data() {
    return {
      dialog: false,
      ProgramTitle: this.program?.originalTitle,
      Season: this.program?.season,
      Episode: this.program?.episode,
      genre1Name: this.program?.genre1Name,
      genre2Name: this.program?.genre2Name,
      genre3Name: this.program?.genre3Name,
      id: this.program?.metaProgramID,
      genre1ID: this.program?.genre1ID,
      genre2ID: this.program?.genre2ID,
      genre3ID: this.program?.genre3ID,
      targetGroupCode: this.program?.targetGroupCode,
      territoryCode: this.program?.territoryCode
    };
  },
  methods: {
    setSelectedGenre(value) {
      this.program.genre1Name = value.name1;
      this.program.genre2Name = value.name2;
      this.program.genre3Name = value.name3;
      this.program.genre1ID = value.genre1ID;
      this.program.genre2ID = value.genre2ID;
      this.program.genre3ID = value.genre3ID;
    },
    onClose() {
      this.dialog = false;
    },
    setSelectedCountryAndTarget(value){
      this.program.targetGroupCode = value.targetGroupCode;
      this.program.territoryCode = value.territoryCode;
      console.log(this.program.targetGroupCode);
    },
    saveBroadcast() {
      this.program.originalTitle = this.ProgramTitle;
      this.program.season = this.Season;
      this.program.episode = this.Episode;
      console.log(this.program);
      api
        .put("/api/programs/" + this.program.metaProgramID, this.program)
        .then()
        .catch(error => alert(`Error: ${error}`));
      this.dialog = false;
    }
  },
};
</script>

<style scoped>
.editProgram {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  font-weight: 100;
}

.btnDialogAccept,
.btnDialogCancel {
  padding: 8px 34px;
  border-radius: 5px;
  margin-right: 10px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  font-weight: 100;
  transition: 0.3s;
}
.btnDialogAccept {
  background-color: #177cc4;
  color: cornsilk;
}
.btnDialogCancel {
  border: 1px solid #177cc4;
  color: #177cc4;
}

.v-dialog {
  max-width: 700px;
}
</style>