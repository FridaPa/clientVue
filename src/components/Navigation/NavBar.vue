<template>
  <div>
    <v-card class="overflow-hidden">
      <v-app-bar fixed >
        <v-spacer></v-spacer>    
        <v-toolbar-title class="title">MMS Metadata</v-toolbar-title>
        <v-tabs align-with-title>
          <v-tab to="/Program">Program</v-tab>        
          <v-tab to="/PgLog">PgLog</v-tab>
          <v-tab to="/ChannelSettings">Kanalinställningar</v-tab>
        </v-tabs>
        <div>
          <div style="width: 400px">
            <ReceivedLogBar></ReceivedLogBar>
          </div>
        </div>
        <div v-if="$adal.isAuthenticated()">{{userProfile.name}}</div>
      </v-app-bar>
    </v-card>
  </div>
</template>

<script>
import { AuthenticationContext } from "vue-adal";
import ReceivedLogBar from "../LogOverview/TopBar/ReceivedLogBar";

export default {
  name: "Navigation",
  components: { ReceivedLogBar },
  data() {
    return {};
  },
  computed: {
    userProfile: function() {
      return AuthenticationContext.user.profile;
    }
  }
};
</script>
<style scoped>
.title {
  width: 200px;
}
</style>