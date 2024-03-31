// 引入项目中的全部组件
import SvgIcon from '@/components/SvgIcon/index.vue'
import Pagination from '@/components/Pagination/index.vue'
import { App } from 'vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 全局对象
const allGlobalComponent = { SvgIcon, Pagination }
// 对外暴露插件对象
export default {
  // 务必叫install方法
  install(app: App<Element>) {
    // 注册项目全部的全局组件
    Object.keys(allGlobalComponent).forEach((key) => {
      app.component(
        key,
        allGlobalComponent[key as keyof typeof allGlobalComponent],
      )
    })
    // 将element-plus的图标注册为全局组件
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component)
    }
  },
}
