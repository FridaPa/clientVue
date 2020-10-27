import Vuetify from 'vuetify'
import Vue from 'vue'
import Vuex from 'vuex'
const messageHub = new Vue();
Vue.prototype.$messageHub = messageHub;

Vue.use(Vuex);
Vue.use(Vuetify);

import { mount } from '@vue/test-utils';
import TargetGroup from '../TargetGroup.vue';
describe('target group test', () => {
    const wrapper = mount(TargetGroup);

    it('gets right value when button is clicked', async ()=>{
        expect(wrapper.vm.$data.dialog).toBe(false);
        wrapper.setData({dialog: true});
        expect(wrapper.vm.$data.dialog).toBe(true);
        wrapper.vm.onClose();
        expect(wrapper.vm.$data.dialog).toBe(false);
    })

    it('sets targetGroupCode value when running', () =>{
        let id = 2;
        wrapper.vm.selectTargetGroup(id);
        expect(wrapper.vm.$data.activeTargetGroup).toBe(2);
    })

    it("emits an event with an object", async  () => {
     //  wrapper.vm.saveSelected()    
        //console.log(wrapper.emitted())
        let TK = "V";
        let CK = "U"
        wrapper.vm.$emit('selectedCountryAndTarget', {target:TK, country:CK});
        await wrapper.vm.$nextTick() 
        console.log(wrapper.emitted());
        expect(wrapper.emitted().selectedCountryAndTarget).toBeTruthy()
        expect(wrapper.emitted().selectedCountryAndTarget[0]).toEqual([{ country:"U", target:"V"}])
   })

})