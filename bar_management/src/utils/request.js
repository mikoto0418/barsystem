import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'

const service = axios.create({
  baseURL: 'http://localhost:8000/api',
  timeout: 5000
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    console.log('API响应数据:', response.data)
    // 直接返回响应的数据部分
    return response.data
  },
  error => {
    console.error('API错误响应:', error.response)
    console.error('API错误:', error)
    if (error.response) {
      // 处理后端返回的错误
      const errorMessage = error.response.data.message || 
                          error.response.data.detail ||
                          error.response.data.error ||
                          '请求失败'
      
      if (error.response.status === 401) {
        localStorage.removeItem('token')
        router.push('/login')
        ElMessage.error('登录已过期，请重新登录')
      } else if (error.response.status === 400) {
        ElMessage.error(errorMessage)
      } else if (error.response.status === 404) {
        ElMessage.error('请求的资源不存在')
      } else if (error.response.status === 500) {
        ElMessage.error('服务器错误，请稍后重试')
      } else {
        ElMessage.error(errorMessage)
      }
    } else if (error.request) {
      // 请求发出但没有收到响应
      ElMessage.error('网络错误，请检查网络连接')
    } else {
      // 请求配置出错
      ElMessage.error('请求配置错误')
    }
    return Promise.reject(error)
  }
)

export default service 