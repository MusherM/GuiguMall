// 路由鉴权
import router from '@/router'
import nprogress from 'nprogress'
nprogress.configure({ showSpinner: false })
// 引入进度条样式
import 'nprogress/nprogress.css'
// 获取用户token
import useUserStore from './store/modules/user'
import pinia from './store'
import setting from './setting'
const userStore = useUserStore(pinia)
// 全局前置守卫
router.beforeEach(async (to: any, from: any, next: any) => {
  document.title = setting.title + '-' + to.meta.title
  nprogress.start()
  const token = userStore.token
  const username = userStore.username
  // 登录成功
  if (token) {
    if (to.path == '/login') {
      next({ path: '/' })
    } else {
      // 如果有用户信息，放行
      if (username) next()
      // 如果没有用户信息，则发请求获取用户信息再放行
      else {
        try {
          await userStore.userInfo()
          next()
        } catch (error) {
          // token 过期，获取不到用户信息了
          // 用户手动修改了本地存储的token
          // 退出登录
          await userStore.userLogout()
          next({ path: 'login', query: { redirect: to.path } })
        }
      }
    }
  } else {
    // 未登录
    if (to.path == '/login') {
      next()
    } else {
      next({ path: '/login', query: { redirect: to.path } })
    }
  }
})

// 全局后置守卫
router.afterEach((to: any, from: any, next: any) => {
  nprogress.done()
})
