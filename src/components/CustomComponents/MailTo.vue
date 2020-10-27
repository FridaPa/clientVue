<template>
    <v-btn :href="mailto()">{{ButtonText}}</v-btn>
</template>

<script>
  export default {
    name: "MailTo",
    props: ["ButtonText", "Address", "Cc", "Bcc", "Subject", "Body"],
    data(){
      return {

      }
    },
    methods: {
      mailto() {
        return "mailto:" + this.Address + "?" +
          "cc=" + this.Cc +
          "&bcc=" + this.Bcc +
          "&subject=" + this.Subject +
          "&body=" + this.Body;

      }
    }
  }
</script>

<style scoped>

</style>