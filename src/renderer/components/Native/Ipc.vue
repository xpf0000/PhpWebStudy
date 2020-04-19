<template>
  <div v-if="false"></div>
</template>

<script>
  import is from 'electron-is'
  import {
    commands
  } from '@/components/Command/index'

  export default {
    name: 'mo-ipc',
    computed: {
    },
    watch: {
    },
    methods: {
      bindIpcEvents: function () {
        this.$electron.ipcRenderer.on('command', (event, command, ...args) => {
          commands.execute(command, ...args)
        })
      },
      unbindIpcEvents: function () {
        this.$electron.ipcRenderer.removeAllListeners('command')
      }
    },
    created: function () {
      commands.$EveBus = this.$EveBus
      this.bindIpcEvents()
      // id of the menu item
      let visibleStates = {}
      if (is.mas()) {
        visibleStates['app.check-for-updates'] = false
      }
      this.$electron.ipcRenderer.send('command', 'application:change-menu-states', visibleStates, null, null)
    },
    destroyed: function () {
      this.unbindIpcEvents()
    }
  }
</script>
