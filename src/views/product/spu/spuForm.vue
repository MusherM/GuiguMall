<script setup lang="ts">
import { SpuData } from '@/api/product/spu/type'
import { ref } from 'vue'
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
// 子组件写一个方法
const initHasSpuData = async (spu: SpuData) => {
  // spu 即为父组件传递来的 SPU 对象(不完整)
  // 获取全部品牌数据
  let result: AllTradeMark = await reqAllTradeMark()
  allTradeMark.value = result.data
  // 获取某一个品牌旗下全部售卖商品的图片
  let result1: SpuHasImage = await reqSpuImageList(spu.id as number)
  imgList.value = result1.data
  // 获取已有的 SPU 销售属性的数据
  let result2: SaleAttrResponseData = await reqSpuHasSaleAttr(spu.id as number)
  saleAttr.value = result2.data
  // 获取整个项目全部 SPU 的销售属性
  let result3: HasSaleAttrResponseData = await reqAllSaleAttr()
  allSaleAttr.value = result3.data
}
defineExpose({ initHasSpuData })
</script>

<template>
  <el-form ref="form" label-width="auto">
    <el-form-item label="SPU 名称">
      <el-input placeholder="请输入 SPU 名称"></el-input>
    </el-form-item>
    <el-form-item label="SPU 品牌">
      <el-select style="width: 200px">
        <el-option>华为</el-option>
        <el-option>OPPO</el-option>
        <el-option>VIVO</el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="SPU 描述">
      <el-input placeholder="请输入描述" type="textarea"></el-input>
    </el-form-item>
    <el-form-item label="SPU 照片">
      <el-upload
        v-model:file-list="fileList"
        action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
      >
        <el-icon><Plus /></el-icon>
      </el-upload>

      <el-dialog v-model="dialogVisible">
        <img w-full :src="dialogImageUrl" alt="Preview Image" />
      </el-dialog>
    </el-form-item>
    <el-form-item label="SPU 销售属性">
      <!-- 展示销售属性的下拉菜单 -->
      <el-select style="width: 200px">
        <el-option>华为</el-option>
        <el-option>OPPO</el-option>
        <el-option>VIVO</el-option>
      </el-select>
      <el-button
        type="primary"
        size="default"
        icon="Plus"
        style="margin-left: 10px"
      >
        添加属性值
      </el-button>
      <!-- table 展示销售属性与属性值的地方 -->
      <el-table border style="margin: 10px 0px">
        <el-table-column
          type="index"
          label="序号"
          width="80px"
          align="center"
        ></el-table-column>
        <el-table-column label="销售属性名称" width="120px"></el-table-column>
        <el-table-column label="销售属性值"></el-table-column>
        <el-table-column label="操作" width="100px"></el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="default" @click="">保存</el-button>
      <el-button type="info" size="default" @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped lang="scss"></style>
