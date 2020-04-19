const join = require('path').join
const existsSync = require('fs').existsSync
const readFileSync = require('fs').readFileSync
const writeFileSync = require('fs').writeFileSync
const Shell = require('shelljs')
const BaseManager = require('./BaseManager')
const Utils = require('./Utils')
const execPromise = require('child-process-promise').exec
class MemcachedManager extends BaseManager {
  // eslint-disable-next-line no-useless-constructor
  constructor () {
    super()
    this.type = 'memcached'
  }

  init () {
    this.pidPath = join(global.Server.MemcachedDir, 'logs/memcached.pid')
  }

  _installVersion (version) {
    let rbtmpl = join(global.Server.BrewMemcached, `${version}.rb`)
    let brewVersion = version.replace('-', '@')
    let ngrb = join(global.Server.BrewFormula, `${brewVersion}.rb`)
    let content = readFileSync(rbtmpl, 'utf-8')
    let errorpath = join(global.Server.MemcachedDir, 'common/logs/error.log')
    let pid = join(global.Server.MemcachedDir, 'common/logs/memcached.pid')
    content = content.replace('#ErrorLogPath#', errorpath).replace('#PIDPath#', pid)
    writeFileSync(ngrb, content)
    // copyFileSync(rbtmpl, ngrb)

    try {
      Shell.env['HOMEBREW_NO_AUTO_UPDATE'] = true
      Shell.env['HOMEBREW_NO_SANDBOX'] = 1
      Shell.env['PATH'] = `/usr/local/bin:${Shell.env['PATH']}`

      this._doInstall(brewVersion).then(code => {
        return this._stopServer()
      }).then(code => {
        return this._startServer(version)
      }).then(code => {
        process.send({ command: 'application:server-stat', info: { memcached: true } })
        process.send({ command: 'application:task-log', info: `安装成功,${version}已成功运行<br/>` })
        process.send({ command: 'application:task-result', info: 'SUCCESS' })
        process.send({ command: 'application:task-end', info: 0 })
      }).catch(code => {
        process.send({ command: 'application:task-log', info: '安装失败<br/>' })
        process.send({ command: 'application:task-result', info: 'FAIL' })
        process.send({ command: 'application:task-end', info: 1 })
      })
    } catch (e) {
      process.send({ command: 'application:task-log', info: `${e}<br/>` })
      process.send({ command: 'application:task-result', info: 'FAIL' })
      process.send({ command: 'application:task-end', info: 1 })
    }
  }

  _startServer (version) {
    return new Promise((resolve, reject) => {
      let vpath = this._versionPath(version)
      let bin = join(vpath, 'bin/memcached')
      if (!existsSync(bin)) {
        reject(new Error('启动文件不存在,服务器启动失败'))
        return
      }
      let common = join(global.Server.MemcachedDir, 'logs')
      Utils.createFolder(common)
      let pid = join(common, 'memcached.pid')
      let log = join(common, 'memcached.log')
      let command = `${bin} -d -P ${pid} -vv >> ${log} 2>&1`
      execPromise(command).then(res => {
        console.log('res: ', res)
        setTimeout(_ => {
          if (existsSync(pid)) {
            resolve(0)
          } else {
            reject(new Error('启动失败,请查看日志文件'))
          }
        }, 600)
      }).catch(err => {
        reject(err)
      })
    })
  }
}
module.exports = MemcachedManager
