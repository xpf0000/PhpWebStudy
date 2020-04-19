import { ipcRenderer, remote } from 'electron'
import is from 'electron-is'
import { isEmpty } from 'lodash'
import {
  separateConfig,
  changeKeysToCamelCase,
  changeKeysToKebabCase
} from '@shared/utils'

const application = remote.getGlobal('application')

export default class Api {
  constructor (options = {}) {
    this.options = options

    this.client = null
    this.init()
  }

  init () {
    this.loadConfig()
  }

  loadConfigFromLocalStorage () {
    // TODO
    const result = {}
    return result
  }

  loadConfigFromNativeStore () {
    const systemConfig = application.configManager.getSystemConfig()
    const userConfig = application.configManager.getUserConfig()

    const result = { ...systemConfig, ...userConfig }
    console.log('loadConfigFromNativeStore: ', result)
    return result
  }

  loadConfig () {
    let result = is.renderer()
      ? this.loadConfigFromNativeStore()
      : this.loadConfigFromLocalStorage()

    result = changeKeysToCamelCase(result)
    console.log('loadConfig: ', result)
    this.config = result
  }

  fetchPreference () {
    return new Promise((resolve) => {
      this.loadConfig()
      resolve(this.config)
    })
  }

  savePreference (params = {}) {
    const kebabParams = changeKeysToKebabCase(params)
    if (is.renderer()) {
      return this.savePreferenceToNativeStore(kebabParams)
    } else {
      return this.savePreferenceToLocalStorage(kebabParams)
    }
  }

  savePreferenceToLocalStorage () {
    // TODO
  }

  savePreferenceToNativeStore (params = {}) {
    const { user, system, others } = separateConfig(params)
    if (!isEmpty(system)) {
      console.info('[PhpWebStudy] save system config: ', system)
      ipcRenderer.send('command', 'application:save-preference', {
        system
      })
      this.changeGlobalOption(system)
    }

    if (!isEmpty(user)) {
      console.info('[PhpWebStudy] save user config: ', user)
      ipcRenderer.send('command', 'application:save-preference', {
        user
      })
    }

    if (!isEmpty(others)) {
      console.info('[PhpWebStudy] save config found illegal key: ', others)
    }
  }
}
