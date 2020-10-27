import Vuetify from 'vuetify'
import Vue from 'vue'
import Vuex from 'vuex'
const messageHub = new Vue();
Vue.prototype.$messageHub = messageHub;

Vue.use(Vuex);
Vue.use(Vuetify);
import { mount } from '@vue/test-utils';
import Program from "../Program.vue";
//import  {getPrograms}  from "../Program.vue";
import CreateNewProgram from '../CreateNewProgram';
//jest.mock("../Program.vue")


describe('testProgram', () => {
  window.alert = jest.fn();
  const mockUrlDelete = 'api/programs/61249';
  const mockUrl = 'api/programs/';
  const mockPrograms = [{"metaProgramID":61249,"programType":"\u0000","programCode":null,
  "channelID":204,"channelName":"Boomerang","programTitle":"Tom & Jerry","originalTitle":null,
  "programShortTitle":"Tom & Jerry","mainSerie":"Tom & Jerry","serie":null,"season":null,
  "episode":"143","countryOfOrigin":null,"productionCompany":null,"rightsOwner":null,
  "channelReference":null,"status":null,"genre1ID":4,"genre1Name":"Fiktion/Film","genre2ID":7,
  "genre2Name":"Tecknat","genre3ID":0,"genre3Name":null,"groupID":null,"targetGroupCode":"B",
  "territoryCode":"U","validationErrorID":0,"logID":0}];
   const mockProgramsDeleted = [];

 const getPrograms = jest.fn(url => mockPrograms);
  const deleteProgram = jest.fn(url => mockProgramsDeleted);

    const wrapper = mount(Program, {
      methods:{
      } 
    });

    it('renders a child', () => {
      window.alert.mockClear();
        expect(wrapper.findComponent(CreateNewProgram).exists()).toBe(true)
    })

  it('returns programs from an api call', () => {
      expect(getPrograms(mockUrl)).toBe(mockPrograms);
    });

    it('called getprograms with a mockUrl', () => {
      expect(getPrograms).toHaveBeenCalledWith(mockUrl);
    });

    it('deletes program from an api call', () => {
      expect(deleteProgram(mockUrlDelete)).toBe(mockProgramsDeleted);
    });

// mock api //
/*it('mock api real call', async () => {
  getPrograms.mockResolvedValueOnce(mockPrograms) 

   const programs = await wrapper.vm.getPrograms();
   console.log(programs);
   expect(programs).toHaveBeenCalledTimes(1);
})*/

    it('renders correctly', () => {
      window.alert.mockClear();
        expect(wrapper.element).toMatchSnapshot()
    })

    it('deletes from array', async () => {
      window.alert.mockClear();
       await wrapper.setData({programList: [
            {"metaProgramID":61242, "programTitle":"Tom & Jerry"},
            {"metaProgramID":61249, "programTitle":"Tom & Tom"},
            {"metaProgramID":61248, "programTitle":"jocke & Tom"}
        ], selectedID: 61242})
      await  wrapper.vm.deleteProgram()
      expect(wrapper.vm.$data.programList).toHaveLength(2)   
    })

    it('throws error with string insert', async () => {
      window.alert.mockClear();
       await wrapper.setData({programList: [
            {"metaProgramID":61242, "programTitle":"Tom & Jerry"},
            {"metaProgramID":61249, "programTitle":"Tom & Tom"},
            {"metaProgramID":61248, "programTitle":"jocke & Tom"}
        ], selectedID: "hej"});
   const fuc = await wrapper.vm.deleteProgram();
      expect(wrapper.vm.$data.programList).toHaveLength(3) 
  
  })
    it('adds in array', async() => {
      window.alert.mockClear();
      await  wrapper.setData({programList: [
            {"metaProgramID":61242, "programTitle":"Tom & Jerry"},
        ], program: { "metaProgramID": 46489, "programTitle":"Spacex" } })
        await  wrapper.vm.saveProgram()
        expect(wrapper.vm.$data.programList).toHaveLength(2)
    })

});
