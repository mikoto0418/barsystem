<template>
  <div class="language-switch">
    <el-dropdown @command="handleLanguageChange">
      <span class="el-dropdown-link">
        {{ currentLanguageLabel }}
        <el-icon class="el-icon--right"><arrow-down /></el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="zh">中文</el-dropdown-item>
          <el-dropdown-item command="en">English</el-dropdown-item>
          <el-dropdown-item command="ar">العربية</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ArrowDown } from '@element-plus/icons-vue'

const { locale } = useI18n()

const currentLanguageLabel = computed(() => {
  const labels = {
    zh: '中文',
    en: 'English',
    ar: 'العربية'
  }
  return labels[locale.value]
})

const handleLanguageChange = (lang) => {
  locale.value = lang
  localStorage.setItem('language', lang)
  // 如果使用阿拉伯语，需要调整文档方向
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
}
</script>

<style scoped>
.language-switch {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
}

.el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
  display: flex;
  align-items: center;
}

[dir="rtl"] .language-switch {
  left: 20px;
  right: auto;
}
</style> 