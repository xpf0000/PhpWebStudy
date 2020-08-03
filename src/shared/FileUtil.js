import fs from 'fs'
import path from 'path'
import axios from 'axios'

export default class FileUtil {
  constructor (dirPath) {
    this.dirPath = dirPath.replace(/\\/g, '/')
  }
  static remove (path, delself = true) {
    if (fs.existsSync(path)) {
      if (!fs.statSync(path).isDirectory()) {
        fs.unlinkSync(path)
        return
      }
      fs.readdirSync(path).forEach(function (file) {
        var curPath = path + '/' + file
        if (fs.statSync(curPath).isDirectory()) { // recurse
          // eslint-disable-next-line no-undef
          FileUtil.remove(curPath)
        } else { // delete file
          fs.unlinkSync(curPath)
        }
      })
      if (delself) {
        fs.rmdirSync(path)
      }
    }
  }
  static getAllFile (fp, fullpath = true) {
    let arr = []
    let files = fs.readdirSync(fp)
    files.forEach(function (item, index) {
      let fPath = path.join(fp, item)
      let stat = fs.statSync(fPath)
      if (stat.isDirectory()) {
        let sub = FileUtil.getAllFile(fPath, fullpath)
        arr = arr.concat(sub)
      }
      if (stat.isFile()) {
        arr.push(fullpath ? fPath : item)
      }
    })
    return arr
  }
  static getAllFileAsync (fp, fullpath = true) {
    return new Promise((resolve, reject) => {
      let arr = []
      let subs = []
      fs.readdir(fp, (_, paths) => {
        paths.forEach((item, index) => {
          let fPath = path.join(fp, item)
          fs.stat(fPath, (_, stat) => {
            if (stat.isDirectory()) {
              subs.push(FileUtil.getAllFileAsync(fPath, fullpath))
            }
            if (stat.isFile()) {
              arr.push(fullpath ? fPath : item)
            }
            if (index === paths.length - 1) {
              if (subs.length > 0) {
                Promise.all(subs).then(arrs => {
                  arr = arr.concat(...arrs)
                  resolve(arr)
                })
              } else {
                resolve(arr)
              }
            }
          })
        })
      })
    })
  }
  static getSubFolder (fp) {
    let arr = []
    let files = fs.readdirSync(fp)
    files.forEach(function (item, index) {
      let fPath = path.join(fp, item)
      let stat = fs.statSync(fPath)
      if (stat.isDirectory() === true) {
        arr.push(fPath)
      }
    })
    return arr
  }
  static createFolder (fp) {
    fp = fp.replace(/\\/g, '/')
    if (fs.existsSync(fp)) { return true }
    const arr = fp.split('/')
    let dir = '/'
    for (let p of arr) {
      dir = path.join(dir, p)
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir)
      }
    }
    return fs.existsSync(fp)
  }
  static chmod (fp, mode) {
    if (fs.statSync(fp).isFile()) {
      fs.chmodSync(fp, mode)
      return
    }
    let files = fs.readdirSync(fp)
    files.forEach(function (item, index) {
      let fPath = path.join(fp, item)
      fs.chmodSync(fPath, mode)
      let stat = fs.statSync(fPath)
      if (stat.isDirectory() === true) {
        // eslint-disable-next-line no-undef
        FileUtil.chmod(fPath, mode)
      }
    })
  }
  static readFileAsync (fp, encode = 'utf-8') {
    return new Promise((resolve, reject) => {
      fs.readFile(fp, encode, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }
  static writeFileAsync (fp, content) {
    return new Promise((resolve, reject) => {
      fs.writeFile(fp, content, (err) => {
        if (err) {
          reject(err)
        } else {
          resolve(true)
        }
      })
    })
  }
  static downFile (url, savepath) {
    return new Promise((resolve, reject) => {
      axios({
        method: 'get',
        url: url,
        responseType: 'stream'
      })
        .then(function (response) {
          let base = path.basename(savepath)
          FileUtil.createFolder(base)
          let stream = fs.createWriteStream(savepath)
          response.data.pipe(stream)
          stream.on('error', err => {
            reject(err)
          })
          stream.on('finish', code => {
            resolve(true)
          })
        }).catch(err => {
          reject(err)
        })
    })
  }
}
