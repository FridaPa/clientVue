<template>
    <div>

        <v-toolbar color="#177CC4" height="50px">
            <v-row>
                <v-col class="d-flex justify-space-around">
                    <v-toolbar-title>
                        <p class="toolbarFont">{{title}}</p>
                    </v-toolbar-title>
                </v-col>
            </v-row>
        </v-toolbar>
        <v-toolbar color="#177CC477" height="50px">
            <v-row>
                <v-col v-if="UseTime">
                    <p class="toolbarFont">Override</p>
                </v-col>

                <v-col v-if="UseTime">
                    <p class="toolbarFont">Tidpunkt</p>
                </v-col>
                <v-col>
                    <p class="toolbarFont">Kanal</p>
                </v-col>
            </v-row>
        </v-toolbar>
    </div>
</template>

<script>
  export default {
    name: "LogOverviewToolbar",
    props: {
      title: String,
      UseTime: Boolean,
    }
  }
</script>

<style scoped>

    h1 {
        margin-left: 50px;
    }

    .v-sheet .v-sheet--title .theme--light .v-toolbar {
        border-radius: 4px;
    }

    .toolbarFont {
        color: white;
        text-align: center;
    }

    .v-application p {
        margin-bottom: 0;
    }
</style>