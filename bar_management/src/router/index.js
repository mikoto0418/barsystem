/**
 * @description 路由配置文件
 * 定义了应用的所有路由规则，包括：
 * 1. 公开访问的点餐相关路由
 * 2. 需要登录的管理页面路由
 * 3. 登录页面和404错误页
 * 4. 路由守卫实现登录验证
 */

// 导入路由创建函数和布局组件
import { createRouter, createWebHistory } from 'vue-router'
import BlankLayout from '@/layout/BlankLayout.vue'
import AdminLayout from '@/layout/AdminLayout.vue'
import OrderList from '@/views/order/OrderList.vue'
import OrderDetail from '@/views/order/OrderDetail.vue'
import ProductDetail from '@/views/ordering/ProductDetail.vue'

// 路由配置数组
const routes = [
  // 公开访问的点餐相关路由
  {
    path: '/ordering',
    component: BlankLayout,
    children: [
      {
        path: 'qr',
        name: 'qr-ordering',
        component: () => import('@/views/ordering/QRCodeEntry.vue') // 扫码点餐入口
      },
      {
        path: 'r/:id',
        name: 'robot-ordering',
        component: () => import('@/views/ordering/RobotEntry.vue') // 机器人点餐入口
      },
      {
        path: 'staff',
        name: 'staff-ordering',
        component: () => import('@/views/ordering/StaffEntry.vue') // 服务员点餐入口
      },
      {
        path: 'success',
        name: 'order-success',
        component: () => import('@/views/ordering/OrderSuccess.vue') // 下单成功页
      },
      {
        path: 'product/:id',
        name: 'ordering-product-detail',
        component: ProductDetail, // 商品详情页
        props: true
      },
      {
        path: 'confirm',
        name: 'order-confirm',
        component: () => import('@/views/ordering/OrderConfirm.vue') // 订单确认页
      }
    ]
  },
  
  // 需要登录的管理页面路由
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true }, // 添加需要认证的元信息
    children: [
      {
        path: 'products',
        name: 'product-list',
        component: () => import('@/views/product/ProductList.vue') // 商品列表页
      },
      {
        path: 'products/add',
        name: 'product-add',
        component: () => import('@/views/product/ProductEdit.vue') // 商品添加页
      },
      {
        path: 'products/edit/:id',
        name: 'product-edit',
        component: () => import('@/views/product/ProductEdit.vue') // 商品编辑页
      },
      {
        path: 'orders',
        name: 'order-list',
        component: OrderList // 订单列表页
      },
      {
        path: 'orders/:id',
        name: 'order-detail',
        component: OrderDetail // 订单详情页
      }
    ]
  },
  
  // 登录页面路由
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/LoginPage.vue')
  },
  
  // 根路径重定向到扫码点餐页面
  {
    path: '/',
    redirect: '/ordering/qr'
  },
  
  // 404错误页面路由
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/error/404.vue')
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes
})

/**
 * 全局路由守卫
 * 在进入需要登录的路由前检查是否已经登录
 * 如果未登录，则重定向到登录页面
 */
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const token = localStorage.getItem('token')
    if (!token) {
      next({
        path: '/login',
        query: { redirect: to.fullPath } // 保存原目标路径
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router