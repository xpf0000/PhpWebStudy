<template>
  <el-drawer
    v-model="show"
    size="60%"
    :destroy-on-close="true"
    :with-header="false"
    @closed="onDrawerClosed"
  >
    <div class="host-vhost">
      <div class="nav">
        <div class="left" @click="close">
          <yb-icon :svg="import('@/svg/back.svg?raw')" width="24" height="24" />
          <span class="ml-15">系统Hosts</span>
        </div>
      </div>

      <div class="main-wapper">
        <div ref="input" class="block"></div>
        <div class="tool">
          <el-button @click="openConfig">打开</el-button>
          <el-button @click="saveConfig">保存</el-button>
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script>
  import { readFileAsync, writeFileAsync } from '@shared/file'
  import { editor } from 'monaco-editor/esm/vs/editor/editor.api.js'
  import 'monaco-editor/esm/vs/editor/contrib/find/browser/findController.js'
  import 'monaco-editor/esm/vs/basic-languages/ini/ini.contribution.js'
  import { nextTick } from 'vue'
  import IPC from '@/util/IPC.js'
  import { VueExtend } from '@/core/VueExtend.js'

  const { shell } = require('@electron/remote')

  export default {
    show(data) {
      return new Promise(() => {
        let dom = document.createElement('div')
        document.body.appendChild(dom)
        let vm = VueExtend(this, data)
        const intance = vm.mount(dom)
        intance.onClosed = () => {
          dom && dom.remove()
          dom = null
          console.log('intance.onClosed !!!!!!')
        }
      })
    },
    components: {},
    props: {},
    data() {
      return {
        show: true,
        config: '',
        configpath: '/private/etc/hosts'
      }
    },
    computed: {},
    created: function () {
      IPC.send('app-fork:host', 'doFixHostsRole').then((key) => {
        IPC.off(key)
        this.getConfig()
      })
    },
    mounted() {
      nextTick().then(() => {
        this.initEditor()
      })
    },
    unmounted() {
      this.monacoInstance && this.monacoInstance.dispose()
      this.monacoInstance = null
    },
    methods: {
      close() {
        this.show = false
        this.$destroy()
        this.onClosed()
      },
      onDrawerClosed() {
        this.onClosed()
      },
      openConfig() {
        shell.showItemInFolder(this.configpath)
      },
      saveConfig() {
        const content = this.monacoInstance.getValue()
        writeFileAsync(this.configpath, content)
          .then(() => {
            this.$message.success('系统Hosts保存成功')
          })
          .catch(() => {
            this.$message.error('系统Hosts保存失败, 请查看文件是否存在, 文件权限是否正确')
          })
      },
      getConfig() {
        readFileAsync(this.configpath)
          .then((conf) => {
            this.config = conf
            this.initEditor()
          })
          .catch(() => {
            this.config = '/private/etc/hosts 文件读取失败, 请查看文件是否存在, 文件权限是否正确'
            this.initEditor()
          })
      },
      initEditor() {
        if (!this.monacoInstance) {
          if (!this?.$refs?.input?.style) {
            return
          }
          this.monacoInstance = editor.create(this.$refs.input, {
            value: this.config,
            language: 'ini',
            theme: 'vs-dark',
            scrollBeyondLastLine: true,
            overviewRulerBorder: true,
            automaticLayout: true
          })
        } else {
          this.monacoInstance.setValue(this.config)
        }
      }
    }
  }
</script>

<style lang="scss">
  .host-vhost {
    width: 100%;
    height: 100%;
    background: #1d2033;
    display: flex;
    flex-direction: column;
    user-select: none;
    .nav {
      height: 76px;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      background: #282b3d;
      .left {
        cursor: pointer;
        display: flex;
        align-items: center;
        padding: 6px 0;
      }
    }
    .main-wapper {
      flex: 1;
      width: 100%;
      overflow: hidden;
      padding: 12px;
      color: rgba(255, 255, 255, 0.7);
      display: flex;
      flex-direction: column;

      > .block {
        width: 100%;
        flex: 1;
        overflow: hidden;
      }
      .tool {
        flex-shrink: 0;
        padding: 30px 0 20px 0;
      }
    }
  }
</style>