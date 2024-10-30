import { watch } from 'vue'

export function createPersistedState(options = {}) {
  return ({ store }) => {
    const storage = options.storage || localStorage
    const storageKey = `${store.$id}`

    // 從 storage 恢復狀態，添加錯誤處理
    const savedState = storage.getItem(storageKey)
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState)
        store.$patch(parsed)
      } catch (e) {
        console.warn(`Failed to parse stored state for ${storageKey}:`, e)
        // 清除無效的存儲數據
        storage.removeItem(storageKey)
      }
    }

    // 監聽變化並保存，添加錯誤處理
    watch(
      () => store.$state,
      (state) => {
        try {
          const serialized = JSON.stringify(state)
          storage.setItem(storageKey, serialized)
        } catch (e) {
          console.error(`Failed to serialize state for ${storageKey}:`, e)
        }
      },
      { deep: true }
    )
  }
}