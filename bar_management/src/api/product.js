/**
 * @description 商品相关的API接口封装
 * 包含商品的增删改查等基本操作
 */
import request from '@/utils/request'

/**
 * 获取商品列表
 * @param {Object} params - 查询参数
 * @param {number} [params.page] - 页码
 * @param {number} [params.page_size] - 每页数量
 * @param {string} [params.category] - 商品分类
 * @returns {Promise<Object>} 返回商品列表及分页信息
 */
export const getProducts = (params) => {
  return request({
    url: '/products/',
    method: 'get',
    params
  })
}

/**
 * 获取商品详情
 * @param {string|number} id - 商品ID
 * @returns {Promise<Object>} 返回商品详细信息
 */
export const getProduct = (id) => {
  return request({
    url: `/products/${id}/`,
    method: 'get'
  }).then(response => {
    // 确保数字字段的类型正确
    return {
      ...response,
      price: Number(response.price || 0),
      alcohol_content: Number(response.alcohol_content || 0)
    }
  }).catch(error => {
    console.error('获取商品详情失败:', error)
    throw error
  })
}

/**
 * 创建新商品
 * @param {Object} data - 商品数据
 * @param {string} data.name - 商品名称
 * @param {number} data.price - 商品价格
 * @param {string} data.category - 商品分类
 * @param {number} data.alcohol_content - 酒精含量
 * @param {string} [data.description] - 商品描述
 * @param {File} [data.image] - 商品图片
 * @returns {Promise<Object>} 返回创建的商品信息
 */
export const createProduct = (data) => {
  return request({
    url: '/products/',
    method: 'post',
    data
  })
}

/**
 * 更新商品信息
 * @param {string|number} id - 商品ID
 * @param {Object} data - 更新的商品数据
 * @returns {Promise<Object>} 返回更新后的商品信息
 */
export const updateProduct = (id, data) => {
  return request({
    url: `/products/${id}/`,
    method: 'put',
    data
  })
}

/**
 * 删除商品
 * @param {string|number} id - 商品ID
 * @returns {Promise<void>} 返回空Promise
 */
export const deleteProduct = (id) => {
  return request({
    url: `/products/${id}/`,
    method: 'delete'
  })
}

// 获取商品分类列表
export function getCategories() {
  // 由于后端API '/products/categories/' 不存在，我们直接返回本地存储的类别
  // 或者使用默认类别，避免404错误
  return new Promise((resolve) => {
    const savedCategories = localStorage.getItem('productCategories')
    if (savedCategories) {
      resolve(JSON.parse(savedCategories))
    } else {
      // 返回默认类别
      resolve([
        { label: '白酒', value: 'BAIJIU' },
        { label: '红酒', value: 'RED_WINE' },
        { label: '啤酒', value: 'BEER' },
        { label: '洋酒', value: 'FOREIGN' }
      ])
    }
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

/**
 * 上传商品图片
 * @param {number} productId - 商品ID
 * @param {File} file - 图片文件
 * @returns {Promise<Object>} 返回上传结果，包含图片URL
 */
export const uploadProductImage = (productId, file) => {
  const formData = new FormData()
  formData.append('product_id', productId)
  formData.append('file', file)
  
  return request({
    url: '/products/upload-image/',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

























































































































//