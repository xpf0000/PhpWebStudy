import type { Configuration } from 'electron-builder'
import PublishConfig from './publish'

const conf: Configuration = {
  productName: 'PHPWebStudy',
  buildVersion: '1.0.43',
  electronVersion: '23.1.1',
  appId: 'phpstudy.mas.xpfme.com',
  asar: true,
  directories: {
    output: 'release'
  },
  files: [
    'dist/electron/**/*',
    'dist/render/**/*',
    '!**/node_modules/*/{CHANGELOG.md,README.md,README,readme.md,readme,LICENSE}',
    '!**/node_modules/*/{test,__tests__,tests,powered-test,example,examples}',
    '!**/node_modules/*.d.ts',
    '!**/node_modules/.bin'
  ],
  mac: {
    icon: 'build/icon.icns',
    target: {
      target: 'mas',
      arch: 'x64'
    },
    asarUnpack: ['**/*.node'],
    extendInfo: {
      'Icon file': 'icon.icns'
    },
    type: 'distribution',
    darkModeSupport: true,
    category: 'public.app-category.developer-tools',
    hardenedRuntime: true,
    gatekeeperAssess: false
  },
  mas: {
    type: 'distribution',
    entitlements: 'build/entitlements.mas.plist',
    entitlementsInherit: 'build/entitlements.mas.inherit.plist',
    provisioningProfile: 'build/phpwebstudy_mas_production.provisionprofile',
    hardenedRuntime: false
  },
  afterSign: 'build/notarize.js',
  publish: [PublishConfig],
  afterPack: 'build/afterPack.js'
}

export default conf
