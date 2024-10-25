import { ref, onUnmounted } from 'vue';
import { useSettingsStore } from '@/store/settings';
import { debounce } from 'lodash';

export function usePanelResize(initialWidth, side, minWidth = 200, maxWidthRatio = 0.5) {
  const width = ref(initialWidth);
  const settingsStore = useSettingsStore();
  let isResizing = false;

  // 使用 debounce 來限制更新設置的頻率
  const debouncedUpdateSetting = debounce((newWidth) => {
    settingsStore.updateSetting(`${side}PanelWidth`, newWidth);
  }, 3); // 3ms 延遲，可以根據需要調整

  const startResize = (e) => {
    if (isResizing) return;
    isResizing = true;

    const startX = e.clientX;
    const startWidth = width.value;

    document.body.style.userSelect = 'none';

    const resize = (e) => {
      let newWidth;
      if (side === 'left') {
        newWidth = startWidth + e.clientX - startX;
      } else {
        newWidth = startWidth - (e.clientX - startX);
      }

      if (newWidth > minWidth && newWidth < window.innerWidth * maxWidthRatio) {
        // 即時更新視覺效果
        width.value = newWidth;
        // 延遲更新設置
        debouncedUpdateSetting(newWidth);
      }
    };

    const stopResize = () => {
      isResizing = false;
      document.body.style.userSelect = 'auto';
      document.removeEventListener('mousemove', resize);
      document.removeEventListener('mouseup', stopResize);
      // 在停止調整大小時立即更新設置
      settingsStore.updateSetting(`${side}PanelWidth`, width.value);
    };

    document.addEventListener('mousemove', resize);
    document.addEventListener('mouseup', stopResize);
  };

  // 確保在組件卸載時清理事件監聽器
  onUnmounted(() => {
    document.removeEventListener('mousemove', resize);
    document.removeEventListener('mouseup', stopResize);
  });

  return {
    width,
    startResize
  };
}