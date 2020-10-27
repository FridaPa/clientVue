<template>
          <v-col cols="11">
              <v-col cols="10">
                <v-row>
                  <v-col cols="3" sm="6" md="3">
                    <v-text-field
                      v-model="searchTitle"
                      label="Programtitel..."
                    ></v-text-field>
                  </v-col>
                  <br />
                  <v-col cols="3" sm="6" md="3">
                    <v-text-field
                      v-model="searchSeason"
                      label="Säsong..."
                    ></v-text-field>
                  </v-col>
                  <br />
                  <v-col cols="3">
                    <v-text-field
                      v-model="searchEpisode"
                      label="Episod..."
                    ></v-text-field>
                  </v-col>

                  <CreateNewProgram @createProgram="createProgram" />
                </v-row>
              </v-col>
              <v-toolbar class="toolbar" color="#177CC4" height="50px">
                <v-row>
                  <v-col class="align" cols="1">
                    <p class="toolbarFont">Kanal</p>
                  </v-col>
                  <v-col class="align" cols="2">
                    <p class="toolbarFont">Titel</p>
                  </v-col>
                  <v-col class="align" cols="1">
                    <v-row>
                      <v-col class="pa-0" cols="6">
                        <p class="toolbarFont">S</p>
                      </v-col>
                      <v-col class="pa-0" cols="6">
                        <p class="toolbarFont">E</p>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="4">
                    <v-row>
                      <v-col class="pa-0" cols="4">
                        <p class="toolbarFont">Genre 1</p>
                      </v-col>
                      <v-col class="pa-0" cols="4">
                        <p class="toolbarFont">Genre 2</p>
                      </v-col>
                      <v-col class="pa-0" cols="4">
                        <p class="toolbarFont">Genre 3</p>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col class="align" cols="1">
                    <v-row>
                      <v-col class="pa-0" cols="6">
                        <p class="toolbarFont">M</p>
                      </v-col>
                      <v-col class="pa-0" cols="6">
                        <p class="toolbarFont">L</p>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col class="align" cols="3"></v-col>
                </v-row>
              </v-toolbar>
              <span v-for="(program, i) in filteredList()" :key="i" no-action>
                <v-list v-if="searchTitle.length > 5" class="test">
                  <v-list-item>
                    <v-list-item-content class="pa-0" id="fonts">
                      <v-row>
                        <v-col class="align" cols="1">{{
                          program.channelName ? program.channelName : "?"
                        }}</v-col>
                        <v-col class="align" cols="2">{{
                          program.originalTitle ? program.originalTitle : "?"
                        }}</v-col>
                        <v-col class="align" cols="1">
                          <v-row>
                            <v-col cols="6" class="pa-0">{{
                              program.season ? program.season : "?"
                            }}</v-col>
                            <v-col cols="6" class="pa-0">{{
                              program.episode ? program.episode : "?"
                            }}</v-col>
                          </v-row>
                        </v-col>
                        <v-col cols="4">
                          <v-row>
                            <v-col class="pa-0" cols="4">{{
                              program.genre1Name ? program.genre1Name : "?"
                            }}</v-col>
                            <v-col class="pa-0" cols="4">{{
                              program.genre2Name ? program.genre2Name : "?"
                            }}</v-col>
                            <v-col class="pa-0" cols="4">{{
                              program.genre3Name ? program.genre3Name : "?"
                            }}</v-col>
                          </v-row>
                        </v-col>
                        <v-col class="align" cols="1">
                          <v-row>
                            <v-col cols="6" class="pa-0">{{
                              program.targetGroupCode
                                ? program.targetGroupCode
                                : "?"
                            }}</v-col>
                            <v-col cols="6" class="pa-0">{{
                              program.territoryCode
                                ? program.territoryCode
                                : "?"
                            }}</v-col>
                          </v-row>
                        </v-col>
                        <v-col cols="3">
                          <v-row>
                            <ProgramDialogue :program="program" />
                            <DeleteProgramDialogue
                              :program="program"
                              @deleteProgramById="deleteProgramById"
                            />
                            <Broadcasts :program="program" />
                          </v-row>
                        </v-col>
                      </v-row>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </span>
              <div v-observe-visibility="visibilityChanged"></div>
            </v-col>
</template>


<script>
import Broadcasts from "./Broadcasts";
import DeleteProgramDialogue from "./DeleteProgramDialogue";
import CreateNewProgram from "./CreateNewProgram";
import ProgramDialogue from "./ProgramDialogue";
import api from "../../services/BroadcastApiService";
export default {
  name: "Program",
  components: {
    ProgramDialogue,
    CreateNewProgram,
    DeleteProgramDialogue,
    Broadcasts,
  },
  data() {
    return {
      search: "",
      selectedItem: {},
      selectedRow: {},
      selected: [],
      series: [],
      isVisible: true,
      programList: [],
      count: 0,
      maxValue: 20,
      searchTitle: "",
      searchSeason: "",
      searchEpisode: "",
      isTyping: false,
      selectedID: "",
      metaProgramID: "",
      broadcastList: "",
      program: {
        originalTitle: "",
        episode: "",
        season: "",
        programCode: "",
        programTitle: "",
        programShortTitle: "",
        channelID: "",
        genre1ID: "",
        genre2ID: "",
        genre3ID: "",
        genre1Name: "",
        genre2Name: "",
        genre3Name: "",
        channelName: "",
        territoryCode: "",
        targetGroupCode: "",
      },
    };
  },
  methods: {  
    visibilityChanged() {
      this.count = this.count + 1;
    },
    getPrograms() {
      api
        .get("api/programs/")
        .then((response) => {
          this.programList = response;
        })
        .catch((error) => alert("Error - " + error));
    },
    createProgram(value) {
      this.program = value;
      this.saveProgram();
    },
    saveProgram() {
      api
        .post("/api/programs/", this.program)
        .then(this.programList.push(this.program))
        .catch((error) => alert(`Error: ${error}`));
    },
    deleteProgram() {
      api
        .delete("/api/programs/" + this.selectedID)
        .then(
          (this.programList = this.programList.filter(
            (item) => item.metaProgramID !== this.selectedID
          ))
        )
        .catch((error) => alert(`Error: ${error}`));
      this.dialog = false;
    },
    deleteProgramById(value) {
      this.selectedID = value;
      this.deleteProgram();
    },
    filteredList() {
      return this.programList
        .filter((item) => {
          return (
            item.originalTitle &&
            item.originalTitle
              .toLowerCase()
              .includes(this.searchTitle.toLowerCase())
          );
        })
        .filter((item) => {
          if (this.searchSeason == "") return item;
          else return item.season == parseInt(this.searchSeason);
        })
        .filter((item) => {
          if (this.searchEpisode == "") return item;
          else return item.episode == parseInt(this.searchEpisode);
        })
        .slice(0, 20 * this.count);
    },
  },
  mounted() {
    this.getPrograms();
  },
};
</script>

<style scoped>
#align {
  vertical-align: middle;
  text-align: center;
}
.button {
  padding: 0px 40px !important;
}
.toolbarFont {
  color: white;
  font-size: 14px;
}

.toolbar {
  border-radius: 5px;
}
#fonts {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  font-weight: normal;
  color: #4a4c4e;
}

.extraContent {
  width: 98%;
  margin-left: 1%;
  background-color: red;
}

.test {
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.4);
  margin-bottom: 7px;
  border-radius: 5px;
  font-size: 13px;
  padding: 0px !important;
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

#seriesTable div table tbody tr.v-data-table__selected {
  background-color: greenyellow;
}
</style>
