<template>
  <div class="order-confirm-page" :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'">
    <LanguageSwitch />
    <div class="header">
      <el-button @click="goBack" icon="ArrowLeft">{{ $t('common.back') }}</el-button>
      <h2>{{ $t('order.confirmOrder') }}</h2>
    </div>

    <div class="confirm-content">
      <!-- 订单信息 -->
      <div class="order-info">
        <template v-if="orderMethod === 'QR'">
          <div class="info-item">
            <span class="label">{{ $t('dining.tableNumber') }}</span>
            <span>{{ tableNumber }}</span>
          </div>
          <div class="info-item">
            <span class="label">{{ $t('dining.numberOfDiners') }}</span>
            <span>{{ numberOfDiners }}{{ $t('dining.people') }}</span>
          </div>
        </template>
        <template v-else-if="orderMethod === 'ROBOT'">
          <div class="info-item">
            <span class="label">机器人编号</span>
            <span>{{ robotId }}</span>
          </div>
        </template>
        <template v-else>
          <div class="info-item">
            <span class="label">桌号</span>
            <span>{{ tableNumber }}</span>
          </div>
        </template>
      </div>

      <!-- 商品列表 -->
      <div class="products-list">
        <h3>{{ $t('order.selectedItems') }}</h3>
        <el-table :data="cartItems" border>
          <el-table-column prop="product.name" :label="$t('product.name')" />
          <el-table-column :label="$t('order.unitPrice')">
            <template #default="{ row }">
              ¥{{ row.product.price }}
            </template>
          </el-table-column>
          <el-table-column prop="quantity" :label="$t('order.quantity')" width="100" />
          <el-table-column :label="$t('order.temperature')" width="100">
            <template #default="{ row }">
              {{ formatTemperature(row.temperature_choice) }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('order.subtotal')" width="120">
            <template #default="{ row }">
              ¥{{ (row.product.price * row.quantity).toFixed(2) }}
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 订单总计 -->
      <div class="order-total">
        <div class="total-item">
          <span>{{ $t('order.totalItems') }}：</span>
          <span>{{ totalQuantity }}{{ $t('order.pieces') }}</span>
        </div>
        <div class="total-item">
          <span>{{ $t('order.totalAmount') }}：</span>
          <span class="price">¥{{ totalAmount }}</span>
        </div>
      </div>

      <!-- 提交按钮 -->
      <div class="submit-section">
        <el-button type="primary" size="large" @click="handleSubmit" :loading="submitting">
          {{ $t('common.submit') }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import LanguageSwitch from '@/components/common/LanguageSwitch.vue'
import { createOrder } from '@/api/order'
import { getCartItems, clearCart } from '@/utils/cart'

const { t } = useI18n()

const route = useRoute()
const router = useRouter()

const orderMethod = ref(route.query.method || 'QR')
const tableNumber = ref(route.query.table || '')
const robotId = ref(route.query.robot_id || '')
const numberOfDiners = ref(parseInt(route.query.diners) || 0)
const cartItems = ref([])
const submitting = ref(false)

// 格式化温度选择
const formatTemperature = (temp) => {
  const tempMap = {
    'COLD': '冷饮',
    'HOT': '热饮'
  }
  return tempMap[temp] || temp
}

// 计算总数量
const totalQuantity = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + item.quantity, 0)
})

// 计算总金额
const totalAmount = computed(() => {
  return cartItems.value
    .reduce((sum, item) => sum + item.product.price * item.quantity, 0)
    .toFixed(2)
})

// 返回上一页
const goBack = () => {
  router.back()
}

// 提交订单
const handleSubmit = async () => {
  if (submitting.value) return
  
  try {
    submitting.value = true
    const orderData = {
      order_method: orderMethod.value,
      table_number: orderMethod.value === 'ROBOT' ? 'ROBOT' : tableNumber.value,
      number_of_diners: parseInt(numberOfDiners.value) || 1,
      total_amount: parseFloat(totalAmount.value),
      details: cartItems.value.map(item => ({
        product: item.product.id,
        quantity: parseInt(item.quantity),
        unit_price: parseFloat(item.product.price),
        temperature_choice: item.temperature_choice
      }))
    }

    if (orderMethod.value === 'ROBOT') {
      orderData.robot_id = robotId.value
    }

    console.log('提交的订单数据:', orderData)
    const response = await createOrder(orderData)
    console.log('创建订单响应:', response)
    
    // 清空购物车
    clearCart(orderMethod.value, tableNumber.value)
    
    // 触发订单创建事件
    window.dispatchEvent(new CustomEvent('order-created'))
    
    router.replace({
      name: 'order-success',
      query: { 
        order_method: orderMethod.value,
        robot_id: robotId.value,
        table: tableNumber.value,
        diners: numberOfDiners.value,
        order_id: response.id
      }
    })
    ElMessage.success(t('order.orderSuccess'))
  } catch (error) {
    console.error('提交订单失败:', error)
    ElMessage.error(t('order.orderFailed'))
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  // 获取购物车数据
  cartItems.value = getCartItems(orderMethod.value, tableNumber.value)
  if (cartItems.value.length === 0) {
    ElMessage.warning(t('order.emptyCart'))
    router.back()
  }
})
</script>

<style scoped>
.order-confirm-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;
}

.header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.header h2 {
  margin: 0;
  color: #333;
}

.confirm-content {
  background-color: #fff;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

.order-info {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.info-item {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
}

.info-item span {
  color: #333;
}

.label {
  width: 100px;
  color: #333;
}

.products-list {
  margin-bottom: 30px;
}

.products-list h3 {
  margin-bottom: 20px;
  color: #333;
}

.order-total {
  margin: 30px 0;
  padding: 20px;
  background-color: #f8f8f8;
  border-radius: 4px;
}

.total-item {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 10px;
  color: #333;
}

.total-item:last-child {
  margin-bottom: 0;
}

.price {
  color: #f56c6c;
  font-size: 24px;
  font-weight: bold;
  margin-left: 10px;
}

.submit-section {
  text-align: center;
  margin-top: 30px;
}

/* 添加 RTL 支持 */
[dir="rtl"] .header {
  flex-direction: row-reverse;
}

[dir="rtl"] .total-item {
  flex-direction: row-reverse;
}

[dir="rtl"] .price {
  margin-right: 10px;
  margin-left: 0;
}
</style> 