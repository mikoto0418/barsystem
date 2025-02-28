<template>
  <div class="robot-entry">
    <div class="robot-info">
      <h2>机器人编号：{{ robotId }}</h2>
    </div>
    <OrderingPage
      order-method="ROBOT"
      :robot-id="robotId"
      @submit="handleSubmitOrder"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import OrderingPage from '@/components/ordering/OrderingPage.vue'
import { createOrder } from '@/api/order'

const route = useRoute()
const router = useRouter()

// 从路由参数中获取机器人ID，而不是查询参数
const robotId = ref(route.params.id || '')

// 提交订单
const handleSubmitOrder = async (orderData) => {
  try {
    await createOrder(orderData)
    ElMessage.success('下单成功')
    router.push({
      name: 'order-success',
      query: { 
        order_method: 'ROBOT',
        robot_id: robotId.value
      }
    })
  } catch (error) {
    ElMessage.error('下单失败')
  }
}
</script>

<style scoped>
.robot-entry {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.robot-info {
  background-color: #fff;
  padding: 20px;
  margin-bottom: 20px;
  text-align: center;
}

.robot-info h2 {
  margin: 10px 0;
  color: #409EFF;
}
</style> 