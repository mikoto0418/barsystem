<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getProducts, deleteProduct, getCategories } from '@/api/product'
import { ElMessage, ElMessageBox } from 'element-plus'
import CategoryManagement from './CategoryManagement.vue'

const router = useRouter()
const loading = ref(false)
const products = ref([])
const categories = ref([])
const categoryManagementVisible = ref(false)

const formatCategory = (category) => {
    // 从本地存储的类别数据中查找对应的类别名称
    const foundCategory = categories.value.find(item => item.value === category)
    if (foundCategory) {
        return foundCategory.label
    }
    return category
}

const formatTemperature = (temp) => {
    const tempMap = {
        'COLD': '冷饮',
        'HOT': '热饮',
        'BOTH': '冷热皆可'
    }
    return tempMap[temp] || temp
}

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

const handleAdd = () => {
    router.push({ name: 'product-add' })
}

const handleEdit = (row) => {
    router.push({ name: 'product-edit', params: { id: row.id } })
}

const handleDelete = async (row) => {
    try {
        await ElMessageBox.confirm('确认删除该商品?', '提示', {
            type: 'warning'
        })
        await deleteProduct(row.id)
        ElMessage.success('删除成功')
        fetchProducts()
    } catch (error) {
        if (error !== 'cancel') {
            console.error('删除商品失败:', error)
            ElMessage.error('删除商品失败')
        }
    }
}

// 打开类别管理对话框
const openCategoryManagement = () => {
    categoryManagementVisible.value = true
}

// 处理类别管理对话框确认
const handleCategoryConfirm = (updatedCategories) => {
    categories.value = updatedCategories
    // 由于后端没有提供保存类别的API，我们只在前端保存类别信息
    // 确保类别数据结构正确，只包含label和value属性
    localStorage.setItem('productCategories', JSON.stringify(updatedCategories))
    // 刷新商品列表，以便立即显示更新后的类别名称
    fetchProducts()
    ElMessage.success('类别设置已保存')
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
    await fetchCategories()
    fetchProducts()
})
</script>

<template>
    <div class="product-list">
        <div class="header">
            <h2>商品管理</h2>
            <div class="header-buttons">
                <el-button type="primary" @click="openCategoryManagement">类别设置</el-button>
                <el-button type="primary" @click="handleAdd">新增商品</el-button>
            </div>
        </div>

        <el-table v-loading="loading" :data="products" border style="width: 100%">
            <el-table-column prop="name" label="名称" />
            <el-table-column prop="category" label="类别">
                <template #default="{ row }">
                    {{ formatCategory(row.category) }}
                </template>
            </el-table-column>
            <el-table-column prop="alcohol_content" label="酒精度">
                <template #default="{ row }">
                    {{ row.alcohol_content }}%
                </template>
            </el-table-column>
            <el-table-column prop="price" label="价格">
                <template #default="{ row }">
                    ¥{{ row.price }}
                </template>
            </el-table-column>
            <el-table-column prop="temperature_requirement" label="温度要求">
                <template #default="{ row }">
                    {{ formatTemperature(row.temperature_requirement) }}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="200">
                <template #default="{ row }">
                    <el-button type="primary" link @click="handleEdit(row)">
                        编辑
                    </el-button>
                    <el-button type="danger" link @click="handleDelete(row)">
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
    
    <!-- 类别管理对话框 -->
    <CategoryManagement
        v-model:visible="categoryManagementVisible"
        :initial-categories="categories"
        @confirm="handleCategoryConfirm"
    />
</template>

<style scoped>
.product-list {
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

.header h2 {
    margin: 0;
}

.header-buttons {
    display: flex;
    gap: 10px;
}
</style>