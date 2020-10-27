import Vuetify from 'vuetify'
import Vue from 'vue'
import Vuex from 'vuex'
const messageHub = new Vue();
Vue.prototype.$messageHub = messageHub;

Vue.use(Vuex);
Vue.use(Vuetify);

import { mount } from '@vue/test-utils';
import MailDialogue from '../SubComponents/MailDialogue';

//
describe('mail dialogue test', () => {
    console.error = jest.fn();
    const wrapper = mount(MailDialogue)
    let channel = 125;
    const mockUrl = "api/ChannelConfig/channel/" + channel;
    const mockConfigArray = [
        {"configID":23,"channelID":906,"configKey":"Email","configValue":"DL_MMS@eurosport.com",
        "active":true,"createdAt":"2020-06-17T13:37:00+02:00","createdBy":"Admin"},{"configID":24,
        "channelID":906,"configKey":"Email","configValue":"adsales@eurosport.com","active":true,
        "createdAt":"2020-06-17T13:37:00+02:00","createdBy":"Admin"}
    ]
    const getChannel = jest.fn(url => mockConfigArray);
    /*it('get new clas name after selection', () => {
        let selection = 'mitt val';
        wrapper.vm.selectedAlt(selection)
        expect(wrapper.find('#listHover').hasClass('active')).to.equal(true);
    })*/

    it('returns config from an api call', () => {
        expect(getChannel(mockUrl)).toBe(mockConfigArray);
      });
  
      it('called getChannel with a mockUrl', () => {
        expect(getChannel).toHaveBeenCalledWith(mockUrl);
      });

    it('Date to Timestamp', () => {
        let date = new Date("January 31 2020 12:30");
        let timeStamp = wrapper.vm.dateToTimeStamp(date);
        expect(timeStamp).toBe("12:30");
    })

    it('get config array from server', async() => {
        console.error.mockClear();

   


    })
})