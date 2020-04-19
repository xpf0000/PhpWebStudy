<template>
  <div class="php-panel main-right-panel">
    <ul class="top-tab">
        <li @click="current_tab = index" :class="current_tab === index ? 'active' : ''" v-for="(item, index) in tabs" v-text="item">服务</li>
    </ul>
    <div class="main-block">
      <mo-php-service v-if="current_tab === 0"></mo-php-service>
      <mo-php-config v-if="current_tab === 1"></mo-php-config>
      <mo-php-versions v-if="current_tab === 2"></mo-php-versions>
      <mo-php-logs  v-if="current_tab === 3" type="php-fpm"></mo-php-logs>
      <mo-php-logs  v-if="current_tab === 4" type="php-fpm-slow"></mo-php-logs>
      <mo-php-extends v-if="current_tab === 5"></mo-php-extends>
    </div>
  </div>
</template>

<script>
  import Versions from './Versions'
  import Service from './Service'
  import Config from './Config'
  import Logs from './Logs'
  import Extends from './Extends'
  export default {
    name: 'mo-php-panel',
    data () {
      return {
        current_tab: 0,
        tabs: ['服务', '配置文件', '切换版本', 'FPM日志', '慢日志', '扩展']
      }
    },
    components: {
      [Config.name]: Config,
      [Versions.name]: Versions,
      [Service.name]: Service,
      [Logs.name]: Logs,
      [Extends.name]: Extends
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
  .php-panel{
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
