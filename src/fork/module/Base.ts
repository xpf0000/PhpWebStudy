import { I18nT } from '../lang'
import { existsSync } from 'fs'
import { join } from 'path'
import type { SoftInstalled } from '@shared/app'
import { execPromise, spawnPromise, waitTime } from '../Fn'
import { ForkPromise } from '@shared/ForkPromise'
import { readFile, writeFile, copyFile, unlink, chmod } from 'fs-extra'

export class Base {
  type: string
  pidPath: string
  constructor() {
    this.type = ''
    this.pidPath = ''
  }

  exec(fnName: string, ...args: any) {
    // @ts-ignore
    const fn: (...args: any) => ForkPromise<any> = this?.[fnName] as any
    return fn.call(this, ...args)
  }

  _startServer(version: SoftInstalled): ForkPromise<any> {
    console.log(version)
    return new ForkPromise<any>((resolve) => {
      resolve(true)
    })
  }

  _linkVersion(version: SoftInstalled): ForkPromise<any> {
    return new ForkPromise(async (resolve) => {
      if (version && version?.bin) {
        try {
          const v = version.bin
            .split(global.Server.BrewCellar + '/')
            .pop()
            ?.split('/')?.[0]
          if (v) {
            const command = `brew unlink ${v} && brew link --overwrite --force ${v}`
            console.log('_linkVersion: ', command)
            execPromise(command, {
              env: {
                HOMEBREW_NO_INSTALL_FROM_API: 1
              }
            })
              .then(() => {})
              .catch(() => {})
            resolve(true)
          } else {
            resolve(I18nT('fork.versionError'))
          }
        } catch (e: any) {
          resolve(e.toString())
        }
      } else {
        resolve(I18nT('fork.needSelectVersion'))
      }
    })
  }

  doLinkVersion(version: SoftInstalled) {
    return new ForkPromise((resolve, reject) => {
      this._linkVersion(version).then((res) => {
        if (res === true) {
          resolve(true)
        } else {
          reject(new Error(res))
        }
      })
    })
  }

  switchVersion(version: SoftInstalled) {
    return new ForkPromise(async (resolve, reject, on) => {
      if (!existsSync(version?.bin)) {
        reject(new Error(I18nT('fork.binNoFound')))
        return
      }
      if (!version?.version) {
        reject(new Error(I18nT('fork.versionNoFound')))
        return
      }
      try {
        this._linkVersion(version)
      } catch (e) {}
      try {
        await this._stopServer(version)
        await this._startServer(version).on(on)
        resolve(true)
      } catch (e) {
        reject(e)
      }
    })
  }

  stopService(version: SoftInstalled) {
    return this._stopServer(version)
  }

  reloadService(version: SoftInstalled) {
    return this._reloadServer(version)
  }

  startService(version: SoftInstalled) {
    return new ForkPromise(async (resolve, reject, on) => {
      if (!existsSync(version?.bin)) {
        reject(new Error(I18nT('fork.binNoFound')))
        return
      }
      if (!version?.version) {
        reject(new Error(I18nT('fork.versionNoFound')))
        return
      }
      try {
        this._linkVersion(version)
      } catch (e) {}
      try {
        await this._stopServer(version)
        await this._startServer(version).on(on)
        resolve(true)
      } catch (e) {
        reject(e)
      }
    })
  }

