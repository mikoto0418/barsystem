// 导入全局样式文件
import './assets/main.css'

// 导入Vue核心功能和应用入口组件
import { createApp } from 'vue'
import App from './App.vue'

// 导入路由配置
import router from './router'

// 导入标题管理器
import { setupTitleManager } from './utils/titleManager'

// 导入Element Plus组件库及其图标
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 导入国际化配置
import i18n from './i18n'

// 创建Vue应用实例
const app = createApp(App)

// 注册所有Element Plus图标组件
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 使用路由、Element Plus组件库和国际化插件
app.use(router)
app.use(ElementPlus)
app.use(i18n)

// 初始化标题管理器
setupTitleManager(router)

// 挂载应用到DOM
app.mount('#app')
