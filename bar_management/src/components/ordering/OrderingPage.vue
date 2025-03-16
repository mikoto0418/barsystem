<template>
  <div class="ordering-page" :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'">
    <LanguageSwitch />
    <!-- 左侧分类 -->
    <div class="category-section">
      <el-menu
        :default-active="activeCategory"
        @select="handleCategorySelect"
      >
        <el-menu-item index="ALL">
          <span>{{ $t('ordering.category.all') }}</span>
        </el-menu-item>
        <el-menu-item index="BAIJIU">
          <span>{{ $t('ordering.category.baijiu') }}</span>
        </el-menu-item>
        <el-menu-item index="RED_WINE">
          <span>{{ $t('ordering.category.redWine') }}</span>
        </el-menu-item>
        <el-menu-item index="BEER">
          <span>{{ $t('ordering.category.beer') }}</span>
        </el-menu-item>
        <el-menu-item index="FOREIGN">
          <span>{{ $t('ordering.category.foreign') }}</span>
        </el-menu-item>
      </el-menu>
    </div>

    <!-- 商品列表区域 -->
    <div class="product-section">
      <div class="search-bar">
        <el-input
          v-model="searchKeyword"
          :placeholder="$t('ordering.search')"
          prefix-icon="Search"
          clearable
        />
      </div>

      <div class="product-list" v-loading="loading">
        <el-empty v-if="!filteredProducts.length" description="暂无商品" />
        <div class="products-grid">
          <el-card 
            v-for="product in filteredProducts" 
            :key="product.id" 
            class="product-card"
            :body-style="{ padding: '0px' }"
          >
            <div class="product-info" @click="showProductDetail(product)">
              <h3>{{ product.name }}</h3>
              <div class="tags">
                <el-tag size="small">{{ formatCategory(product.category) }}</el-tag>
                <el-tag size="small" type="success">{{ product.alcohol_content }}%</el-tag>
              </div>
              <div class="price">¥{{ product.price }}</div>
            </div>
            <div class="product-actions">
              <el-button 
                type="primary" 
                size="small" 
                @click.stop="quickAddToCart(product)"
              >
                快速购买
              </el-button>
              <el-button 
                type="default" 
                size="small" 
                @click.stop="showProductDetail(product)"
              >
                查看详情
              </el-button>
            </div>
          </el-card>
        </div>
      </div>
    </div>

    <!-- 购物车抽屉 -->
    <el-drawer
      v-model="cartDrawer"
      :title="$t('cart.title')"
      direction="btt"
      size="60vh"
    >
      <div v-if="cartItems.length === 0" class="empty-cart">
        {{ $t('cart.empty') }}
      </div>
      <template v-else>
        <div class="cart-items">
          <div v-for="item in cartItems" :key="item.product.id" class="cart-item">
            <div class="item-info">
              <h4>{{ item.product.name }}</h4>
              <div class="item-price">¥{{ item.product.price }}</div>
            </div>
            <div class="item-actions">
              <el-input-number 
                v-model="item.quantity"
                :min="0"
                :max="99"
                size="small"
                @change="(value) => handleQuantityChange(item, value)"
              />
              <el-button type="danger" link @click="handleRemoveItem(item)">
                删除
              </el-button>
            </div>
          </div>
        </div>
        
        <div class="cart-footer">
          <div class="total">
            <span class="total-label">{{ $t('cart.total') }}:</span>
            <span class="price">¥{{ totalAmount }}</span>
          </div>
          <div class="actions">
            <el-button type="danger" @click="handleClearCart">
              {{ $t('cart.clearCart') }}
            </el-button>
            <el-button type="primary" @click="handleSubmit">
              {{ $t('cart.submitOrder') }}
            </el-button>
          </div>
        </div>
      </template>
    </el-drawer>

    <!-- 悬浮购物车按钮 -->
    <div class="cart-fab">
      <el-badge :value="cartItemCount" :hidden="!cartItemCount">
        <el-button
          type="primary"
          circle
          @click="cartDrawer = true"
        >
          <el-icon><ShoppingCart /></el-icon>
        </el-button>
      </el-badge>
    </div>

    <!-- 添加商品详情对话框 -->
    <el-dialog
      v-model="productDetailVisible"
      :title="selectedProduct?.name"
      width="500px"
      destroy-on-close
    >
      <div class="product-detail" v-if="selectedProduct">
        <div class="detail-item">
          <span class="label">类别：</span>
          <el-tag>{{ formatCategory(selectedProduct.category) }}</el-tag>
        </div>
        
        <div class="detail-item">
          <span class="label">酒精度：</span>
          <el-tag type="success">{{ selectedProduct.alcohol_content }}%</el-tag>
        </div>
        
        <div class="detail-item">
          <span class="label">价格：</span>
          <span class="price">¥{{ selectedProduct.price }}</span>
        </div>
        
        <div class="detail-item">
          <span class="label">温度要求：</span>
          <el-radio-group v-model="temperatureChoice" v-if="selectedProduct.temperature_requirement === 'BOTH'">
            <el-radio label="COLD">冷饮</el-radio>
            <el-radio label="HOT">热饮</el-radio>
          </el-radio-group>
          <el-tag v-else :type="selectedProduct.temperature_requirement === 'HOT' ? 'danger' : 'info'">
            {{ formatTemperature(selectedProduct.temperature_requirement) }}
          </el-tag>
        </div>
        
        <div class="detail-item">
          <span class="label">数量：</span>
          <el-input-number 
            v-model="quantity" 
            :min="1" 
            :max="99"
            size="small"
          />
        </div>
      </div>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="productDetailVisible = false">取消</el-button>
          <el-button type="primary" @click="handleAddToCart">
            加入购物车
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getProducts } from '@/api/product'
import { getCartItems, saveCartItems, clearCart } from '@/utils/cart'
import { ShoppingCart } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import LanguageSwitch from '@/components/common/LanguageSwitch.vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  orderMethod: {
    type: String,
    required: true
  },
  tableNumber: {
    type: String,
    default: ''  // 机器人点餐时可能为空
  },
  robotId: {
    type: String,
    default: ''  // 非机器人点餐时为空
  },
  numberOfDiners: {
    type: Number,
    default: 0  // 机器人点餐时可能为0
  }
})

