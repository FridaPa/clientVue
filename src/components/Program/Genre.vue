<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="800px">
      <template v-slot:activator="{on}">
        <button class="btnDialogue" @click="dialog = true">Välj genre</button>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">Lägg till ny Genre</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <div>
                <span class="subtitle-1">Genre 1</span>
                <v-list v-for="(genre, i) in genre1" :key="i" no-action class="test">
                  <v-list-item
                    @click="selectGenre1(genre.Genre1ID, genre.Name)"
                    id="listHover" class="genre1"
                    v-bind:class="{ activeGenre: (activeGenre1 == (genre.Genre1ID)) }">
                    <v-list-item-content class="pa-0" id="fonts">
                      <v-col class="pa-0" cols="12">{{genre.Name ? genre.Name : '?'}}</v-col>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </div>
              <span class="space" v-if="showGenre2">
                <span class="subtitle-1">Genre 2</span>
                <v-list v-for="(genre, i) in genre2" :key="i" no-action class="test">
                  <v-list-item @click="selectGenre2(genre.Genre2ID, genre.Name)"
                    id="listHover"
                    v-bind:class="{ activeGenre: (activeGenre2 == (genre.Genre2ID)) }">
                    <v-list-item-content class="pa-0" id="fonts">
                      <v-col
                        
                        class="pa-0"
                        cols="12">{{genre.Name ? genre.Name : '?'}}
                        </v-col>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </span>
              <span class="space" v-if="showGenre3">
                <span class="subtitle-1">Genre 3</span>
                <v-list v-for="(genre, i) in genre3" :key="i" no-action class="test">
                  <v-list-item    @click="selectGenre3(genre.Genre3ID, genre.Name)"
                    id="listHover" 
                    v-bind:class="{ activeGenre: (activeGenre3 == (genre.Genre3ID)) }">
                    <v-list-item-content class="pa-0" id="fonts">
                      <v-col
                     
                        class="pa-0"
                        cols="12"
                      >{{genre.Name ? genre.Name : '?'}}</v-col>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </span>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <button class="btnDialogCancel" text @click="onClose()">STÄNG</button>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import api from "../../services/BroadcastApiService";
export default {
  name: "Genre",
  data() {
    return {
      activeGenre1: "",
      activeGenre2: "",
      activeGenre3: "",
      dialog: false,
      currentSelection: "",
      currentSelection2: "",
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
          name3: ""
          },
      
    };
  },
  methods: {
    onClose() {
      this.dialog = false;
    },
    selectGenre1(id, item) {
      this.activeGenre1 = id;
      this.genre.genre1ID = id;
      this.genre.name1 = item;
      this.genre.genre2ID = 0;
      this.genre.name2 = "";
      this.genre.genre3ID = 0;
      this.genre.name3 = "";
      api
        .get("api/genre/?id1=" + this.genre.genre1ID)
        .then(response => {
          this.genre2 = response;
        })
        .catch(error => {
          console.log(error);
        });
      this.activeGenre2 = "";
      this.showGenre2 = true;
      this.showGenre3 = false;
    },

    getGenre1() {
      api
        .get("api/genre/")
        .then(response => {
          this.genre1 = response;
        })
        .catch(error => {
          console.log(error);
        });
    },
    selectGenre2(id, item) {

      this.activeGenre2 = id;
      this.genre.genre3ID = 0;
      this.genre.name3 = "";
      this.genre.genre2ID = id;
      this.genre.name2 = item;
      api
        .get("api/genre/?id1=" + this.genre.genre1ID + "&id2=" + this.genre.genre2ID)
        .then(response => {
          this.genre3 = response;
        })
        .catch(error => {
          console.log(error);
        });
      this.showGenre3 = true;
      this.activeGenre3 = "";
       this.$emit("selectedGenre", this.genre);
            
    },
    selectGenre3(id, item) {
      console.log(this.genre);
      this.activeGenre3 = id;
      this.genre.genre3ID = id;
      this.genre.name3 = item;
      this.$emit("selectedGenre", this.genre);
      this.onClose();
    
    }
  },
  mounted: function() {
    this.getGenre1();
  }
};
</script>

<style scoped>
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
.test {
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
</style>