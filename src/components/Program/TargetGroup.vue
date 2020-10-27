<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="700px">
      <template v-slot:activator="{on}">
        <button class="btnDialogue" @click="dialog = true">Landskod/målgruppskod</button>
      </template>
      <v-card>
        <v-card-title>
          <span class="dialogueHeading">Lägg till landskod och målgruppskod</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <p>Målgruppskod</p>
            <v-list v-for="(target, i) in targetGroups" :key="i" class="listClass" no-action>
              <v-list-item
                @click="selectTargetGroup(target.targetGroupCode)"
                v-bind:class="{ activeTargetGroup: (activeTargetGroup == (target.targetGroupCode)) }"
              >
                <v-list-item-content class="pa-0" id="fonts">
                  <v-col cols="6">{{target.name}}</v-col>
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <br />
            <p>Landskod</p>
            <v-list
              v-for="(country, i) in countryCodes"
              :key="`A-${i}`"
              class="listClass"
              no-action
            >
              <v-list-item
                @click="selectCountryCode(country.territoryCode)"
                v-bind:class="{ activeCountryCode: (activeCountryCode == (country.territoryCode)) }"
              >
                <v-list-item-content class="pa-0" id="fonts">
                  <v-col cols="6">{{country.name}}</v-col>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
         <button class="btnDialogCancel" text @click="onClose()">STÄNG</button>
          <button class="btnDialogAccept" text @click="saveSelected()">LÄGG TILL</button>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  name: "TargetGroup",
  data() {
    return {
      dialog: false,
      activeCountryCode: "",
      activeTargetGroup: "",
      targetGroups: [
        { name: "Vuxen", targetGroupCode: "V" },
        {
          name: "Barn/Ungdom",
          targetGroupCode: "B"
        }
      ],
      countryCodes: [
        { name: "Svensk", territoryCode: "S" },
        {
          name: "Utlänsk",
          territoryCode: "U"
        }
      ]
    };
  },
  methods: {
    onClose() {
      this.dialog = false;
    },
    saveSelected() {
      this.$emit("selectedCountryAndTarget", {
        territoryCode: this.territoryCode,
        targetGroupCode: this.targetGroupCode
      });
      this.dialog = false;
    },
    selectTargetGroup(id) {
      this.activeTargetGroup = id;
      this.targetGroupCode = id;
    },
    selectCountryCode(id) {
      this.activeCountryCode = id;
      this.territoryCode = id;
    }
  },
};
</script>

<style  scoped>
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
.btnDialogue {
  border: 1px solid darkgray;
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