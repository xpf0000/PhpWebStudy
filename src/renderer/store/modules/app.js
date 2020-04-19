import { getSystemTheme } from '@/components/Native/utils'

const state = {
  systemTheme: getSystemTheme(),
  aboutPanelVisible: false,
  stat: {
    nginx: false,
    php: false,
    mysql: false,
    apache: false
  },
  hosts: []
}

const getters = {
}

const mutations = {
  CHANGE_ABOUT_PANEL_VISIBLE (state, visible) {
    state.aboutPanelVisible = visible
  },
  CHANGE_SYSTEM_THEME (state, theme) {
    state.systemTheme = theme
  },
  UPDATE_SERVER_STAT (state, stat) {
    state.stat = { ...state.stat, ...stat }
  },
  UPDATE_HOSTS (state, hosts) {
    state.hosts = hosts
  }
}

const actions = {
  showAboutPanel ({ commit }) {
    commit('CHANGE_ABOUT_PANEL_VISIBLE', true)
  },
  hideAboutPanel ({ commit }) {
    commit('CHANGE_ABOUT_PANEL_VISIBLE', false)
  },
  updateServerStat ({ commit }, stat) {
    commit('UPDATE_SERVER_STAT', stat)
  },
  updateSystemTheme ({ commit }, theme) {
    commit('CHANGE_SYSTEM_THEME', theme)
  },
  updateHosts ({ commit }, hosts) {
    commit('UPDATE_HOSTS', hosts)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
