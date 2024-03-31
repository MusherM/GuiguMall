<script setup lang="ts">
import { User, Lock } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
import useUserStore from '@/store/modules/user.ts'
import { useRouter, useRoute } from 'vue-router'
import { ElNotification } from 'element-plus'
import { getTime } from '@/utils/time'
let userStore = useUserStore()
// 获取路由器
let $router = useRouter()
const $route = useRoute()
// 定义变量，控制按钮加载效果
let loading = ref(false)
// 收集账号密码的数据
let loginForm = reactive({
  username: 'admin',
  password: '111111',
})
// 获取el-form组件
let loginForms = ref()

// 登录按钮的回调
const login = async () => {
  // 保证全部表单校验通过后再发请求
  await loginForms.value.validate()
  // 开始加载
  loading.value = true
  // 通知仓库发登录请求
  // 如果请求成功，则跳转到展示数据的地方
  // 请求失败，则弹出登录失败的信息
  try {
    await userStore.userLogin(loginForm)
    // 先判断路径是否有query参数，有则跳转
    const redirect: any = $route.query.redirect
    $router.push({ path: redirect || '/' })
    // 登录成功的提示信息
    ElNotification({
      type: 'success',
      message: '欢迎回来',
      title: `HI，${getTime()}好`,
    })
    loading.value = false
  } catch (error) {
    loading.value = false
    ElNotification({
      type: 'error',
      message: (error as Error).message,
    })
  }
}

// 自定义校验规则的函数
const validateUserName = (rule: any, value: any, callback: any) => {
  // rule 即为校验规则对象
  // value 表单元素文本内容
  // callback是规则放行函数，如果不符合条件，则注入提示信息
  if (value.length >= 5) {
    callback()
  } else {
    callback(new Error('账号长度至少5位'))
  }
}

const validatePassword = (rule: any, value: any, callback: any) => {
  // rule 即为校验规则对象
  // value 表单元素文本内容
  // callback是规则放行函数，如果不符合条件，则注入提示信息
  if (value.length >= 6) {
    callback()
  } else {
    callback(new Error('密码长度至少6位'))
  }
}

// 定义表单校验需要的配置对象
const rules = {
  username: [
    {
      trigger: 'change',
      validator: validateUserName,
    },
  ],
  password: [
    {
      trigger: 'change',
      validator: validatePassword,
    },
  ],
}
</script>

<template>
  <div class="login_container">
    <el-row>
      <el-col :span="12" :xs="0"></el-col>
      <el-col :span="12" :xs="24">
        <el-form
          class="login_form"
          :model="loginForm"
          :rules="rules"
          ref="loginForms"
        >
          <h1>Hello</h1>
          <h2>欢迎来到硅谷甄选</h2>
          <el-form-item prop="username">
            <el-input
              :prefix-icon="User"
              v-model="loginForm.username"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              type="password"
              :prefix-icon="Lock"
              v-model="loginForm.password"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              :loading="loading"
              class="login_btn"
              type="primary"
              size="default"
              @click="login"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="scss">
.login_container {
  width: 100%;
  height: 100vh;
  background: url('@/assets/images/background.jpg') no-repeat;
  background-size: cover;
  .login_form {
    position: relative;
    width: 80%;
    top: 30vh;
    background: url('@/assets/images/login_form.png') no-repeat;
    background-size: cover;
    padding: 40px;
    h1 {
      color: white;
      font-size: 40px;
    }
    h2 {
      color: white;
      font-size: 20px;
      margin: 20px 0px;
    }
    .login_btn {
      width: 100%;
    }
  }
}
</style>
