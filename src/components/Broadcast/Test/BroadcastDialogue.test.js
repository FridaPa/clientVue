import Vuetify from 'vuetify'
import Vue from 'vue'
import Vuex from 'vuex'
const messageHub = new Vue();
Vue.prototype.$messageHub = messageHub;

Vue.use(Vuex);
Vue.use(Vuetify);

import { mount } from '@vue/test-utils';
import Broadcast from "../BroadcastDialogue";

describe('Simple Method Testing', () => {
    window.alert = jest.fn();
    const wrapper = mount(Broadcast, {
        methods: {
        },
        mounted() {
        }
    });

    it ('Date to Hours and Minutes', () => {
        window.alert.mockClear();
        let date = new Date("January 31 2020 12:31");
        
        let hours = wrapper.vm.toHours(date);
        expect(hours).toBe("12");
        
        let minutes = wrapper.vm.toMinutes(date);
        expect(minutes).toBe("31");
    });
    
    it ('onClose sets dialog to false', () => {
        window.alert.mockClear();

        expect(wrapper.vm.$data.dialog).toBe(false);
        wrapper.setData({dialog: true});
        expect(wrapper.vm.$data.dialog).toBe(true);
        wrapper.vm.onClose();
        expect(wrapper.vm.$data.dialog).toBe(false);
    })

    // it('has a button', () => {
    //     expect(wrapper.contains('.v-btn')).toBe(true);
    // });
    // it('buttons text is none', () => {
    //     expect(wrapper.find('.v-btn').text()).toBe('none'); 
    // });
    
    
    // Example of button press
    // it('Button with name should change on press', async () => {
    //         // axios.get('/users/12345').then(onFulfilled);
    //
    //         expect(wrapper.find('.v-btn').text()).toContain('none');
    //         const button = wrapper.find('button');
    //
    //         button.trigger('click');
    //
    //         await Vue.nextTick();
    //         expect(wrapper.find('.v-btn').text()).toContain("Test");
    //
    //
    // });
});