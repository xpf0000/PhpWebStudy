<template>
  <div class="host-edit">
    <div class="nav">
      <div class="left" @click="doClose">
        <mo-icon name="back" width="24" height="24" />
        <span class="ml-15">添加站点</span>
      </div>
      <el-button class="shrink0" @click="doSave">保存</el-button>
    </div>

    <div class="main-wapper">
      <div class="main">
        <input type="text" :class="'input'+(errs['name'] ? ' error' : '')" placeholder="name eg: www.xxx.com" v-model.trim="item.name"></input>
        <textarea type="text" class="input-textarea" placeholder="alias eg: www.xxx.com" v-model.trim="item.alias"></textarea>
        <div class="path-choose mt-20 mb-20">
          <input type="text" :class="'input'+(errs['root'] ? ' error' : '')" placeholder="root path" readonly="" :value="item.root"></input>
          <div class="icon-block" @click="chooseRoot('root')">
            <mo-icon class="choose" name="folder" width="18" height="18" />
          </div>
        </div>
      </div>

      <div class="plant-title">Port</div>
      <div class="main">
        <div class="port-set mb-20">
          <div class="port-type">
            Nginx
          </div>
          <input type="number" :class="'input'+(errs['port_nginx'] ? ' error' : '')" placeholder="default: 80" v-model.number="item.port.nginx"></input>
        </div>

        <div class="port-set mb-20">
          <div class="port-type">
            Apache
          </div>
          <input type="number" :class="'input'+(errs['port_apache'] ? ' error' : '')" placeholder="default: 8080" v-model.number="item.port.apache"></input>
        </div>

      </div>


      <div class="plant-title">SSL</div>

      <div class="main">

        <div class="ssl-switch">
          <span>SSL</span>
          <el-switch v-model="item.useSSL"></el-switch>
        </div>


        <div class="path-choose mt-20" v-if="item.useSSL">
          <input type="text" :class="'input'+(errs['cert'] ? ' error' : '')" placeholder="cert" readonly="" :value="item.ssl.cert"></input>
          <div class="icon-block" @click="chooseRoot('cert', true)">
            <mo-icon class="choose" name="folder" width="18" height="18" />
          </div>
        </div>

        <div class="path-choose mt-20 mb-20" v-if="item.useSSL">
          <input type="text" :class="'input'+(errs['certkey'] ? ' error' : '')" placeholder="cert key" readonly="" :value="item.ssl.key"></input>
          <div class="icon-block" @click="chooseRoot('certkey', true)">
            <mo-icon class="choose" name="folder" width="18" height="18" />
          </div>
        </div>

        <div class="ssl-switch mb-20 mt-20" v-if="item.useSSL">
          <span>Port</span>
        </div>

        <div class="port-set port-ssl mb-20" v-if="item.useSSL">
          <div class="port-type">
            Nginx
          </div>
          <input type="number" :class="'input'+(errs['port_nginx_ssl'] ? ' error' : '')" placeholder="default: 443" v-model.number="item.port.nginx_ssl"></input>
        </div>

        <div class="port-set port-ssl mb-20" v-if="item.useSSL">
          <div class="port-type">
            Apache
          </div>
          <input type="number" :class="'input'+(errs['port_apache_ssl'] ? ' error' : '')" placeholder="default: 8443" v-model.number="item.port.apache_ssl"></input>
        </div>

      </div>

      <div class="plant-title">Nginx</div>

      <div class="main">

        <el-select @change="rewriteChange" v-model="rewriteKey" placeholder="当前">
          <el-option
            v-for="key in rewrites"
            :key="key"
            :label="key"
            :value="key">
          </el-option>
        </el-select>

        <textarea type="text" class="input-textarea nginx-rewrite" placeholder="url rewrite" v-model.trim="item.nginx.rewrite"></textarea>

      </div>

    </div>

  </div>
</template>

