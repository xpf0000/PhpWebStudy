import api from '@/api'
import { isEmpty } from 'lodash'

const state = {
  engineMode: 'MAX',
  config: {}
}

const mutations = {
  UPDATE_PREFERENCE_DATA (state, config) {
    state.config = { ...state.config, ...config }
  }
}

const actions = {
  fetchPreference ({ commit }) {
    return new Promise((resolve) => {
      api.fetchPreference()
        .then((config) => {
          if (!config.server.memcached) {
            config.server.memcached = {
              current: ''
            }
          }
          if (!config.server.redis) {
            config.server.redis = {
              current: ''
            }
          }
          commit('UPDATE_PREFERENCE_DATA', config)
          resolve(config)
        })
    })
  },
  save ({ commit, dispatch }, config) {
    if (isEmpty(config)) {
      return
    }
    commit('UPDATE_PREFERENCE_DATA', config)
    return api.savePreference(config)
  },
  changeThemeConfig ({ commit }, theme) {
    commit('UPDATE_PREFERENCE_DATA', { theme })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
