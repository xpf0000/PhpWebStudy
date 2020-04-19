const join = require('path').join
const existsSync = require('fs').existsSync
const copyFileSync = require('fs').copyFileSync
const unlinkSync = require('fs').unlinkSync
const readFileSync = require('fs').readFileSync
const writeFileSync = require('fs').writeFileSync
const chmodSync = require('fs').chmodSync
const Shell = require('shelljs')
const { spawn } = require('child_process')
const BaseManager = require('./BaseManager')
class MysqlManager extends BaseManager {
  constructor () {
    super()
    this.type = 'mysql'
  }

  init () {
    this.pidPath = join(global.Server.MysqlDir, 'mysql.pid')
  }

  _installVersion (version) {
    this.version = version
    let rbtmpl = join(global.Server.BrewMysql, `${version}.rb`)
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
        return this._initMysql()
      }).then(code => {
        process.send({ command: 'application:server-stat', info: { mysql: true } })
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

  _handlChildOut (str) {
    if (this.version === 'mysql-5.7.29' || this.version === 'mysql-8.0.19') {
      if (str.indexOf('A temporary password is generated for') >= 0) {
        let regexp = /(A temporary password is generated for root@localhost: )([\s\S]*?)(<br\/>)/g
        let password = regexp.exec(str)
        if (password && password.length >= 2) {
          this.root_password = password[2]
          console.log('catch root password: ', this.root_password)
        }
      }
    }
  }

  _initMysql () {
    return new Promise((resolve, reject) => {
      try {
        let sh = join(global.Server.Static, 'sh/mysql-init.sh')
        let copyfile = join(global.Server.Cache, 'mysql-init.sh')
        if (existsSync(copyfile)) {
          unlinkSync(copyfile)
        }
        let content = readFileSync(sh, 'utf-8')
        writeFileSync(copyfile, content)
        chmodSync(copyfile, '0777')
        const child = spawn('bash', [copyfile, this._versionPath(this.version), this.root_password || ''], { env: Shell.env })
        child.stdout.on('data', data => {
          let str = data.toString()
          console.log('stdout: ', str)
        })
        child.stderr.on('data', err => {
          let str = err.toString()
          console.log('stderr: ', str)
        })
        child.on('close', function (code) {
          process.send({ command: 'application:task-log', info: '初始化密码成功,root用户密码已设置为root<br/>' })
          resolve(0)
        })
      } catch (e) {
        console.log('_initMysql error: ', e)
        reject(e)
      }
    })
  }

  _startServer (version) {
    return new Promise((resolve, reject) => {
      let vpath = this._versionPath(version)
      let bin = join(vpath, 'bin/mysqld_safe')
      if (!existsSync(bin)) {
        reject(new Error('启动文件不存在,服务器启动失败'))
        return
      }
      let m = join(vpath, 'my.cnf')
      let p = join(global.Server.MysqlDir, 'mysql.pid')
      let s = join(global.Server.MysqlDir, 'slow.log')
      let e = join(global.Server.MysqlDir, 'error.log')
      const child = spawn(bin, [`--defaults-file=${m}`, `--pid-file=${p}`, `--user=mysql`, `--slow-query-log-file=${s}`, `--log-error=${e}`], { env: Shell.env })

      let success = false
      function checkpid (time = 0) {
        if (existsSync(p)) {
          console.log('time: ', time)
          success = true
          spawn('kill', ['-9', child.pid])
        } else {
          if (time < 10) {
            setTimeout(f => {
              checkpid(time + 1)
            }, 500)
          } else {
            spawn('kill', ['-9', child.pid])
          }
        }
      }

      child.stdout.on('data', function (data) {
        let str = data.toString().replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>')
        process.send({ command: 'application:task-mysql-log', info: str })
        console.log('stdout: ', str)
        checkpid()
      })
      child.stderr.on('data', function (err) {
        let str = err.toString().replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>')
        process.send({ command: 'application:task-mysql-log', info: str })
        console.log('stderr: ', str)
      })
      child.on('close', function (code) {
        console.log('close: ', code)
        if (code === null && success) {
          resolve(code)
        } else {
          reject(code)
        }
      })
    })
  }
}
module.exports = MysqlManager
