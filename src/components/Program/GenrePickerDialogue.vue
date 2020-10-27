<template>
            <v-dialog v-model="dialog" persistent max-width="450px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="primary"
                :disabled="isValidGenreObject()"
                v-bind="attrs"
                v-on="on"
              >
                Sätt genre
              </v-btn>
            </template>
            <v-card style="margin-left:0px">
              <v-card-title class="headline">Vill du koppla?</v-card-title>
              <v-card-text>
                <v-list-item two-line>
                  <v-list-item-content>
                    <v-list-item-title>Serie:</v-list-item-title>
                    <v-list-item-subtitle
                      >{{ this.serie.mainSerie }} ({{
                        this.serie.serieID
                      }})</v-list-item-subtitle
                    >
                  </v-list-item-content>
                </v-list-item>
                <v-list-item two-line>
                  <v-list-item-content>
                    <v-list-item-title>Genre:</v-list-item-title>
                    <v-list-item-subtitle
                      >{{ this.genre.name1 }}, {{ this.genre.name2 }},
                      {{ this.genre.name3 }}</v-list-item-subtitle
                    >
                  </v-list-item-content>
                </v-list-item>
                <v-list-item two-line>
                  <v-list-item-content>
                    <v-list-item-title
                      >Målgruppskod & Landskod:</v-list-item-title
                    >
                    <v-list-item-subtitle
                      >{{ this.genre.targetGroupCodeName }},
                      {{ this.genre.territoryCodeName }}</v-list-item-subtitle
                    >
                  </v-list-item-content>
                </v-list-item>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green darken-1" text @click="setGenre">Ja</v-btn>
                <v-btn color="green darken-1" text @click="dialog = false"
                  >Nej</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>
</template>

<script>
export default {
  name: "Genre",
  components: {},
  
  props: ["serie", "genre"],
  data() {
    return {
      dialog: false,
    };
  },
  methods: {
    setGenre() {
      this.dialog = false;

       this.$emit("onSetGenre");
    },
    isValidGenreObject() {
      if (
        this.serie.mainSerie &&
        this.genre.targetGroupCode &&
        this.genre.territoryCode &&
        this.serie.genre1ID != "" &&
        this.serie.genre2ID != ""
      ) {
        return false;
      }

      return true;
    },
  },  
};

</script>