<script>
import FileUtil from '@shared/FileUtil'
import '@/components/Icons/folder.js'
import '@/components/Icons/back.js'
import { accessSync, constants } from 'fs'
import { exec } from 'child-process-promise'
import { mapState } from 'vuex'
import { join } from 'path'
let rewrites = {}
export default {
  name: 'mo-host-edit',
  data () {
    return {
      item: {
        id: 0,
        name: '',
        alias: '',
        useSSL: false,
        ssl: {
          cert: '',
          key: ''
        },
        port: {
          nginx: 80,
          apache: 8080,
          nginx_ssl: 443,
          apache_ssl: 8443
        },
        nginx: {
          rewrite: ''
        },
        url: '',
        root: ''
      },
      edit: {},
      errs: {
        name: false,
        root: false,
        cert: false,
        certkey: false,
        port_nginx: false,
        port_apache: false,
        port_nginx_ssl: false,
        port_apache_ssl: false
      },
      isEdit: false,
      rewrites: [],
      rewriteKey: ''
    }
  },
  components: {
  },
  props: {
  },
  computed: {
    ...mapState('apache', {
      apacheTaskRunning: state => state.taskRunning
    }),
    ...mapState('nginx', {
      nginxTaskRunning: state => state.taskRunning
    }),
    ...mapState('app', {
      apacheRunning: state => state.stat.apache,
      nginxRunning: state => state.stat.nginx,
      hosts: state => state.hosts
    }),
    ...mapState('preference', {
      password: state => state.config.password
    })
  },
  watch: {
    item: {
      handler (n, o) {
        for (let k in this.errs) {
          this.errs[k] = false
        }
      },
      immediate: true,
      deep: true
    },
    'item.name': function () {
      for (let h of this.hosts) {
        if (h.name === this.item.name && h.id !== this.item.id) {
          this.errs['name'] = true
          break
        }
      }
    }
  },
  methods: {
    rewriteChange (item) {
      if (!rewrites[item]) {
        let file = join(this.rewritePath, `${item}.conf`)
        FileUtil.readFileAsync(file).then(content => {
          rewrites[item] = content
          this.item.nginx.rewrite = content
        })
      } else {
        this.item.nginx.rewrite = rewrites[item]
      }
    },
    loadRewrite () {
      this.rewritePath = join(global.Server.Static, 'rewrite')
      if (Object.keys(rewrites).length === 0) {
        FileUtil.getAllFileAsync(this.rewritePath, false).then(files => {
          files = files.sort()
          for (let file of files) {
            let k = file.replace('.conf', '')
            rewrites[k] = ''
            this.rewrites.push(k)
          }
        })
      } else {
        this.rewrites.push(...Object.keys(rewrites))
      }
    },
    doClose () {
      this.$EveBus.$emit('Host-Edit-Close')
    },
    chooseRoot (flag, choosefile = false) {
      const self = this
      let opt = ['openDirectory', 'createDirectory']
      if (choosefile) {
        opt.push('openFile')
      }
      this.$electron.remote.dialog.showOpenDialog({
        properties: opt
      }).then(({ canceled, filePaths }) => {
        if (canceled || filePaths.length === 0) {
          return
        }
        const [path] = filePaths
        switch (flag) {
          case 'root':
            self.item.root = path
            break
          case 'cert':
            self.item.ssl.cert = path
            break
          case 'certkey':
            self.item.ssl.key = path
            break
        }
      })
    },
    checkItem () {
      if (!Number.isInteger(this.item.port.nginx)) {
        this.errs['port_nginx'] = true
      }
      if (!Number.isInteger(this.item.port.apache)) {
        this.errs['port_apache'] = true
      }

      if (this.item.useSSL) {
        if (!Number.isInteger(this.item.port.nginx_ssl)) {
          this.errs['port_nginx_ssl'] = true
        }
        if (!Number.isInteger(this.item.port.apache_ssl)) {
          this.errs['port_apache_ssl'] = true
        }
      }

      this.errs['name'] = this.item.name.length === 0
      this.errs['root'] = this.item.root.length === 0
      if (this.item.useSSL) {
        this.errs['cert'] = this.item.ssl.cert.length === 0
        this.errs['certkey'] = this.item.ssl.key.length === 0
      }
      for (let h of this.hosts) {
        if (h.name === this.item.name && h.id !== this.item.id) {
          this.errs['name'] = true
          break
        }
      }
      for (let k in this.errs) {
        if (this.errs[k]) {
          return false
        }
      }
      return true
    },
    doSave () {
      if (!this.checkItem()) {
        return
      }
      let flag = this.isEdit ? 'edit' : 'add'
      let access = false
      try {
        accessSync('/private/etc/hosts', constants.R_OK | constants.W_OK)
        access = true
        console.log('可以读写')
      } catch (err) {
        console.error('无权访问')
      }
      if (!access) {
        if (!this.password) {
          this.$EveBus.$emit('vue:need-password')
        } else {
          exec(`echo '${this.password}' | sudo -S chmod 777 /private/etc`)
            .then(result => {
              return exec(`echo '${this.password}' | sudo -S chmod 777 /private/etc/hosts`)
            })
            .then(result => {
              this.$electron.ipcRenderer.send('command', 'host', 'handleHost', this.item, flag, this.edit)
            })
            .catch(_ => {
              this.$message.error('操作失败,hosts文件权限不正确')
            })
        }
      } else {
        this.$electron.ipcRenderer.send('command', 'host', 'handleHost', this.item, flag, this.edit)
      }
    }
  },
  created: function () {
    this.loadRewrite()
    this.item.id = new Date().getTime()
    this.$EveBus.$on('vue:host-add-end', res => {
      if (res === true) {
        if (this.apacheRunning && !this.apacheTaskRunning) {
          this.$electron.ipcRenderer.send('command', 'apache', 'reloadService', this.version)
        }
        if (this.nginxRunning && !this.nginxTaskRunning) {
          this.$electron.ipcRenderer.send('command', 'nginx', 'reloadService', this.version)
        }
        let list = JSON.parse(JSON.stringify(this.hosts))
        list.push(this.item)
        this.$store.dispatch('app/updateHosts', list)
        this.$electron.ipcRenderer.send('command', 'host', 'updateHostList', list)
        this.$message.success('操作成功')
        this.$EveBus.$emit('Host-Edit-Close')
      }
    })
    this.$EveBus.$on('vue:host-edit-end', res => {
      if (res === true) {
        if (this.apacheRunning && !this.apacheTaskRunning) {
          this.$electron.ipcRenderer.send('command', 'apache', 'reloadService', this.version)
        }
        if (this.nginxRunning && !this.nginxTaskRunning) {
          this.$electron.ipcRenderer.send('command', 'nginx', 'reloadService', this.version)
        }
        let list = JSON.parse(JSON.stringify(this.hosts))
        let i = 0
        for (let h of list) {
          if (h.id === this.edit.id) {
            break
          }
          i += 1
        }
        list[i] = this.item
        this.$store.dispatch('app/updateHosts', list)
        this.$electron.ipcRenderer.send('command', 'host', 'updateHostList', list)
        this.$message.success('操作成功')
        this.$EveBus.$emit('Host-Edit-Close')
      }
    })
  },
  destroyed () {
    this.$EveBus.$off('vue:host-add-end')
    this.$EveBus.$off('vue:host-edit-end')
  }
}
</script>

