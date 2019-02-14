import Vue from 'vue'
import Vuex from 'vuex'

// @ts-ignore
import api from '@molgenis/molgenis-api-client'

import { TableCreate, AppState, PostArguments } from '@/types/store'

Vue.use(Vuex)

const state: AppState = {
  events: null,
  array: null
}

export default new Vuex.Store({
  state: state,
  mutations: {
    SET_EVENTS (state, events) {
      state.events = events
    },
    SET_ARRAY (state, array) {
      state.array = array
    }
  },
  actions: {
    CREATE_TABLE ({ commit, dispatch }: any, { tableName, type, callback }: TableCreate) {
      const data = [{
        'id': tableName,
        'label': tableName,
        'package': 'mosaic',
        'extends': 'mosaic_' + type
      }]
      dispatch('ADD_LINES', { lines: data, table: 'sys_md_EntityType', callback })
    },
    ADD_LINES ({ commit }: any, { lines, table, callback }: PostArguments) {
      const data = { 'entities': lines }
      const options = {
        'headers': { 'Content-Type': 'application/json' },
        'body': JSON.stringify(data)
      }
      api.post(`/api/v2/${table}`, options).then(() => {
        callback()
      })
    },
    DELETE_TABLE ({ commit }: any, tableName: string) {
      api.delete_(`/api/v2/sys_md_EntityType/${tableName}`).then(() => {
        console.log('Deleted', tableName)
      })
    }
  }
})
