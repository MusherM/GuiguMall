<script setup lang="ts">
import { reqAttr } from '@/api/product/attr'
import useCategory from '@/store/modules/category'
import { watch, ref, reactive, nextTick, onBeforeUnmount } from 'vue'
import {
  reqAddOrUpdateAttr,
  reqRemoveAttr,
} from '../../../api/product/attr/index'
import { ElMessage } from 'element-plus'
import {
  AttrResponseData,
  Attr,
  AttrValue,
} from '../../../api/product/attr/type'
const categoryStore = useCategory()
// 存储已有的属性值
let attrList = ref<Attr[]>([])
// 定义卡片内容切换对象
let scene = ref<number>(0) // scene=0，显示table，1显示添加
// 收集新增属性的数据
let attrParams = reactive<Attr>({
  attrName: '',
  attrValueList: [],
  categoryId: '',
  categoryLevel: 3,
})
// 准备一个数组。将来存储对应的组件实例el-input
let inputArr = ref<any>([])

// 监听三级分类Id的变化，确定了就发请求获取属性
watch(
  () => categoryStore.c3Id,
  () => {
    // 清空上一次的数据
    attrList.value = []
    // 保证三级分类确定了再请求
    if (!categoryStore.c3Id) return
    getAttr()
  },
)

// 获取已有的属性
const getAttr = async () => {
  // 获取分类的id
  const { c1Id, c2Id, c3Id } = categoryStore
  const result: AttrResponseData = await reqAttr(c1Id, c2Id, c3Id)
  if (result.code == 200) {
    attrList.value = result.data
  }
}

// 添加属性按钮的回调
const addAttr = () => {
  // 每次点击，先清空数据
  Object.assign(attrParams, {
    attrName: '',
    attrValueList: [],
    categoryId: categoryStore.c3Id,
    categoryLevel: 3,
  })
  // 切换为修改属性的结构
  scene.value = 1
}
// table中修改已有属性按钮的回调
const updateAttr = (row: Attr) => {
  scene.value = 1
  // 将已有的属性对象赋值给attrParams
  Object.assign(attrParams, JSON.parse(JSON.stringify(row)))
}
// 取消按钮的回调
const cancel = () => {
  scene.value = 0
}

// 添加属性值按钮的回调
const addAttrValue = () => {
  attrParams.attrValueList.push({
    valueName: '',
    flag: true, // 控制每一个属性值的编辑模式与查看模式的切换
  })
  // 获取最后的el-input组件
  nextTick(() => {
    inputArr.value[inputArr.value.length - 1].focus()
  })
}
// 保存按钮的回调
const save = async () => {
  // 发请求
  let result = await reqAddOrUpdateAttr(attrParams)
  if (result.code == 200) {
    // 切换场景
    scene.value = 0
    // 获取全部已有的属性与属性值
    getAttr()
    // 提示信息
    ElMessage({
      type: 'success',
      message: attrParams.id ? '修改成功' : '添加成功',
    })
  } else {
    ElMessage({
      type: 'error',
      message: attrParams.id ? '修改失败' : '添加失败',
    })
  }
}
// 属性值表单失去焦点的回调
const toLook = (row: AttrValue, $index: number) => {
  // 非法情况判断:值为空
  if (row.valueName.trim() == '') {
    // 删除掉对应属性值为空的元素
    attrParams.attrValueList.splice($index, 1)
    // 提示信息
    ElMessage({
      type: 'error',
      message: '属性值不能为空',
    })
    return
  }
  // 非法情况判断：重复值
  const repeat = attrParams.attrValueList.some((item) => {
    // 切记把当前的元素排除出去
    if (item != row) {
      return item.valueName === row.valueName
    }
  })
  // console.log(repeat)
  if (repeat) {
    // 删除掉对应属性值为空的元素
    attrParams.attrValueList.splice($index, 1)
    // 提示信息
    ElMessage({
      type: 'error',
      message: '属性值不能重复',
    })
    return
  }
  row.flag = false
}
// 切换为编辑模式的回调
const toEdit = (row: AttrValue, $index: number) => {
  row.flag = true
  // 点击时input元素才出来，需要等一个tick再处理
  nextTick(() => inputArr.value[$index].focus())
}
// 删除某个已有的属性的方法回调
const deleteAttr = async (attrId: number) => {
  let result: any = await reqRemoveAttr(attrId)
  // 删除成功
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    getAttr()
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败',
    })
  }
}
// 路由组件卸载的时候清空pinia仓库
onBeforeUnmount(() => {
  categoryStore.$reset()
})
</script>

<template>
  <!-- 三级分类全局组件 -->
  <Category :scene="scene" />
  <el-card style="margin: 10px 0px">
    <div v-show="scene == 0">
      <el-button
        type="primary"
        size="default"
        icon="Plus"
        :disabled="categoryStore.c3Id ? false : true"
        @click="addAttr"
      >
        添加属性
      </el-button>
      <el-table border style="margin: 10px 0px" :data="attrList">
        <el-table-column
          label="序号"
          type="index"
          align="center"
          width="80px"
        ></el-table-column>
        <el-table-column
          label="属性名称"
          width="120px"
          prop="attrName"
        ></el-table-column>
        <el-table-column label="属性值名称">
          <template #="{ row, $index }">
            <el-tag
              v-for="(item, index) in row.attrValueList"
              :key="item.id"
              style="margin: 5px"
            >
              {{ item.valueName }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120px">
          <template #="{ row, $index }">
            <el-button
              type="primary"
              size="small"
              @click="updateAttr(row)"
              icon="Edit"
            ></el-button>
            <el-popconfirm
              :title="`确定要删除${row.attrName}吗`"
              width="200px"
              @confirm="deleteAttr(row.id)"
            >
              <template #reference>
                <el-button type="danger" size="small" icon="Delete"></el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-show="scene == 1">
      <!-- 展示添加属性与修改属性的结构 -->
      <el-form :inline="true">
        <el-form-item label="属性名称">
          <el-input
            placeholder="请输入属性名称"
            v-model="attrParams.attrName"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-button
        type="primary"
        size="default"
        icon="Plus"
        :disabled="attrParams.attrName ? false : true"
        @click="addAttrValue"
      >
        添加属性值
      </el-button>
      <el-button type="info" size="default" @click="cancel">取消</el-button>
      <el-table
        border
        style="margin: 10px 0px"
        :data="attrParams.attrValueList"
      >
        <el-table-column
          width="80px"
          type="index"
          align="center"
          label="序号"
        ></el-table-column>
        <el-table-column label="属性值的名称">
          <!-- row即为当前的属性值对象 -->
          <template #="{ row, $index }">
            <el-input
              :ref="(vc: any) => (inputArr[$index] = vc)"
              size="small"
              placeholder="请输入属性值"
              v-model="row.valueName"
              v-if="row.flag"
              @blur="toLook(row, $index)"
            ></el-input>
            <div v-else @click="toEdit(row, $index)">{{ row.valueName }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #="{ row, $index }">
            <el-button
              type="danger"
              size="small"
              icon="Delete"
              @click="() => attrParams.attrValueList.splice($index, 1)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button
        type="primary"
        size="default"
        @click="save"
        :disabled="!(attrParams.attrValueList.length > 0)"
      >
        保存
      </el-button>
      <el-button type="info" size="default" @click="cancel">取消</el-button>
    </div>
  </el-card>
</template>

<style scoped lang="scss"></style>
