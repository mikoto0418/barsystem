<template>
  <div class="qr-entry">
    <LanguageSwitch />
    <template v-if="!numberOfDiners">
      <!-- 人数选择界面 -->
      <div class="diners-selection">
        <div class="table-info">
          <h2>{{ $t('dining.tableNumber') }}：{{ tableNumber }}</h2>
        </div>
        <h3>{{ $t('dining.selectDiners') }}</h3>
        <div class="diners-buttons">
          <el-button
            v-for="num in 8"
            :key="num"
            type="primary"
            size="large"
            round
            @click="confirmDiners(num)"
          >
            {{ num }}{{ $t('dining.people') }}
          </el-button>
        </div>
      </div>
    </template>
    <template v-else>
      <!-- 点餐界面 -->
      <OrderingPage
        order-method="QR"
        :table-number="tableNumber"
        :number-of-diners="numberOfDiners"
        @submit="handleSubmitOrder"
      />
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import OrderingPage from '@/components/ordering/OrderingPage.vue'
import LanguageSwitch from '@/components/common/LanguageSwitch.vue'
import { createOrder } from '@/api/order'

const route = useRoute()
const router = useRouter()

const tableNumber = ref(route.query.table || '')
const numberOfDiners = ref(parseInt(route.query.diners) || 0)

// 确认就餐人数
const confirmDiners = (num) => {
  if (!tableNumber.value) {
    ElMessage.error('无效的桌号')
    return
  }
  numberOfDiners.value = num
  router.replace({
    query: { 
      ...route.query,
      diners: num 
    }
  })
}

// 提交订单
const handleSubmitOrder = async (orderData) => {
  try {
    await createOrder(orderData)
    ElMessage.success('下单成功')
    router.push({
      name: 'order-success',
      query: { order_method: 'QR' }
    })
  } catch (error) {
    ElMessage.error('下单失败')
  }
}
</script>

<style scoped>
.qr-entry {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.diners-selection {
  max-width: 600px;
  margin: 0 auto;
  padding: 40px 20px;
  text-align: center;
}

.table-info {
  margin-bottom: 30px;
}

.table-info h2 {
  color: #409EFF;
  font-size: 24px;
}

.diners-selection h3 {
  margin-bottom: 30px;
  color: #333;
}

.diners-buttons {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  padding: 0 20px;
}

.el-button {
  width: 100%;
  height: 60px;
  font-size: 18px;
}
</style> 