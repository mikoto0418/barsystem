import request from '@/utils/request'

// 获取订单列表
export const getOrders = () => {
  return request({
    url: '/orders/',
    method: 'get'
  }).then(response => {
    console.log('原始API响应:', response)
    // 如果响应是对象且包含 results，则返回 results
    if (response && response.results) {
      return response.results
    }
    // 如果响应本身就是数组，直接返回
    if (Array.isArray(response)) {
      return response
    }
    // 默认返回空数组
    return []
  })
}

// 获取订单详情
export const getOrder = (id) => {
  return request({
    url: `/orders/${id}/`,
    method: 'get'
  })
}

// 创建订单
export const createOrder = (data) => {
  // 确保数据格式正确
  const orderData = {
    order_method: data.order_method,
    table_number: data.table_number || 'ROBOT', // 为机器人点餐提供默认桌号
    number_of_diners: parseInt(data.number_of_diners) || 1, // 默认就餐人数为1
    total_amount: parseFloat(data.total_amount),
    status: 'PENDING',
    details: data.details.map(item => ({
      product: parseInt(item.product),
      quantity: parseInt(item.quantity),
      unit_price: parseFloat(item.unit_price),
      temperature_choice: item.temperature_choice
    }))
  }

  if (data.robot_id) {
    orderData.robot_id = data.robot_id
    orderData.table_number = `ROBOT_${data.robot_id}` // 为机器人点餐设置特殊桌号格式
  }

  console.log('发送到后端的订单数据:', orderData)
  
  return request({
    url: '/orders/',
    method: 'post',
    data: orderData
  })
}

// 取消订单
export const cancelOrder = (id) => {
  return request({
    url: `/orders/${id}/cancel_order/`,
    method: 'post'
  })
}

// 完成订单
export const completeOrder = (id) => {
  return request({
    url: `/orders/${id}/complete_order/`,
    method: 'post'
  })
}

// 删除订单
export const deleteOrder = (id) => {
  return request({
    url: `/orders/${id}/`,
    method: 'delete'
  })
} 