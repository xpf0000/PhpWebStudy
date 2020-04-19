<template>
  <div class="host-logs">
    <ul class="top-tab">
      <li @click="initType('nginx-access')" :class="type === 'nginx-access' ? 'active' : ''">Nginx-Access</li>
      <li @click="initType('nginx-error')" :class="type === 'nginx-error' ? 'active' : ''">Nginx-Error</li>
      <li @click="initType('apache-access')" :class="type === 'apache-access' ? 'active' : ''">Apache-Access</li>
      <li @click="initType('apache-error')" :class="type === 'apache-error' ? 'active' : ''">Apache-Error</li>
    </ul>
    <el-input resize="none" class="block" :readonly="true" type="textarea" v-model="log"></el-input>
    <div class="tool">
      <el-button class="shrink0" :disabled="!filepath" @click="logDo('open')" >打开</el-button>
      <el-button class="shrink0" :disabled="!filepath" @click="logDo('refresh')" >刷新</el-button>
      <el-button class="shrink0" :disabled="!filepath" @click="logDo('clean')" >清空</el-button>
    </div>
  </div>
</template>

<script>
  import { join } from 'path'
  import { existsSync } from 'fs'
  import FileUtil from '@shared/FileUtil'
  import { execSync } from 'child_process'
  export default {
    name: 'mo-host-logs',
    data () {
      return {
        type: '',
        name: '',
        filepath: '',
        log: ''
      }
    },
    components: {
    },
    props: {
    },
    computed: {
    },
    watch: {
    },
    methods: {
      logDo (flag) {
        switch (flag) {
          case 'open':
            this.$electron.remote.shell.showItemInFolder(this.filepath)
            break
          case 'refresh':
            this.getLog()
            break
          case 'clean':
            FileUtil.writeFileAsync(this.filepath, '').then(conf => {
              this.log = ''
              this.$message.success('日志清空成功')
            })
            break
        }
      },
      getLog () {
        if (existsSync(this.filepath)) {
          FileUtil.readFileAsync(this.filepath).then(log => {
            this.log = log
            this.$nextTick(() => {
              let container = this.$el.querySelector('textarea')
              if (container) {
                container.scrollTop = container.scrollHeight
              }
            })
          })
        } else {
          this.log = '当前无日志'
        }
      },
      initType (type) {
        this.type = type
        this.filepath = this.logfile[type]
        if (existsSync(this.filepath)) {
          execSync(`sudo chmod 777 ${this.filepath}`)
        }
        this.getLog()
      },
      init () {
        let logpath = join(global.Server.BaseDir, 'vhost/logs')
        let accesslogng = join(logpath, `${this.name}.log`)
        let errorlogng = join(logpath, `${this.name}.error.log`)
        let accesslogap = join(logpath, `${this.name}-access_log`)
        let errorlogap = join(logpath, `${this.name}-error_log`)
        this.logfile = {
          'nginx-access': accesslogng,
          'nginx-error': errorlogng,
          'apache-access': accesslogap,
          'apache-error': errorlogap
        }
      }
    },
    created: function () {
    }
  }
</script>

<style lang="scss">
  .host-logs{
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    padding: 20px 20px 0 20px;
    background: #1d2033;
    .block{
      display: flex;
      align-items: center;
      flex: 1;
      font-size: 15px;
      textarea{
        height: 100%;
      }
    }
    >.top-tab{
      width: 100%;
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      flex-shrink: 0;
      >li{
        cursor: pointer;
        padding: 0 20px;
        height: 36px;
        margin-right: 20px;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        user-select: none;
        &:hover {
          background-color: #3e4257;
        }
        &.active{
          background: #3e4257;
        }
      }
    }
    .tool{
      flex-shrink: 0;
      width: 100%;
      display: flex;
      align-items: center;
      padding: 30px 0;
      .shrink0{
        flex-shrink: 0;
      }
      .path{
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
        margin-right: 20px;
      }
    }
  }
</style>
