import { defineAsyncComponent } from 'vue'
import { logger } from './logger'

export function loadComponent(path, fallback = 'div') {
  return defineAsyncComponent({
    loader: () => import(path).catch(async error => {
      await logger.warn(`Failed to load component: ${path}`, error);
      return { template: `<${fallback}></${fallback}>` }
    }),
    // 可選：加載時使用的佔位符組件
    loadingComponent: { template: '<div>Loading...</div>' },
    // 可選：如果加載組件超時，使用的錯誤組件
    errorComponent: { template: '<div>Error loading component</div>' },
    // 在顯示 loadingComponent 之前的延遲 | 預設值：200（單位 ms）
    delay: 200,
    // 如果提供了 timeout ，並且加載組件的時間超過了設定值，將顯示錯誤組件
    // 預設值：Infinity（即永不超時，單位 ms）
    timeout: 3000
  })
}