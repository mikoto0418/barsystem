import { createRouter, createWebHistory } from 'vue-router'
import BlankLayout from '@/layout/BlankLayout.vue'
import AdminLayout from '@/layout/AdminLayout.vue'
import OrderList from '@/views/order/OrderList.vue'
import OrderDetail from '@/views/order/OrderDetail.vue'
import ProductDetail from '@/views/ordering/ProductDetail.vue'

const routes = [
  // 公开访问的点餐相关路由
  {
    path: '/ordering',
    component: BlankLayout,
    children: [
      {
        path: 'qr',
        name: 'qr-ordering',
        component: () => import('@/views/ordering/QRCodeEntry.vue')
      },
      {
        path: 'r/:id',
        name: 'robot-ordering',
        component: () => import('@/views/ordering/RobotEntry.vue')
      },
      {
        path: 'staff',
        name: 'staff-ordering',
        component: () => import('@/views/ordering/StaffEntry.vue')
      },
      {
        path: 'success',
        name: 'order-success',
        component: () => import('@/views/ordering/OrderSuccess.vue')
      },
      {
        path: 'product/:id',
        name: 'ordering-product-detail',
        component: ProductDetail,
        props: true
      },
      {
        path: 'confirm',
        name: 'order-confirm',
        component: () => import('@/views/ordering/OrderConfirm.vue')
      }
    ]
  },
  
  // 需要登录的管理页面路由
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'products',
        name: 'product-list',
        component: () => import('@/views/product/ProductList.vue')
      },
      {
        path: 'products/add',
        name: 'product-add',
        component: () => import('@/views/product/ProductEdit.vue')
      },
      {
        path: 'products/edit/:id',
        name: 'product-edit',
        component: () => import('@/views/product/ProductEdit.vue')
      },
      {
        path: 'orders',
        name: 'order-list',
        component: OrderList
      },
      {
        path: 'orders/:id',
        name: 'order-detail',
        component: OrderDetail
      }
    ]
  },
  
  // 登录页面
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/LoginPage.vue')
  },
  
  // 根路径重定向到点餐页面
  {
    path: '/',
    redirect: '/ordering/qr'
  },
  
  // 404页面
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/error/404.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const token = localStorage.getItem('token')
    if (!token) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router