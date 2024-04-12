// 商品分类全局组件的仓库
import { reqC1, reqC2, reqC3 } from '@/api/product/attr'
import { CategoryResponseData } from '@/api/product/attr/type'
import { defineStore } from 'pinia'
import { CategoryState } from './types/type'

const useCategory = defineStore('Category', {
  state: (): CategoryState => {
    return {
      // 存储一级分类
      c1Arr: [],
      // 存储二级分类
      c2Arr: [],
      // 存储二级分类
      c3Arr: [],
      // 存储一级分类的ID
      c1Id: '',
      // 存储二级分类的ID
      c2Id: '',
      // 存储三级分类的ID
      c3Id: '',
    }
  },
  actions: {
    async getC1() {
      const result: CategoryResponseData = await reqC1()
      if (result.code == 200) {
        this.c1Arr = result.data
      }
    },
    async getC2() {
      const result: CategoryResponseData = await reqC2(this.c1Id as number)
      if (result.code == 200) {
        this.c2Arr = result.data
      }
    },
    async getC3() {
      const result: CategoryResponseData = await reqC3(this.c2Id as number)
      if (result.code == 200) {
        this.c3Arr = result.data
      }
    },
  },
  getters: {},
})

export default useCategory