const loading = ref(false)
const products = ref([])
const searchKeyword = ref('')
const activeCategory = ref('ALL')
const cartItems = ref([])
const cartDrawer = ref(false)
const productDetailVisible = ref(false)
const selectedProduct = ref(null)
const quantity = ref(1)
const temperatureChoice = ref('COLD')
const router = useRouter()
const { t } = useI18n()

// 格式化分类
const formatCategory = (category) => {
  // 从本地存储获取类别数据
  const savedCategories = localStorage.getItem('productCategories')
  if (savedCategories) {
    const categories = JSON.parse(savedCategories)
    const foundCategory = categories.find(item => item.value === category)
    if (foundCategory) {
      return foundCategory.label
    }
  }
  return category
}

// 过滤商品
const filteredProducts = computed(() => {
  let result = products.value
  
  // 按分类筛选
  if (activeCategory.value !== 'ALL') {
    result = result.filter(item => item.category === activeCategory.value)
  }
  
  // 按关键词搜索
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(item => 
      item.name.toLowerCase().includes(keyword) ||
      formatCategory(item.category).toLowerCase().includes(keyword)
    )
  }
  
  return result
})

// 购物车相关计算属性
const cartItemCount = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + item.quantity, 0)
})

const totalAmount = computed(() => {
  return cartItems.value
    .reduce((total, item) => {
      return total + item.product.price * item.quantity
    }, 0)
    .toFixed(2)
})

// 获取商品列表
const fetchProducts = async () => {
  try {
    loading.value = true
    const response = await getProducts()
    products.value = response
  } catch (error) {
    console.error('获取商品列表失败:', error)
    ElMessage.error('获取商品列表失败')
  } finally {
    loading.value = false
  }
}

// 分类切换
const handleCategorySelect = (category) => {
  activeCategory.value = category
  searchKeyword.value = ''
}

const showProductDetail = (product) => {
  const query = {
    method: props.orderMethod
  }
  
  // 根据不同点餐方式添加不同参数
  if (props.orderMethod === 'ROBOT') {
    query.robot_id = props.robotId
  } else {
    query.table = props.tableNumber
    query.diners = props.numberOfDiners
  }

  // 使用完整的路径
  router.push({
    path: `/ordering/product/${product.id}`,
    query
  }).catch(err => {
    console.error('路由跳转失败:', err)
    ElMessage.error('页面跳转失败')
  })
}

const handleAddToCart = () => {
  const cartItem = {
    product: selectedProduct.value,
    quantity: quantity.value,
    temperature_choice: temperatureChoice.value
  }
  
  // 查找购物车中是否已存在相同商品和温度选择
  const existingItemIndex = cartItems.value.findIndex(
    item => item.product.id === cartItem.product.id && 
           item.temperature_choice === cartItem.temperature_choice
  )
  
  if (existingItemIndex > -1) {
    // 更新数量
    cartItems.value[existingItemIndex].quantity += cartItem.quantity
  } else {
    // 添加新项
    cartItems.value.push(cartItem)
  }
  
  // 保存购物车
  saveCartItems(props.orderMethod, props.tableNumber, cartItems.value)
  
  ElMessage.success('已加入购物车')
  productDetailVisible.value = false
}

