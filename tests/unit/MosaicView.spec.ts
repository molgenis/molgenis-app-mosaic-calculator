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

  describe('handleFileSelect', () => {
    it('given the event file should set the filedata and fileName', () => {
      const wrapper = shallowMount(MosaicView, { store, localVue })
      const mockFileEvent = {
        target: {
          id: 'eventFile',
          files: [{file: {name:'event-file-name', data: 'mockdata'}}]
        }
      }
      // @ts-ignore
      wrapper.vm.handleFileSelect(mockFileEvent)
      // @ts-ignore
      expect(wrapper.vm.eventFile).toEqual({file: {name:'event-file-name', data: 'mockdata'}})
    })

    it('given the event file should set the snpFile and fileName', () => {
      const wrapper = shallowMount(MosaicView, { store, localVue })
      const mockFileEvent = {
        target: {
          id: 'snpFile',
          files: [{file: {name:'snp-file-name', data: 'mockdata'}}]
        }
      }
      // @ts-ignore
      wrapper.vm.handleFileSelect(mockFileEvent)
      // @ts-ignore
      expect(wrapper.vm.snpFile).toEqual({file: {name:'snp-file-name', data: 'mockdata'}})
    })
  })


})
