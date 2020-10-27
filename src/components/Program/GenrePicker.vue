<template>
  <div>
    <br />
    <v-container>
      <v-row>
        <v-col cols="2">
          <span class="subtitle-1">Genre 1</span>
          <v-list
            v-for="(genre, i) in genre1"
            :key="i"
            no-action
            class="genreList"
          >
            <v-list-item
              @click="selectGenre1(genre.Genre1ID, genre.Name)"
              id="listHover"
              v-bind:class="{ activeGenre: activeGenre1 == genre.Genre1ID }"
            >
              <v-list-item-content class="pa-0" id="fonts">
                <v-col class="pa-0" cols="12">{{
                  genre.Name ? genre.Name : "?"
                }}</v-col>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-col>
        <v-col cols="2">
          <span class="space" v-if="showGenre2">
            <span class="subtitle-1">Genre 2</span>
            <v-list
              v-for="(genre, i) in genre2"
              :key="i"
              no-action
              class="genreList"
            >
              <v-list-item
                @click="selectGenre2(genre.Genre2ID, genre.Name)"
                id="listHover"
                v-bind:class="{ activeGenre: activeGenre2 == genre.Genre2ID }"
              >
                <v-list-item-content class="pa-0" id="fonts">
                  <v-col class="pa-0" cols="12"
                    >{{ genre.Name ? genre.Name : "?" }}
                  </v-col>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </span>
        </v-col>
        <v-col cols="2">
          <span class="space" v-if="showGenre3">
            <span class="subtitle-1">Genre 3</span>
            <v-list
              v-for="(genre, i) in genre3"
              :key="i"
              no-action
              class="genreList"
            >
              <v-list-item
                @click="selectGenre3(genre.Genre3ID, genre.Name)"
                id="listHover"
                v-bind:class="{ activeGenre: activeGenre3 == genre.Genre3ID }"
              >
                <v-list-item-content class="pa-0" id="fonts">
                  <v-col class="pa-0" cols="12">{{
                    genre.Name ? genre.Name : "?"
                  }}</v-col>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </span>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="3">
          <p>Målgruppskod</p>
          <v-list
            v-for="(target, i) in targetGroups"
            :key="i"
            class="listClass"
            no-action
          >
            <v-list-item
              @click="selectTargetGroup(target.targetGroupCode, target.name)"
              v-bind:class="{
                activeTargetGroup: activeTargetGroup == target.targetGroupCode,
              }"
            >
              <v-list-item-content class="pa-0" id="fonts">
                <v-col cols="6">{{ target.name }}</v-col>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-col>
        <v-col cols="3">
          <p>Landskod</p>
          <v-list
            v-for="(country, i) in countryCodes"
            :key="`A-${i}`"
            class="listClass"
            no-action
          >
            <v-list-item
              @click="selectCountryCode(country.territoryCode, country.name)"
              v-bind:class="{
                activeCountryCode: activeCountryCode == country.territoryCode,
              }"
            >
              <v-list-item-content class="pa-0" id="fonts">
                <v-col cols="6">{{ country.name }}</v-col>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <GenrePickerDialogue
            :serie="serie"
            :genre="genre"
            @onSetGenre="onSetGenre"
          />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import api from "../../services/BroadcastApiService";
