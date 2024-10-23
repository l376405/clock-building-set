import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { persistencePlugin } from './store/plugins/persistencePlugin'
import { loggerPlugin } from './store/plugins/LoggerPlugin'
import { logger } from './utils/logger'
import App from './App.vue'

// 創建 Pinia 實例
const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
pinia.use(persistencePlugin)
pinia.use(loggerPlugin)
app.config.globalProperties.$logger = logger
// 創建 Vue 實例
app.mount('#app')