const updateCart = (item, value) => {
  if (value === 0) {
    // 如果数量为0，从购物车中移除
    const index = cartItems.value.findIndex(i => i === item)
    if (index > -1) {
      cartItems.value.splice(index, 1)
    }
  }
  // 保存更新后的购物车
  saveCartItems(props.orderMethod, props.tableNumber, cartItems.value)
}

const handleQuantityChange = (item, value) => {
  item.quantity = value
  updateCart(item, value)
}

const handleClearCart = async () => {
  try {
    await ElMessageBox.confirm(t('cart.clearConfirm'), t('cart.confirmTip'), {
      type: 'warning'
    })
    cartItems.value = []
    // 清空本地存储的购物车数据
    clearCart(props.orderMethod, props.tableNumber)
    ElMessage.success(t('cart.clearSuccess'))
  } catch (error) {
    if (error !== 'cancel') {
      console.error('清空购物车失败:', error)
    }
  }
}

const handleSubmit = () => {
  if (cartItems.value.length === 0) {
    ElMessage.warning('购物车为空，请先添加商品')
    return
  }

  // 跳转到确认订单页面
  router.push({
    name: 'order-confirm',
    query: {
      method: props.orderMethod,
      table: props.tableNumber,
      robot_id: props.robotId,
      diners: props.numberOfDiners
    }
  })
}

const quickAddToCart = (product) => {
  const cartItem = {
    product,
    quantity: 1,
    temperature_choice: product.temperature_requirement === 'BOTH' ? 'COLD' : product.temperature_requirement
  }
  
  // 查找购物车中是否已存在相同商品和温度选择
  const existingItemIndex = cartItems.value.findIndex(
    item => item.product.id === cartItem.product.id && 
           item.temperature_choice === cartItem.temperature_choice
  )
  
  if (existingItemIndex > -1) {
    // 更新数量
    cartItems.value[existingItemIndex].quantity += 1
  } else {
    // 添加新项
    cartItems.value.push(cartItem)
  }
  
  // 保存购物车
  saveCartItems(props.orderMethod, props.tableNumber, cartItems.value)
  
  ElMessage.success('已加入购物车')
}

const handleRemoveItem = (item) => {
  const index = cartItems.value.findIndex(i => i === item)
  if (index > -1) {
    cartItems.value.splice(index, 1)
    saveCartItems(props.orderMethod, props.tableNumber, cartItems.value)
    ElMessage.success('商品已移除')
  }
}

onMounted(() => {
  fetchProducts()
  cartItems.value = getCartItems(props.orderMethod, props.tableNumber)
})
</script>

<style scoped>
.ordering-page {
  display: flex;
  height: 100vh;
  position: relative;
}

.category-section {
  width: 200px;
  border-right: 1px solid #eee;
}

.product-section {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.search-bar {
  margin-bottom: 20px;
}

.product-card {
  margin-bottom: 20px;
  cursor: pointer;
  transition: all 0.3s;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.product-info {
  padding: 15px;
}

.product-info h3 {
  margin: 0 0 10px 0;
  font-size: 16px;
}

.tags {
  margin-bottom: 10px;
}

.tags .el-tag {
  margin-right: 5px;
}

.price {
  color: #f56c6c;
  font-size: 18px;
  font-weight: bold;
}

.product-actions {
  padding: 10px 15px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: space-between;
}

.cart-fab {
  position: fixed;
  right: 40px;
  bottom: 40px;
  z-index: 100;
}

.cart-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.cart-items {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  max-height: calc(60vh - 140px);
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.item-info {
  flex: 1;
}

.item-info h4 {
  margin: 0 0 5px 0;
  font-size: 14px;
  color: #333;
}

.item-price {
  color: #f56c6c;
  font-size: 14px;
}

.item-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.cart-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  background-color: #fff;
  border-top: 1px solid #eee;
  z-index: 1;
}

.total-label {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.total {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 15px;
}

.price {
  color: #f56c6c;
  font-size: 20px;
  font-weight: bold;
  margin-left: 5px;
}

.cart-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.product-detail {
  padding: 20px;
}

.detail-item {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.detail-item .label {
  width: 80px;
  color: #666;
}

.detail-item .price {
  color: #f56c6c;
  font-size: 20px;
  font-weight: bold;
}

.el-tag {
  margin-right: 10px;
}

/* 添加 RTL 支持 */
[dir="rtl"] .cart-item {
  flex-direction: row-reverse;
}

[dir="rtl"] .cart-item-info {
  margin-right: 10px;
  margin-left: 0;
}

[dir="rtl"] .total {
  flex-direction: row-reverse;
}

[dir="rtl"] .actions {
  flex-direction: row-reverse;
}

.empty-cart {
  text-align: center;
  color: #909399;
  padding: 30px;
}

:deep(.el-drawer__header) {
  margin-bottom: 0;
  padding: 16px 20px;
  border-bottom: 1px solid #eee;
  color: #333;
  font-weight: 500;
  font-size: 16px;
}
</style>