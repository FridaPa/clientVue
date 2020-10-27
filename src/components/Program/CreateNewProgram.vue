<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="700px">
      <template v-slot:activator="{on}">
        <button class="btnDialogAccept" @click="dialog = true">Lägg till program</button>
      </template>
      <v-card>
        <v-card-title>
          <span class="createProgram">Lägg till nytt program</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-select
                      :items="categories"
                      label="Välj kategori"
                      @change="onSelectionChangedCategory()"
                      v-model="currentSelection"
              ></v-select>
              <v-col cols="6">
                <v-text-field label="Programtitel" v-model="program.originalTitle" required/>
              </v-col>
              <v-col cols="6">
                <v-text-field label="Produktionsår" v-model="prodYear" required/>
              </v-col>
              <v-col v-if="showEpisodeandSeason" cols="6">
                <v-text-field label="Säsong" v-model="program.season" type="number" required/>
              </v-col>
              <v-col v-if="showEpisodeandSeason" cols="6">
                <v-text-field label="Episod" v-model="program.episode" type="number" required/>
              </v-col>
              <v-col cols="10">
                <v-row>
                  <Genre @selectedGenre="setSelectedGenre"/>
                  <TargetGroup @selectedCountryAndTarget="setSelectedCountryAndTarget"/>
                </v-row>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <button class="btnDialogCancel" text @click="onClose()">STÄNG</button>
          <button class="btnDialogAccept" text @click="saveBroadcast()">LÄGG TILL</button>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
  import Genre from "./Genre.vue";
  import TargetGroup from "./TargetGroup.vue";

  export default {
    name: "CreateNewProgram",
    components: {Genre, TargetGroup},
    data() {
      return {
        dialog: false,
        showEpisodeandSeason: false,
        currentSelection: "",
        categories: ["Sport", "Film", "Serie"],
        prodYear: "",
        program: {
          genre1ID: "",
          genre2ID: "",
          genre3ID: "",
          genre1Name: "",
          genre2Name: "",
          genre3Name: "",
          channelName: "",
          channelID: "",
          season: "",
          episode: "",
          programCode: "",
          originalTitle: "",
          programTitle: "",
          programShortTitle: "",
          territoryCode: "",
          targetGroupCode: ""
        }
      };
    },
    methods: {
      onClose() {
        this.dialog = false;
      },
      setSelectedCountryAndTarget(value) {
        this.program.targetGroupCode = value.targetGroupCode;
        this.program.territoryCode = value.territoryCode;
      },
      setSelectedGenre(value) {
        this.program.genre1ID = value.genre1ID;
        this.program.genre2ID = value.genre2ID;
        this.program.genre3ID = value.genre3ID;
        this.program.genre1Name = value.name1;
        this.program.genre2Name = value.name2;
        this.program.genre3Name = value.name3;
      },
      saveBroadcast() {
        this.$emit("createProgram", this.program);
        this.dialog = false;
      },
      onSelectionChangedCategory() {
        if (this.currentSelection === "Serie") this.showEpisodeandSeason = true;
        else this.showEpisodeandSeason = false;
      },
    },
  };
</script>

<style scoped>
  .createProgram {
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    font-weight: 100;
  }

  .btnDialogAccept,
  .btnDialogCancel {
    margin-left: 10px;
    padding: 8px 34px;
    border-radius: 5px;
    margin-right: 10px;
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    font-weight: 100;
    transition: 0.3s;
  }

  .btnDialogAccept {
    background-color: #177cc4;
    color: white;
  }

  .btnDialogCancel {
    border: 1px solid #177cc4;
    color: #177cc4;
  }

  .v-dialog {
    max-width: 700px;
  }
</style>