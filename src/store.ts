import Vue from 'vue'
import Vuex from 'vuex'
import * as experimentRepository from '@/repository/ExperimentRepository'
import * as jobService from '@/service/JobService'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    experimentId: null,
    isRunning: false,
    resultUrl: null,
    error: ''
  },
  mutations: {
    experimentId (state, experimentId) {
      state.experimentId = experimentId
    },
    resultUrl (state, resultUrl) {
      state.resultUrl = resultUrl
    },
    isRunning (state, isRunning) {
      state.isRunning = isRunning
    },
    error (state, error) {
      state.error = error
    }
  },
  actions: {
    runExperiment ({ commit, state }, experimentData) {
      return experimentRepository.saveExpData(experimentData).then((experimentId: string) => {
        commit('experimentId', experimentId)
        return jobService.runJob(experimentId).then((resultUrl: string) => {
          commit('isRunning', false)
          commit('resultUrl', resultUrl)
          return experimentRepository.saveResultFileId(experimentId, resultUrl)
        })
      }, () => {
        commit('error', 'Error; Failed to run experiment.')
      })
    },
    removeData ({ commit, state }) {
      const experimentId = state.experimentId
      const resultUrl = state.resultUrl
      if (experimentId == null) {
        return Promise.reject(new Error('Error removing data; experimentId can not be null.'))
      }
      if (resultUrl == null) {
        return Promise.reject(new Error('Error removing data; resultUrl can not be null.'))
      } else {
        return experimentRepository.removeData(experimentId, resultUrl).then(() => {
          commit('resultUrl', '')
          commit('experimentId', '')
        }, () => {
          commit('error', 'Error; Could not remove results, please concat the administrator')
        })
      }
    }
  }
})
