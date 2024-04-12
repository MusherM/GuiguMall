import request from '@/utils/request'
import { AllTradeMark, HasSpuResponseData, SpuHasImage } from './type'

enum API {
  // 获取已有的spu数据
  HASSPU_URL = '/admin/product/',
  ALL_TRADEMARK_URL = 'admin/product/baseTrademark/getTrademarkList',
  // 获取某一个spu下全部售卖商品图片
  IMAGE_URL = 'admin/product/spuImageList/',
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

// 活泼去已有SPU下全部商品图片地址
export const reqSpuImageList = (spuId: number) =>
  request.get<any, SpuHasImage>(API.IMAGE_URL + spuId)
