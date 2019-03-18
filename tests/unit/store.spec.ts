import store from '@/store'
import * as experimentRepository from '@/repository/ExperimentRepository'
import * as jobService from '@/service/JobService'

jest.mock('@/repository/ExperimentRepository', () => ({
  saveExpData: jest.fn(),
  saveResultFileId: jest.fn(),
  removeData: jest.fn()
}))

jest.mock('@/service/JobService', () => ({
  runJob: jest.fn()
}))

describe('store', () => {
  beforeEach(() => {
    store.commit('experimentId', null)
    store.commit('isRunning', false)
    store.commit('resultUrl', null)
    store.commit('error', '')
  })

  describe('initial state', () => {
    it('experimentId', () => { expect(store.state.experimentId).toEqual(null) })
    it('isRunning', () => { expect(store.state.isRunning).toEqual(false) })
    it('resultUrl', () => { expect(store.state.resultUrl).toEqual(null) })
    it('error', () => { expect(store.state.error).toEqual('') })
  })

  describe('mutatons', () => {
    it('experimentId', () => {
      store.commit('experimentId', 'exp-id')
      expect(store.state.experimentId).toEqual('exp-id')
    })
    it('isRunning', () => {
      store.commit('isRunning', true)
      expect(store.state.isRunning).toEqual(true)
    })
    it('resultUrl', () => {
      store.commit('resultUrl', 'http://some-url')
      expect(store.state.resultUrl).toEqual('http://some-url')
    })
    it('error', () => {
      store.commit('error', 'some error')
      expect(store.state.error).toEqual('some error')
    })
  })

  describe('actions', () => {
    describe('runExperiment', () => {
      it('should save the data', (done) => {
        const mockData = { mock: 'data' }
        // @ts-ignore
        experimentRepository.saveExpData.mockResolvedValue('experiment-id')
        // @ts-ignore
        jobService.runJob.mockResolvedValue('result-url')

        store.dispatch('runExperiment', mockData).then(() => {
          expect(store.state.experimentId).toEqual('experiment-id')
          expect(store.state.isRunning).toEqual(false)
          expect(store.state.resultUrl).toEqual('result-url')
          done()
        })
      })

      it('should set error on upload fail', (done) => {
        const mockData = { mock: 'data' }
        // @ts-ignore
        experimentRepository.saveExpData.mockRejectedValue(undefined)
        store.dispatch('runExperiment', mockData).then(() => {
          expect(store.state.error).toEqual('Error; Failed upload experiment data.')
          done()
        })
      })

      it('should set error on run job fail', (done) => {
        const mockData = { mock: 'data' }
        // @ts-ignore
        experimentRepository.saveExpData.mockResolvedValue('experiment-id')
        // @ts-ignore
        jobService.runJob.mockRejectedValue(undefined)
        store.dispatch('runExperiment', mockData).then(() => {
          expect(store.state.error).toEqual('Error; Failed to run experiment.')
          done()
        })
      })
    })

    describe('removeData', () => {
      it('should remove the data', (done) => {
        store.commit('experimentId', 'exp-id')
        store.commit('resultUrl', 'result-url')
        // @ts-ignore
        experimentRepository.removeData.mockResolvedValue(undefined)
        store.dispatch('removeData').then(() => {
          expect(store.state.experimentId).toEqual('')
          expect(store.state.resultUrl).toEqual('')
          done()
        })
      })

      it('should set error on failure', (done) => {
        store.commit('experimentId', 'exp-id')
        store.commit('resultUrl', 'result-url')
        // @ts-ignore
        experimentRepository.removeData.mockRejectedValue(undefined)
        store.dispatch('removeData').then(() => {
          expect(store.state.error).toEqual('Error; Could not remove results, please concat the administrator')
          done()
        })
      })
    })
  })
})
