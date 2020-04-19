
<template>
  <div class="nginx-versions">
    <div class="block">
      <span>选择版本</span>
      <el-select v-model="current" :disabled="currentType === 'nginx-versions' && isRunning" placeholder="请选择" class="ml-30">
        <el-option
          v-for="item in versions"
          :key="item"
          :label="item"
          :value="item">
        </el-option>
      </el-select>
      <el-button class="ml-20" :disabled="isRunning" @click="versionChange" :loading="isRunning">切换</el-button>
    </div>

    <ul class="logs" id="logs" v-if="currentType === 'nginx-versions'">
      <li class="mb-5" v-for="log in logs" v-html="log"></li>
    </ul>

  </div>
</template>

<script>
  import FileUtil from '@shared/FileUtil'
  import { join } from 'path'
  import { mapState } from 'vuex'
  export default {
    name: 'mo-nginx-versions',
    data () {
      return {
        current: '',
        versions: ['nginx-1.12.2', 'nginx-1.14.2', 'nginx-1.16.1', 'nginx-1.17.8']
      }
    },
    components: {
    },
    props: {},
    computed: {
      ...mapState('task', {
        currentType: state => state.taskType,
        isRunning: state => state.taskRunning,
        logs: state => state.taskLog,
        taskResult: state => state.taskResult
      })
    },
    watch: {
      currentType (nv, ov) {
        console.log(`currentType: nv: ${nv}, ov: ${ov}`)
      },
      logs () {
        this.$nextTick(() => {
          let container = this.$el.querySelector('#logs')
          if (container) {
            container.scrollTop = container.scrollHeight
          }
        })
      }
    },
    methods: {
      getAllVersion () {
        let brewng = join(__static, 'brew/nginx')
        let rbfiles = FileUtil.getAllFile(brewng).map(file => file.replace(`${brewng}/`, '').replace('.rb', ''))
        console.log('files: ', rbfiles)
        this.versions = rbfiles
      },
      getCurrenVersion () {
        if (this.$store.state.task.taskType === 'nginx-versions' && this.$store.state.task.taskRunning) {
          this.current = this.$store.state.task.taskVersion
          console.log('this.current: ', this.current)
        } else {
          let c = this.$store.state.preference.config.server.nginx.current
          this.current = c
        }
        if (!this.$store.state.task.taskRunning) {
          this.$store.dispatch('task/cleanLog')
        }
      },
      versionChange () {
        console.log('current is change: ', this.current)
        this.$store.dispatch('task/start', { type: 'nginx-versions', v: this.current })
        this.$electron.ipcRenderer.send('command', 'nginx', 'switchVersion', this.current)
      }
    },
    created: function () {
      if (!this.$store.state.task.taskRunning) {
        this.$store.dispatch('task/cleanLog')
      }
      this.getCurrenVersion()
    }
  }
</script>

<style lang="scss">
  .nginx-versions{
    display: flex;
    flex-direction: column;
    height: 100%;
    .block{
      display: flex;
      align-items: center;
      margin: 40px 0 30px 40px;
      flex-shrink: 0;
    }
    .logs{
      padding-left: 40px;
      flex: 1;
      width: 100%;
      display: flex;
      flex-direction: column;
      overflow: auto;
      >li{
        width: 100%;
        word-break: break-all;
      }
    }
  }
</style>
