const join = require('path').join
const existsSync = require('fs').existsSync
const BaseManager = require('./BaseManager')
const { I18nT } = require('./lang/index.js')
const sudo = require('sudo-prompt')
const execPromise = require('child-process-promise').exec

class NginxManager extends BaseManager {
  constructor() {
    super()
    this.type = 'nginx'
  }

  init() {
    this.pidPath = join(global.Server.NginxDir, 'common/logs/nginx.pid')
  }

  _startServer(version) {
    return new Promise((resolve, reject) => {
      let bin = version.bin
      if (!existsSync(bin)) {
        reject(new Error(I18nT('fork.binNoFound')))
        return
      }
      let c = join(global.Server.NginxDir, 'common/conf/nginx.conf')
      let pid = join(global.Server.NginxDir, 'common/logs/nginx.pid')
      let errlog = join(global.Server.NginxDir, 'common/logs/error.log')
      let g = `pid ${pid};error_log ${errlog};`

      sudo.exec(
        `sudo ${bin} -c ${c} -g '${g}'`,
        {
          name: 'PHPWebStudy'
        },
        (err, stdout, stderr) => {
          if (err) {
            const errStr = stderr?.toString() ?? ''
            this._handleLog(errStr)
            reject(new Error(errStr))
            return
          }
          this._handleLog(stdout?.toString() ?? '')
          resolve(0)
        }
      )
    })
  }
}
module.exports = NginxManager
