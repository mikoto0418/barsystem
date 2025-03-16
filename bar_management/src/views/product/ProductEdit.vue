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
        <el-select v-model="form.category" placeholder="请选择类别" class="category-select">
          <el-option 
            v-for="item in categories" 
            :key="item.value" 
            :label="item.label" 
            :value="item.value" 
          />
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
        <el-radio-group v-model="form.temperature_requirement">
          <el-radio label="COLD">冷饮</el-radio>
          <el-radio label="HOT">热饮</el-radio>
          <el-radio label="BOTH">冷热皆可</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="描述" prop="description">
        <el-input 
          v-model="form.description" 
          type="textarea" 
          :rows="3"
          placeholder="请输入商品描述"
        />
      </el-form-item>
      
      <el-form-item label="商品图片" prop="image">
        <el-upload
          class="product-image-uploader"
          :action="'#'"
          :http-request="handleImageUpload"
          :show-file-list="false"
          :before-upload="beforeImageUpload"
        >
          <img v-if="imageUrl" :src="imageUrl" class="product-image" />
          <el-icon v-else class="product-image-uploader-icon"><Plus /></el-icon>
        </el-upload>
        <div class="image-tip" v-if="!imageUrl">点击上传商品图片</div>
        <div class="image-tip" v-else>点击更换图片</div>
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
import { getProduct, createProduct, updateProduct, uploadProductImage, getCategories } from '@/api/product'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import CategoryManagement from './CategoryManagement.vue'

const route = useRoute()
const router = useRouter()
const formRef = ref(null)
const loading = ref(false)
const imageUrl = ref('')
const imageFile = ref(null)
const categories = ref([])

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



// 获取类别列表
const fetchCategories = async () => {
  try {
    // 先尝试从本地存储获取类别列表
    const savedCategories = localStorage.getItem('productCategories')
    if (savedCategories) {
      categories.value = JSON.parse(savedCategories)
      return
    }
    
    // 如果本地没有，尝试从API获取
    try {
      const response = await getCategories()
      if (response && response.length > 0) {
        categories.value = response
        return
      }
    } catch (error) {
      console.error('API获取类别列表失败:', error)
    }
    
    // 如果以上都失败，使用默认类别
    categories.value = [
      { label: '白酒', value: 'BAIJIU' },
      { label: '红酒', value: 'RED_WINE' },
      { label: '啤酒', value: 'BEER' },
      { label: '洋酒', value: 'FOREIGN' }
    ]
  } catch (error) {
    console.error('获取类别列表失败:', error)
    // 使用默认类别
    categories.value = [
      { label: '白酒', value: 'BAIJIU' },
      { label: '红酒', value: 'RED_WINE' },
      { label: '啤酒', value: 'BEER' },
      { label: '洋酒', value: 'FOREIGN' }
    ]
  }
}

onMounted(async () => {
  // 获取类别列表
  await fetchCategories()
  
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
      
      // 设置图片URL
      if (response.image_url) {
        imageUrl.value = response.image_url
      }
    } catch (err) {
      console.error('获取商品信息失败:', err)
      ElMessage.error('获取商品信息失败')
    } finally {
      loading.value = false
    }
  }
})

// 图片上传前的验证
const beforeImageUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('上传文件只能是图片格式!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('上传图片大小不能超过 2MB!')
    return false
  }
  
  imageFile.value = file
  return true
}

// 自定义图片上传处理
const handleImageUpload = async (options) => {
  try {
    if (!imageFile.value) return
    
    // 如果是编辑模式且已有商品ID，直接上传图片
    if (isEdit.value) {
      const result = await uploadProductImage(route.params.id, imageFile.value)
      imageUrl.value = result.url
      ElMessage.success('图片上传成功')
    } else {
      // 如果是新增模式，先创建一个本地预览
      const reader = new FileReader()
      reader.onload = (e) => {
        imageUrl.value = e.target.result
      }
      reader.readAsDataURL(imageFile.value)
    }
  } catch (error) {
    console.error('图片上传失败:', error)
    ElMessage.error('图片上传失败')
  }
}

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
      // 新增商品
      const result = await createProduct(submitData)
      
      // 如果有选择图片，上传图片
      if (imageFile.value && result.id) {
        try {
          await uploadProductImage(result.id, imageFile.value)
        } catch (error) {
          console.error('图片上传失败:', error)
          ElMessage.warning('商品创建成功，但图片上传失败')
        }
      }
      
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

.product-image-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 178px;
  height: 178px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.product-image-uploader:hover {
  border-color: #409EFF;
}

.product-image-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.product-image {
  width: 178px;
  height: 178px;
  display: block;
  object-fit: cover;
}

.image-tip {
  color: #909399;
  font-size: 12px;
  margin-top: 5px;
}

.category-select-container {
  display: flex;
  align-items: center;
}

.category-select {
  width: 180px;
  margin-right: 10px;
}
</style>