<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getProducts, deleteProduct } from '@/api/product'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const loading = ref(false)
const products = ref([])

const formatCategory = (category) => {
    const categoryMap = {
        'BAIJIU': '白酒',
        'RED_WINE': '红酒',
        'BEER': '啤酒',
        'FOREIGN': '洋酒'
    }
    return categoryMap[category] || category
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

onMounted(() => {
    fetchProducts()
})
</script>

<template>
    <div class="product-list">
        <div class="header">
            <h2>商品管理</h2>
            <el-button type="primary" @click="handleAdd">新增商品</el-button>
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
</style>