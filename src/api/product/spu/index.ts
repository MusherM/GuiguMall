import request from '@/utils/request'
import {
  AllTradeMark,
  HasSaleAttrResponseData,
  HasSpuResponseData,
  SaleAttrResponseData,
  SpuData,
  SpuHasImage,
} from './type'

enum API {
  // 获取已有的spu数据
  HASSPU_URL = '/admin/product/',
  ALL_TRADEMARK_URL = '/admin/product/baseTrademark/getTrademarkList/',
  // 获取某一个spu下全部售卖商品图片
  IMAGE_URL = '/admin/product/spuImageList/',
  // 获取spu下全部已有的销售属性接口地址
  SPU_HAS_SALE_ATTR_URL = '/admin/product/spuSaleAttrList/',
  // 获取整个项目全部的销售属性
  ALL_SALE_ATTR_URL = '/admin/product/baseSaleAttrList',
  // 追加一个新的 SPU
  ADDSPU_URL = 'admin/product/saveSpuInfo',
  // 更新已有的 SPU
  UPDATESPU_URL = 'admin/product/updateSpuInfo',
}
export const reqHasSpu = (
  page: number,
  limit: number,
  category3Id: number | string,
) =>
  request.get<any, HasSpuResponseData>(
    API.HASSPU_URL + `${page}/${limit}?category3Id=${category3Id}`,
  )

// 获取全部的spu品牌数据
export const reqAllTradeMark = () =>
  request.get<any, AllTradeMark>(API.ALL_TRADEMARK_URL)

// 获取已有SPU下全部商品图片地址
export const reqSpuImageList = (spuId: number) =>
  request.get<any, SpuHasImage>(API.IMAGE_URL + spuId)

// 获取已有的SPU拥有多少个销售属性
export const reqSpuHasSaleAttr = (spuId: number) =>
  request.get<any, SaleAttrResponseData>(API.SPU_HAS_SALE_ATTR_URL + spuId)

// 获取全部销售属性
export const reqAllSaleAttr = () =>
  request.get<any, HasSaleAttrResponseData>(API.ALL_SALE_ATTR_URL)

// 添加一个新的 SPU
// 更新一个已有的 SPU
// data: 新增的 SPU/已有的 SPU 对象
export const reqAddOrUpdateSpu = (data: SpuData) => {
  // 有id，说明是更改
  if (data.id) {
    return request.post<any, any>(API.UPDATESPU_URL, data)
  } else {
    return request.post<any, any>(API.ADDSPU_URL, data)
  }
}
