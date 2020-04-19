<template>
  <ul class="host-list">
    <li @click="current_row = index" :class="'host-item'+(current_row === index ? ' active' : '')" v-for="(item, index) in hosts">
      <div class="left">
        <div class="icon-block">
          <mo-icon name="link" width="22" height="22" />
        </div>
        <div class="info">
          <span class="name" v-text="item.name">

          </span>
          <span class="url" v-text="item.url">

          </span>
        </div>
      </div>

      <el-popover
        popper-class="host-list-poper"
        placement="bottom-end"
        width="150"
        :ref="'host-list-poper-'+index"
        trigger="click">
        <ul class="host-list-menu">
          <li @click="action(item, index, 'open')">
            <mo-icon name="folder" width="13" height="13" />
            <span class="ml-15">打开</span>
          </li>
          <li @click="action(item, index, 'edit')">
            <mo-icon name="edit" width="13" height="13" />
            <span class="ml-15">编辑</span>
          </li>
          <li @click="action(item, index, 'log')">
            <mo-icon name="log" width="13" height="13" />
            <span class="ml-15">日志</span>
          </li>
          <li @click="action(item, index, 'del')">
            <mo-icon name="trash" width="13" height="13" />
            <span class="ml-15">删除</span>
          </li>

        </ul>

        <div class="right" slot="reference">
          <mo-icon name="more1" width="22" height="22" />
        </div>
      </el-popover>
    </li>
  </ul>
</template>

<script>
  import '@/components/Icons/edit.js'
  import '@/components/Icons/trash.js'
  import '@/components/Icons/folder.js'
  import '@/components/Icons/link.js'
  import '@/components/Icons/more1.js'
  import '@/components/Icons/log.js'
  import { mapState } from 'vuex'
  export default {
    name: 'mo-host-list',
    data () {
      return {
        current_row: 0,
        abc: '',
        extensionDir: '',
        task_index: 0
      }
    },
    components: {
    },
    props: {},
    computed: {
      ...mapState('app', {
        apacheRunning: state => state.stat.apache,
        nginxRunning: state => state.stat.nginx,
        hosts: state => state.hosts
      })
    },
    watch: {
    },
    methods: {
      action (item, index, flag) {
        console.log('item: ', item)
        this.task_index = index
        console.log('$refs: ', this.$refs['host-list-poper-' + this.task_index][0])
        switch (flag) {
          case 'open':
            this.$electron.remote.shell.showItemInFolder(item.root)
            break
          case 'edit':
            this.$EveBus.$emit('Host-Edit-Item', item)
            break
          case 'log':
            this.$EveBus.$emit('Host-Logs-Item', item)
            break
          case 'del':
            this.$confirm('确认删除?', {
              customClass: 'confirm-del',
              type: 'warning'
            })
              .then(_ => {
                this.$electron.ipcRenderer.send('command', 'host', 'handleHost', item, 'del')
              })
              .catch(_ => {})
            break
        }
        this.$refs['host-list-poper-' + this.task_index][0].doClose()
      }
    },
    created: function () {
      this.$EveBus.$on('vue:host-del-end', res => {
        if (res === true) {
          if (this.apacheRunning && !this.apacheTaskRunning) {
            this.$electron.ipcRenderer.send('command', 'apache', 'reloadService', this.version)
          }
          if (this.nginxRunning && !this.nginxTaskRunning) {
            this.$electron.ipcRenderer.send('command', 'nginx', 'reloadService', this.version)
          }
          let list = JSON.parse(JSON.stringify(this.hosts))
          list.splice(this.task_index, 1)
          this.$store.dispatch('app/updateHosts', list)
          this.$electron.ipcRenderer.send('command', 'host', 'updateHostList', list)
          this.$message.success('操作成功!')
        } else {
          this.$message.error(res)
        }
      })
    },
    destroyed () {
      this.$EveBus.$off('vue:host-del-end')
    }
  }
</script>

<style lang="scss">
  .confirm-del{
    background: #32364a !important;
    border: 1px solid #32364a !important;
    color: #fff !important;
    .el-message-box__message, .el-message-box__close{
      color: rgba(255,255,255,0.7) !important;
    }
  }
  .host-list{
    display: flex;
    flex-direction: column;
    max-height: 100%;
    .host-item{
      display: flex;
      justify-content: space-between;
      padding: 0 20px;
      align-items: center;
      width: 100%;
      height: 64px;
      &.active{
        background: #32364a;
        .left .info {
          color: #fff;
        }
      }
      &:hover{
        background: #3e4257;
      }
      .left{
        display: flex;
        align-items: center;
        .icon-block{
          width: 44px;
          height: 44px;
          border-radius: 25px;
          background: #004878;
          margin-right: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .info{
          line-height: 1.5;
          display: flex;
          flex-direction: column;
          color: rgba(255,255,255,0.7);
          .name{
            font-size: 15px;
          }
          .url{
            font-size: 12px;
          }
        }
      }
      .right{
        height: 39px;
        width: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 7px;
        &:hover{
          background: #282b3d;
        }
      }
    }
  }
  .host-list-menu{
    display: flex;
    flex-direction: column;
    background: #32364a;
    user-select: none;
    >li{
      display: flex;
      align-items: center;
      padding: 8px 15px;
      &:hover{
        background: #3e4257;
      }
    }
  }
  .host-list-poper{
    background: #32364a !important;
    border: none !important;
    color: #fff !important;
    padding: 0 !important;
  }
</style>
