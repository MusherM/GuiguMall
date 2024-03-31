<script setup lang="ts">
import setting from '@/setting'
defineOptions({
  name: 'Logo',
})
</script>

<template>
  <div class="logo">
    <img :src="setting.logo" alt="GuiguMall" v-if="!setting.logoHidden" />
    <p>{{ setting.title }}</p>
  </div>
</template>

<style scoped lang="scss">
.logo {
  width: 100%;
  height: $base-menu-logo-height;
  color: white;
  display: flex;
  align-items: center;
  padding: 10px;
  img {
    width: 30px;
    height: 30px;
  }
  p {
    font-size: $base-logo-title-fontSize;
    margin-left: 10px;
  }
}
</style>
