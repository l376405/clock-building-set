import './assets/styles/themeVariable.css'
import { createApp, nextTick } from 'vue'
import { createPinia } from 'pinia'
import { createPersistedState } from '@/store/plugins/persistencePlugin'
import { loggerPlugin } from '@/store/plugins/LoggerPlugin'
import { logger } from '@/utils/logger'
import { useThemeStore } from './store/theme'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import './assets/styles/common.css'
import './assets/styles/elementVariables.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 清理 localStorage 中的無效數據
const cleanLocalStorage = () => {
  try {
    const keys = Object.keys(localStorage)
    keys.forEach(key => {
      try {
        JSON.parse(localStorage.getItem(key))
      } catch (e) {
        console.warn(`Removing invalid storage for key ${key}`)
        localStorage.removeItem(key)
      }
    })
  } catch (e) {
    console.error('Failed to clean localStorage:', e)
  }
}

// 初始化主題
const initializeTheme = async () => {
  const themeStore = useThemeStore()
  await logger.debug('Initializing theme')
  themeStore.initTheme()
}

// 應用初始化
const initializeApp = async () => {
  // 清理 localStorage
  cleanLocalStorage()

  // 創建應用實例
  const app = createApp(App)

  // 配置 Pinia
  const pinia = createPinia()
  pinia.use(createPersistedState())
  app.use(pinia)

  // 配置 Element Plus
  app.use(ElementPlus)

  // 註冊 Element Plus 圖標
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }

  // 配置全局 logger
  app.config.globalProperties.$logger = logger

  // 掛載應用
  app.mount('#app')

  // 在 DOM 更新後初始化主題
  await nextTick(() => initializeTheme())
}

// 啟動應用
initializeApp().catch(error => {
  console.error('Failed to initialize app:', error)
})