const join = require('path').join
const existsSync = require('fs').existsSync
const readFileSync = require('fs').readFileSync
const writeFileSync = require('fs').writeFileSync
// const copyFileSync = require('fs').copyFileSync
const Shell = require('shelljs')
const { spawn } = require('child_process')
const BaseManager = require('./BaseManager')
class NginxManager extends BaseManager {
  // eslint-disable-next-line no-useless-constructor
  constructor () {
    super()
    this.type = 'nginx'
  }

  init () {
    this.pidPath = join(global.Server.NginxDir, 'common/logs/nginx.pid')
  }

  _installVersion (version) {
    let rbtmpl = join(global.Server.BrewNginx, `${version}.rb`)
    let brewVersion = version.replace('-', '@')
    let ngrb = join(global.Server.BrewFormula, `${brewVersion}.rb`)
    let content = readFileSync(rbtmpl, 'utf-8')
    let errorpath = join(global.Server.NginxDir, 'common/logs/error.log')
    let pid = join(global.Server.NginxDir, 'common/logs/nginx.pid')
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
        process.send({ command: 'application:server-stat', info: { nginx: true } })
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
      let bin = join(vpath, 'sbin/nginx')
      if (!existsSync(bin)) {
        reject(new Error('启动文件不存在,服务器启动失败'))
        return
      }
      let c = join(global.Server.NginxDir, 'common/conf/nginx.conf')
      let pid = join(global.Server.NginxDir, 'common/logs/nginx.pid')
      let errlog = join(global.Server.NginxDir, 'common/logs/error.log')
      let g = `pid ${pid};error_log ${errlog};`
      process.send({ command: 'application:task-log', info: `sudo ${bin} -c ${c} -g ${g}<br/>` })
      const child = spawn('sudo', [bin, '-c', c, '-g', g], { env: Shell.env })
      this._childHandle(child, resolve, reject)
    })
  }
}
module.exports = NginxManager