import GenrePickerDialogue from "./GenrePickerDialogue.vue";
export default {
  name: "Genre",
  components: {
    GenrePickerDialogue,
  },
  props: ["serie"],
  data() {
    return {
      activeGenre1: "",
      activeGenre2: "",
      activeGenre3: "",
      showGenre2: false,
      showGenre3: false,
      genre1: [],
      genre2: [],
      genre3: [],
      genre: {
        genre1ID: "",
        genre2ID: "",
        genre3ID: "",
        name1: "",
        name2: "",
        name3: "",
        targetGroupCodeName: "",
        territoryCodeName: "",
        targetGroupCode: "",
        territoryCode: "",
      },
      activeCountryCode: "",
      activeTargetGroup: "",
      targetGroups: [
        { name: "Vuxen", targetGroupCode: "V" },
        {
          name: "Barn/Ungdom",
          targetGroupCode: "B",
        },
      ],
      countryCodes: [
        { name: "Svensk", territoryCode: "S" },
        {
          name: "Utlänsk",
          territoryCode: "U",
        },
      ],
    };
  },
  methods: {
    onSetGenre() {
      console.log(this.genre.genre3ID);
      this.$emit("onGenreSelectionComplete", {
        SerieID: this.serie.serieID,
        Genre1ID: this.genre.genre1ID,
        Genre2ID: this.genre.genre2ID,
        Genre3ID: this.genre.genre3ID,
        TargetGroupCode: this.targetGroupCode,
        TerritoryCode: this.territoryCode,
      });
    },
    isValidGenreObject() {
      if (
        this.serie.mainSerie &&
        this.targetGroupCode &&
        this.territoryCode &&
        this.serie.genre1ID != "" &&
        this.serie.genre2ID != ""
      ) {
        return false;
      }

      return true;
    },
    selectTargetGroup(id, name) {
      this.activeTargetGroup = id;
      this.genre.targetGroupCode = id;
      this.genre.targetGroupCodeName = name;
    },
    selectCountryCode(id, name) {
      this.activeCountryCode = id;
      this.genre.territoryCode = id;
      this.genre.territoryCodeName = name;
    },

    selectGenre1(id, item) {
      this.genre.genre2ID = 0;
      this.genre.genre3ID = 0;
      this.genre.name2 = "";
      this.genre.name3 = "";
      this.activeGenre1 = id;
      this.genre.genre1ID = id;
      this.genre.name1 = item;
      api
        .get("api/genre/?id1=" + this.genre.genre1ID)
        .then((response) => {
          this.genre2 = response;
        })
        .catch((error) => console.error(error));
      this.activeGenre2 = "";
      this.showGenre2 = true;
      this.showGenre3 = false;
    },

    getGenre() {
      api
        .get("api/genre/")
        .then((response) => {
          this.genre1 = response;
        })
        .catch((error) => console.error(error));
    },
    selectGenre2(id, item) {
      this.genre.genre3ID = 0;
      this.genre.name3 = "";
      this.activeGenre2 = id;
      this.genre.genre2ID = id;
      this.genre.name2 = item;
      api
        .get(
          "api/genre/?id1=" +
            this.genre.genre1ID +
            "&id2=" +
            this.genre.genre2ID
        )
        .then((response) => {
          this.genre3 = response;
        })
        .catch((error) => console.error(error));
      this.showGenre3 = true;
      this.activeGenre3 = "";
      this.$emit("selectedGenre", this.genre);
    },
    selectGenre3(id, item) {
      this.activeGenre3 = id;
      this.genre.genre3ID = id;
      this.genre.name3 = item;
      this.$emit("selectedGenre", this.genre);
    },
  },
  mounted: function() {
    this.getGenre();
  },
  computed: {
    headers() {
      return [
        { text: "SerieID", value: "serieID" },
        { text: "MainSerie", value: "mainSerie" },
        { text: "StartDate", value: "startDate" },
      ];
    },
  },
};
</script>

<style scoped>
v-data-table__selected {
  background-color: red !important;
}
.space {
  margin-left: 15px;
}
#listHover:hover,
.activeGenre {
  background-color: #177cc4;
  color: white !important;
  border-radius: 5px;
}

.btnDialogAccept,
.btnDialogCancel,
.btnDialogue {
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
.btnDialogue {
  border: 1px solid darkgray;
}

.btnDialogCancel {
  border: 1px solid #177cc4;
  color: #177cc4;
}

.v-dialog {
  width: 900px !important;
}
.genreList {
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.4);
  margin-bottom: 7px;
  border-radius: 5px;
  font-size: 13px;
  width: 200px !important;
  padding: 0px !important;
}
.subtitle-1 {
  margin-bottom: 10px;
}
.v-sheet .v-sheet--title .theme--light .v-toolbar {
  border-radius: 4px;
}

.v-card {
  box-shadow: none;
  margin-left: 20px;
}

.activeCountryCode,
.activeTargetGroup {
  background-color: #177cc4;
  color: white !important;
  border-radius: 5px;
}
.listClass {
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.4);
  margin-bottom: 7px;
  border-radius: 5px;
  font-size: 13px;
  padding: 0px !important;
  width: 200px;
}
.btnDialogAccept,
.btnDialogCancel,
.btnDialogue {
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
.dialogueHeading {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  font-weight: 100;
}
</style>
