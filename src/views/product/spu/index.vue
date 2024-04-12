<script setup lang="ts">
import { reqHasSpu } from '@/api/product/spu'
import { HasSpuResponseData, Records } from '@/api/product/spu/type'
import Category from '@/components/Category/index.vue'
import useCategory from '@/store/modules/category'
import { ref, watch } from 'vue'
import spuForm from './spuForm.vue'
import skuForm from './skuForm.vue'
// 场景编号
// 0： 显示已有SPU
// 1： 添加/修改已有的SPU
// 2： 添加 SKU
let scene = ref<number>(0)
// 分页器默认的页码
let pageNo = ref<number>(1)
let pageSize = ref<number>(3)
// 存储已有的spu总个数
let total = ref<number>(0)
const categoryStore = useCategory()
// 存储已有的spu数据
let records = ref<Records>([])
// 监听三级分类id的变化
watch(
  () => categoryStore.c3Id,
  () => {
    // 保证有c3Id
    if (!categoryStore.c3Id) return
    getHasSpu()
  },
)

// 用于获取三级分类下的已有spu
const getHasSpu = async (pager = 1) => {
  // 修改当前页码
  pageNo.value = pager
  let result: HasSpuResponseData = await reqHasSpu(
    pageNo.value,
    pageSize.value,
    categoryStore.c3Id,
  )
  if (result.code == 200) {
    records.value = result.data.records
    total.value = result.data.total
  }
}
// 分页器下拉菜单发生变化的时候出发
const changeSize = () => {
  getHasSpu()
}
// 添加SPU按钮的回调
const addSpu = () => {
  changeScene(1)
}
// 子组件spu绑定的自定义事件
const changeScene = (num: number) => {
  scene.value = num
}
</script>

<template>
  <Category :scene="scene"></Category>
  <el-card style="margin: 10px 0px">
    <div v-show="scene == 0">
      <el-button
        type="primary"
        size="default"
        icon="Plus"
        :disabled="!categoryStore.c3Id"
        @click="addSpu"
      >
        添加 SPU
      </el-button>
      <!-- 展示已有的spu数据 -->
      <el-table style="margin: 10px 0px" border :data="records">
        <el-table-column
          label="序号"
          type="index"
          align="center"
          width="80px"
        ></el-table-column>
        <el-table-column label="SPU 名称" prop="spuName"></el-table-column>
        <el-table-column
          label="SPU 描述"
          prop="description"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column label="SPU 操作">
          <template #="{ row, $index }">
            <el-button
              type="primary"
              size="small"
              @click="addSku"
              icon="Plus"
              title="添加 SKU"
            ></el-button>
            <el-button
              type="primary"
              size="small"
              @click="addSpu"
              icon="Edit"
              title="修改 SPU"
            ></el-button>
            <el-button
              type="primary"
              size="small"
              @click="addSpu"
              icon="View"
              title="查看 SKU 列表"
            ></el-button>
            <el-button
              type="primary"
              size="small"
              @click="addSpu"
              icon="Delete"
              title="删除 SPU"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination
        v-model:current-page="pageNo"
        v-model:page-size="pageSize"
        :page-sizes="[3, 5, 7, 9]"
        :background="true"
        layout="prev, pager, next, jumper, -> ,sizes, total"
        :total="total"
        @current-change="getHasSpu"
        @size-change="changeSize"
      />
    </div>
    <!-- 添加/修改 SPU 子组件 -->
    <spuForm v-show="scene == 1" @changeScene="changeScene"></spuForm>
    <!-- 添加 SKU 子组件 -->
    <skuForm v-show="scene == 2"></skuForm>
  </el-card>
</template>

<style scoped lang="scss"></style>
