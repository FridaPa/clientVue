<template>
    <v-row justify="center">
        <v-dialog v-model="dialog" persistent max-width="700px">
            <template v-slot:activator="{on}">
                <v-icon class="pa-0" color="#177CC4" @click="dialog = true">mdi-square-edit-outline</v-icon>
                
               
            </template>
            <v-card>
                <v-card-title>
                    <span class="headline">Redigera</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="6">
                                <v-text-field label="Typ" v-model="ProgramType" required/>
                            </v-col>
                            <v-col cols="6">
                                <v-text-field label="Titel" v-model="ProgramTitle" required/>
                            </v-col>
                            <v-col cols="6">
                                <v-text-field label="Säsong" v-model="Season" required/>
                            </v-col>
                            <v-col cols="6">
                                <v-text-field label="Episod" v-model="Episode" type="number" required/>
                            </v-col>
                            <v-col cols="6">
                                <v-label>Start Tid</v-label>
                                <v-time-picker v-model="startTimePicker"
                                               @click:hour="(value) => this.StartDateHours = value"
                                               @click:minute="(value) => this.StartDateMinutes = value" 
                                               scrollable 
                                               format="24hr"></v-time-picker>
                            </v-col>
                            <v-col cols="6">
                                <v-label>Slut Tid</v-label>
                                <v-time-picker v-model="endTimePicker"
                                               @click:hour="(value) => this.EndDateHours = value"
                                               @click:minute="(value) => this.EndDateMinutes = value"
                                               scrollable 
                                               format="24hr"></v-time-picker>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer/>
                    <button class="btnDialogCancel" text @click="onClose()">STÄNG</button>
                    <button class="btnDialogAccept" text @click="saveBroadcast()">SPARA</button>
                </v-card-actions>
            </v-card>
        </v-dialog >
    </v-row>
</template>
<script>
    // import axios from "axios";

    import api from "../../services/BroadcastApiService";
    export default {
        name: "BroadcastDialogue",
        props: ['YesButtonText', 'ButtonText', 'Broadcast'],
        components: {},
        data() {
            return {
                dialog: false,
                ProgramType: this.Broadcast?.programType,
                ProgramTitle: this.Broadcast?.programTitle,
                Season: this.Broadcast?.season,
                Episode: this.Broadcast?.episode,
                StartDateHours: this.toHours(this.Broadcast?.startDate),
                StartDateMinutes: this.toMinutes(this.Broadcast?.startDate),
                EndDateHours: this.toHours(this.Broadcast?.endDate),
                EndDateMinutes: this.toMinutes(this.Broadcast?.endDate),

                endTimePickerModal: false,
                endTimePicker: null,
                startTimePicker: null,
            }
        },
        methods:{
            onClose() {
                this.dialog = false;
            },
            saveBroadcast() {
                let startDate = new Date(this.Broadcast.startDate);
                let endDate = new Date(this.Broadcast.endDate);
                startDate.setHours(this.StartDateHours);
                startDate.setMinutes(this.StartDateMinutes);
                endDate.setHours(this.EndDateHours);
                endDate.setMinutes(this.EndDateMinutes);
                
                this.Broadcast.startDate = startDate;
                this.Broadcast.endDate = endDate;
                api.put("api/Front/updateFrontBroadcast", this.Broadcast)
                    .then()
                .catch(error => alert(`Error: ${error}`));
                this.dialog = false;
            },
            toHours:  function(item) {
                let date = new Date(item);
                return date.toLocaleTimeString("sv-SE", {
                    hour: "2-digit",
                    hour12: false,
                });
            },
            toMinutes:  function(item) {
                let date = new Date(item);
                return date.toLocaleTimeString("sv-SE", {
                    minute: "2-digit",
                    hour12: false,
                });
            },
        },
        mounted: function() {
            this.endTimePicker = this.EndDateHours + ":" + this.EndDateMinutes;
            this.startTimePicker = this.StartDateHours + ":" + this.StartDateMinutes;

        }
    }
</script>

<style scoped>

.btnDialogAccept, .btnDialogCancel  {
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
    padding: 8px 34px;
    border-radius: 5px;
    margin-right: 10px;
    font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-weight: 100;
    transition: 0.3s;
}
.btnDialogAccept {
    background-color: #177CC4;
    color: cornsilk;
}

.v-time-picker-clock {
width:100px;
}
.v-dialog {
    max-width:700px;
}

</style>