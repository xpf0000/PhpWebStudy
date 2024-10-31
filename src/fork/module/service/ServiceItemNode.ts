import type { AppHost } from '@shared/app'
import { dirname, join } from 'path'
import { existsSync, mkdirp, writeFile, readFile } from 'fs-extra'
import { getHostItemEnv, ServiceItem } from './ServiceItem'
import { ForkPromise } from '@shared/ForkPromise'
import { execPromiseRoot } from '../../Fn'
import { ProcessPidListByPid } from '../../Process'

export class ServiceItemNode extends ServiceItem {
  start(item: AppHost) {
    return new ForkPromise(async (resolve, reject) => {
      if (this.exit) {
        reject(new Error('Exit'))
        return
      }
      this.host = item
      await this.stop()

      const nodeDir = item?.nodeDir ?? ''
      if (!nodeDir || !existsSync(nodeDir)) {
        reject(new Error(`NodeJS not exists: ${item.nodeDir}`))
        return
      }

      if (!item.bin || !existsSync(item.bin)) {
        reject(new Error(`Run File not exists: ${item.bin}`))
        return
      }

      if (!item.root || !existsSync(item.root)) {
        reject(new Error(`Run Directory not exists: ${item.root}`))
        return
      }

      const javaDir = join(global.Server.BaseDir!, 'nodejs')
      await mkdirp(javaDir)
      const pid = join(javaDir, `${item.id}.pid`)
      const log = join(javaDir, `${item.id}.log`)
      if (existsSync(pid)) {
        try {
          await execPromiseRoot(`del -Force ${pid}`)
        } catch (e) {}
      }

      const opt = await getHostItemEnv(item)
      const commands: string[] = []
      if (opt && opt?.env) {
        for (const k in opt.env) {
          const v = opt.env[k]
          if (v.includes(' ')) {
            commands.push(`set ${k}="${v}"`)
          } else {
            commands.push(`set ${k}=${v}`)
          }
        }
      }
      commands.push(`set PATH="${dirname(item.nodeDir!)};%PATH%"`)
      commands.push(`start /B ${item.startCommand} > ${log} 2>&1 &`)
      this.command = commands.join('\n')
      console.log('command: ', this.command)
      const sh = join(global.Server.Cache!, `service-${this.id}.sh`)
      await writeFile(sh, this.command)
      process.chdir(global.Server.Cache!)
      try {
        await execPromiseRoot(
          `powershell.exe -Command "(Start-Process -FilePath ./service-${this.id}.cmd -PassThru -WindowStyle Hidden).Id" > ${pid}`
        )
        const cpid = await this.checkPid()
        this.daemon()
        resolve({
          'APP-Host-Service-Start-PID': cpid
        })
      } catch (e) {
        console.log('start e: ', e)
        reject(e)
      }
    })
  }
  async checkState() {
    const id = this.host?.id
    if (!id) {
      return []
    }
    const baseDir = join(global.Server.BaseDir!, 'nodejs')
    const pidFile = join(baseDir, `${id}.pid`)
    this.pidFile = pidFile
    if (!existsSync(pidFile)) {
      return []
    }
    const pid = (await readFile(pidFile, 'utf-8')).trim()
    return await ProcessPidListByPid(pid)
  }
}
