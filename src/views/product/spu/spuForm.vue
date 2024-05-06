<script setup lang="ts">
import { SpuData } from '@/api/product/spu/type'
import { computed, ref } from 'vue'
import { SpuImage, SaleAttr, HasSaleAttr } from '../../../api/product/spu/type'
import {
  reqAllTradeMark,
  reqSpuImageList,
} from '../../../api/product/spu/index'
import {
  AllTradeMark,
  SpuHasImage,
  SaleAttrResponseData,
} from '../../../api/product/spu/type'
import {
  reqSpuHasSaleAttr,
  reqAllSaleAttr,
} from '../../../api/product/spu/index'
import {
  HasSaleAttrResponseData,
  Trademark,
} from '../../../api/product/spu/type'
import { ElMessage } from 'element-plus'

let $emit = defineEmits(['changeScene'])
// 点击取消按钮，通知父组件切换场景
const cancel = () => {
  $emit('changeScene', 0)
}
// 存储已有的 SPU 数据
let allTradeMark = ref<Trademark[]>([])
let imgList = ref<SpuImage[]>([])
let saleAttr = ref<SaleAttr[]>([])
let allSaleAttr = ref<HasSaleAttr[]>([])
// 存储已有的spu对象
let SpuParams = ref<SpuData>({
  category3Id: '', //收集三级分类的ID
  spuName: '', //SPU的名字
  description: '', //SPU的描述
  tmId: '', //品牌的ID
  spuImageList: [],
  spuSaleAttrList: [],
})
// 控制对话框的显示与隐藏
let dialogVisible = ref<boolean>(false)
// 存储预览的图片地址
let dialogImageUrl = ref<string>('')

// 子组件写一个方法
const initHasSpuData = async (spu: SpuData) => {
  SpuParams.value = spu
  // spu 即为父组件传递来的 SPU 对象(不完整)
  // 获取全部品牌数据
  let result: AllTradeMark = await reqAllTradeMark()
  allTradeMark.value = result.data
  // 获取某一个品牌旗下全部售卖商品的图片
  let result1: SpuHasImage = await reqSpuImageList(spu.id as number)
  imgList.value = result1.data.map((item) => {
    return {
      name: item.imgName,
      url: item.imgUrl,
    }
  })
  // 获取已有的 SPU 销售属性的数据
  let result2: SaleAttrResponseData = await reqSpuHasSaleAttr(spu.id as number)
  saleAttr.value = result2.data
  // 获取整个项目全部 SPU 的销售属性
  let result3: HasSaleAttrResponseData = await reqAllSaleAttr()
  allSaleAttr.value = result3.data
}
// 照片墙点击预览按钮的钩子
const handlePictureCardPreview = (file: any) => {
  // 对话框弹出
  dialogVisible.value = true
  dialogImageUrl.value = file.url
}
// 照片墙点击删除按钮的钩子
const handleRemove = () => {}
// 照片墙上传成功之前的钩子，约束文件的大小与类型
const handleUpload = (file: any) => {
  if (
    file.type == 'image/png' ||
    file.type == 'image/jpg' ||
    file.type == 'image/jpeg' ||
    file.type == 'image/gif'
  ) {
    if (file.size / 1024 / 1024 < 3) return true
    else {
      ElMessage({
        type: 'error',
        message: '上传的文件大小必须小于 3M',
      })
      return false
    }
  } else {
    ElMessage({
      type: 'error',
      message: '上传的文件必须是png/jpg/jpeg/gif',
    })
    return false
  }
}
// 计算出当前spu还未拥有的销售属性
let unSelectedSaleAttr = computed(() => {
  // 全部销售属性：颜色、版本、尺码
  // 已有的销售属性：颜色，版本
  let unSelectedAttr = allSaleAttr.value.filter((item) =>
    saleAttr.value.every((item1) => item.name != item1.saleAttrName),
  )
  return unSelectedAttr
})
// 将来收集还未选择的销售属性的ID与属性值的名字
let saleAttrIdAndValueName = ref<string>('')
// 添加销售属性的函数
const addSaleAttr = () => {}
defineExpose({ initHasSpuData })
</script>

<template>
  <el-form ref="form" label-width="auto">
    <el-form-item label="SPU 名称">
      <el-input
        placeholder="请输入 SPU 名称"
        v-model="SpuParams.spuName"
      ></el-input>
    </el-form-item>
    <el-form-item label="SPU 品牌">
      <el-select style="width: 200px" v-model="SpuParams.tmId">
        <el-option
          v-for="(item, index) in allTradeMark"
          :key="item.id"
          :label="item.tmName"
          :value="item.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="SPU 描述">
      <el-input
        placeholder="请输入描述"
        type="textarea"
        v-model="SpuParams.description"
      ></el-input>
    </el-form-item>
    <el-form-item label="SPU 照片">
      <!-- filelist展示默认图片 -->
      <el-upload
        v-model:file-list="imgList"
        action="/api/admin/product/fileUpload"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :before-upload="handleUpload"
      >
        <el-icon><Plus /></el-icon>
      </el-upload>

      <el-dialog v-model="dialogVisible">
        <img
          w-full
          :src="dialogImageUrl"
          alt="Preview Image"
          style="width: 100%"
        />
      </el-dialog>
    </el-form-item>
    <el-form-item label="SPU 销售属性">
      <!-- 展示销售属性的下拉菜单 -->
      <el-select
        style="width: 200px"
        :placeholder="
          unSelectedSaleAttr.length
            ? `还有${unSelectedSaleAttr.length}个属性未选择`
            : '无'
        "
        v-model="saleAttrIdAndValueName"
      >
        <el-option
          v-for="(item, index) in unSelectedSaleAttr"
          :key="item.id"
          :label="item.name"
          :value="`${item.id}:${item.name}`"
        ></el-option>
      </el-select>
      <el-button
        @click="addSaleAttr"
        :disabled="saleAttrIdAndValueName ? false : true"
        type="primary"
        size="default"
        icon="Plus"
        style="margin-left: 10px"
      >
        添加属性值
      </el-button>
      <!-- table 展示销售属性与属性值的地方 -->
      <el-table border style="margin: 10px 0px" :data="saleAttr">
        <el-table-column
          type="index"
          label="序号"
          width="80px"
          align="center"
        ></el-table-column>
        <el-table-column
          label="销售属性名称"
          width="120px"
          prop="saleAttrName"
        ></el-table-column>
        <el-table-column label="销售属性值">
          <!-- row：当前spu已有的销售属性对象 -->
          <template #="{ row, $index }">
            <el-tag
              v-for="(item, index) in row.spuSaleAttrValueList"
              :key="row.id"
              closable
              :disable-transitions="false"
              @close="handleClose(tag)"
              style="margin: 0px 5px"
            >
              {{ item.saleAttrValueName }}
            </el-tag>
            <el-button
              type="primary"
              size="small"
              icon="Plus"
              @click=""
            ></el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100px">
          <template #="{ row, $index }">
            <el-button
              type="danger"
              size="small"
              @click="saleAttr.splice($index, 1)"
              icon="Delete"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="default" @click="">保存</el-button>
      <el-button type="info" size="default" @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped lang="scss"></style>
