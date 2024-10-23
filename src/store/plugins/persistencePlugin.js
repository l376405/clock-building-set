import { watch } from 'vue'

export function persistencePlugin({ store }) {
  // 從 localStorage 恢復狀態
  const savedState = localStorage.getItem(store.$id)
  if (savedState) {
    store.$patch(JSON.parse(savedState))
  }

  // 監聽變化並保存到 localStorage
  watch(
    () => store.$state,
    (state) => {
      localStorage.setItem(store.$id, JSON.stringify(state))
    },
    { deep: true }
  )
}