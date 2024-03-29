import { defineStore } from 'pinia'
import IPC from '@/util/IPC'
const IP = require('ip')

export interface FtpItem {
  user: string
  pass: string
  dir: string
  disabled: boolean
  mark: string
}

interface State {
  running: boolean
  ip: string
  fetching: boolean
  allFtp: Array<FtpItem>
  port: number
}

const state: State = {
  running: false,
  ip: '',
  fetching: false,
  allFtp: [],
  port: 0
}

export const FtpStore = defineStore('ftp', {
  state: (): State => state,
  getters: {},
  actions: {
    getIP() {
      this.ip = IP.address()
    },
    getPort() {
      IPC.send('app-fork:pure-ftpd', 'getPort').then((key: string, res?: any) => {
        IPC.off(key)
        this.port = res?.data
      })
    },
    getAllFtp() {
      return new Promise((resolve) => {
        IPC.send('app-fork:pure-ftpd', 'getAllFtp').then((key: string, res?: any) => {
          IPC.off(key)
          this.allFtp.splice(0)
          const arr = res?.data ?? []
          this.allFtp.push(...arr)
          resolve(true)
        })
      })
    },
    start() {
      return new Promise((resolve) => {
        if (!this.running) {
          resolve(true)
          return
        }
        this.fetching = true
        IPC.send('app-fork:ftp', 'startService').then((key: string, res?: any) => {
          IPC.off(key)
          this.fetching = false
          this.running = res?.data === true
          if (res?.code === 0) {
            resolve(true)
          } else {
            resolve(res?.msg ?? new Error('Ftp start fail!'))
          }
        })
      })
    },
    stop() {
      return new Promise((resolve) => {
        if (!this.running) {
          resolve(true)
          return
        }
        this.fetching = true
        IPC.send('app-fork:ftp', 'stopService').then((key: string, res?: any) => {
          IPC.off(key)
          this.fetching = false
          this.running = res?.data === true
          if (res?.code === 0) {
            resolve(true)
          } else {
            resolve(res?.msg ?? new Error('Ftp start fail!'))
          }
        })
      })
    }
  }
})
