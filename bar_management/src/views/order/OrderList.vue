<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { getOrders, cancelOrder, completeOrder, deleteOrder } from '@/api/order'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()
const loading = ref(false)
const orders = ref([])
const activeTab = ref('ALL') // 默认显示全部

// 按状态分类的订单
const filteredOrders = computed(() => {
  if (activeTab.value === 'ALL') {
    return orders.value
  }
  return orders.value.filter(order => order.status === activeTab.value)
})

// 格式化订单方式
const formatOrderMethod = (method) => {
  const methodMap = {
    'QR': '扫码点餐',
    'ROBOT': '机器人点餐',
    'STAFF': '服务员点餐'
  }
  return methodMap[method] || method
}

// 格式化订单状态
const formatStatus = (status) => {
  const statusMap = {
    'PENDING': '待处理',
    'COMPLETED': '已完成',
    'CANCELLED': '已取消'
  }
  return statusMap[status] || status
}

// 格式化时间
const formatTime = (timeStr) => {
  if (!timeStr) return ''
  const date = new Date(timeStr)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })
}

// 获取订单列表
const fetchOrders = async () => {
  try {
    loading.value = true
    const response = await getOrders()
    orders.value = Array.isArray(response) ? response : []
  } catch (error) {
    console.error('获取订单列表失败:', error)
    ElMessage.error('获取订单列表失败')
  } finally {
    loading.value = false
  }
}

// 处理删除订单
const handleDelete = async (id, event) => {
  // 阻止事件冒泡，避免触发行点击事件
  event.stopPropagation()
  try {
    await ElMessageBox.confirm('确认删除该订单? 删除后将无法恢复', '警告', {
      type: 'warning',
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    })
    await deleteOrder(id)
    ElMessage.success('删除成功')
    fetchOrders()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
      console.error('删除订单失败:', error)
    }
  }
}

// 处理完成订单
const handleComplete = async (id, event) => {
  event.stopPropagation()
  try {
    await ElMessageBox.confirm('确认完成该订单?', '提示', {
      type: 'warning',
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    })
    await completeOrder(id)
    ElMessage.success('操作成功')
    fetchOrders()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败')
      console.error('完成订单失败:', error)
    }
  }
}

// 处理取消订单
const handleCancel = async (id, event) => {
  event.stopPropagation()
  try {
    await ElMessageBox.confirm('确认取消该订单?', '提示', {
      type: 'warning',
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    })
    await cancelOrder(id)
    ElMessage.success('取消成功')
    fetchOrders()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('取消失败')
      console.error('取消订单失败:', error)
    }
  }
}

// 处理行点击
const handleRowClick = (row) => {
  router.push(`/admin/orders/${row.id}`)
}

// 选中的订单
const selectedOrders = ref([])

// 计算属性：是否有待处理的订单被选中
const hasSelectedPending = computed(() => {
  return selectedOrders.value.some(order => order.status === 'PENDING')
})

// 计算属性：是否有待处理或已完成的订单被选中
const hasSelectedPendingOrCompleted = computed(() => {
  return selectedOrders.value.some(order => 
    order.status === 'PENDING' || order.status === 'COMPLETED'
  )
})

// 处理选择变化
const handleSelectionChange = (selection) => {
  selectedOrders.value = selection
}

// 批量完成订单
const handleBatchComplete = async () => {
  try {
    await ElMessageBox.confirm(
      `确认完成选中的 ${selectedOrders.value.length} 个订单?`, 
      '提示',
      { type: 'warning' }
    )
    
    const pendingOrders = selectedOrders.value.filter(order => order.status === 'PENDING')
    await Promise.all(pendingOrders.map(order => completeOrder(order.id)))
    
    ElMessage.success('批量完成成功')
    fetchOrders()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败')
      console.error('批量完成订单失败:', error)
    }
  }
}

// 批量取消订单
const handleBatchCancel = async () => {
  try {
    await ElMessageBox.confirm(
      `确认取消选中的 ${selectedOrders.value.length} 个订单?`, 
      '提示',
      { type: 'warning' }
    )
    
    const validOrders = selectedOrders.value.filter(
      order => order.status === 'PENDING' || order.status === 'COMPLETED'
    )
    await Promise.all(validOrders.map(order => cancelOrder(order.id)))
    
    ElMessage.success('批量取消成功')
    fetchOrders()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败')
      console.error('批量取消订单失败:', error)
    }
  }
}

// 批量删除订单
const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm(
      `确认删除选中的 ${selectedOrders.value.length} 个订单? 删除后将无法恢复`, 
      '警告',
      { type: 'warning' }
    )
    
    await Promise.all(selectedOrders.value.map(order => deleteOrder(order.id)))
    
    ElMessage.success('批量删除成功')
    fetchOrders()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
      console.error('批量删除订单失败:', error)
    }
  }
}

