import IPC from '@/util/IPC'
import { reloadWebServer } from '@/util/Service'
import type { AppHost } from '@/store/app'
import { AppStore } from '@/store/app'
import { I18nT } from '@shared/lang'
import { MessageError, MessageSuccess } from '@/util/Element'
import { HostStore } from '@/components/Host/store'
const { shell } = require('@electron/remote')
const handleHostEnd = (arr: Array<AppHost>, isAdd?: boolean) => {
  const appStore = AppStore()

  reloadWebServer(isAdd ? arr : undefined)

  const hosts = appStore.hosts
  hosts.splice(0)
  hosts.push(...arr)

  HostStore.updateCurrentList()

  const writeHosts = appStore.config.setup.hosts.write
  IPC.send('app-fork:host', 'writeHosts', writeHosts).then((key: string) => {
    IPC.off(key)
  })

  MessageSuccess(I18nT('base.success'))
}

export const handleHost = (
  host: AppHost,
  flag: 'add' | 'edit' | 'del',
  old?: AppHost,
  park?: boolean
) => {
  return new Promise((resolve) => {
    host = JSON.parse(JSON.stringify(host))
    old = JSON.parse(JSON.stringify(old ?? {}))
    IPC.send('app-fork:host', 'handleHost', host, flag, old, park).then((key: string, res: any) => {
      IPC.off(key)
      if (res?.code === 0) {
        if (res?.data?.host) {
          handleHostEnd(res.data.host, flag === 'add')
          resolve(true)
        } else if (res?.data?.hostBackFile) {
          MessageError(I18nT('base.hostParseErr'))
          shell.showItemInFolder(res?.data?.hostBackFile)
          resolve(I18nT('base.hostParseErr'))
        }
      } else if (res?.code === 1) {
        MessageError(res.msg)
        resolve(res.msg)
      }
    })
  })
}
