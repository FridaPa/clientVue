import Vuetify from 'vuetify'
import Vue from 'vue'
import Vuex from 'vuex'
const messageHub = new Vue();
Vue.prototype.$messageHub = messageHub;

Vue.use(Vuex);
Vue.use(Vuetify);

import { mount } from '@vue/test-utils';
import PgEpg from '../PgEpg';


// TO TO - kolla på transformIgnorePatterns för att få tillgång till vyn
describe('PG-EPG testing', () => {

    const wrapper = mount(PgEpg, {
      
    });

    it('Receves an array from api', async () =>{
        const loadChannelsForDate = jest.fn().mockName("loadChannelsForDate");
        wrapper.setMethods({
            loadChannelsForDate: loadChannelsForDate
        })
        loadChannelsForDate.mockResolvedValue({
            data: [   
                { "status":"error","channelID":204,"name":"Boomerang", "date": "20200730"},
                { "status": "validationOK","channelID":633, "name":"tv4", "date": "20200730"}
             ] 
        })
        let date = "20200730";
        wrapper.setData({channelInfo: []})
        await wrapper.vm.loadChannelsForDate(date); 
        expect(wrapper.vm.$data.channelInfo).not.toBe([]);  
    })
    it('Adds epg entry', async () => {
        wrapper.setData({selectedChannel: 204, pgEpgEntries: [ {"title": "hello", "metaBroadcastID": 123 }]})
        await wrapper.vm.addEmptyEntry()
        expect(wrapper.vm.$data.pgEpgEntries).toHaveLength(2)

    })

    it('Overrides log', () => {
        wrapper.setData({selectedChannel: {"logID": 3, "name": "channel", "id": 2, "state": "error"}})
        wrapper.vm.overrideLog()
        expect(wrapper.vm.$data.selectedChannel.state).toBe("Override");
        expect(wrapper.vm.$data.equiresOverride).toBe(false);
    })

    it('gives the right value and calls clearEpgEntries function', () => {
        const clearEpgEntriese = jest.fn().mockName("clearEpgEntries");
       let channel= {
           state: false,
           name: "tv4"
       }
       wrapper.vm.channelChanged(channel); 
       wrapper.setMethods({  // måste hitta annan metod än setmethods, denna kmr gå ut
        clearEpgEntries: clearEpgEntries
    })
       expect(clearEpgEntries).toHaveBeenCalledTimes(1)
       expect(wrapper.vm.$data.hasChosenChannel).toBe(true);
    }) 
    
})