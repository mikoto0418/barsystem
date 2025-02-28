<template>
  <div class="product-edit">
    <h2>{{ isEdit ? '编辑商品' : '新增商品' }}</h2>
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="120px"
      class="product-form"
    >
      <el-form-item label="商品名称" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      
      <el-form-item label="类别" prop="category">
        <el-select v-model="form.category" placeholder="请选择类别">
          <el-option label="白酒" value="BAIJIU" />
          <el-option label="红酒" value="RED_WINE" />
          <el-option label="啤酒" value="BEER" />
          <el-option label="洋酒" value="FOREIGN" />
        </el-select>
      </el-form-item>
      
      <el-form-item label="价格" prop="price">
        <el-input-number 
          v-model="form.price" 
          :precision="2" 
          :step="0.1" 
          :min="0"
        />
      </el-form-item>
      
      <el-form-item label="酒精度" prop="alcohol_content">
        <el-input-number 
          v-model="form.alcohol_content" 
          :precision="1" 
          :step="0.1"
          :min="0"
          :max="100"
        />
      </el-form-item>

      <el-form-item label="温度要求" prop="temperature_requirement">
        <el-select v-model="form.temperature_requirement" placeholder="请选择温度要求">
          <el-option label="冷饮" value="COLD" />
          <el-option label="热饮" value="HOT" />
          <el-option label="冷热皆可" value="BOTH" />
        </el-select>
      </el-form-item>

      <el-form-item label="描述" prop="description">
        <el-input 
          v-model="form.description" 
          type="textarea" 
          :rows="3"
          placeholder="请输入商品描述"
        />
      </el-form-item>
      
      <el-form-item>
        <el-button type="primary" @click="handleSubmit" :loading="loading">保存</el-button>
        <el-button @click="handleCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getProduct, createProduct, updateProduct } from '@/api/product'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const formRef = ref(null)
const loading = ref(false)

const isEdit = computed(() => !!route.params.id)

const form = ref({
  name: '',
  category: '',
  price: 0,
  alcohol_content: 0,
  temperature_requirement: 'COLD',
  description: ''
})

const rules = {
  name: [
    { required: true, message: '请输入商品名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  category: [
    { required: true, message: '请选择商品类别', trigger: 'change' }
  ],
  price: [
    { required: true, message: '请输入价格', trigger: 'blur' },
    { type: 'number', min: 0, message: '价格必须大于0', trigger: 'blur' }
  ],
  alcohol_content: [
    { required: true, message: '请输入酒精度', trigger: 'blur' },
    { type: 'number', min: 0, max: 100, message: '酒精度必须在0-100之间', trigger: 'blur' }
  ],
  temperature_requirement: [
    { required: true, message: '请选择温度要求', trigger: 'change' }
  ]
}

onMounted(async () => {
  if (isEdit.value) {
    try {
      loading.value = true
      const response = await getProduct(route.params.id)
      form.value = {
        name: response.name || '',
        category: response.category || '',
        price: Number(response.price) || 0,
        alcohol_content: Number(response.alcohol_content) || 0,
        temperature_requirement: response.temperature_requirement || 'COLD',
        description: response.description || ''
      }
    } catch (err) {
      console.error('获取商品信息失败:', err)
      ElMessage.error('获取商品信息失败')
    } finally {
      loading.value = false
    }
  }
})

const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    
    loading.value = true
    const submitData = {
      ...form.value,
      price: Number(form.value.price),
      alcohol_content: Number(form.value.alcohol_content)
    }

    if (isEdit.value) {
      await updateProduct(route.params.id, submitData)
      ElMessage.success('更新成功')
    } else {
      await createProduct(submitData)
      ElMessage.success('创建成功')
    }
    router.push({ name: 'product-list' })
  } catch (err) {
    console.error('保存失败:', err)
    ElMessage.error(err?.message || '保存失败')
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  router.push({ name: 'product-list' })
}
</script>

<style scoped>
.product-edit {
  padding: 20px;
}

.product-form {
  max-width: 600px;
  margin-top: 20px;
}

.el-input-number {
  width: 180px;
}

.el-select {
  width: 180px;
}
</style> 