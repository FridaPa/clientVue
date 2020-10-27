import Vuetify from 'vuetify'
import Vue from 'vue'
import Vuex from 'vuex'
const messageHub = new Vue();
Vue.prototype.$messageHub = messageHub;

Vue.use(Vuex);
Vue.use(Vuetify);

//TODO - fixa errors för att få tillgång till vyns tester
import { mount } from '@vue/test-utils';
import PGChannels from '../SubComponents/PGChannels';

describe('PGChannels test', () => {
    const wrapper = mount(PGChannels);

    it('returns the right value depends on state', () => {
        let state = null;
        wrapper.vm.getClassBasedOnState(state);
        expect(wrapper.html()).toBe('missingState')
    })

})