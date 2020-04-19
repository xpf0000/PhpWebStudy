const axios = require('axios')
const path = require('path')
const fs = require('fs')
// eslint-disable-next-line no-extend-native
String.prototype.endWith = function (str) {
  if (!str || str === '' || this.length === 0 || str.length > this.length) {
    return false
  }
  let sub = this.substring(this.length - str.length)
  console.log('endWith sub: ', sub, ' ,str: ', str, ' ,res: ', sub === str)
  return this.substring(this.length - str.length) === str
}
// eslint-disable-next-line no-extend-native
String.prototype.startWith = function (str) {
  if (!str || str === '' || this.length === 0 || str.length > this.length) {
    return false
  }
  let sub = this.substr(0, str.length)
  console.log('startWith sub: ', sub, ' ,str: ', str, ' ,res: ', sub === str)
  return this.substr(0, str.length) === str
}
class Utils {
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
        Utils.chmod(fPath, mode)
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

  static downFile (url, savepath) {
    return new Promise((resolve, reject) => {
      axios({
        method: 'get',
        url: url,
        responseType: 'stream'
      })
        .then(function (response) {
          let base = path.dirname(savepath)
          Utils.createFolder(base)
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

module.exports = Utils
