<template>
  <div id="app">
    <mo-title-bar
      v-if="isRenderer()"
      :showActions="showWindowActions"
    />
    <router-view />
    <mo-ipc v-if="isRenderer()" />
  </div>
</template>

<script>
  import is from 'electron-is'
  import TitleBar from '@/components/Native/TitleBar'
  import Ipc from '@/components/Native/Ipc'
  import { mapState } from 'vuex'
  import { getLangDirection } from '@shared/utils'
  // import { exec } from 'child-process-promise'

  export default {
    name: 'PhpWebStudy',
    components: {
      [TitleBar.name]: TitleBar,
      [Ipc.name]: Ipc
    },
    computed: {
      ...mapState('task', {
        currentType: state => state.taskType,
        isRunning: state => state.taskRunning,
        taskResult: state => state.taskResult,
        taskVersion: state => state.taskVersion
      }),
      ...mapState('app', {
        systemTheme: state => state.systemTheme
      }),
      ...mapState('preference', {
        showWindowActions: state => {
          return (is.windows() || is.linux()) && state.config.hideAppMenu
        },
        rpcSecret: state => state.config.rpcSecret,
        theme: state => state.config.theme,
        locale: state => state.config.locale,
        password: state => state.config.password,
        dir: state => getLangDirection(state.config.locale)
      }),
      themeClass: function () {
        if (this.theme === 'auto') {
          return `theme-${this.systemTheme}`
        } else {
          return `theme-${this.theme}`
        }
      },
      i18nClass: function () {
        return `i18n-${this.locale}`
      },
      dirClass: function () {
        return `dir-${this.dir}`
      }
    },
    methods: {
      isRenderer: is.renderer,
      updateRootClassName: function () {
        const { themeClass = '', i18nClass = '', dirClass = '' } = this
        const className = `${themeClass} ${i18nClass} ${dirClass}`
        document.documentElement.className = className
      }
    },
    beforeMount: function () {
      this.updateRootClassName()
    },
    watch: {
      themeClass: function (val, oldVal) {
        this.updateRootClassName()
      },
      i18nClass: function (val, oldVal) {
        this.updateRootClassName()
      },
      dirClass: function (val, oldVal) {
        this.updateRootClassName()
      },
      password () {
        console.log('password is changed: ', this.password)
      }
    },
    created () {
      global.Server = this.$electron.remote.getGlobal('Server')
      console.log('App vue global.Server: ', global.Server)
      this.$electron.ipcRenderer.send('command', 'host', 'hostList')
      this.$EveBus.$on('vue:task-versions-success', _ => {
        let type = this.currentType.replace('-versions', '')
        let server = this.$store.state.preference.config.server
        if (!server[type]) {
          server[type] = {}
        }
        console.log('vue:task-versions-success: type: ', type)
        console.log('vue:task-versions-success: version: ', this.taskVersion)
        server[type].current = this.taskVersion
        console.log('vue:task-versions-success: server: ', server)
        this.$store.dispatch('preference/save', { server: server })
        this.$store.dispatch('task/result', '')
      })
      // if (!this.password) {
      //   this.$prompt('请输入电脑用户密码', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     inputType: 'password',
      //     customClass: 'password-prompt'
      //   }).then(({ value }) => {
      //     exec(`sudo -S chmod 777 /private/etc`)
      //       .then(result => {
      //         console.log(`stdout: ${result.stdout}`)
      //         console.log(`stderr: ${result.stderr}`)
      //         return exec(`sudo -S chmod 777 /private/etc/hosts`)
      //       })
      //       .then(result => {
      //         console.log('权限修改成功!!!!')
      //       })
      //       .catch(error => {
      //         console.log('error: ', error)
      //       })
      //   }).catch(err => {
      //     console.log('err: ', err)
      //   })
      // }
    },
    destroyed () {
      this.$EveBus.$off('vue:task-versions-success')
    },
    mounted () {
    }
  }
</script>

<style>
</style>
