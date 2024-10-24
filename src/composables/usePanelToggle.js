import { ref, computed } from 'vue';
import { useSettingsStore } from '@/store/settings';

export function usePanelToggle() {
  const settingsStore = useSettingsStore();

  const topNavbarVisible = ref(true);
  const leftPanelVisible = ref(true);
  const rightPanelVisible = ref(true);
  const isLeftPanelAnimating = ref(false);
  const isRightPanelAnimating = ref(false);

  const leftWidth = computed(() => leftPanelVisible.value ? (settingsStore.leftPanelWidth || 300) : 0);
  const rightWidth = computed(() => rightPanelVisible.value ? (settingsStore.rightPanelWidth || 300) : 0);

  const toggleTopNavbar = () => {
    topNavbarVisible.value = !topNavbarVisible.value;
  };

  const toggleLeftPanel = () => {
    isLeftPanelAnimating.value = true;
    setTimeout(() => {
      leftPanelVisible.value = !leftPanelVisible.value;
      if (leftPanelVisible.value) {
        settingsStore.updateSetting('leftPanelWidth', settingsStore.leftPanelWidth || 300);
      } else {
        settingsStore.updateSetting('leftPanelWidth', 0);
      }
      setTimeout(() => {
        isLeftPanelAnimating.value = false;
      }, 300); // 動畫持續時間
    }, 10); // 短暫延遲以確保動畫類別被應用
  };

  const toggleRightPanel = () => {
    isRightPanelAnimating.value = true;
    setTimeout(() => {
      rightPanelVisible.value = !rightPanelVisible.value;
      if (rightPanelVisible.value) {
        settingsStore.updateSetting('rightPanelWidth', settingsStore.rightPanelWidth || 300);
      } else {
        settingsStore.updateSetting('rightPanelWidth', 0);
      }
      setTimeout(() => {
        isRightPanelAnimating.value = false;
      }, 300); // 動畫持續時間
    }, 10); // 短暫延遲以確保動畫類別被應用
  };

  return {
    topNavbarVisible,
    leftPanelVisible,
    rightPanelVisible,
    isLeftPanelAnimating,
    isRightPanelAnimating,
    leftWidth,
    rightWidth,
    toggleTopNavbar,
    toggleLeftPanel,
    toggleRightPanel
  };
}