import { shallowMount } from '@vue/test-utils'
import MosaicView from '@/components/MosaicView.vue'
jest.mock('@/repository/ExperimentRepository', () => ({
  saveExpData: jest.fn(),
  saveResultFileId: jest.fn(),
  removeData: jest.fn()
}))

jest.mock('@/repository/ScriptJobRepository', () => ({
  run: jest.fn(),
  poll: jest.fn()
}))

describe('MosaicView.vue', () => {
  it('creates a component with name MosaicView', () => {
    const wrapper = shallowMount(MosaicView)
    expect(wrapper.name()).toMatch('MosaicView')
  })
})
