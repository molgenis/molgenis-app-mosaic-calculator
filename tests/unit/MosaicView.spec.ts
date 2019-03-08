import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import MosaicView from '@/components/MosaicView.vue'
import * as experimentRepository from '@/repository/ExperimentRepository'
import * as scriptJobRepository from '@/repository/ScriptJobRepository'
jest.mock('@/repository/ExperimentRepository', () => ({
  saveExpData: jest.fn(),
  saveResultFileId: jest.fn(),
  removeData: jest.fn()
}))

jest.mock('@/repository/ScriptJobRepository', () => ({
  run: jest.fn(),
  poll: jest.fn()
}))

const localVue = createLocalVue()

localVue.use(Vuex)

describe('MosaicView.vue', () => {

  let store: any

  beforeEach(() => {
    store = new Vuex.Store({
    })
  })


  describe('when the components is mounted', () => {
    it('should have the name MosaicView', () => {
      const wrapper = shallowMount(MosaicView, { store, localVue })
      expect(wrapper.name()).toMatch('MosaicView')
    })
  })

  // describe('when clicking the calculate button', () => {
  //   it('saveExpData should be called, and then the run called passing the experiment id', () => {
  //     const formData = {
  //       gender: '',
  //       eventFile: {},
  //       snpFile: {}
  //     };
  //
  //     (experimentRepository.saveExpData as jest.Mock).mockResolvedValue('exp-id');
  //     (scriptJobRepository.run as jest.Mock).mockResolvedValue('script-job-id')
  //
  //     const wrapper = shallowMount(MosaicView, { store, localVue })
  //     wrapper.find('#calc-btn').trigger('click')
  //
  //     expect(experimentRepository.saveExpData).toBeCalledWith(formData)
  //     expect(scriptJobRepository.run).toBeCalled()
  //   })
  // })
})
