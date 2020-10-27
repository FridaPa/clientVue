<template>
  <div class="divheight">
    <v-dialog v-model="dialog" persistent max-width="100%">
      <template v-slot:activator="{on}">
        <v-btn depressed class="buttonstyle" color="#177CC4" @click="dialog = true">{{buttonText}}</v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="dialogueHeading">Välj Kanal</span>
        </v-card-title>
        <v-row>
            <v-card-text>
              <div class="row" v-for="row in rowCount" :key="row">
                <v-list v-for="(item, i) in GetChannelFromIndex(i)" :key="i">
                  <v-list-item @click="onSelectionChangedChannel(item.channelID)" class="dialogueList">
                  {{item.channel}}
                  </v-list-item>
                </v-list>
              </div>
            </v-card-text>
        </v-row>


           <v-card-actions>
          <v-spacer />
          <button class="btnDialogCancel" @click="onClose()">STÄNG</button>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "ChannelHouseDialogue",
  props: {
    buttonText: String,
    channels: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      itemsPerRow:5,
      dialog: false,
      currentSelection: "",
    };
  },
  methods: {
    GetChannelFromIndex(index){
     return this.channels.slice((index - 1) * this.itemsPerRow, index * this.itemsPerRow);
    },
    onClose() {
      this.dialog = false;
    },
    onSelectionChanged(item) {
      this.currentSelection = item;
      this.$emit("onSelectionChanged", this.currentSelection);
      this.onClose();
    },
    onSelectionChangedChannel(item) {
      this.currentSelection = item;
      this.$emit("onSelectionChangedChannel", this.currentSelection);
      this.onClose();
    }
  },
   computed:{
    rowCount:function(){     
      return Math.ceil(this.channels.length / this.itemsPerRow);
    },
  }
};
</script>

<style scoped>

.dialogueList {
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  border-radius: 5px;
  font-size: 13px;
  width: 200px;
  margin-left: 10px;
}
  .btnDialogCancel {
  border: 1px solid #177cc4 !important;
  color: #177cc4;
  font-size: 12px;
   padding-left: 30px;
  padding-right: 30px;
  border-radius: 5px;
  padding-top: 10px;
  padding-bottom: 10px;
  }
 .dialogueHeading {
font-weight: 100;
font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}
.divheight {
  height: 50px;
  text-align: center;
}
.buttonstyle {
  padding-left: 30px !important;
  padding-right: 30px !important;
  display: inline-block;
  vertical-align: middle;
  font-size: 12px !important;
  color: white !important;
}
</style>