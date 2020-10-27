<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="700px">
      <template v-slot:activator="{on}">
        <v-icon color="red" @click="dialog = true">mdi-close-box</v-icon>
      </template>
      <v-card>
        <v-card-title>
          <span class="deleteProgram">Är du säker på att du vill ta bort detta program?</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="11.5">
                <v-list class="test">
                  <v-list-item>
                    <v-row>
                         <v-col cols="2">{{channel}}</v-col>
                      <v-col cols="2">{{programTitle}}</v-col>
                      <v-col cols="1">{{season? season : '?'}}</v-col>
                      <v-col cols="2">{{episode? episode : '?'}}</v-col>
                      <v-col cols="2">{{genre1? genre1 :'?'}}</v-col>
                      <v-col cols="2">{{genre2? genre2 : '?'}}</v-col>
                      <v-col cols="2">{{genre3? genre3 :'?'}}</v-col>
                    </v-row>
                  </v-list-item>
                </v-list>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <button class="btnDialogCancel" text @click="onClose()">ÅNGRA</button>
          <button class="btnDialogAccept" text @click="selectIDforDelete(id)">JA, TA BORT</button>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  name: "DeleteProgramDialogue",
  props: ["program"],
  components: {},
  data() {
    return {
      dialog: false,
      channel: this.program?.channelName,
      programTitle: this.program?.originalTitle,
      season: this.program?.season,
      episode: this.program?.episode,
      genre1: this.program?.genre1Name,
      genre2: this.program?.genre2Name,
      genre3: this.program?.genre3Name,
      id: this.program?.metaProgramID,
      selected: ""
    };
  },
  methods: {
    onClose() {
      this.dialog = false;
    },
    selectIDforDelete(id) {
      this.selected = id;
      this.$emit("deleteProgramById", this.selected);
      console.log(this.selected);
      this.dialog = false;
    }
  }
};
</script>

<style scoped>
.deleteProgram {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  font-weight: 100;
}
.pa-0 {
  text-align: center;
  vertical-align: middle;
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
  width: 900px !important;
}
.test {
  border: 1px solid lightgrey !important;
  margin-bottom: 7px;
  border-radius: 5px;
  font-size: 13px;
}
</style>