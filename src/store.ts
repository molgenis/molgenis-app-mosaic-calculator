import Vue from 'vue'
import Vuex from 'vuex'

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

  }
})
