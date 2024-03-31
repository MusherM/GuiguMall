// 关于layout组件相关的仓库

import { defineStore } from 'pinia'

let useLayoutSettingStore = defineStore('SettingStore', {
  state: () => {
    return {
      fold: false, // 控制折叠效果
      refresh: false, // 控制刷新效果
    }
  },
})

export default useLayoutSettingStore
