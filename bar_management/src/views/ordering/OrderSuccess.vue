<template>
  <div class="order-success-page">
    <el-result
      icon="success"
      title="下单成功"
      :sub-title="`订单号：${orderId}`"
    >
      <template #extra>
        <el-button type="primary" @click="handleBack">返回点餐</el-button>
      </template>
    </el-result>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const orderId = route.query.order_id

const handleBack = () => {
  const orderMethod = route.query.order_method
  const table = route.query.table
  const robotId = route.query.robot_id
  const diners = route.query.diners
  
  // 根据不同的点餐方式构建返回路径
  let returnPath = '/ordering/'
  switch (orderMethod) {
    case 'QR':
      // 如果已经选择了就餐人数，直接返回点餐页面
      if (diners) {
        returnPath += `qr?table=${table}&diners=${diners}`
      } else {
        returnPath += `qr?table=${table}`
      }
      break
    case 'ROBOT':
      returnPath += `r/${robotId}`
      break
    case 'STAFF':
      // 修改这里：服务员点餐直接返回到点餐页面，保持桌号和就餐人数
      if (table && diners) {
        returnPath += `staff?table=${table}&diners=${diners}`
      } else if (table) {
        returnPath += `staff?table=${table}`
      } else {
        returnPath += 'staff'
      }
      break
    default:
      returnPath += 'qr'
  }
  
  router.replace(returnPath)
}
</script>

<style scoped>
.order-success-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
  padding: 20px;
}
</style> 