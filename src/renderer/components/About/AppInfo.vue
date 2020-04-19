<template>
  <div class="app-info">
    <div class="app-version">
      <span>Php Web Study</span>
    </div>
    <div class="app-icon"></div>
    <div class="engine-info">
      <span>Version {{version}}</span>
    </div>
  </div>
</template>

<script>
  import is from 'electron-is'
  import Logo from '@/components/Logo/Logo'

  export default {
    name: 'mo-app-info',
    components: {
      [Logo.name]: Logo
    },
    props: {
      version: {
        type: String,
        default: ''
      }
    },
    methods: {
      isMas: is.mas
    }
  }
</script>

<style lang="scss">
  .app-info {
    position: relative;
    margin: 8px 0;
    padding: 0 20px;
    min-height: 120px;
    .app-version span {
      display: inline-block;
      vertical-align: bottom;
      font-size: $--font-size-large;
      color: $--app-version-color;
      line-height: 18px;
    }
    .app-icon {
      position: absolute;
      top: 0;
      right: 0;
      background: transparent url('~@/assets/256x256.png') center center no-repeat;
      background-size: 128px 128px;
      width: 128px;
      height: 128px;
    }
    .engine-info {
      margin: 24px 35% 0 8px;
      h4 {
        font-size: $--font-size-base;
        font-weight: normal;
        color: $--app-engine-title-color;
      }
      ul {
        font-size: 12px;
        color: $--app-engine-info-color;
        list-style: none;
        padding: 0;
        line-height: 20px;
        @include clearfix();
        li {
          float: left;
          width: 50%;
        }
      }
    }
  }
</style>
