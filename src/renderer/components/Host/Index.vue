<template>
  <div class="host-panel main-right-panel">
    <ul class="top-tab">
      <li @click="drawer = true" class="active">添加</li>
    </ul>
    <mo-host-list></mo-host-list>
    <el-drawer
      size="460px"
      title="我是标题"
      :visible.sync="drawer"
      :wrapperClosable="false"
      :destroy-on-close="true"
      custom-class="host-edit-drawer"
      ref="host-edit-drawer"
      :with-header="false">
      <mo-host-edit ref="host-edit"></mo-host-edit>
    </el-drawer>

    <el-drawer
      size="60%"
      title="我是标题"
      :visible.sync="logshow"
      :destroy-on-close="true"
      :with-header="false">
      <mo-host-logs ref="host-logs"></mo-host-logs>
    </el-drawer>

  </div>
</template>

<script>
  import Vue from 'vue'
  import Edit from './Edit'
  import List from './List'
  import Logs from './Logs'
  export default {
    name: 'mo-host-panel',
    data () {
      return {
        current_tab: 0,
        tabs: ['添加'],
        drawer: false,
        logshow: false
      }
    },
    components: {
      [Edit.name]: Edit,
      [List.name]: List,
      [Logs.name]: Logs
    },
    props: {
    },
    computed: {
    },
    watch: {
    },
    methods: {
    },
    created: function () {
      this.$EveBus.$on('Host-Edit-Close', data => {
        let ref = this.$refs['host-edit-drawer']
        console.log('ref: ', ref)
        ref.hide()
      })
      this.$EveBus.$on('Host-Edit-Item', data => {
        this.drawer = true
        this.$nextTick(() => {
          console.log('refs: ', this.$refs)
          let ref = this.$refs['host-edit']
          console.log('ref: ', ref)
          console.log('ref.item: ', ref.item)
          Vue.set(ref, 'item', JSON.parse(JSON.stringify(data)))
          Vue.set(ref, 'edit', JSON.parse(JSON.stringify(data)))
          ref.isEdit = true
        })
      })
      this.$EveBus.$on('Host-Logs-Item', data => {
        this.logshow = true
        this.$nextTick(() => {
          console.log('refs: ', this.$refs)
          let ref = this.$refs['host-logs']
          ref.name = data.name
          ref.type = 'nginx-access'
          ref.init()
          ref.initType(ref.type)
        })
      })
    },
    destroyed () {
      this.$EveBus.$off('Host-Edit-Close')
      this.$EveBus.$off('Host-Edit-Item')
      this.$EveBus.$off('Host-Logs-Item')
    }
  }
</script>

<style lang="scss">
  .el-drawer{
    outline: none;
    .el-drawer__body{
      height: 100%;
    }
  }
  .host-edit-drawer{
    z-index: 5050 !important;
  }
  .host-panel{
    height: 100%;
    overflow: auto;
    line-height: 1.75;
    padding: 30px 18px;
    display: flex;
    flex-direction: column;
    >.top-tab{
      width: 100%;
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      flex-shrink: 0;
      >li{
        user-select: none;
        cursor: pointer;
        width: 100px;
        height: 36px;
        margin-right: 20px;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        &:hover {
          background-color: #3e4257;
        }
        &.active{
          background: #3e4257;
        }
      }
    }
    .main-block{
      flex: 1;
      width: 100%;
      overflow: hidden;
    }
  }
</style>
