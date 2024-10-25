import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// 從環境變量中讀取配置，如果未設置，預設為 false
const skipDebug = process.env.VITE_APP_SKIP_DEBUG === 'true'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 8080,
    open: true
  },
  build: {
    sourcemap: !skipDebug
  },
  css: {
    devSourcemap: !skipDebug
  }
})