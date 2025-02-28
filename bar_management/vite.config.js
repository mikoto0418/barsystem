import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',  // 改用 127.0.0.1 而不是 localhost
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'), // 添加路径重写规则
        secure: false, // 添加此配置
        ws: true // 支持 websocket
      }
    }
  }
})
