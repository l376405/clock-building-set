import { ref, computed } from 'vue';
import { useSettingsStore } from '@/store/settings';

export function usePanelToggle() {
  const settingsStore = useSettingsStore();

  const isLeftPanelAnimating = ref(false);
  const isRightPanelAnimating = ref(false);

  const leftPanelVisible = computed({
    get: () => settingsStore.leftPanelVisible,
    set: (value) => settingsStore.updateSetting('leftPanelVisible', value)
  });

  const rightPanelVisible = computed({
    get: () => settingsStore.rightPanelVisible,
    set: (value) => settingsStore.updateSetting('rightPanelVisible', value)
  });

  const toggleTopNavbar = () => {
    settingsStore.updateSetting('topNavbarVisible', !settingsStore.topNavbarVisible);
  };

  const toggleLeftPanel = () => {
    isLeftPanelAnimating.value = true;
    leftPanelVisible.value = !leftPanelVisible.value;
    setTimeout(() => {
      isLeftPanelAnimating.value = false;
    }, 300);
  };

  const toggleRightPanel = () => {
    isRightPanelAnimating.value = true;
    rightPanelVisible.value = !rightPanelVisible.value;
    setTimeout(() => {
      isRightPanelAnimating.value = false;
    }, 300);
  };

  return {
    leftPanelVisible,
    rightPanelVisible,
    isLeftPanelAnimating,
    isRightPanelAnimating,
    toggleTopNavbar,
    toggleLeftPanel,
    toggleRightPanel
  };
}