<template>
  <div class="module-config">
    <el-card>
      <div ref="input" class="block"></div>
      <template #footer>
        <div class="tool">
          <el-button @click="logDo">{{ $t('base.open') }}</el-button>
          <el-button @click="logDo">{{ $t('base.refresh') }}</el-button>
          <el-button @click="logDo">{{ $t('base.clean') }}</el-button>
        </div>
      </template>
    </el-card>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import { EditorConfigMake, EditorCreate } from '../../fn'

  export default defineComponent({
    mounted() {
      this.initEditor()
    },
    unmounted() {
      this.monacoInstance && this.monacoInstance.dispose()
      this.monacoInstance = null
    },
    methods: {
      initEditor() {
        this.monacoInstance = EditorCreate(
          this?.$refs?.input as HTMLElement,
          EditorConfigMake('', true, 'on')
        )
      },
      logDo() {}
    }
  })
</script>
