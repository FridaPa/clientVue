import { HubConnectionBuilder, LogLevel } from '@aspnet/signalr'
import getRuntimeConfig from "./runtimeConfig";
let connection;
let webApiUrl;
export default {
    
    install (Vue) {
      getRuntimeConfig().then(result => {
          webApiUrl = result.WebApiUrl;
      })
        .then(() => {
          this.initializeMessageHub(Vue);
        });
    },
    
    stop(){
        connection.onclose(() => {});
        connection.stop();
    },
    
    initializeMessageHub(Vue) {
      connection = new HubConnectionBuilder()
        .withUrl(webApiUrl + '/MessageHub')
        .configureLogging(LogLevel.Information)
        .build();
      const messageHub = new Vue();
      // every component will use this.$questionHub to access the event bus
      Vue.prototype.$messageHub = messageHub;
      connection.on('UserLoggedIn', (username) => {
        messageHub.$emit('userLoggedIn', { username })
      });
      let startedPromise = null;
      function start () {
        startedPromise = connection.start().catch(() => {
          // alert('Failed to connect with hub, retrying in 5 seconds', err);
          return new Promise((resolve, reject) =>
            setTimeout(() => start().then(resolve).catch(reject), 5000))
        });
        return startedPromise;
      }
      connection.onclose(() => start());

      start()
    }
    
}

