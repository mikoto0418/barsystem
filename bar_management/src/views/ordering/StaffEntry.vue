<template>
  <div class="staff-entry">
    <template v-if="!isReady">
      <!-- 初始化表单 -->
      <div class="init-form">
        <h2>服务员点餐</h2>
        <el-form
          ref="formRef"
          :model="initForm"
          :rules="rules"
          label-width="100px"
        >
          <el-form-item label="桌号" prop="tableNumber">
            <el-input v-model="initForm.tableNumber" placeholder="请输入桌号" />
          </el-form-item>
          <el-form-item label="就餐人数">
            <div class="diners-buttons">
              <el-button
                v-for="num in 8"
                :key="num"
                :type="initForm.numberOfDiners === num ? 'primary' : 'default'"
                @click="initForm.numberOfDiners = num"
              >
                {{ num }}人
              </el-button>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleInit">开始点餐</el-button>
          </el-form-item>
        </el-form>
      </div>
    </template>
    <template v-else>
      <!-- 点餐界面 -->
      <div class="order-info">
        <span>桌号：{{ initForm.tableNumber }}</span>
        <span>就餐人数：{{ initForm.numberOfDiners }}人</span>
      </div>
      <OrderingPage
        order-method="STAFF"
        :table-number="initForm.tableNumber"
        :number-of-diners="initForm.numberOfDiners"
        @submit="handleSubmitOrder"
      />
    </template>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import OrderingPage from '@/components/ordering/OrderingPage.vue'
import { createOrder } from '@/api/order'

const router = useRouter()
const formRef = ref(null)
const isReady = ref(false)

const initForm = reactive({
  tableNumber: '',
  numberOfDiners: 1
})

const rules = {
  tableNumber: [
    { required: true, message: '请输入桌号', trigger: 'blur' },
    { pattern: /^[A-Za-z0-9-]+$/, message: '桌号格式不正确', trigger: 'blur' }
  ]
}

// 初始化确认
const handleInit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    isReady.value = true
  } catch (error) {
    ElMessage.error('请完善表单信息')
  }
}

// 提交订单
const handleSubmitOrder = async (orderData) => {
  try {
    await createOrder(orderData)
    ElMessage.success('下单成功')
    router.push({
      name: 'order-success',
      query: { order_method: 'STAFF' }
    })
  } catch (error) {
    ElMessage.error('下单失败')
  }
}
</script>

<style scoped>
.staff-entry {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;
}

.init-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 30px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

.init-form h2 {
  text-align: center;
  margin-bottom: 30px;
}

.diners-buttons {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.order-info {
  background-color: #fff;
  padding: 15px 20px;
  margin-bottom: 20px;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
}

.order-info span {
  font-size: 16px;
  color: #409EFF;
}
</style> 