  _stopServer(version: SoftInstalled) {
    console.log(version)
    return new ForkPromise(async (resolve) => {
      const dis: { [k: string]: string } = {
        caddy: 'caddy',
        nginx: 'nginx',
        apache: 'httpd',
        mysql: 'mysqld',
        mariadb: 'mariadbd',
        memcached: 'memcached',
        redis: 'redis-server',
        mongodb: 'mongod',
        postgresql: 'postgres',
        'pure-ftpd': 'pure-ftpd'
      }
      const serverName = dis[this.type]
      const command = `ps aux | grep '${serverName}' | awk '{print $2,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20}'`
      console.log('_stopServer command: ', command)
      let res: any = null
      try {
        res = await execPromise(command)
      } catch (e) {}
      const pids = res?.stdout?.trim()?.split('\n') ?? []
      const arr: Array<string> = []
      for (const p of pids) {
        if (this.type === 'redis' || global.Server.ForceStart === true) {
          if (
            p.includes(' grep ') ||
            p.includes(' /bin/sh -c') ||
            p.includes('/Contents/MacOS/') ||
            p.startsWith('/bin/bash ') ||
            p.includes('brew.rb ') ||
            p.includes(' install ') ||
            p.includes(' uninstall ') ||
            p.includes(' link ') ||
            p.includes(' unlink ')
          ) {
            continue
          }
          arr.push(p.split(' ')[0])
        } else if (p.includes(global.Server.BaseDir!)) {
          arr.push(p.split(' ')[0])
        }
      }
      console.log('_stopServer arr: ', arr)
      if (arr.length > 0) {
        const pids = arr.join(' ')
        let sig = ''
        switch (this.type) {
          case 'mysql':
          case 'mariadb':
          case 'mongodb':
            sig = '-TERM'
            break
          default:
            sig = '-INT'
            break
        }
        try {
          await execPromise(`echo '${global.Server.Password}' | sudo -S kill ${sig} ${pids}`)
        } catch (e) {}
      }
      await waitTime(300)
      resolve(true)
    })
  }

  _reloadServer(version: SoftInstalled) {
    console.log(version)
    return new ForkPromise(async (resolve, reject) => {
      if (existsSync(this.pidPath)) {
        try {
          const pid = await readFile(this.pidPath, 'utf-8')
          const sign =
            this.type === 'apache' ||
            this.type === 'mysql' ||
            this.type === 'nginx' ||
            this.type === 'mariadb'
              ? '-HUP'
              : '-USR2'
          await execPromise(`echo '${global.Server.Password}' | sudo -S kill ${sign} ${pid}`)
          await waitTime(1000)
          resolve(0)
        } catch (e) {
          reject(e)
        }
      } else {
        reject(new Error(I18nT('fork.serviceNoRun')))
      }
    })
  }

  _doInstallOrUnInstallByBrew(rb: string, action: string) {
    return new ForkPromise<any>(async (resolve, reject, on) => {
      const arch = global.Server.isAppleSilicon ? '-arm64' : '-x86_64'
      const name = rb
      const sh = join(global.Server.Static!, 'sh/brew-cmd.sh')
      const copyfile = join(global.Server.Cache!, 'brew-cmd.sh')
      try {
        if (existsSync(copyfile)) {
          await unlink(copyfile)
        }
        await copyFile(sh, copyfile)
        await chmod(copyfile, '0777')
      } catch (e) {
        reject(e)
        return
      }
      spawnPromise('zsh', [copyfile, arch, action, name]).on(on).then(resolve).catch(reject)
    })
  }

  _doInstallOrUnInstallByPort(name: string, action: string) {
    return new ForkPromise(async (resolve, reject, on) => {
      const arch = global.Server.isAppleSilicon ? '-arm64' : '-x86_64'
      const sh = join(global.Server.Static!, 'sh/port-cmd.sh')
      const copyfile = join(global.Server.Cache!, 'port-cmd.sh')
      try {
        if (existsSync(copyfile)) {
          await unlink(copyfile)
        }
        let content = await readFile(sh, 'utf-8')
        content = content
          .trim()
          .replace(new RegExp('##PASSWORD##', 'g'), global.Server.Password!)
          .replace(new RegExp('##ARCH##', 'g'), arch)
          .replace(new RegExp('##ACTION##', 'g'), action)
          .replace(new RegExp('##NAME##', 'g'), name)
        await writeFile(copyfile, content)
        await chmod(copyfile, '0777')
      } catch (e) {
        reject(e)
      }
      spawnPromise('zsh', [copyfile]).on(on).then(resolve).catch(reject)
    })
  }

  getAxiosProxy() {
    const proxyUrl =
      Object.values(global?.Server?.Proxy ?? {})?.find((s: string) => s.includes('://')) ?? ''
    let proxy: any = {}
    if (proxyUrl) {
      try {
        const u = new URL(proxyUrl)
        proxy.protocol = u.protocol.replace(':', '')
        proxy.host = u.hostname
        proxy.port = u.port
      } catch (e) {
        proxy = undefined
      }
    } else {
      proxy = undefined
    }
    return proxy
  }
}
