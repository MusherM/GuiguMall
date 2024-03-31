<script setup lang="ts">
import useLayoutSettingStore from '../../../store/modules/setting'
import useUserStore from '../../../store/modules/user'
import { useRouter, useRoute } from 'vue-router'
defineOptions({
  name: 'Setting',
})
const LayoutSettingStore = useLayoutSettingStore()

const updateRefresh = () => {
  LayoutSettingStore.refresh = !LayoutSettingStore.refresh
}

const fullScreen = () => {
  // DOM对象的一个属性，可以用来判断当前是不是全屏
  let full = document.fullscreenElement
  if (!full) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}

const userStore = useUserStore()
const $router = useRouter()
const $route = useRoute()
// 退出登录的回调
const logout = async () => {
  // 1. 向服务器发请求[退出登录接口]
  // 2. 清除仓库中的相关数据
  await userStore.userLogout()
  // 3. 跳转登录页面
  $router.push({ path: '/login', query: { redirect: $route.path } })
}
</script>

<template>
  <el-button
    type="primary"
    size="small"
    icon="Refresh"
    circle
    @click="updateRefresh"
  ></el-button>
  <el-button
    type="primary"
    size="small"
    icon="FullScreen"
    circle
    @click="fullScreen"
  ></el-button>
  <el-button type="primary" size="small" icon="Setting" circle></el-button>
  <img
    :src="userStore.avatar"
    style="width: 24px; height: 24px; margin: 0px 10px; border-radius: 50%"
  />
  <el-dropdown>
    <span class="el-dropdown-link">
      {{ userStore.username }}
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style scoped lang="scss"></style>
