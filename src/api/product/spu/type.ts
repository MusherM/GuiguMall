// 服务器全部接口返回的数据类型
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// spu数据的ts类型
export interface SpuData {
  id?: number
  spuName: string
  description: string
  category3Id: number | string
  tmId: number | string
  spuSaleAttrList: null | SaleAttr[]
  spuImageList: null | SpuImage[]
}

// 数组包含元素都是已有的spu数据的类型
export type Records = SpuData[]
// 定义获取已有的spu接口返回的数据的类型
export interface HasSpuResponseData extends ResponseData {
  data: {
    records: Records
    total: number
    size: number
    current: number
    searchCount: boolean
    pages: number
  }
}

// 所有品牌数据的ts类型
export interface Trademark {
  id: number
  tmName: string
  logoUrl: string
}

// 品牌接口返回的数据类型
export interface AllTradeMark extends ResponseData {
  data: Trademark[]
}

// 商品图片的ts类型
export interface SpuImage {
  id?: number
  imgName?: string
  imgUrl?: string
  name?: string
  url?: string
  createTime?: string
  updateTime?: string
  spuId?: number
}

// 已有的spu的照片墙数据返回类型
export interface SpuHasImage extends ResponseData {
  data: SpuImage[]
}

// 商品销售属性的ts类型
export interface SaleAttrValue {
  id?: number
  createTime?: null
  updateTime?: null
  spuId?: number
  baseSaleAttrId: number
  saleAttrValueName: string
  saleAttrName?: string
  ischecked?: null
}

// 销售属性对象类型
export interface SaleAttr {
  id?: number
  createTime?: null
  updateTime?: null
  spuId?: number
  baseSaleAttrId: number
  saleAttrName: string
  spuSaleAttrValueList: SaleAttrValue[]
}

// SPU 已有的销售属性接口返回的类型
export interface SaleAttrResponseData extends ResponseData {
  data: SaleAttr[]
}

// 已有的全部SPU的返回数据的类型
export interface HasSaleAttr {
  id: number
  name: string
}

export interface HasSaleAttrResponseData extends ResponseData {
  data: HasSaleAttr[]
}
