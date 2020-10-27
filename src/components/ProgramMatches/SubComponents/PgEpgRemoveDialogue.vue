<template>
  <v-dialog
          v-model="dialog"
          width="500">
    <template v-slot:activator="{ on, attrs }">
      <v-btn elevation="0"
             color="white"
             v-bind="attrs"
             v-on="on">
        <v-icon color="red">mdi-delete</v-icon>
      </v-btn>
    </template>
    <v-card v-if="!empty">
      <v-card-title
              class="headline red lighten-2"
              primary-title
      >
        Ta bort {{name}}
      </v-card-title>
      <v-card-text>
        Är du säker på att du vill ta bort "{{name}}"?
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
                color="red lighten-2"
                @click="dialog = false"
        >
          Avbryt
        </v-btn>
        <v-btn
                color="red lighten-2"
                @click="remove"
        >
          Ta bort
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-card v-else>
      <v-card-title
              class="headline red lighten-2"
              primary-title
      >
        Ta bort Tom ruta
      </v-card-title>
      <v-card-text>
        <p class="emptyText">Är du säker på att du vill ta bort den tomma rutan?</p>
        <p class="emptyText">Alla EPG-poster under denna kommer då att flyttas upp ett steg</p>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
                color="red lighten-2"
                @click="dialog = false"
        >
          Avbryt
        </v-btn>
        <v-btn
                color="red lighten-2"
                @click="remove"
        >
          Ta bort
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    name: "PgEpgRemoveDialogue",
    props: ['name', 'empty'],
    data() {
      return {
        dialog: false,
      }
    },
    methods: {
      remove() {
        this.dialog = false;
        this.$emit('onRemoveEntry', this.empty);
      },
    }
  }
</script>

<style scoped>
  .emptyText {
    font-size: 20px;
    margin-top:20px;
  }
</style>