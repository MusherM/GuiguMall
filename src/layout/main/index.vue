<script setup lang="ts">
import useLayoutSettingStore from '@/store/modules/setting'
import { watch, ref, nextTick } from 'vue'

defineOptions({
  name: 'MyMain',
})
const LayoutSettingStore = useLayoutSettingStore()
// 控制当前组件是否销毁重建
let flag = ref(true)
watch(
  () => LayoutSettingStore.refresh,
  () => {
    flag.value = false
    nextTick(() => {
      flag.value = true
    })
  },
)
</script>

<template>
  <router-view v-slot="{ Component }">
    <transition name="fade">
      <component :is="Component" v-if="flag" />
    </transition>
  </router-view>
</template>

<style scoped lang="scss">
.fade-enter-from {
  opacity: 0;
}

.fade-enter-active {
  transition: all 0.3s;
}

.fade-enter-to {
  opacity: 1;
}
</style>
