// 购物车本地存储的key前缀
const CART_KEY_PREFIX = 'bar_cart_'

// 获取购物车存储key
const getCartKey = (method, tableNumber) => {
  return `${CART_KEY_PREFIX}${method}_${tableNumber}`
}

// 获取购物车数据
export const getCartItems = (method, tableNumber) => {
  const key = getCartKey(method, tableNumber)
  const items = localStorage.getItem(key)
  return items ? JSON.parse(items) : []
}

// 保存购物车数据
export const saveCartItems = (method, tableNumber, items) => {
  const key = getCartKey(method, tableNumber)
  localStorage.setItem(key, JSON.stringify(items))
}

// 清空指定购物车
export const clearCart = (method, tableNumber) => {
  const key = getCartKey(method, tableNumber)
  localStorage.removeItem(key)
}

// 清除所有购物车数据
export const clearAllCarts = () => {
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith(CART_KEY_PREFIX)) {
      localStorage.removeItem(key)
    }
  })
} 