
<template>
  <div class="memcached-service">
    <div class="block">
      <span>当前版本:</span>
      <span class="ml-30" v-text="version"></span>
    </div>

    <div class="block mt-20">
      <span>当前状态:</span>
      <div class="ml-30 status" v-if="serverRunning">
        <span class="mr-10">运行中</span>
        <mo-icon name="task-start" width="16" height="16" />
      </div>
      <div class="ml-30 status" v-else>
        <span class="mr-10">未运行</span>
        <mo-icon name="task-stop" width="16" height="16" />
      </div>
    </div>

    <div class="block mt-20">
      <el-button :loading="current_task === 'stop'" :disabled="isRunning || !version" @click="serviceDo('stop')" v-if="serverRunning">停止</el-button>
      <el-button :loading="current_task === 'start'" :disabled="isRunning || !version" @click="serviceDo('start')" v-else>启动</el-button>
      <el-button :loading="current_task === 'restart'" :disabled="isRunning || !version" class="ml-30" @click="serviceDo('restart')" >重启</el-button>
    </div>

    <ul class="logs mt-20">
      <li class="mb-5" v-for="log in logs" v-html="log"></li>
    </ul>

  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import '@/components/Icons/task-start.js'
  import '@/components/Icons/task-stop.js'
  export default {
    name: 'mo-memcached-service',
    data () {
      return {
        current_task: ''
      }
    },
    components: {
    },
    props: {},
    computed: {
      ...mapState('memcached', {
        isRunning: state => state.taskRunning,
        logs: state => state.taskLog
      }),
      ...mapState('app', {
        serverRunning: state => state.stat.memcached
      }),
      ...mapState('preference', {
        version: state => state.config.server.memcached.current
      })
    },
    watch: {
      isRunning (nv) {
        if (!nv) {
          this.current_task = ''
        }
      }
    },
    methods: {
      serviceDo (flag) {
        this.current_task = flag
        this.$store.dispatch('memcached/start', { type: 'memcached-service', v: this.version })
        let arg = ''
        switch (flag) {
          case 'stop':
            arg = 'stopService'
            break
          case 'start':
          case 'restart':
            arg = 'startService'
            break
          case 'reload':
            arg = 'reloadService'
            break
        }
        this.$electron.ipcRenderer.send('command', 'memcached', arg, this.version)
      }
    },
    created: function () {
      if (!this.$store.state.memcached.taskRunning) {
        this.$store.dispatch('memcached/cleanLog')
      }
    }
  }
</script>

<style lang="scss">
  .memcached-service{
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 40px 0 0 40px;
    .block{
      display: flex;
      align-items: center;
      flex-shrink: 0;
      .status{
        display: flex;
        align-items: center;
      }
    }
    .logs{
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
