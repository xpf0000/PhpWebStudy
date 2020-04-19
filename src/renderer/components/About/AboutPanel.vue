<template>
  <el-dialog
    custom-class="app-about-dialog"
    width="61.8vw"
    :visible.sync="visible"
    @open="handleOpen"
    :before-close="handleClose"
    @closed="handleClosed">
    <mo-app-info :version="version" />
    <mo-copyright slot="footer" />
  </el-dialog>
</template>

<script>
  import is from 'electron-is'
  import AppInfo from '@/components/About/AppInfo'
  import Copyright from '@/components/About/Copyright'

  export default {
    name: 'mo-about-panel',
    components: {
      [AppInfo.name]: AppInfo,
      [Copyright.name]: Copyright
    },
    props: {
      visible: {
        type: Boolean,
        default: false
      }
    },
    data () {
      const version = this.$electron.remote.app.getVersion()
      return {
        version
      }
    },
    computed: {
    },
    methods: {
      isRenderer: is.renderer,
      isMas: is.mas,
      handleOpen () {
      },
      handleClose (done) {
        this.$store.dispatch('app/hideAboutPanel')
      },
      handleClosed () {
      }
    }
  }
</script>

<style lang="scss">
  .app-about-dialog {
    background: #1d2033;
    max-width: 632px;
    .el-dialog__header {
      padding-top: 0;
      padding-bottom: 0;
    }
  }
</style>
