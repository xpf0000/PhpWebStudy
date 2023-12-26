import { exec, spawn, execSync } from 'child_process'
import { merge } from 'lodash'
import { statSync, chmodSync, readdirSync, mkdirSync, existsSync, createWriteStream } from 'fs'
import { join, dirname } from 'path'
import { ForkPromise } from '@shared/ForkPromise'
import crypto from 'crypto'
import axios from 'axios'
export const ProcessSendSuccess = (key: string, data: any, on?: boolean) => {
  process?.send?.({
    on,
    key,
    info: {
      code: 0,
      data
    }
  })
}

export const ProcessSendError = (key: string, msg: any, on?: boolean) => {
  process?.send?.({
    on,
    key,
    info: {
      code: 1,
      msg
    }
  })
}

export const ProcessSendLog = (key: string, msg: any, on?: boolean) => {
  process?.send?.({
    on,
    key,
    info: {
      code: 200,
      msg
    }
  })
}

export function uuid(length = 32) {
  const num = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
  let str = ''
  for (let i = 0; i < length; i++) {
    str += num.charAt(Math.floor(Math.random() * num.length))
  }
  return str
}

export function waitTime(time: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, time)
  })
}

export function fixEnv(): { [k: string]: any } {
  const env = { ...process.env }
  if (!env['PATH']) {
    env['PATH'] =
      '/opt:/opt/homebrew/bin:/opt/homebrew/sbin:/opt/local/bin:/opt/local/sbin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin'
  } else {
    env[
      'PATH'
    ] = `/opt:/opt/homebrew/bin:/opt/homebrew/sbin:/opt/local/bin:/opt/local/sbin:/usr/local/bin:/usr/bin:/usr/sbin:${env['PATH']}`
  }
  if (global.Server.Proxy) {
    for (const k in global.Server.Proxy) {
      env[k] = global.Server.Proxy[k]
    }
  }
  return env
}

export function execSyncFix(cammand: string, opt?: { [k: string]: any }): string | undefined {
  let res: any = undefined
  try {
    res = execSync(
      cammand,
      merge(
        {
          env: fixEnv()
        },
        opt
      )
    ).toString()
  } catch (e) {
    res = undefined
  }
  return res
}

export function execPromise(
  cammand: string,
  opt?: { [k: string]: any }
): Promise<{
  stdout: string
  stderr: string
}> {
  return new Promise((resolve, reject) => {
    try {
      exec(
        cammand,
        merge(
          {
            env: fixEnv()
          },
          opt
        ),
        (error, stdout, stderr) => {
          if (!error) {
            resolve({
              stdout,
              stderr
            })
          } else {
            reject(error)
          }
        }
      )
    } catch (e) {
      reject(e)
    }
  })
}

export function spawnPromise(
  cammand: string,
  params: Array<any>,
  opt?: { [k: string]: any }
): ForkPromise<any> {
  return new ForkPromise((resolve, reject, on) => {
    const child = spawn(
      cammand,
      params,
      merge(
        {
          env: fixEnv()
        },
        opt
      )
    )

    let exit = false
    const onEnd = (code: number | null) => {
      if (exit) return
      exit = true
      if (!code) {
        resolve(code)
      } else {
        reject(code)
      }
    }
    child.stdout.on('data', (data) => {
      on(data.toString())
    })
    child.stderr.on('data', (err) => {
      on(err.toString())
    })
    child.on('exit', onEnd)
    child.on('close', onEnd)
  })
}

export function chmod(fp: string, mode: string) {
  if (statSync(fp).isFile()) {
    chmodSync(fp, mode)
    return
  }
  const files = readdirSync(fp)
  files.forEach(function (item) {
    const fPath = join(fp, item)
    chmodSync(fPath, mode)
    const stat = statSync(fPath)
    if (stat.isDirectory()) {
      chmod(fPath, mode)
    }
  })
}

export function createFolder(fp: string) {
  fp = fp.replace(/\\/g, '/')
  if (existsSync(fp)) {
    return true
  }
  const arr = fp.split('/')
  let dir = '/'
  for (const p of arr) {
    dir = join(dir, p)
    if (!existsSync(dir)) {
      mkdirSync(dir)
    }
  }
  return existsSync(fp)
}

export function md5(str: string) {
  const md5 = crypto.createHash('md5')
  return md5.update(str).digest('hex')
}

export function getAllFile(fp: string, fullpath = true) {
  let arr: Array<string> = []
  if (!existsSync(fp)) {
    return arr
  }
  const state = statSync(fp)
  if (state.isFile()) {
    return [fp]
  }
  const files = readdirSync(fp)
  files.forEach(function (item) {
    const fPath = join(fp, item)
    if (existsSync(fPath)) {
      const stat = statSync(fPath)
      if (stat.isDirectory()) {
        const sub = getAllFile(fPath, fullpath)
        arr = arr.concat(sub)
      }
      if (stat.isFile()) {
        arr.push(fullpath ? fPath : item)
      }
    }
  })
  return arr
}

export function downFile(url: string, savepath: string) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'get',
      url: url,
      responseType: 'stream'
    })
      .then(function (response) {
        const base = dirname(savepath)
        createFolder(base)
        const stream = createWriteStream(savepath)
        response.data.pipe(stream)
        stream.on('error', (err) => {
          reject(err)
        })
        stream.on('finish', () => {
          resolve(true)
        })
      })
      .catch((err) => {
        reject(err)
      })
  })
}

export function getSubDir(fp: string, fullpath = true) {
  const arr: Array<string> = []
  if (!existsSync(fp)) {
    return arr
  }
  const stat = statSync(fp)
  if (stat.isDirectory() && !stat.isSymbolicLink()) {
    try {
      const files = readdirSync(fp)
      files.forEach(function (item) {
        const fPath = join(fp, item)
        if (existsSync(fPath)) {
          const stat = statSync(fPath)
          if (stat.isDirectory() && !stat.isSymbolicLink()) {
            arr.push(fullpath ? fPath : item)
          }
        }
      })
    } catch (e) {}
  }
  return arr
}