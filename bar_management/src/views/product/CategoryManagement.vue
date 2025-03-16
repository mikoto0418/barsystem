<template>
  <div>
    <!-- 类别管理对话框 -->
    <el-dialog
      v-model="dialogVisible"
      title="类别管理"
      width="500px"
    >
      <div class="category-list">
        <el-table :data="categories" border style="width: 100%">
          <el-table-column prop="label" label="类别名称" />
          <el-table-column label="操作" width="150">
            <template #default="{ row, $index }">
              <el-button type="primary" link @click="handleEdit($index)">
                编辑
              </el-button>
              <el-button 
                type="danger" 
                link 
                @click="handleDelete($index)"
                :disabled="categories.length <= 1"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="add-category">
          <el-button type="primary" @click="handleAdd" style="margin-top: 15px">
            添加类别
          </el-button>
        </div>
      </div>

      <!-- 添加/编辑类别表单 -->
      <el-dialog
        v-model="formDialogVisible"
        :title="isEdit ? '编辑类别' : '添加类别'"
        width="400px"
        append-to-body
      >
        <el-form
          ref="categoryFormRef"
          :model="categoryForm"
          :rules="categoryRules"
          label-width="80px"
        >
          <el-form-item label="类别名称" prop="label">
            <el-input v-model="categoryForm.label" placeholder="请输入类别名称" />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="formDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="submitCategoryForm">确定</el-button>
          </span>
        </template>
      </el-dialog>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="confirm">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  initialCategories: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:visible', 'confirm'])

const dialogVisible = ref(false)
const formDialogVisible = ref(false)
const isEdit = ref(false)
const editIndex = ref(-1)
const categories = ref([])

// 类别表单
const categoryFormRef = ref(null)
const categoryForm = ref({
  label: ''
})

// 表单验证规则
const categoryRules = {
  label: [
    { required: true, message: '请输入类别名称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ]
}

// 监听visible属性变化
watch(() => props.visible, (newVal) => {
  dialogVisible.value = newVal
  if (dialogVisible.value) {
    // 深拷贝初始类别数据
    categories.value = JSON.parse(JSON.stringify(props.initialCategories))
  }
}, { immediate: true })

// 监听dialogVisible变化
watch(dialogVisible, (newVal) => {
  emit('update:visible', newVal)
})

// 添加类别
const handleAdd = () => {
  isEdit.value = false
  categoryForm.value = {
    label: ''
  }
  formDialogVisible.value = true
}

// 编辑类别
const handleEdit = (index) => {
  isEdit.value = true
  editIndex.value = index
  categoryForm.value = {
    ...categories.value[index]
  }
  formDialogVisible.value = true
}

// 删除类别
const handleDelete = async (index) => {
  try {
    await ElMessageBox.confirm('确认删除该类别?', '提示', {
      type: 'warning'
    })
    categories.value.splice(index, 1)
  } catch (error) {
    // 用户取消删除
  }
}

// 提交类别表单
const submitCategoryForm = async () => {
  if (!categoryFormRef.value) return
  
  try {
    await categoryFormRef.value.validate()
    
    // 检查类别名称是否重复
    const isDuplicate = categories.value.some((item, index) => {
      return item.label === categoryForm.value.label && index !== editIndex.value
    })
    
    if (isDuplicate) {
      ElMessage.error('类别名称已存在')
      return
    }
    
    if (isEdit.value) {
      // 更新现有类别
      categories.value[editIndex.value] = { ...categoryForm.value }
    } else {
      // 添加新类别
      categories.value.push({ ...categoryForm.value })
    }
    
    formDialogVisible.value = false
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

// 取消
const cancel = () => {
  dialogVisible.value = false
}

// 确认
const confirm = () => {
  emit('confirm', categories.value)
  dialogVisible.value = false
}
</script>

<style scoped>
.category-list {
  margin-bottom: 20px;
}

.add-category {
  margin-top: 10px;
  display: flex;
  justify-content: center;
}
</style>