import Vuetify from 'vuetify'
import Vue from 'vue'
import Vuex from 'vuex'
const messageHub = new Vue();
Vue.prototype.$messageHub = messageHub;

Vue.use(Vuex);
Vue.use(Vuetify);

import { mount } from '@vue/test-utils';
import PgEpgEntry from '../SubComponents/PgEpgEntry';

//TODO - fixa errors i vyn för att kunna göra klart tester
describe('pg epg entry test', () => {
    const wrapper = mount(PgEpgEntry);

    it('returns true', () => {
        let pg = "hej";
        let epg = "hej";
      let compare =  wrapper.vm.compareTitles(pg, epg);
      expect(compare).toBe(true);

    })
})