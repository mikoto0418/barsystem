<template>
  <div class="order-detail">
    <div class="header">
      <el-page-header @back="goBack" :title="'返回订单列表'" :content="'订单详情'" />
    </div>

    <el-card v-loading="loading" class="detail-card">
      <!-- 基本信息 -->
      <div class="basic-info">
        <el-descriptions :column="3" border>
          <el-descriptions-item label="订单号">{{ order.id }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ formatTime(order.created_time) }}</el-descriptions-item>
          <el-descriptions-item label="订单状态">
            <el-tag :type="getStatusType(order.status)">
              {{ formatStatus(order.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="点餐方式">
            {{ formatOrderMethod(order.order_method) }}
          </el-descriptions-item>
          <el-descriptions-item label="桌号">{{ order.table_number }}</el-descriptions-item>
          <el-descriptions-item label="就餐人数">{{ order.number_of_diners }}人</el-descriptions-item>
          <el-descriptions-item label="备注" :span="3">{{ order.remarks || '无' }}</el-descriptions-item>
        </el-descriptions>
      </div>

      <!-- 订单明细 -->
      <div class="order-items">
        <h3>订单明细</h3>
        <el-table :data="order.details" border style="width: 100%">
          <el-table-column prop="product_name" label="商品名称" />
          <el-table-column prop="quantity" label="数量" width="100" />
          <el-table-column prop="unit_price" label="单价" width="120">
            <template #default="{ row }">
              ¥{{ row.unit_price }}
            </template>
          </el-table-column>
          <el-table-column label="温度" width="100">
            <template #default="{ row }">
              <el-tag :type="row.temperature_choice === 'HOT' ? 'danger' : 'primary'">
                {{ formatTemperature(row.temperature_choice) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="小计" width="120">
            <template #default="{ row }">
              ¥{{ (row.unit_price * row.quantity).toFixed(2) }}
            </template>
          </el-table-column>
        </el-table>

        <div class="total-amount">
          <span>总计：</span>
          <span class="amount">¥{{ order.total_amount }}</span>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="actions" v-if="order.status === 'PENDING'">
        <el-button type="success" @click="handleComplete">完成订单</el-button>
        <el-button type="warning" @click="handleCancel">取消订单</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getOrder, cancelOrder, completeOrder } from '@/api/order'
import { ElMessage, ElMessageBox } from 'element-plus'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const order = ref({
  details: []
})

// 格式化订单状态
const formatStatus = (status) => {
  const statusMap = {
    'PENDING': '待处理',
    'COMPLETED': '已完成',
    'CANCELLED': '已取消'
  }
  return statusMap[status] || status
}

// 获取状态标签类型
const getStatusType = (status) => {
  const typeMap = {
    'PENDING': 'warning',
    'COMPLETED': 'success',
    'CANCELLED': 'danger'
  }
  return typeMap[status] || 'info'
}

// 格式化订单方式
const formatOrderMethod = (method) => {
  const methodMap = {
    'QR': '扫码点餐',
    'ROBOT': '机器人点餐',
    'STAFF': '商家点餐'
  }
  return methodMap[method] || method
}

// 格式化温度选择
const formatTemperature = (temp) => {
  const tempMap = {
    'COLD': '冷饮',
    'HOT': '热饮'
  }
  return tempMap[temp] || temp
}

// 格式化时间
const formatTime = (timeStr) => {
  if (!timeStr) return ''
  return new Date(timeStr).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// 获取订单详情
const fetchOrderDetail = async () => {
  try {
    loading.value = true
    const response = await getOrder(route.params.id)
    order.value = response
    console.log('订单详情数据:', order.value)
  } catch (error) {
    console.error('获取订单详情失败:', error)
    ElMessage.error('获取订单详情失败')
  } finally {
    loading.value = false
  }
}

// 返回列表
const goBack = () => {
  router.push('/admin/orders')
}

// 完成订单
const handleComplete = async () => {
  try {
    await ElMessageBox.confirm('确认完成该订单?', '提示', {
      type: 'warning'
    })
    await completeOrder(order.value.id)
    ElMessage.success('订单已完成')
    fetchOrderDetail()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败')
      console.error('完成订单失败:', error)
    }
  }
}

// 取消订单
const handleCancel = async () => {
  try {
    await ElMessageBox.confirm('确认取消该订单?', '提示', {
      type: 'warning'
    })
    await cancelOrder(order.value.id)
    ElMessage.success('订单已取消')
    fetchOrderDetail()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败')
      console.error('取消订单失败:', error)
    }
  }
}

onMounted(() => {
  fetchOrderDetail()
})
</script>

<style scoped>
.order-detail {
  padding: 20px;
}

.header {
  margin-bottom: 20px;
}

.detail-card {
  margin-bottom: 20px;
}

.basic-info {
  margin-bottom: 30px;
}

.order-items {
  margin-top: 30px;
}

.order-items h3 {
  margin-bottom: 20px;
  color: #333;
}

.total-amount {
  margin-top: 20px;
  text-align: right;
  font-size: 16px;
}

.amount {
  color: #f56c6c;
  font-size: 24px;
  font-weight: bold;
  margin-left: 10px;
}

.actions {
  margin-top: 30px;
  text-align: center;
}

.actions .el-button {
  margin: 0 10px;
}

:deep(.el-tag.el-tag--info.el-tag--plain) {
  background-color: #ecf5ff;
  border-color: #b3d8ff;
  color: #409eff;
}
</style> 