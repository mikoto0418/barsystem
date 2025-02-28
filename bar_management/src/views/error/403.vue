<template>
  <div class="forbidden-page">
    <el-result
      icon="warning"
      title="403 禁止访问"
      sub-title="抱歉，您没有权限访问此页面"
    >
      <template #extra>
        <el-button type="primary" @click="handleBack">返回</el-button>
      </template>
    </el-result>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const handleBack = () => {
  router.go(-1)
}
</script>

<style scoped>
.forbidden-page {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
}
</style> 