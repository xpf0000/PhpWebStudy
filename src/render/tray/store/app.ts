import { defineStore } from 'pinia'

export interface TrayState {
  password: string
  lang: string
  nginx: {
    show: boolean
    run: boolean
    running: boolean
    disabled: boolean
  }
  apache: {
    show: boolean
    run: boolean
    running: boolean
    disabled: boolean
  }
  mysql: {
    show: boolean
    run: boolean
    running: boolean
    disabled: boolean
  }
  php: {
    show: boolean
    run: boolean
    running: boolean
    disabled: boolean
  }
  memcached: {
    show: boolean
    run: boolean
    running: boolean
    disabled: boolean
  }
  redis: {
    show: boolean
    run: boolean
    running: boolean
    disabled: boolean
  }
  groupIsRunning: boolean
  groupDisabled: boolean
}

const state: TrayState = {
  lang: '',
  apache: { show: true, disabled: true, run: false, running: false },
  memcached: { show: true, disabled: true, run: false, running: false },
  mysql: { show: true, disabled: true, run: false, running: false },
  nginx: { show: true, disabled: true, run: false, running: false },
  password: '',
  php: { show: true, disabled: true, run: false, running: false },
  redis: { show: true, disabled: true, run: false, running: false },
  groupIsRunning: false,
  groupDisabled: true
}

export const AppStore = defineStore('trayApp', {
  state: (): TrayState => state,
  getters: {},
  actions: {}
})