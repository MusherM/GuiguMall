<script setup lang="ts">
import useLayoutSettingStore from '@/store/modules/setting'
import { useRoute } from 'vue-router'

let LayoutSettingStore = useLayoutSettingStore()
let $route = useRoute()
// 点击图标的方法
const changeIcon = () => {
  LayoutSettingStore.fold = !LayoutSettingStore.fold
}
defineOptions({
  name: 'Breadcrumb',
})
</script>

<template>
  <!-- 顶部左侧的静态 -->
  <el-icon style="margin-right: 10px" @click="changeIcon">
    <component :is="LayoutSettingStore.fold ? 'Fold' : 'Expand'"></component>
  </el-icon>
  <!-- 左侧面包屑 -->
  <el-breadcrumb separator-icon="ArrowRight">
    <el-breadcrumb-item
      v-for="(item, index) in $route.matched"
      :key="index"
      v-show="item.meta.title"
      :to="item.path"
    >
      <el-icon>
        <component :is="item.meta.icon"></component>
      </el-icon>
      <!-- 面包屑展示对应路由的标题 -->
      <span style="margin: 0px 5px">{{ item.meta.title }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<style scoped lang="scss"></style>
