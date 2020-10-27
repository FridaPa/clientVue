<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="700px">
      <template v-slot:activator="{on}">
     <v-icon color="red" @click="dialog = true" >mdi-close-box</v-icon>
      </template>
      <v-card>
        <v-card-text>
          <v-container>
            <p class="deleteConfig">
             Är du säker på att du vill ta bort {{configValue}} ?
            </p>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <button class="btnDialogCancel" text @click="onClose()">Avbryt</button>
          <button class="btnDialogAccept" text @click="deleteConfig()">JA</button>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>


<script>
export default {
  name: "DeleteConfigDialogue",
  props: ["config"],
  components: {},
  data() {
    return {
      dialog: false,
      selected: "",
      configValue: this.config?.configValue,
      id: this.config?.configID,
    };
  },
  methods: {
    onClose() {
      this.dialog = false;
    },
    deleteConfig() {
      this.$emit("deleteConfig", this.id);
      this.dialog = false;
    }
  }
};
</script>

<style  scoped>
.btnDialogAccept,
.btnDialogCancel {
  padding: 8px 34px;
  border-radius: 5px;
  margin-right: 10px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  font-weight: 100;
}
.btnDialogAccept {
  background-color: #177cc4;
  color: cornsilk;
}
.btnDialogCancel {
  border: 1px solid #177cc4;
  color: #177cc4;
}
.deleteConfig {
    margin-top: 20px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  font-weight: 100;
  font-size: 20px;
  color: grey;
}
</style>