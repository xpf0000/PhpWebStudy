const state = {
  taskRunning: false,
  taskType: '',
  taskLog: [],
  taskVersion: '',
  taskResult: ''
}

const getters = {
}

const mutations = {
  SET_TASK_VERSION (state, v) {
    state.taskVersion = v
  },
  GET_TASK_RESULT (state, v) {
    state.taskResult = v
  },
  UPDATE_TASK_STATUS (state, running) {
    state.taskRunning = running
  },
  CHANGE_CURRENT_TYPE (state, type) {
    console.log('task mutations CHANGE_CURRENT_TYPE: ', type)
    state.taskType = type
  },
  Clean_TASK_LOG (state) {
    state.taskLog.splice(0, state.taskLog.length)
  },
  UPDATE_TASK_LOG (state, log) {
    if (log.endWith('<br/>') && !log.endWith('%<br/>')) {
      state.taskLog.push(log)
    } else {
      state.taskLog.pop()
      state.taskLog.push(log)
    }
  }
}

const actions = {
  start ({ commit }, { type, v }) {
    console.log('task actions start type: ', type, ' v: ', v)
    commit('UPDATE_TASK_STATUS', true)
    commit('Clean_TASK_LOG')
    commit('CHANGE_CURRENT_TYPE', type)
    commit('SET_TASK_VERSION', v)
    commit('GET_TASK_RESULT', '')
  },
  end ({ commit }) {
    console.log('task actions end !!!!!!!!!!!')
    commit('UPDATE_TASK_STATUS', false)
    commit('SET_TASK_VERSION', '')
  },
  updateLog ({ commit }, log) {
    console.log('task actions updateLog: ', log.replace(/&ensp;/g, ''))
    commit('UPDATE_TASK_LOG', log)
  },
  cleanLog ({ commit }) {
    commit('Clean_TASK_LOG')
  },
  result ({ commit }, r) {
    commit('GET_TASK_RESULT', r)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
