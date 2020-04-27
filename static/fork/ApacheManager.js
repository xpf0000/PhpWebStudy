const join = require('path').join
const existsSync = require('fs').existsSync
const readFileSync = require('fs').readFileSync
const writeFileSync = require('fs').writeFileSync
const copyFileSync = require('fs').copyFileSync
const Shell = require('shelljs')
const Utils = require('./Utils')
const BaseManager = require('./BaseManager')
const execPromise = require('child-process-promise').exec

class ApacheManager extends BaseManager {
  // eslint-disable-next-line no-useless-constructor
  constructor () {
    super()
    this.type = 'apache'
  }

  init () {
    this.pidPath = join(global.Server.ApacheDir, 'common/logs/httpd.pid')
  }

  _installVersion (version) {
    let rbtmpl = join(global.Server.BrewApache, `${version}.rb`)
    let brewVersion = version.replace('-', '@')
    let ngrb = join(global.Server.BrewFormula, `${brewVersion}.rb`)
    copyFileSync(rbtmpl, ngrb)

    try {
      Shell.env['HOMEBREW_NO_AUTO_UPDATE'] = true
      Shell.env['HOMEBREW_NO_SANDBOX'] = 1
      Shell.env['PATH'] = `/usr/local/bin:${Shell.env['PATH']}`

      this._doInstall(brewVersion).then(code => {
        let vhost = join(global.Server.BaseDir, 'vhost/apache')
        Utils.createFolder(vhost)
        let vpath = this._versionPath(version)
        let conf = join(vpath, 'conf/httpd.conf')
        let content = readFileSync(conf, 'utf-8')
        let logs = join(global.Server.ApacheDir, 'common/logs')
        Utils.createFolder(logs)
        content = content.replace(/#LOGPATH#/g, logs)
        content += `\nPidFile ${logs}/httpd.pid\n` +
          `IncludeOptional ${vhost}/*.conf`
        writeFileSync(conf, content)
        writeFileSync(join(vpath, 'conf/httpd.conf.default'), content)
        return this._stopServer()
      }).then(code => {
        return this._startServer(version)
      }).then(code => {
        process.send({ command: 'application:server-stat', info: { apache: true } })
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
      let logs = join(global.Server.ApacheDir, 'common/logs')
      Utils.createFolder(logs)
      let vpath = this._versionPath(version)
      let bin = join(vpath, 'bin/apachectl')
      if (!existsSync(bin)) {
        reject(new Error('启动文件不存在,服务器启动失败'))
        return
      }
      execPromise(`echo '${global.Server.Password}' | sudo -S ${bin} -k start`).then(res => {
        this._handleLog(res.stdout)
        resolve(0)
      }).catch(err => {
        this._handleLog(err)
        reject(new Error(''))
      })
    })
  }
}
module.exports = ApacheManager
