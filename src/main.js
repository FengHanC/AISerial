// 基础框架和第三方库
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import { ElMessage } from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 样式文件
import 'element-plus/dist/index.css'
import './style.css'

// 应用核心模块
import App from './App.vue'
import store from './store'

// 初始化Vue应用
const app = createApp(App)

// 全局配置
app.config.globalProperties.$message = ElMessage

// 注册Element Plus图标组件
Object.entries(ElementPlusIconsVue).forEach(([iconName, iconComponent]) => {
  app.component(iconName, iconComponent)
})

// 使用插件
app.use(ElementPlus)
app.use(store)

// 挂载应用
app.mount('#app')
