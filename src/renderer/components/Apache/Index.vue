<template>
  <div class="apache-panel main-right-panel">
    <ul class="top-tab">
        <li @click="current_tab = index" :class="current_tab === index ? 'active' : ''" v-for="(item, index) in tabs" v-text="item">服务</li>
    </ul>
    <div class="main-block">
      <mo-apache-service v-if="current_tab === 0"></mo-apache-service>
      <mo-apache-config v-if="current_tab === 1"></mo-apache-config>
      <mo-apache-versions v-if="current_tab === 2"></mo-apache-versions>
      <mo-apache-logs  v-if="current_tab === 3" type="error_log"></mo-apache-logs>
      <mo-apache-logs  v-if="current_tab === 4" type="access_log"></mo-apache-logs>
    </div>
  </div>
</template>

<script>
  import Versions from './Versions'
  import Service from './Service'
  import Config from './Config'
  import Logs from './Logs'
  export default {
    name: 'mo-apache-panel',
    data () {
      return {
        current_tab: 0,
        tabs: ['服务', '配置修改', '切换版本', '错误日志', '运行日志']
      }
    },
    components: {
      [Config.name]: Config,
      [Versions.name]: Versions,
      [Service.name]: Service,
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
    }
  }
</script>

<style lang="scss">
  .apache-panel{
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
