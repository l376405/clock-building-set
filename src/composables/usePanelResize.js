import { ref, onUnmounted, watch } from 'vue';
import { useSettingsStore } from '@/store/settings';

export function usePanelResize(side) {
  const settingsStore = useSettingsStore();
  const width = ref(settingsStore[`${side}PanelWidth`]);
  const isPanelVisible = ref(settingsStore[`${side}PanelVisible`]);
  let isResizing = false;
  let startX = 0;
  let startWidth = 0;

  const resize = (e) => {
    if (!isResizing || !isPanelVisible.value) return;

    let newWidth;
    if (side === 'left') {
      newWidth = startWidth + e.clientX - startX;
    } else {
      newWidth = startWidth - (e.clientX - startX);
    }

    const minWidth = 200;
    const maxWidth = window.innerWidth * 0.4;

    if (newWidth > minWidth && newWidth < maxWidth) {
      width.value = newWidth;
    }
  };

  const stopResize = () => {
    if (!isResizing) return;

    isResizing = false;
    document.body.style.userSelect = 'auto';
    document.removeEventListener('mousemove', resize);
    document.removeEventListener('mouseup', stopResize);
    // 只在停止調整大小時更新設置
    settingsStore.updateSetting(`${side}PanelWidth`, width.value);
  };

  const startResize = (e) => {
    if (isResizing || !isPanelVisible.value) return;

    isResizing = true;
    startX = e.clientX;
    startWidth = width.value;
    document.body.style.userSelect = 'none';
    document.addEventListener('mousemove', resize);
    document.addEventListener('mouseup', stopResize);
  };

  // 監聽面板可見性變化
  watch(() => settingsStore[`${side}PanelVisible`], (newValue) => {
    isPanelVisible.value = newValue;
  });

  onUnmounted(() => {
    document.removeEventListener('mousemove', resize);
    document.removeEventListener('mouseup', stopResize);
  });

  return {
    width,
    startResize,
    isPanelVisible
  };
}