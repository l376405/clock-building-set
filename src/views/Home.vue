<template>
    <div class="home">
      <!-- 浮動面板 -->
        <div class="floating-panels">
            <!-- 頂部導航欄 -->
            <component :is="components.TopNavbar" 
                v-if="components.TopNavbar"
                :class="{ 'panel-visible': topNavbarVisible }" 
                @toggle="toggleTopNavbar"
            />
            <!-- 左側面板 -->
            <component :is="components.LeftPanel"
                v-if="components.LeftPanel"
                :class="{ 'panel-visible': leftPanelVisible }" 
                @toggle="toggleLeftPanel"
                :style="{ width: `${leftWidth}px` }" >
                <component :is="components.ClockSetting" v-if="components.ClockSetting" />
                <component :is="components.DateSetting" v-if="components.DateSetting" />
            </component>
            <!-- 左側面板調整 -->
            <div id="left-resizer" @mousedown="startLeftResize"></div>
            <!-- 右側面板 -->
            <component :is="components.RightPanel"
                v-if="components.RightPanel"
                :class="{ 'panel-visible': rightPanelVisible }" 
                @toggle="toggleRightPanel"
                :style="{ width: `${rightWidth}px` }" >
                <component :is="components.ImageUpload" v-if="components.ImageUpload" />
                <component :is="components.ObjectList" v-if="components.ObjectList" />
            </component>
            <!-- 右側面板調整 -->
            <div id="right-resizer" @mousedown="startRightResize"></div>
        </div>
      <!-- 預覽區 -->
        <component :is="components.PreviewArea"
            v-if="components.PreviewArea"
            ref="previewArea"
            @toggle-top-navbar="toggleTopNavbar"
            @toggle-left-panel="toggleLeftPanel"
            @toggle-right-panel="toggleRightPanel"
        />
    </div>
  </template>

<script setup>
    import { ref, onMounted } from 'vue';
    import { useSettingsStore } from '@/store/settings';
    import { usePanelResize } from '@/composables/usePanelResize';
    import { logger } from '@/utils/logger';
    import { loadComponent } from '@/utils/componentLoader';

    // 動態導入組件
    const components = {
        TopNavbar: loadComponent('@/components/navbar/TopNavbar.vue'),
        LeftPanel: loadComponent('@/components/panels/LeftPanel.vue'),
        RightPanel: loadComponent('@/components/panels/RightPanel.vue'),
        ClockSetting: loadComponent('@/components/panels/ClockSetting.vue'),
        DateSetting: loadComponent('@/components/panels/DateSetting.vue'),
        ImageUpload: loadComponent('@/components/panels/ImageUpload.vue'),
        ObjectList: loadComponent('@/components/panels/ObjectList.vue'),
        PreviewArea: loadComponent('@/components/preview/PreviewArea.vue'),
    };

    const topNavbarVisible = ref(true);
    const leftPanelVisible = ref(true);
    const rightPanelVisible = ref(true);

    const settingsStore = useSettingsStore();

    const toggleTopNavbar = () => {
        topNavbarVisible.value = !topNavbarVisible.value;
    };

    const toggleLeftPanel = () => {
        leftPanelVisible.value = !leftPanelVisible.value;
    };

    const toggleRightPanel = () => {
        rightPanelVisible.value = !rightPanelVisible.value;
    };

    // 左側面板調整
    const { width: leftWidth, startResize: startLeftResize } = usePanelResize(300, 'left');
    // 右側面板調整
    const { width: rightWidth, startResize: startRightResize } = usePanelResize(300, 'right');

    onMounted(async () => {
        settingsStore.loadFromLocalStorage();
        leftWidth.value = settingsStore.leftPanelWidth || 300;
        rightWidth.value = settingsStore.rightPanelWidth || 300;
        await logger.info('Home component mounted', { leftWidth: leftWidth.value, rightWidth: rightWidth.value });
    });
</script>
<style scoped>
    .home {
    height: 100vh;
    position: relative;
    overflow: hidden;
    }

    .floating-panels {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    }

    .floating-panels > * {
    pointer-events: auto;
    }

    .top-navbar {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 10;
    }

    .left-panel {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 5;
    }

    .right-panel {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 5;
    }

    #left-resizer, #right-resizer {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 5px;
    background: #ccc;
    cursor: col-resize;
    z-index: 6;
    }

    #left-resizer {
    left: 300px; /* 初始位置，應與左面板寬度相同 */
    }

    #right-resizer {
    right: 300px; /* 初始位置，應與右面板寬度相同 */
    }

    .panel-visible {
    /* 可見狀態的樣式 */
    }
</style>
