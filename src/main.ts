import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from '@/App.vue'
//@ts-expect-error 忽略当前文件ts类型的检测否则有红色提示(打包会失败)
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
// svg 图标需要的依赖
import 'virtual:svg-icons-register'
// 引入自定义插件对象，引入整个项目的全局组件
import globalComponent from '@/components'
// 引入模板的全局样式
import '@/styles/index.scss'
// 引入路由
import router from './router'
// 引入仓库
import pinia from './store'
import './permission'
const app = createApp(App)
// 安装自定义插件
app.use(globalComponent)
app.use(ElementPlus, {
  locale: zhCn,
})
// 注册路由
app.use(router)
// 安装仓库
app.use(pinia)
app.mount('#app')
