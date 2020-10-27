<template>
  <v-main>
    <v-tabs slider-color="blue">
      <v-tab ripple>
        Program
      </v-tab>
      <v-tab ripple>
        Genre
      </v-tab>
      <v-tab-item>
        <v-card flat>
          <v-card-text>
               <ProgramTable/>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <v-card-text>
            <SeriesList/>
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs>
  </v-main>
</template>

<script>


import SeriesList from "./SeriesList";
import ProgramTable from "./ProgramList.vue";
export default {
  name: "Program",
  components: {
    SeriesList,
    ProgramTable
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
