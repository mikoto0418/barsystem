<template>
  <div class="product-detail-page" :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'">
    <LanguageSwitch />
    <div class="header">
      <el-button @click="goBack">
        <el-icon><ArrowLeft /></el-icon>
        {{ $t('common.back') }}
      </el-button>
    </div>

    <div class="detail-content" v-loading="loading">
      <template v-if="product">
        <h2>{{ product.name }}</h2>
        
        <div class="info-section">
          <div class="info-item">
            <span class="label">{{ $t('product.category') }}</span>
            <el-tag>{{ formatCategory(product.category) }}</el-tag>
          </div>
          
          <div class="info-item">
            <span class="label">{{ $t('product.alcoholContent') }}</span>
            <el-tag type="success">{{ product.alcohol_content }}%</el-tag>
          </div>
          
          <div class="info-item">
            <span class="label">{{ $t('product.price') }}</span>
            <span class="price">¥{{ product.price }}</span>
          </div>
          
          <div class="info-item">
            <span class="label">{{ $t('product.temperatureRequirement') }}</span>
            <template v-if="product.temperature_requirement === 'BOTH'">
              <el-radio-group v-model="temperatureChoice">
                <el-radio label="COLD">{{ $t('ordering.temperature.cold') }}</el-radio>
                <el-radio label="HOT">{{ $t('ordering.temperature.hot') }}</el-radio>
              </el-radio-group>
            </template>
            <el-tag v-else :type="product.temperature_requirement === 'HOT' ? 'danger' : 'info'">
              {{ formatTemperature(product.temperature_requirement) }}
            </el-tag>
          </div>
          
          <div class="info-item">
            <span class="label">{{ $t('order.quantity') }}</span>
            <el-input-number 
              v-model="quantity" 
              :min="1" 
              :max="99"
            />
          </div>
          
          <div class="description" v-if="product.description">
            <div class="label">{{ $t('product.description') }}</div>
            <p>{{ product.description }}</p>
          </div>
        </div>

        <div class="action-bar">
          <el-button type="primary" size="large" @click="handleAddToCart">
            {{ $t('order.addToCart') }}
          </el-button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getProduct } from '@/api/product'
import { getCartItems, saveCartItems } from '@/utils/cart'
import { useI18n } from 'vue-i18n'
import LanguageSwitch from '@/components/common/LanguageSwitch.vue'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const product = ref(null)
const loading = ref(false)
const quantity = ref(1)
const temperatureChoice = ref('COLD')

// 格式化分类
const formatCategory = (category) => {
  const categoryMap = {
    'WHITE_WINE': '白酒',
    'RED_WINE': '红酒',
    'BEER': '啤酒',
    'COCKTAIL': '鸡尾酒',
    'SOFT_DRINK': '软饮'
  }
  return categoryMap[category] || category
}

// 格式化温度要求
const formatTemperature = (temp) => {
  const tempMap = {
    'COLD': '冷饮',
    'HOT': '热饮',
    'BOTH': '冷/热'
  }
  return tempMap[temp] || temp
}

// 获取商品详情
const fetchProductDetail = async () => {
  loading.value = true
  try {
    const response = await getProduct(route.params.id)
    product.value = response
    temperatureChoice.value = product.value.temperature_requirement === 'BOTH' ? 
      'COLD' : product.value.temperature_requirement
  } catch {
    ElMessage.error(t('product.fetchFailed'))
  } finally {
    loading.value = false
  }
}

// 加入购物车
const handleAddToCart = () => {
  const cartItem = {
    product: {
      id: product.value.id,  // 确保存储产品ID
      name: product.value.name,
      price: product.value.price
    },
    quantity: quantity.value,
    temperature_choice: temperatureChoice.value
  }
  
  const cartItems = getCartItems(route.query.method, route.query.table)
  const existingItemIndex = cartItems.findIndex(
    item => item.product.id === cartItem.product.id && 
           item.temperature_choice === cartItem.temperature_choice
  )
  
  if (existingItemIndex > -1) {
    cartItems[existingItemIndex].quantity += cartItem.quantity
  } else {
    cartItems.push(cartItem)
  }
  
  saveCartItems(route.query.method, route.query.table, cartItems)
  ElMessage.success(t('order.addSuccess'))
}

// 返回上一页
const goBack = () => {
  router.back()
}

onMounted(() => {
  fetchProductDetail()
})
</script>

<style scoped>
.product-detail-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;
}

.header {
  margin-bottom: 20px;
}

.detail-content {
  background-color: #fff;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

.info-section {
  margin: 30px 0;
}

.info-item {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.label {
  width: 100px;
  color: #666;
  font-size: 16px;
}

.price {
  color: #f56c6c;
  font-size: 24px;
  font-weight: bold;
}

.description {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.description p {
  margin-top: 10px;
  color: #666;
  line-height: 1.6;
}

.action-bar {
  margin-top: 40px;
  text-align: center;
}

.el-tag {
  margin-right: 10px;
}

/* 添加 RTL 支持 */
[dir="rtl"] .info-item {
  flex-direction: row-reverse;
}

[dir="rtl"] .el-tag {
  margin-right: 0;
  margin-left: 10px;
}
</style> 