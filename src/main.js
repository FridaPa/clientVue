import Vue from 'vue'
import App from './App.vue'
import router from './components/router'
import vuetify from '@/plugins/vuetify'
import store from './store'
import signalR from './plugins/signalR'
import VueObserveVisibility from 'vue-observe-visibility';
import getRuntimeConfig from "./plugins/runtimeConfig";
import helpers from './helpers/dateHelper'

Vue.config.productionTip = false;
Vue.use(VueObserveVisibility);
Vue.use(signalR);

const helperPlugin = {
  install() {
    Vue.helpers = helpers;
    Vue.prototype.$helpers = helpers;
  }
}
Vue.use(helperPlugin);

import Adal from 'vue-adal'

let config = null;
Vue.prototype.$runtimeConfig = config;

// use new Vue instance as an event bus
getRuntimeConfig()
  .then(result => {
      config = result;
      Vue.use(Adal, {
        config: {
          tenant: config.AzureTenantId,
          clientId: config.AzureClientId,
          redirectUri: config.FrontendUrl + '/LoggedIn',
          cacheLocation: 'localStorage'
        },
        requireAuthOnInitialize: false,
        router: router
      })
    }
  )
  .then(() => {
      new Vue({
        render: h => h(App),
        store,
        vuetify,
        router
      }).$mount('#app');
      
    }
  )
;

 