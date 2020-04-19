<template>
  <div class="redis-panel main-right-panel">
    <ul class="top-tab">
        <li @click="current_tab = index" :class="current_tab === index ? 'active' : ''" v-for="(item, index) in tabs" v-text="item">服务</li>
    </ul>
    <div class="main-block">
      <mo-redis-service v-if="current_tab === 0"></mo-redis-service>
      <mo-redis-config v-if="current_tab === 1"></mo-redis-config>
      <mo-redis-versions v-if="current_tab === 2"></mo-redis-versions>
      <mo-redis-logs  v-if="current_tab === 3"></mo-redis-logs>
    </div>
  </div>
</template>

<script>
  import Versions from './Versions'
  import Service from './Service'
  import Config from './Config'
  import Logs from './Logs'
  export default {
    name: 'mo-redis-panel',
    data () {
      return {
        current_tab: 0,
        tabs: ['服务', '配置修改', '切换版本', '日志']
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
  .redis-panel{
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
