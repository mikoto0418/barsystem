/**
 * @description 用户相关的API接口封装
 * 包含用户登录、认证等功能
 */
import request from '@/utils/request'

/**
 * 用户登录
 * @param {Object} data - 登录参数
 * @param {string} data.username - 用户名
 * @param {string} data.password - 密码
 * @returns {Promise<Object>} 返回登录结果，包含token等认证信息
 */
export function login(data) {
  return request({
    url: '/login/',
    method: 'post',
    data: {
      username: data.username,
      password: data.password
    }
  })
}