import request from '@/utils/request'
import { HasSpuResponseData } from './type'

enum API {
  // 获取已有的spu数据
  HASSPU_URL = '/admin/product/',
}
export const reqHasSpu = (
  page: number,
  limit: number,
  category3Id: number | string,
) =>
  request.get<any, HasSpuResponseData>(
    API.HASSPU_URL + `${page}/${limit}?category3Id=${category3Id}`,
  )
