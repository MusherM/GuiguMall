// 创建用户相关小仓库
import { defineStore } from 'pinia'
// 引入登录接口
import { reqLogin, reqUserInfo, reqLogout } from '@/api/user'
import { UserState } from './types/type'
import { GET_TOKEN, REMOVE_TOKEN, SET_TOKEN } from '@/utils/token'
// 引入路由
import { constantRoute } from '@/router/routes'
import {
  loginFormData,
  loginResponseData,
  userInfoResponseData,
} from '@/api/user/type'
// 创建用户小仓库
const useUserStore = defineStore('User', {
  // 小仓库存储数据的地方
  state: (): UserState => {
    return {
      token: GET_TOKEN(),
      menuRoutes: constantRoute,
      username: '',
      avatar: '',
    }
  },
  // 异步 逻辑的地方
  actions: {
    async userLogin(data: loginFormData) {
      // 登录请求
      const result: loginResponseData = await reqLogin(data)
      console.log(result)
      // 登录请求：成功 200->token
      if (result.code == 200) {
        // 由于pinia存储数据用的是js对象
        this.token = result.data as string
        // 本地持久化存储一份
        SET_TOKEN(result.data as string)
        return 'ok'
      } else {
        return Promise.reject(new Error(result.data))
      }
    },
    // 获取用户信息的方法
    async userInfo() {
      const result: userInfoResponseData = await reqUserInfo()
      if (result.code == 200) {
        this.username = result.data.name
        this.avatar = result.data.avatar
        return 'ok'
      } else return Promise.reject(new Error(result.message))
    },
    // 退出登录
    async userLogout() {
      const result: any = await reqLogout()
      console.log(result)
      if (result.code == 200) {
        this.token = ''
        this.username = ''
        this.avatar = ''
        REMOVE_TOKEN()
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },
  },
  getters: {},
})

// 对外暴露获取小仓库的方法
export default useUserStore
