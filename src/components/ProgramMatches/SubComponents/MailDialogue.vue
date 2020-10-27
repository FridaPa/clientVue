<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="700px">
      <template v-slot:activator="{on}" >
        <v-btn depressed color="primary" class="btnDialogAccept" :disabled="!enabled" @click="dialog = true">Maila kanal</v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">Maila kanal</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <span class="subtitle-1">Välj alternativ</span>
            <v-list v-for="alt in mailAlternative" :key="alt" no-action class="mailList">
              <v-list-item
                      @click="selectedAlt(alt)"
                      v-bind:class="{ active: (activeSelection == alt)}"
                      id="listHover">
                <v-list-item-content class="pa-0" id="fonts">
                  <v-col class="pa-0" cols="12">{{alt}}</v-col>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <button class="btnDialogCancel" text @click="onClose()">Avbryt</button>
          <mail-to
                  button-text="Se mail"
                  :Address="this.channelMail"
                  Cc="Mikael.Hallne@mms.se"
                  Bcc=""
                  :Subject="this.selected"
                  :Body="getFormatedBodyString()"
          ></mail-to>
          <!--        :Bcc="this.userProfile.name"-->
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>


<script>
  import {AuthenticationContext} from "vue-adal";
  import api from "../../../services/BroadcastApiService";
  import MailTo from "./../../CustomComponents/MailTo";

  export default {
    name: "MailDialogue",
    props: {
      errors: {
        type: Array,
        required: true
      },
      enabled: {
        type: Boolean,
        required: false,
        default: false
      }
    },
    components: {MailTo},
    data() {
      return {
        lineBreak: "%0D%0A",
        mailAlternative: ["För stort glapp mellan program i PG", "EPG starttid/sluttider matchar ej PG-loggens tider",
          "EPG Programtitel matchar ej PG-loggens programtitel"],
        dialog: false,
        selected: ["EPG starttid/sluttider matchar ej PG-loggens tider",
          "EPG Programtitel matchar ej PG-loggens programtitel"],
        activeSelection: false,
        selectedItem: "",
        channelMail: "",
        channel: "",

      };
    },
    methods: {
      onClose() {
        this.dialog = false;
      },
      getUniqueMail() {
        this.channelMail = [...new Set(this.channelMail.map(data => data.configValue))]
      },
      getFormatedBodyString() {
        let body = "Nedan följer diffar:" + this.lineBreak + this.lineBreak;
        for (var i = 0; i < this.errors.length; i++) {
          body += this.errors[i].error + this.lineBreak + this.lineBreak;
        }
      return body;
      },
 getChannel() {
        for (let i = 0; i < this.epg.length; i++) {
          this.channel = this.epg[i].channelID;
       }        
        api.get("api/ChannelConfig/channel/" + this.channel)
          .then(result => {
           this.channelMail = result;
            this.getUniqueMail();
          
          })
          .catch(error => console.error(error));
      },
      dateToTimeStamp(item) {
        let date = new Date(item);
        return date.toLocaleTimeString("sv-SE", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false
        });
      },
      selectedAlt(item) {   
        this.activeSelection = item;
        this.selectedItem += item;
        for (let i = 0; i < this.selected.length; i++) {
          if (this.selected[i] !== this.selectedItem) {
            this.selected.push(this.selectedItem);
            break;
          } else {
            this.selected = this.selected.filter(i => i !== this.selectedItem);
            break;
          }
        }
        //  console.log(this.selected);
        this.getChannel();
        this.getFormatedBodyString();
        return this.selected;
      }
    },
    computed: {
      userProfile: function () {
        return AuthenticationContext.user.profile;
      }
    },
  };
</script>

<style scoped>
  .btnDialogAccept,
  .btnDialogCancel {
    padding: 8px 34px !important;
    border-radius: 5px;
    margin-right: 10px;
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    font-weight: 100;
    transition: 0.3s;
  }

  .btnDialogAccept {
    background-color: #177cc4;
    color: cornsilk !important;
  }

  .btnDialogCancel {
    border: 1px solid #177cc4;
    color: #177cc4;
  }

  #listHover:hover,
  .active {
    background-color: #177cc4;
    color: white !important;
    border-radius: 5px;
  }

  .subtitle-1 {
    margin-bottom: 30px !important;
  }

  .mailList {
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.4);
    margin-bottom: 7px;
    border-radius: 5px;
    font-size: 13px;
    width: 350px !important;
    padding: 0px !important;
  }

  .headline {
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif !important;
    font-weight: 100 !important;
  }


</style>