import { ref } from 'vue';
import { useSettingsStore } from '@/store/settings';

// 面板調整邏輯(初始寬度, 面板方向, 最小寬度, 最大寬度比例)
export function usePanelResize(initialWidth, side, minWidth = 200, maxWidthRatio = 0.5) {
  const width = ref(initialWidth); // 面板寬度
  const settingsStore = useSettingsStore(); // 設定儲存邏輯

  const startResize = (e) => {
    const startX = e.clientX; // 起始位置
    const startWidth = width.value; // 起始寬度

    const resize = (e) => {
      let newWidth;
      if (side === 'left') {
        newWidth = startWidth + e.clientX - startX; // 左側面板調整
      } else {
        newWidth = startWidth - (e.clientX - startX); // 右側面板調整
      }

      if (newWidth > minWidth && newWidth < window.innerWidth * maxWidthRatio) {
        width.value = newWidth; // 更新面板寬度
        settingsStore.updateSetting(`${side}PanelWidth`, newWidth); // 更新設定
      }
    };

    const stopResize = () => {
      document.removeEventListener('mousemove', resize); // 移除滑鼠移動事件
      document.removeEventListener('mouseup', stopResize); // 移除滑鼠釋放事件
    };

    document.addEventListener('mousemove', resize); // 添加滑鼠移動事件
    document.addEventListener('mouseup', stopResize); // 添加滑鼠釋放事件
  };

  // 返回面板寬度和開始調整函數
  return {
    width,
    startResize
  };
}