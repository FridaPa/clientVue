import Vuetify from 'vuetify'
import Vue from 'vue'
import Vuex from 'vuex'
const messageHub = new Vue();
Vue.prototype.$messageHub = messageHub;

Vue.use(Vuex);
Vue.use(Vuetify);

import { mount } from '@vue/test-utils';
import UnhandledDates from '../SubComponents/UnhandledDates';


describe('Unhandled dates testing', () =>{
    const wrapper = mount(UnhandledDates);

    it('check emit and emit value', async() => {
        let date = "20200303";
        wrapper.vm.$emit('datePressed', date);
        await wrapper.vm.$nextTick() 
        console.log(wrapper.emitted());
        expect(wrapper.emitted().datePressed).toBeTruthy()
        expect(wrapper.emitted().datePressed[0]).toEqual(["20200303"])
    })

 /*   it('converts datatype and return unique dates', () => {
        let dateArray = [
            {"LogID":3041,"ChannelID":671,"ReceivedAt":"2020-07-08T10:50:44.4524824",
            "ValidFor":"2020-07-07T00:00:00","LogFileName":"pg200707.kun","Product":null,
            "Contact":null,"State":"TechnicalValidationOK","ChannelName":"KUN\r\n"},
            {"LogID":3042,"ChannelID":206,"ReceivedAt":"2020-07-08T10:50:44.7029908",
            "ValidFor":"2020-07-07T00:00:00","LogFileName":"pg200707.nat","Product":null,
            "Contact":null,"State":"TechnicalValidationOK","ChannelName":"NAT\r\n"},
            {"LogID":3044,"ChannelID":1066,"ReceivedAt":"2020-07-08T10:50:45.1701187",
            "ValidFor":"2020-07-08T00:00:00","LogFileName":"pg200707.par","Product":null,
            "Contact":null,"State":"TechnicalValidationOK","ChannelName":"Paramount"}
        ]
       let dateConverter =  wrapper.vm.convertToApiDates(dateArray);
       expect(dateConverter).toBe(["20200707", "20200708"]);
    })*/

    it('returns the right class name', () => {
       // wrapper.setData({active: "hej"})
        //let name = "hej"
      //  wrapper.vm.getActiveClassBasedOnName(name);
       // expect(wrapper.find('v-btn').hasClass('active')).to.equal(true)

    })
})