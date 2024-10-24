import { ref, computed } from 'vue';
import { useSettingsStore } from '@/store/settings';

export function usePanelToggle() {
  const settingsStore = useSettingsStore();

  const isLeftPanelAnimating = ref(false);
  const isRightPanelAnimating = ref(false);

  const leftWidth = computed(() => settingsStore.leftPanelVisible ? (settingsStore.leftPanelWidth || 300) : 0);
  const rightWidth = computed(() => settingsStore.rightPanelVisible ? (settingsStore.rightPanelWidth || 300) : 0);

  const leftPanelVisible = computed({
    get: () => settingsStore.leftPanelVisible,
    set: (value) => {
      settingsStore.updateSetting('leftPanelVisible', value);
    }
  });

  const rightPanelVisible = computed({
    get: () => settingsStore.rightPanelVisible,
    set: (value) => {
      settingsStore.updateSetting('rightPanelVisible', value);
    }
  });

  const toggleTopNavbar = () => {
    settingsStore.updateSetting('topNavbarVisible', !settingsStore.topNavbarVisible);
  };

  const toggleLeftPanel = () => {
    isLeftPanelAnimating.value = true;
    setTimeout(() => {
      leftPanelVisible.value = !leftPanelVisible.value;
      setTimeout(() => {
        isLeftPanelAnimating.value = false;
      }, 300);
    }, 10);
  };

  const toggleRightPanel = () => {
    isRightPanelAnimating.value = true;
    setTimeout(() => {
      rightPanelVisible.value = !rightPanelVisible.value;
      setTimeout(() => {
        isRightPanelAnimating.value = false;
      }, 300);
    }, 10);
  };

  return {
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