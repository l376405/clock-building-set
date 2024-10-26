import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { persistencePlugin } from './store/plugins/persistencePlugin'
import { loggerPlugin } from './store/plugins/LoggerPlugin'
import { logger } from './utils/logger'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import './assets/styles/common.css'
import './assets/styles/elementVariables.css'
import { changeTheme } from './utils/theme'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import './assets/styles/themeVariable.css'

// 創建 Vue 實例
const app = createApp(App)

// 創建 Pinia 實例
const pinia = createPinia()
// 添加自定義序列化器
pinia.use(({ store }) => {
	const serializer = {
	  serialize: JSON.stringify,
	  deserialize: (value) => {
		try {
		  return JSON.parse(value)
		} catch (e) {
		  console.error('Failed to deserialize stored value:', e)
		  return undefined
		}
	  }
	}
	
	store.$persist = {
	  enabled: true,
	  strategies: [
		{
		  key: store.$id,
		  storage: localStorage,
		  serializer: serializer
		}
	  ]
	}
})

app.use(pinia)
app.use(ElementPlus)

// 註冊 Element Plus 圖標組件
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.config.globalProperties.$logger = logger

// 在 app 掛載之後初始化主題
app.mount('#app')

// 使用 nextTick 確保在 DOM 更新後應用主題
import { nextTick } from 'vue'
nextTick(() => {
  const { useThemeStore } = require('./store/theme')
  const themeStore = useThemeStore()
  changeTheme(themeStore.primaryColor)
})