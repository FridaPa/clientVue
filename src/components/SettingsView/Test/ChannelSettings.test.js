import Vuetify from 'vuetify'
import Vue from 'vue'
import Vuex from 'vuex'
const messageHub = new Vue();
Vue.prototype.$messageHub = messageHub;

Vue.use(Vuex);
Vue.use(Vuetify);

import { mount } from '@vue/test-utils';
import ChannelSettings from '../ChannelSettings';

  describe('channelsetting test',  () => {
    const wrapper = mount(ChannelSettings);
      it('gives the proter value when button is clicked', async () => {
          wrapper.findComponent('#listItem').trigger('click')
          const onSelectionChangedChannel = jest.fn().mockName("changedChannel");
          wrapper.setMethods({
            onSelectionChangedChannel: onSelectionChangedChannel
          })
         await wrapper.vm.$nextTick()
          expect(onSelectionChangedChannel).toHaveBeenCalledTimes(1)
      })

     it('api request, return array with value in response', async () => {
      const getChannels = jest.fn().mockName("getChannels");
      wrapper.setMethods({
        getChannels: getChannels
      })
      getChannels.mockResolvedValue({
        data: [   
            { "channelID":204,"channelName":"Boomerang",
            "configValue":"epost@e.se"},
            { "channelID":204,"channelName":"Boomerang",
            "configValue":"mymail@e.se"}
         ] 
    })
      wrapper.setData({settings: []})
       let id = 5;
       let name = 'Orvar';
    await wrapper.vm.onSelectionChangedChannel(id, name);
     expect(wrapper.vm.$data.selectedChannel).toBe(5);
     expect(wrapper.vm.$data.settings).not.toBe([]);

  })

  it('creates a config, adds in array', async () => {
    let config = { "configValue": "epost@e.se","channelID": 23}
    wrapper.setData({settings: [
      { "configValue": "epost2@e.se","configID": 23},
      { "configValue": "epost@e.se","configID": 22}
  ] })
    await  wrapper.vm.createNewConfig(config)
    expect(wrapper.vm.$data.settings).toHaveLength(3)
  })

  it('deletes a config', async () => {
    wrapper.setData({settings: [
      { "configValue": "epost2@e.se","configID": 23},
      { "configValue": "epost@e.se","configID": 22}
  ]}) 
  let id = 23
    await  wrapper.vm.deleteConfig(id)
    expect(wrapper.vm.$data.settings).toHaveLength(1)
  })
})