onMounted(() => {
  fetchOrders()
  window.addEventListener('order-created', fetchOrders)
})

onUnmounted(() => {
  window.removeEventListener('order-created', fetchOrders)
})
</script>

<template>
  <div class="order-list">
    <div class="header">
      <h2>订单管理</h2>
      <div class="header-actions">
        <!-- 批量操作按钮，当有选中项时显示 -->
        <template v-if="selectedOrders.length > 0">
          <el-button 
            type="success" 
            @click="handleBatchComplete"
            v-if="hasSelectedPending"
          >
            批量完成
          </el-button>
          <el-button 
            type="warning" 
            @click="handleBatchCancel"
            v-if="hasSelectedPendingOrCompleted"
          >
            批量取消
          </el-button>
          <el-button 
            type="danger" 
            @click="handleBatchDelete"
          >
            批量删除
          </el-button>
        </template>
        <el-button type="primary" @click="fetchOrders">刷新</el-button>
      </div>
    </div>

    <el-tabs v-model="activeTab">
      <el-tab-pane label="全部" name="ALL">
        <el-table 
          v-loading="loading" 
          :data="filteredOrders" 
          border 
          style="width: 100%"
          @row-click="handleRowClick"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
      <el-table-column prop="id" label="订单号" width="100" />
      <el-table-column prop="table_number" label="桌号" width="80" />
          <el-table-column prop="order_method" label="点餐方式" width="120">
        <template #default="{ row }">
          {{ formatOrderMethod(row.order_method) }}
        </template>
      </el-table-column>
          <el-table-column prop="number_of_diners" label="就餐人数" width="100" />
          <el-table-column prop="total_amount" label="总金额" width="120">
        <template #default="{ row }">
          ¥{{ row.total_amount }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
              <el-tag 
                :type="row.status === 'PENDING' ? 'warning' : 
                       row.status === 'COMPLETED' ? 'success' : 'danger'"
              >
                {{ formatStatus(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
          <el-table-column prop="created_time" label="创建时间" width="180">
            <template #default="{ row }">
              {{ formatTime(row.created_time) }}
            </template>
          </el-table-column>
          <el-table-column prop="remarks" label="备注" show-overflow-tooltip />
          <el-table-column label="操作" width="260" fixed="right">
            <template #default="{ row }">
              <template v-if="row.status === 'PENDING'">
                <el-button
                  type="success"
                  link
                  @click="handleComplete(row.id, $event)"
                >
                  完成
                </el-button>
                <el-button
                  type="warning"
                  link
                  @click="handleCancel(row.id, $event)"
                >
                  取消
                </el-button>
              </template>
              <template v-else-if="row.status === 'COMPLETED'">
                <el-button
                  type="warning"
                  link
                  @click="handleCancel(row.id, $event)"
                >
                  取消
                </el-button>
              </template>
              <template v-else-if="row.status === 'CANCELLED'">
                <el-button
                  type="success"
                  link
                  @click="handleComplete(row.id, $event)"
                >
                  完成
                </el-button>
              </template>
              <el-button
                type="danger"
                link
                @click="handleDelete(row.id, $event)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="待处理" name="PENDING">
        <el-table 
          v-loading="loading" 
          :data="filteredOrders" 
          border 
          style="width: 100%"
          @row-click="handleRowClick"
        >
          <el-table-column prop="id" label="订单号" width="100" />
          <el-table-column prop="table_number" label="桌号" width="80" />
          <el-table-column prop="order_method" label="点餐方式" width="120">
            <template #default="{ row }">
              {{ formatOrderMethod(row.order_method) }}
            </template>
          </el-table-column>
          <el-table-column prop="number_of_diners" label="就餐人数" width="100" />
          <el-table-column prop="total_amount" label="总金额" width="120">
            <template #default="{ row }">
              ¥{{ row.total_amount }}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-tag type="warning">{{ formatStatus(row.status) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="created_time" label="创建时间" width="180">
            <template #default="{ row }">
              {{ formatTime(row.created_time) }}
            </template>
          </el-table-column>
          <el-table-column prop="remarks" label="备注" show-overflow-tooltip />
          <el-table-column label="操作" width="260" fixed="right">
            <template #default="{ row }">
              <template v-if="row.status === 'PENDING'">
                <el-button
                  type="success"
                  link
                  @click="handleComplete(row.id, $event)"
                >
                  完成
                </el-button>
                <el-button
                  type="warning"
                  link
                  @click="handleCancel(row.id, $event)"
                >
                  取消
                </el-button>
              </template>
              <template v-else-if="row.status === 'COMPLETED'">
                <el-button
                  type="warning"
                  link
                  @click="handleCancel(row.id, $event)"
                >
                  取消
                </el-button>
              </template>
              <template v-else-if="row.status === 'CANCELLED'">
                <el-button
                  type="success"
                  link
                  @click="handleComplete(row.id, $event)"
                >
                  完成
                </el-button>
              </template>
              <el-button
                type="danger"
                link
                @click="handleDelete(row.id, $event)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="已完成" name="COMPLETED">
        <el-table 
          v-loading="loading" 
          :data="filteredOrders" 
          border 
          style="width: 100%"
          @row-click="handleRowClick"
        >
          <el-table-column prop="id" label="订单号" width="100" />
          <el-table-column prop="table_number" label="桌号" width="80" />
          <el-table-column prop="order_method" label="点餐方式" width="120">
            <template #default="{ row }">
              {{ formatOrderMethod(row.order_method) }}
            </template>
          </el-table-column>
          <el-table-column prop="number_of_diners" label="就餐人数" width="100" />
          <el-table-column prop="total_amount" label="总金额" width="120">
            <template #default="{ row }">
              ¥{{ row.total_amount }}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-tag type="success">{{ formatStatus(row.status) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="created_time" label="创建时间" width="180">
            <template #default="{ row }">
              {{ formatTime(row.created_time) }}
            </template>
          </el-table-column>
      <el-table-column prop="remarks" label="备注" show-overflow-tooltip />
          <el-table-column label="操作" width="260" fixed="right">
        <template #default="{ row }">
              <template v-if="row.status === 'PENDING'">
          <el-button
            type="success"
                  link
                  @click="handleComplete(row.id, $event)"
          >
            完成
          </el-button>
          <el-button
                  type="warning"
                  link
                  @click="handleCancel(row.id, $event)"
                >
                  取消
                </el-button>
              </template>
              <template v-else-if="row.status === 'COMPLETED'">
                <el-button
                  type="warning"
                  link
                  @click="handleCancel(row.id, $event)"
                >
                  取消
                </el-button>
              </template>
              <template v-else-if="row.status === 'CANCELLED'">
                <el-button
                  type="success"
                  link
                  @click="handleComplete(row.id, $event)"
                >
                  完成
                </el-button>
              </template>
              <el-button
            type="danger"
                link
                @click="handleDelete(row.id, $event)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="已取消" name="CANCELLED">
        <el-table 
          v-loading="loading" 
          :data="filteredOrders" 
          border 
          style="width: 100%"
          @row-click="handleRowClick"
        >
          <el-table-column prop="id" label="订单号" width="100" />
          <el-table-column prop="table_number" label="桌号" width="80" />
          <el-table-column prop="order_method" label="点餐方式" width="120">
            <template #default="{ row }">
              {{ formatOrderMethod(row.order_method) }}
            </template>
          </el-table-column>
          <el-table-column prop="number_of_diners" label="就餐人数" width="100" />
          <el-table-column prop="total_amount" label="总金额" width="120">
            <template #default="{ row }">
              ¥{{ row.total_amount }}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-tag type="danger">{{ formatStatus(row.status) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="created_time" label="创建时间" width="180">
            <template #default="{ row }">
              {{ formatTime(row.created_time) }}
            </template>
          </el-table-column>
          <el-table-column prop="remarks" label="备注" show-overflow-tooltip />
          <el-table-column label="操作" width="260" fixed="right">
            <template #default="{ row }">
              <template v-if="row.status === 'PENDING'">
                <el-button
                  type="success"
                  link
                  @click="handleComplete(row.id, $event)"
                >
                  完成
                </el-button>
                <el-button
                  type="warning"
                  link
                  @click="handleCancel(row.id, $event)"
                >
                  取消
                </el-button>
              </template>
              <template v-else-if="row.status === 'COMPLETED'">
                <el-button
                  type="warning"
                  link
                  @click="handleCancel(row.id, $event)"
                >
                  取消
                </el-button>
              </template>
              <template v-else-if="row.status === 'CANCELLED'">
                <el-button
                  type="success"
                  link
                  @click="handleComplete(row.id, $event)"
                >
                  完成
                </el-button>
              </template>
              <el-button
                type="danger"
                link
                @click="handleDelete(row.id, $event)"
              >
                删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped>
.order-list {
  background-color: #fff;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.header h2 {
  margin: 0;
}

:deep(.el-table__row) {
  cursor: pointer;
}

:deep(.el-table__row:hover) {
  background-color: #f5f7fa;
}
</style> 