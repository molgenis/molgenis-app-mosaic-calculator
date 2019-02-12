import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    events: undefined,
    array: undefined
  },
  mutations: {
    SET_EVENTS(state, events){
      console.log(events)
      state.events = events
    },
    SET_ARRAY(state, array){
      state.array = array
    }
  },
  actions: {

  }
})
