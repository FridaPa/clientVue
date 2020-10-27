import Vuetify from 'vuetify'
import Vue from 'vue'
import Vuex from 'vuex'
const messageHub = new Vue();
Vue.prototype.$messageHub = messageHub;

Vue.use(Vuex);
Vue.use(Vuetify);

import { mount } from '@vue/test-utils';
import Broadcast from "../Broadcast";

describe('Simple Method Testing', () => {
    window.alert = jest.fn();

    const wrapper = mount(Broadcast, {
        data() {
            return {
                lastUsername: 'none',
            }
        },
        methods: {
            onButtonClicked() {
                this.lastUsername = 'Test';

            },
            getBroadcastForDate: () => {

            },

            onUserLoggedIn(username) {
                this.lastUsername = username;
            },
        },
        mounted() {
        }
    });
    
    it ('Date to Timestamp', () => {
        window.alert.mockClear();
        let date = new Date("January 31 2020 12:30");
        let timeStamp = wrapper.vm.dateToTimeStamp(date);
        expect(timeStamp).toBe("12:30");
    })
    
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