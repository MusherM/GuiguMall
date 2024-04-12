<script setup lang="ts">
import { onMounted, ref, reactive, nextTick } from 'vue'
import {
  Records,
  Trademark,
  TrademarkResponseData,
} from '@/api/product/trademark/type'
import { UploadProps, ElMessage } from 'element-plus'
import { reqDeleteTrademark } from '../../../api/product/trademark/index'
import {
  reqHasTrademark,
  reqAddOrUpdateTrademark,
} from '../../../api/product/trademark/index'
// 当前页码
let pageNo = ref<number>(1)
// 每页数据的条数
let limit = ref<number>(3)
// 存储已有品牌数据的总数
let total = ref<number>(0)
// 存储已有品牌数据
let trademarkArr = ref<Records>([])

// 获取el-form组件实例
let formRef = ref()

// 获取已有品牌的接口，封装为函数：在任何情况下想获取数据，调用此函数即可
const getHasTrademark = async (pager = 1) => {
  pageNo.value = pager
  let result: TrademarkResponseData = await reqHasTrademark(
    pageNo.value,
    limit.value,
  )
  if (result.code == 200) {
    total.value = result.data.total
    trademarkArr.value = result.data.records
  }
}
// 组件挂载完毕，发一次请求，获取默认第一页，一页3个已有品牌数据
onMounted(() => {
  getHasTrademark()
})

// 对于当前页码发生改变的回调函数，组件pagination父组件已经回传了页码
// const changePageNo = () => {
//   // 当前页码发生变化的时候，再次发请求，获取对应的已有品牌的数据展示
//   getHasTrademark()
// }

// 当下拉菜单发生变化的时候会触发此函数
const sizeChange = () => {
  // 页码发生变化时，页码归1
  getHasTrademark()
}
// 控制对话框的显示与隐藏
let dialogFormVisible = ref<boolean>(false)
// 定义收集新增品牌数据
let trademarkParams = reactive<Trademark>({
  tmName: '',
  logoUrl: '',
})
// 添加品牌按钮的回调
const addTrademark = () => {
  // 收集的数据清空
  trademarkParams.tmName = ''
  trademarkParams.logoUrl = ''
  trademarkParams.id = 0
  dialogFormVisible.value = true
  // 清空验证信息，使用问号来解决刚开始没有formRef的问题
  // formRef.value?.clearValidate('tmName')
  nextTick(() => {
    formRef.value.clearValidate('tmName')
    formRef.value.clearValidate('logoUrl')
  })
}
// 修改已有品牌的回调
// row：当前已有的品牌
const updateTrademark = (row: Trademark) => {
  dialogFormVisible.value = true
  nextTick(() => {
    formRef.value.clearValidate('tmName')
    formRef.value.clearValidate('logoUrl')
  })
  // trademarkParams.id = row.id
  // // 展示已有品牌的数据
  // trademarkParams.tmName = row.tmName
  // trademarkParams.logoUrl = row.logoUrl
  // ES6 语法合并对象
  Object.assign(trademarkParams, row)
}
// 对话框底部取消按钮
const cancel = () => {
  dialogFormVisible.value = false
}
// 对话框底部确定按钮
const confirm = async () => {
  // 在发请求之前，对表单进行校验
  // 调用方法进行全部表单项校验，然后执行后面的语法，如果失败后面的语句不会执行
  await formRef.value.validate()
  let result: any = await reqAddOrUpdateTrademark(trademarkParams)
  if (result.code == 200) {
    // 添加品牌成功
    // 关闭对话框
    dialogFormVisible.value = false
    // 弹出成功消息
    ElMessage({
      type: 'success',
      message: trademarkParams.id ? '修改品牌成功' : '添加品牌成功',
    })
    // 更新
    getHasTrademark(trademarkParams.id ? pageNo.value : 1)
  } else {
    // 添加品牌失败
    // 关闭对话框
    dialogFormVisible.value = false
    ElMessage({
      type: 'error',
      message: trademarkParams.id ? '修改品牌失败' : '添加品牌失败',
    })
  }
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  // 要求：文件的格式必须是jpg,png,gif 4M
  if (
    rawFile.type == 'image/png' ||
    rawFile.type == 'image/jpeg' ||
    rawFile.type == 'image/gif'
  ) {
    if (rawFile.size / 1024 / 1024 < 4) {
      return true
    } else {
      ElMessage({
        type: 'error',
        message: '上传的文件大小必须小于4M',
      })
      return false
    }
  } else {
    ElMessage({
      type: 'error',
      message: '上传的类型必须是PNG/JPEG/GIF',
    })
    return false
  }
}
// 图片上传成功的钩子
const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response,
  uploadFile,
) => {
  // response 即为当前这次上传图片post请求返回的数据
  // 收集上传图片的地址
  trademarkParams.logoUrl = response.data
  // 图片上传成功，应该清除校验结果
  formRef.value.clearValidate('logoUrl')
}
// 品牌校验自定义规则
const validatorTmName = (rule: any, value: any, callBack: any) => {
  // 自定义校验规则
  if (value.trim().length >= 2) {
    callBack()
  } else {
    callBack(new Error('品牌名称位数大于等于 2 位'))
  }
}
// logo 自定义校验规则
const validatorLogoUrl = (rule: any, value: any, callBack: any) => {
  if (value) {
    callBack()
  } else {
    callBack(new Error('LOGO 图片需要上传'))
  }
}
// 表单规则校验对象
const rules = {
  tmName: [
    // required 这个字段务必要校验
    {
      required: true,
      trigger: 'blur',
      validator: validatorTmName,
    },
  ],
  logoUrl: [{ required: true, validator: validatorLogoUrl }],
}
// 气泡确认框的确认回调
const removeTrademark = async (id: number) => {
  let result = await reqDeleteTrademark(id)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除品牌成功',
    })
    // 再次获取已有品牌的数据
    getHasTrademark(
      trademarkArr.value.length > 1 ? pageNo.value : pageNo.value - 1,
    )
  } else {
    ElMessage({
      type: 'error',
      message: '删除品牌失败',
    })
  }
}
</script>

