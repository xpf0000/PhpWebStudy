<template>
  <div class="host-edit tools-system-env">
    <div class="nav">
      <div class="left" @click="doClose">
        <yb-icon :svg="import('@/svg/delete.svg?raw')" class="top-back-icon" />
        <span class="ml-15">{{ $t('util.toolSystemEnv') }}</span>
      </div>
    </div>

    <div class="main-wapper">
      <template v-for="f in list" :key="f">
        <div class="file">
          <span @click.stop="openFile()">{{ f }}</span>
          <el-button link @click.stop="toEdit(f)">
            <yb-icon :svg="import('@/svg/edit.svg?raw')" width="18" height="18" />
          </el-button>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, Ref } from 'vue'
  import { AsyncComponentShow } from '@web/fn'

  const emit = defineEmits(['doClose'])

  const list: Ref<string[]> = ref([
    '/Users/xxxxxx/.profile',
    '/Users/xxxxxx/.zprofile',
    '/Users/xxxxxx/.zshrc',
    '/Users/xxxxxx/.bash_profile',
    '/etc/paths',
    '/etc/profile'
  ])

  let EditVM: any
  import('./edit.vue').then((res) => {
    EditVM = res.default
  })
  const toEdit = (file: string) => {
    AsyncComponentShow(EditVM, {
      file
    }).then()
  }

  const openFile = () => {}

  const doClose = () => {
    emit('doClose')
  }
</script>
