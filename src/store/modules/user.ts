// 创建用户相关小仓库
import { defineStore } from 'pinia'
// 引入登录接口
import { reqLogin } from '@/api/user'
// 引入数据类型
import { loginForm, loginResponseData } from '@/api/user/type'
import { UserState } from './types/type'
import { GET_TOKEN, SET_TOKEN } from '@/utils/token'

// 创建用户小仓库
const useUserStore = defineStore('User', {
  // 小仓库存储数据的地方
  state: (): UserState => {
    return { token: GET_TOKEN() }
  },
  // 异步 逻辑的地方
  actions: {
    async userLogin(data: loginForm) {
      // 登录请求
      const result: loginResponseData = await reqLogin(data)
      // 登录请求：成功 200->token
      if (result.code == 200) {
        // 由于pinia存储数据用的是js对象
        this.token = result.data.token as string
        // 本地持久化存储一份
        SET_TOKEN(this.token)
        return 'ok'
      } else {
        return Promise.reject(new Error(result.data.message))
      }
    },
  },
  getters: {},
})

// 对外暴露获取小仓库的方法
export default useUserStore
