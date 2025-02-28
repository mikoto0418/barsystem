<template>
  <div class="not-found">
    <el-result
      icon="warning"
      title="404"
      sub-title="抱歉，您访问的页面不存在"
    >
      <template #extra>
        <el-button type="primary" @click="handleBack">返回</el-button>
      </template>
    </el-result>
  </div>
</template>

<script setup name="NotFound">
import { useRouter } from 'vue-router'

const router = useRouter()

const handleBack = () => {
  router.go(-1)
}
</script>

<style scoped>
.not-found {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
}
</style> 