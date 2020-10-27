import Vuetify from 'vuetify'
import Vue from 'vue'
import Vuex from 'vuex'
const messageHub = new Vue();
Vue.prototype.$messageHub = messageHub;

Vue.use(Vuex);
Vue.use(Vuetify);

import { mount } from '@vue/test-utils';
import CreateNewProgram from '../CreateNewProgram';

describe('testProgram', () => {
    const wrapper = mount(CreateNewProgram);
    it("emits an event with an object",  () => {
         wrapper.vm.saveBroadcast()    
         console.log(wrapper.emitted())

    })

    it('changes on changed category', () => {
        wrapper.setData({currentSelection: 'Serie'})
        wrapper.vm.onSelectionChangedCategory()
        expect(wrapper.vm.$data.showEpisodeandSeason).toBe(true);
        wrapper.setData({currentSelection: 'Film'})
        wrapper.vm.onSelectionChangedCategory()
        expect(wrapper.vm.$data.showEpisodeandSeason).toBe(false);
        wrapper.setData({currentSelection: ''})
        wrapper.vm.onSelectionChangedCategory()
        expect(wrapper.vm.$data.showEpisodeandSeason).toBe(false);
    })
});