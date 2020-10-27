<template>
  <v-app>
    <v-main>
      <v-row class="navigation-tab">
        <Navigation/>
      </v-row>
      <v-row>
        <router-view/>
      </v-row>
    </v-main>
  </v-app>
</template>

<script>
  import Navigation from './components/Navigation/NavBar.vue'
  import {AuthenticationContext} from "vue-adal";

  export default {
    name: 'app',
    components: {
      'Navigation': Navigation
    },
    data() {
      return {}
    },
    mounted() {
    },
    methods: {
      init() {
        return AuthenticationContext !== undefined && AuthenticationContext !== null && AuthenticationContext?.config;
      }
    },
    computed: {
      isInitialized() {
        return AuthenticationContext !== undefined && AuthenticationContext !== null && AuthenticationContext?.config;
      }
    },
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }

  .navigation-tab {
    height: 100px;
  }
</style>
