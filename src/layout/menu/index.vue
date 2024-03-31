<script setup lang="ts">
// 获取父组件传递的路由数据
defineProps(['menuList'])
defineOptions({
  name: 'MyMenu',
})
import { useRouter } from 'vue-router'
// 获取路由器对象
let $router = useRouter()
// 点击菜单的回调
const goRoute = (vc: any) => {
  $router.push(vc.index)
}
</script>

<template>
  <div>
    <template v-for="item in menuList" :key="item.path">
      <template v-if="!item.meta.hidden">
        <!-- 没有子路由 -->
        <el-menu-item v-if="!item.children" :index="item.path" @click="goRoute">
          <el-icon>
            <component :is="item.meta.icon"></component>
          </el-icon>
          <template #title>
            <span>{{ item.meta.title }}</span>
          </template>
        </el-menu-item>
        <!-- 有子路由，但只有一个 -->
        <el-menu-item
          v-if="item.children && item.children.length == 1"
          :index="item.children[0].path"
          @click="goRoute"
        >
          <el-icon>
            <component :is="item.children[0].meta.icon"></component>
          </el-icon>
          <template #title>
            <span>{{ item.children[0].meta.title }}</span>
          </template>
        </el-menu-item>
        <!-- 有子路由，且多于一个 -->
        <el-sub-menu
          :index="item.path"
          v-if="item.children && item.children.length > 1"
        >
          <template #title>
            <el-icon>
              <component :is="item.meta.icon"></component>
            </el-icon>
            <span>{{ item.meta.title }}</span>
          </template>
          <MyMenu :menuList="item.children"></MyMenu>
        </el-sub-menu>
      </template>
    </template>
  </div>
</template>

<style scoped lang="scss"></style>
