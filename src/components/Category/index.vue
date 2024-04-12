<script setup lang="ts">
import { onMounted } from 'vue'
import useCategory from '../../store/modules/category'
let categoryStore = useCategory()
// 通知仓库获取一级分类
const getC1 = () => {
  categoryStore.getC1()
}
// 一级分类下拉菜单的change事件
const handler = () => {
  // 清空二三级分类数据
  categoryStore.c2Id = ''
  categoryStore.c3Arr = []
  categoryStore.c3Id = ''
  categoryStore.getC2()
}
// 二级分类下拉菜单的change事件
const handler2 = () => {
  // 清空三级选中
  categoryStore.c3Id = ''
  categoryStore.getC3()
}
onMounted(() => {
  getC1()
})

// 接受父组件传递的scene场景数值
defineProps(['scene'])
</script>

<template>
  <el-card>
    <el-form :inline="true" class="flex-form">
      <el-form-item label="一级分类">
        <el-select
          v-model="categoryStore.c1Id"
          @change="handler"
          :disabled="!(scene == 0)"
        >
          <!-- label即为显示文字，value属性即为select菜单选择属性 -->
          <el-option
            v-for="(c1, index) in categoryStore.c1Arr"
            :key="c1.id"
            :label="c1.name"
            :value="c1.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          v-model="categoryStore.c2Id"
          @change="handler2"
          :disabled="!(scene == 0)"
        >
          <el-option
            v-for="(c2, index) in categoryStore.c2Arr"
            :key="c2.id"
            :label="c2.name"
            :value="c2.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select v-model="categoryStore.c3Id" :disabled="!(scene == 0)">
          <el-option
            v-for="(c3, index) in categoryStore.c3Arr"
            :key="c3.id"
            :label="c3.name"
            :value="c3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<style scoped lang="scss">
.flex-form {
  display: flex;
  justify-content: space-between;
  .el-form-item {
    flex: 1;
  }
}
</style>
