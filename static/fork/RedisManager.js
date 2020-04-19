const join = require('path').join
const existsSync = require('fs').existsSync
const readFileSync = require('fs').readFileSync
const writeFileSync = require('fs').writeFileSync
const copyFileSync = require('fs').copyFileSync
const Shell = require('shelljs')
const BaseManager = require('./BaseManager')
const execPromise = require('child-process-promise').exec
class RedisManager extends BaseManager {
  // eslint-disable-next-line no-useless-constructor
  constructor () {
    super()
    this.type = 'redis'
  }

  init () {
    this.pidPath = join(global.Server.RedisDir, 'common/run/redis.pid')
  }

  _installVersion (version) {
    let rbtmpl = join(global.Server.BrewRedis, `${version}.rb`)
    let brewVersion = version.replace('-', '@')
    let ngrb = join(global.Server.BrewFormula, `${brewVersion}.rb`)
    copyFileSync(rbtmpl, ngrb)

    try {
      Shell.env['HOMEBREW_NO_AUTO_UPDATE'] = true
      Shell.env['HOMEBREW_NO_SANDBOX'] = 1
      Shell.env['PATH'] = `/usr/local/bin:${Shell.env['PATH']}`

      this._doInstall(brewVersion).then(code => {
        return this._stopServer()
      }).then(code => {
        return this._startServer(version)
      }).then(code => {
        process.send({ command: 'application:server-stat', info: { redis: true } })
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
      let bin = join(vpath, 'bin/redis-server')
      if (!existsSync(bin)) {
        console.log('_startServer bin path: ', bin)
        reject(new Error('启动文件不存在,服务器启动失败'))
        return
      }
      let realConf = join(vpath, 'conf/redis.conf')
      if (!existsSync(realConf)) {
        let conffile = join(global.Server.RedisDir, 'common/redis.conf')
        let content = readFileSync(conffile, 'utf-8')
        let pid = this.pidPath
        let log = join(global.Server.RedisDir, 'common/logs/redis.log')
        let db = join(vpath, 'db')
        content = content.replace('#PID_PATH#', pid)
          .replace('#LOG_PATH#', log)
          .replace('#DB_PATH#', db)
        writeFileSync(realConf, content)
        writeFileSync(join(vpath, 'conf/redis.conf.default'), content)
      }
      let command = `${bin} ${realConf}`
      console.log('_startServer command: ', command)
      execPromise(command).then(res => {
        console.log('res: ', res)
        setTimeout(_ => {
          if (existsSync(this.pidPath)) {
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
module.exports = RedisManager
