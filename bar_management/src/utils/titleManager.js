/**
 * @description 页面标题管理工具
 * 根据当前路由路径设置相应的页面标题
 */

// 页面标题映射表
const titleMap = {
  // 点餐相关页面
  '/ordering/qr': '扫码点餐',
  '/ordering/r': '机器人点餐',
  '/ordering/staff': '服务员点餐',
  '/ordering/success': '下单成功',
  '/ordering/product': '商品详情',
  '/ordering/confirm': '订单确认',
  
  // 管理后台页面
  '/admin/products': '商品管理',
  '/admin/products/add': '添加商品',
  '/admin/products/edit': '编辑商品',
  '/admin/orders': '订单管理',
  '/admin/orders/': '订单详情',
  
  // 其他页面
  '/login': '登录',
  '/': '酒吧点餐系统'
}

/**
 * 设置页面标题
 * @param {string} path - 当前路由路径
 * @param {object} route - 路由对象，可用于获取更多信息
 */
export function setDocumentTitle(path, route) {
  // 默认标题
  let title = '酒吧点餐系统'
  
  // 查找精确匹配的路径
  if (titleMap[path]) {
    title = titleMap[path]
  } else {
    // 查找前缀匹配的路径
    for (const key in titleMap) {
      if (path.startsWith(key)) {
        title = titleMap[key]
        break
      }
    }
    
    // 特殊处理：订单详情页
    if (path.match(/\/admin\/orders\/\d+/)) {
      title = '订单详情'
    }
    
    // 特殊处理：商品详情页
    if (path.match(/\/ordering\/product\/\d+/)) {
      title = '商品详情'
    }
  }
  
  // 设置文档标题
  document.title = title
}

/**
 * 初始化标题管理器
 * @param {object} router - Vue Router实例
 */
export function setupTitleManager(router) {
  router.afterEach((to) => {
    // 在路由变化后设置页面标题
    setDocumentTitle(to.path, to)
  })
}