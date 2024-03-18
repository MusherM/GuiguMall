<script setup lang="ts">
import { onMounted } from 'vue'
import request from './utils/request'

onMounted(() => {
  request({
    url: '/user/login',
    method: 'post',
    data: {
      username: 'admin',
      password: '111111',
    },
  }).then((res) => {
    console.log(res)
  })
})
</script>

<template>
  <div>
    <h1>测试代码</h1>
  </div>
</template>

<style scoped lang="scss"></style>
