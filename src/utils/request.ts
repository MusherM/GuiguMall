// 进行axios的二次封装：使用请求与响应拦截器
import useUserStore from '@/store/modules/user'
import axios from 'axios'
import { ElMessage } from 'element-plus'
// 第一步：利用axios对象的create方法，创建axios实例
const request = axios.create({
  // 基础路径
  baseURL: import.meta.env.VITE_APP_BASE_API, // 基础路径会带上/api
  timeout: 5000, // 超时时间设置
})

// 第二步：给request实例添加请求与响应拦截器
request.interceptors.request.use((config) => {
  const userStore = useUserStore()
  if (userStore.token) {
    config.headers.token = userStore.token
  }
  // config配置对象，headers属性请求头，经常给服务器端携带公共参数
  // 返回配置对象
  return config
})

// 第三步，响应拦截器
request.interceptors.response.use(
  (response) => {
    // 成功回调
    // 简化数据
    return response.data
  },
  (error) => {
    // 失败回调，处理http网络错误
    // 定义一个变量：存储网络错误信息
    let message = ''
    const status = error.response.status
    switch (status) {
      case 401:
        message = 'TOKEN过期'
        break
      case 403:
        message = '无权访问'
        break
      case 404:
        message = '地址错误'
        break
      case 500:
        message = '服务器出现问题'
        break
      default:
        message = '网络出现问题'
        break
    }
    // 提示错误信息
    ElMessage({
      type: 'error',
      message,
    })
    return Promise.reject(error)
  },
)

// 对外暴露
export default request
