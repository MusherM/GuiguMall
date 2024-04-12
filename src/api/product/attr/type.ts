// 分类相关数据的ts类型
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

export interface CategoryObj {
  id: number | string
  name: string
  category1Id?: number
  category2Id?: number
}

// 响应的分类接口返回数据的类型
export interface CategoryResponseData extends ResponseData {
  data: CategoryObj[]
}

// 属性与属性值的ts类型
// 属性值对象的ts类型
export interface AttrValue {
  id?: number
  valueName: string
  attrId?: number
  flag?: boolean
}

// 存储每个属性值的数组
export type AttrValueList = AttrValue[]

// 属性对象
export interface Attr {
  id?: number
  attrName: string
  attrValueList: AttrValueList
  categoryId: number | string
  categoryLevel: number
}

// 存储属性对象数组的类型
export type AttrList = Attr[]

// 属性接口返回的数据类型
export interface AttrResponseData extends ResponseData {
  data: AttrList
}
