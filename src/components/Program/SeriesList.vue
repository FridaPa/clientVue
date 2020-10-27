<template>
  <v-row>
    <v-col cols="3" sm="6" md="3">
      <v-card>
        <v-card-title>
          Sätt Genre
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>
        <v-data-table
          :items="series"
          :headers="headers"
          item-key="serieID"
          :search="search"
          single-select
          @click:row="seriesRowClick"
          class="elevation-1"
        >
        </v-data-table>
      </v-card>
    </v-col>
    <v-col cols="6" sm="6" md="6">
      <GenrePicker
        :serie="selectedItem"
        @onGenreSelectionComplete="onGenreSelectionComplete"
      />
    </v-col>
  </v-row>
</template>

<script>
import api from "../../services/BroadcastApiService";
import GenrePicker from "./GenrePicker";
export default {
  name: "Program",
  components: {
    GenrePicker,
  },
  data() {
    return {
      search: "",
      selectedItem: {},
      selectedRow: {},
      series: [],
    };
  },
  methods: {
    onGenreSelectionComplete(data) {
      this.setSeriesGenre(data);
    },
    setSeriesGenre(body) {
      let formatted = JSON.stringify(body);
      api
        .put("api/setSerieGenre", formatted)
        .then(() => {
          const index = this.series.indexOf(this.selectedItem);
          this.series.splice(index, 1);
        })
        .catch((error) => console.error(error));
    },
    seriesRowClick(item, row) {
      row.select(true);
      this.selectedRow = row;
      this.selectedItem = item;
    },
    getUnhandledGenres() {
      api
        .get("api/unhandledGenres")
        .then((response) => {       
          this.series = response;
        })
        .catch((error) => console.error(error));
    },
  },
  mounted() {
    this.getUnhandledGenres();
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