<style lang="scss">
  .password-prompt{
    background: #32364a !important;
    border: 1px solid #32364a !important;
    color: #fff !important;
    .el-message-box__message, .el-message-box__close{
      color: rgba(255,255,255,0.7) !important;
    }
  }
  .host-edit{
    width: 100%;
    height: 100%;
    background: #1d2033;
    display: flex;
    flex-direction: column;
    user-select: none;
    .nav{
      height: 76px;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      background: #282b3d;
      .left{
        display: flex;
        align-items: center;
        padding: 6px 0;
      }
    }
    .main-wapper{
      flex: 1;
      width: 100%;
      overflow: auto;
      padding: 12px;
      color: rgba(255,255,255,0.7);
      &::-webkit-scrollbar{
        width: 0;
        height: 0;
        display: none;
      }
      .input{
        background: transparent;
        border-top: none;
        border-left: none;
        border-right: none;
        border-bottom: 1px solid rgba(255,255,255,0.7);
        outline: none;
        height: 42px;
        color: #fff;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        &::-webkit-input-placeholder{
          color: rgba(255,255,255,0.7);
        }
        &:hover{
          border-bottom: 2px solid rgba(255,255,255,0.7);
        }
        &:focus{
          border-bottom: 2px solid #01cc74;
        }
        &.error{
          border-bottom: 2px solid #cc5441;
        }
      }
      .input-textarea{
        background: transparent;
        border: 1px solid rgba(255,255,255,0.7);
        outline: none;
        height: 120px;
        color: #fff;
        margin-top: 40px;
        border-radius: 8px;
        padding: 10px;
        resize: none;
        line-height: 1.6;
        &::-webkit-input-placeholder{
          color: rgba(255,255,255,0.7);
        }
        &:hover{
          border: 2px solid rgba(255,255,255,0.7);
        }
        &:focus{
          border: 2px solid #01cc74;
        }
        &.nginx-rewrite{
          height: 140px;
          margin-top: 20px;

        }
      }
      .main{
        background: #32364a;
        border-radius: 8px;
        padding: 20px;
        display: flex;
        flex-direction: column;
        .path-choose{
          display: flex;
          align-items: flex-end;
          .input{
            flex: 1;
          }
          .icon-block{
            margin-left: 30px;
            display: flex;
            .choose{
              color: #01cc74;
            }
          }
        }
        .ssl-switch{
          font-size: 15px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .port-set{
          display: flex;
          align-items: flex-end;
          .port-type{
            width: 50px;
            margin-right: 30px;
            flex-shrink: 0;
          }
          .input{
            flex: 1;
            &::-webkit-outer-spin-button{
              -webkit-appearance: none !important;
              margin: 0;
            }
            &::-webkit-inner-spin-button{
              -webkit-appearance: none !important;
              margin: 0;
            }
          }
          &.port-ssl{
            .input{
              margin-right: 48px;
            }
          }
        }
      }
      .plant-title{
        padding: 22px 24px;
        font-size: 15px;
        font-weight: 600;
      }
    }
  }
</style>
