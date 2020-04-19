import { EventEmitter } from 'events'
import { app } from 'electron'
import is from 'electron-is'

import ExceptionHandler from './core/ExceptionHandler'
import logger from './core/Logger'
import Application from './Application'
import {
  splitArgv
} from './utils'
import { EMPTY_STRING } from '@shared/constants'

export default class Launcher extends EventEmitter {
  constructor () {
    super()
    this.url = EMPTY_STRING
    this.file = EMPTY_STRING

    this.makeSingleInstance(() => {
      this.init()
    })
  }

  makeSingleInstance (callback) {
    // Mac App Store Sandboxed App not support requestSingleInstanceLock
    if (is.mas()) {
      callback()
      return
    }

    const gotSingleLock = app.requestSingleInstanceLock()

    if (!gotSingleLock) {
      app.quit()
    } else {
      app.on('second-instance', (event, argv, workingDirectory) => {
        logger.warn('second-instance====>', argv, workingDirectory)
        global.application.showPage('index')
        if (!is.macOS() && argv.length > 1) {
          this.handleAppLaunchArgv(argv)
        }
      })

      callback()
    }
  }

  init () {
    this.exceptionHandler = new ExceptionHandler()

    this.openedAtLogin = is.macOS()
      ? app.getLoginItemSettings().wasOpenedAtLogin
      : false

    if (process.argv.length > 1) {
      this.handleAppLaunchArgv(process.argv)
    }

    logger.warn('openedAtLogin===>', this.openedAtLogin)

    this.handleAppEvents()
  }

  handleAppEvents () {
    this.handelAppReady()
    this.handleAppWillQuit()
  }

  /**
   * handleAppLaunchArgv
   * For Windows, Linux
   * @param {array} argv
   */
  handleAppLaunchArgv (argv) {
    logger.info('handleAppLaunchArgv===>', argv)
    // args: array, extra: map
    const { args, extra } = splitArgv(argv)
    logger.info('splitArgv.args===>', args)
    logger.info('splitArgv.extra===>', extra)
    if (extra['--opened-at-login'] === '1') {
      this.openedAtLogin = true
    }
  }

  handelAppReady () {
    app.on('ready', () => {
      global.application = new Application()
      const { openedAtLogin } = this
      global.application.start('index', {
        openedAtLogin
      })
      global.application.on('ready', () => {
      })
    })

    app.on('activate', () => {
      if (global.application) {
        logger.info('[PhpWebStudy] activate')
        global.application.showPage('index')
      }
    })
  }

  handleAppWillQuit () {
    app.on('will-quit', () => {
      logger.info('[PhpWebStudy] will-quit')
      if (global.application) {
        global.application.stop()
      } else {
        logger.info('[PhpWebStudy] global.application is null !!!')
      }
    })
  }
}