<template>
  <div>
    <el-card class="box-card">
      <!-- 卡片顶部的添加品牌按钮 -->
      <el-button
        type="primary"
        size="default"
        icon="plus"
        @click="addTrademark"
      >
        添加品牌
      </el-button>
      <!-- 表格组件：用于展示已有的品牌数据 -->
      <!-- 
        table
        * border 可以设置表格纵向是否有边框
        table-column
        * lable: 某一个列表
        * width: 宽度
        * align: 对齐方式
      -->
      <el-table style="margin: 10px 0px" border :data="trademarkArr">
        <el-table-column
          label="序号"
          width="80px"
          align="center"
          type="index"
        ></el-table-column>
        <el-table-column label="品牌名称">
          <template #="{ row, $index }">
            <pre style="color: brown">{{ row.tmName }}</pre>
          </template>
        </el-table-column>
        <el-table-column label="品牌LOGO">
          <template #="{ row, $index }">
            <img
              :src="row.logoUrl"
              alt="找不到图片！"
              style="width: 100px; height: 100px"
            />
          </template>
        </el-table-column>
        <el-table-column label="品牌操作">
          <template #="{ row, $index }">
            <el-button
              type="primary"
              size="small"
              icon="edit"
              @click="updateTrademark(row)"
            ></el-button>
            <el-popconfirm
              :title="`您确定要删除${row.tmName}吗？`"
              width="250px"
              icon="Delete"
              @confirm="removeTrademark(row.id)"
            >
              <template #reference>
                <el-button type="danger" size="small" icon="delete"></el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器组件
      pagination
        * v-model: current-page 当前页码
        * v-model: page-size 每页显示数据的条数
        * v-model: page-sizes 用于设置下拉菜单的数据
        * small: 是否使用小型分页器
        * background 设置分页器按钮背景颜色
        * layout 设置分页器6个子组件布局
      -->
      <el-pagination
        v-model:current-page="pageNo"
        v-model:page-size="limit"
        :page-sizes="[3, 5, 7, 9]"
        :background="true"
        layout="prev, pager, next, jumper, ->, sizes, total"
        :total="400"
        :pager-count="9"
        @current-change="getHasTrademark"
        @size-change="sizeChange"
      />
    </el-card>
    <!-- 对话框组件：添加品牌和修改品牌时使用结构 -->
    <!-- v-model：属性控制对话框的显示与隐藏 true 显示 false 隐藏 -->
    <el-dialog
      v-model="dialogFormVisible"
      :title="trademarkParams.id ? '修改品牌' : '添加品牌'"
    >
      <el-form
        style="width: 80%"
        :model="trademarkParams"
        :rules="rules"
        ref="formRef"
      >
        <el-form-item label="品牌名称" label-width="80px" prop="tmName">
          <el-input
            placeholder="请您输入品牌名称"
            v-model="trademarkParams.tmName"
          ></el-input>
        </el-form-item>
        <el-form-item label="品牌 LOGO" label-width="80px" prop="logoUrl">
          <!-- upload组件属性：action图片上传路径书写，需要带/api -->
          <el-upload
            class="avatar-uploader"
            action="/api/admin/product/fileUpload"
            :show-file-list="true"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="trademarkParams.logoUrl"
              :src="trademarkParams.logoUrl"
              class="avatar"
            />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <!-- 具名插槽：footer -->
      <template #footer>
        <el-button type="primary" size="default" @click="cancel">
          取消
        </el-button>
        <el-button type="primary" size="default" @click="confirm">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
