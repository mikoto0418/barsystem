import request from '@/utils/request'

// 获取商品列表
export const getProducts = (params) => {
  return request({
    url: '/products/',
    method: 'get',
    params
  })
}

// 获取商品详情
export const getProduct = (id) => {
  return request({
    url: `/products/${id}/`,
    method: 'get'
  }).then(response => {
    // 确保数字字段的类型正确
    return {
      ...response,
      price: Number(response.price),
      alcohol_content: Number(response.alcohol_content)
    }
  })
}

// 创建商品
export const createProduct = (data) => {
  return request({
    url: '/products/',
    method: 'post',
    data
  })
}

// 更新商品
export const updateProduct = (id, data) => {
  return request({
    url: `/products/${id}/`,
    method: 'put',
    data
  })
}

// 删除商品
export const deleteProduct = (id) => {
  return request({
    url: `/products/${id}/`,
    method: 'delete'
  })
}

// 获取商品分类列表
export function getCategories() {
  return request({
    url: '/products/categories/',
    method: 'get'
  })
}

// 按分类获取商品
export function getProductsByCategory(category) {
  return request({
    url: '/products/',
    method: 'get',
    params: { category }
  })
} 