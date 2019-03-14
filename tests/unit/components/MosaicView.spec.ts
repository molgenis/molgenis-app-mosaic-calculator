import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import MosaicView from '@/components/MosaicView.vue'
import * as jobService from '@/service/JobService'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

jest.mock('@/service/JobService', () => ({
  cancelPolling: jest.fn(),
  poll: jest.fn()
}))

const localVue = createLocalVue()

localVue.use(Vuex)

library.add(faSpinner)
localVue.component('font-awesome-icon', FontAwesomeIcon)

describe('MosaicView.vue', () => {
  let store: any
  let state: any
  let actions: any
  let mutations: any
  let getters: any

  beforeEach(() => {
    state = {
      resultUrl: 'validUrl',
      error: ''
    }
    actions = {
      runExperiment: jest.fn(),
      removeData: jest.fn()
    }

    mutations = {
      isRunning: jest.fn(),
      error: jest.fn()
    }

    getters = {
      isRunning: jest.fn()
    }

    store = new Vuex.Store({
      state, actions, mutations, getters
    })
  })

  describe('when the components is mounted', () => {
    it('should have the name MosaicView', () => {
      const wrapper = shallowMount(MosaicView, { store, localVue })
      expect(wrapper.name()).toMatch('MosaicView')
    })
  })

  describe('handleFileSelect', () => {
    it('given the event file should set the filedata and fileName', () => {
      const wrapper = shallowMount(MosaicView, { store, localVue })
      const mockFileEvent = {
        target: {
          id: 'eventFile',
          files: [{ file: { name: 'event-file-name', data: 'mockdata' } }]
        }
      }
      // @ts-ignore
      wrapper.vm.handleFileSelect(mockFileEvent)
      // @ts-ignore
      expect(wrapper.vm.eventFile).toEqual({ file: { name: 'event-file-name', data: 'mockdata' } })
    })

    it('given the event file should set the snpFile and fileName', () => {
      const wrapper = shallowMount(MosaicView, { store, localVue })
      const mockFileEvent = {
        target: {
          id: 'snpFile',
          files: [{ file: { name: 'snp-file-name', data: 'mockdata' } }]
        }
      }
      // @ts-ignore
      wrapper.vm.handleFileSelect(mockFileEvent)
      // @ts-ignore
      expect(wrapper.vm.snpFile).toEqual({ file: { name: 'snp-file-name', data: 'mockdata' } })
    })
  })

  describe('calculate', () => {
    it('should dispatch the calculate action', () => {
      const wrapper = shallowMount(MosaicView, { store, localVue })
      wrapper.find('#calc-btn').trigger('submit')
      expect(actions.runExperiment).toHaveBeenCalled()
      // @ts-ignore
      expect(mutations.isRunning).toHaveBeenCalled()
    })
  })

  describe('getPdf', () => {
    it('should set an error is the pdf load fails', () => {
      store.state.resultUrl = 'invalidUrl'
      const wrapper = shallowMount(MosaicView, { store, localVue })
      wrapper.find('#calc-btn').trigger('submit')
    })
  })

  describe('removeData', () => {
    it('should dispatch the calculate action', () => {
      const wrapper = shallowMount(MosaicView, { store, localVue })
      wrapper.find('#clear-btn').trigger('click')
      expect(actions.removeData).toHaveBeenCalled()
    })
  })

  describe('beforeDestroy', () => {
    it('should dispatch the clear interval action', () => {
      const wrapper = shallowMount(MosaicView, { store, localVue })
      wrapper.destroy()
      expect(jobService.cancelPolling).toHaveBeenCalled()
    })
  })
})
