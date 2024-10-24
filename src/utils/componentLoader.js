import { defineAsyncComponent } from 'vue'
import { logger } from './logger'

export function loadComponent(path) {
  return defineAsyncComponent({
    loader: () => import(/* webpackChunkName: "async-component" */ `${path}`)
      .catch(async error => {
        await logger.warn(`Failed to load component: ${path}`, error);
        throw error; // 重要：確保錯誤被拋出，這樣 Suspense 可以捕獲它
      }),
    delay: 200,
    timeout: 3000,
    suspensible: true
  })
}