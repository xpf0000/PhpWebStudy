const { join, resolve } = require('path')
const { readFileSync, writeFileSync } = require('fs')
const { execSync } = require('child_process')
/**
 * 处理appstore node-pty python链接库问题
 * @param pack
 * @returns {Promise<boolean>}
 */
exports.default = async function after(pack) {
  const dir = join(pack.appOutDir, 'PHPWebStudy.app/Contents/Resources')
  const optdefault = { env: process.env, cwd: dir }
  if (!optdefault.env['PATH']) {
    optdefault.env['PATH'] =
      '/opt:/opt/homebrew/bin:/opt/homebrew/sbin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin'
  } else {
    optdefault.env[
      'PATH'
    ] = `/opt:/opt/homebrew/bin:/opt/homebrew/sbin:/usr/local/bin:${optdefault.env['PATH']}`
  }
  execSync('rm -rf app.asar.unpacked/node_modules/node-pty/build/node_gyp_bins', optdefault)
  // const info = resolve(dir, '../Info.plist')
  // let content = readFileSync(info, 'utf-8')
  // content = content.replace(
  //   '</dict></plist>',
  //   '<key>ITSAppUsesNonExemptEncryption</key><false/></dict></plist>'
  // )
  // writeFileSync(info, content)
  console.log('afterPack handle end !!!!!!')
  return true
}
