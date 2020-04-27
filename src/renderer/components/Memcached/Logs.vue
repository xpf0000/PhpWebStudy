
<template>
  <div class="memcached-config">
    <el-input resize="none" class="block" :readonly="true" type="textarea" v-model="log"></el-input>
    <div class="tool">
      <el-button class="shrink0" :disabled="!filepath" @click="logDo('open')" >打开</el-button>
      <el-button class="shrink0" :disabled="!filepath" @click="logDo('refresh')" >刷新</el-button>
      <el-button class="shrink0" :disabled="!filepath" @click="logDo('clean')" >清空</el-button>
    </div>
  </div>
</template>

<script>
  import '@/components/Icons/task-start.js'
  import '@/components/Icons/task-stop.js'
  import { join } from 'path'
  import { existsSync } from 'fs'
  import FileUtil from '@shared/FileUtil'
  import { exec } from 'child-process-promise'
  import { mapState } from 'vuex'
  export default {
    name: 'mo-memcached-logs',
    data () {
      return {
        filepath: '',
        log: ''
      }
    },
    components: {
    },
    props: {
    },
    computed: {
      ...mapState('preference', {
        password: state => state.config.password
      })
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
            }).catch(_ => {
              if (!this.password) {
                this.$EveBus.$emit('vue:need-password')
              } else {
                exec(`echo '${this.password}' | sudo -S chmod 777 ${this.filepath}`)
                  .then(res => {
                    this.logDo('clean')
                  }).catch(_ => {
                    this.$EveBus.$emit('vue:need-password')
                  })
              }
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
      init () {
        this.filepath = join(global.Server.MemcachedDir, `logs/memcached.log`)
        this.getLog()
      }
    },
    created: function () {
      this.init()
    }
  }
</script>

<style lang="scss">
  .memcached-config{
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 20px 0 0 20px;
    .block{
      display: flex;
      align-items: center;
      flex: 1;
      font-size: 15px;
      textarea{
        height: 100%;
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
