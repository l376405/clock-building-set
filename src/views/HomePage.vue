<template>
    <div class="home">
        <!-- 浮動面板 -->
        <div class="floating-panels">
            <!-- 頂部導航欄 -->
            <Suspense>
                <template #default>
                    <component :is="components.TopNavbar" 
                        v-if="components.TopNavbar"
                        :class="{ 'panel-visible': topNavbarVisible }" 
                        @toggle="toggleTopNavbar"
                    />
                </template>
                <template #fallback>
                    <div class="top-navbar panel-visible error-container">
                        頂部導航欄加載失敗
                    </div>
                </template>
            </Suspense>
  
            <!-- 左側面板 -->
            <Suspense>
                <template #default>
                    <component :is="components.LeftPanel"
                        v-if="components.LeftPanel"
                        :class="{ 'panel-visible': leftPanelVisible, 'panel-animating': isLeftPanelAnimating }" 
                        @toggle="toggleLeftPanel"
                        :style="{ width: `${leftWidth}px` }"
                    >
                    </component>
                </template>
                <template #fallback>
                    <div class="left-panel panel-visible error-container" 
                        :style="{ width: `${leftWidth}px` }"
                        :class="{ 'panel-animating': isLeftPanelAnimating }"
                    >
                        左側面板加載失敗
                    </div>
                </template>
            </Suspense>
  
            <!-- 右側面板 -->
            <Suspense>
                <template #default>
                    <component :is="components.RightPanel"
                        v-if="components.RightPanel"
                        :class="{ 'panel-visible': rightPanelVisible, 'panel-animating': isRightPanelAnimating }" 
                        @toggle="toggleRightPanel"
                        :style="{ width: `${rightWidth}px` }"
                    >
                    </component>
                </template>
                <template #fallback>
                    <div 
                    class="right-panel panel-visible error-container" 
                        :style="{ width: `${rightWidth}px` }"
                        :class="{ 'panel-animating': isRightPanelAnimating }"
                    >
                        右側面板加載失敗
                    </div>
                </template>
            </Suspense>
  
            <!-- 左側面板調整 -->
            <div id="left-resizer" class="resizer"
                @mousedown="startLeftResize"
                :style="{ left: `calc(1vw + ${leftWidth - 3}px)` }"
                :class="{ 'panel-animating': isLeftPanelAnimating }"
            ></div>
            <div class="toggle-button left" 
                @click="toggleLeftPanel" 
                :style="{ left: `calc(1vw + ${leftWidth+4}px)` }" 
                :class="{ 'panel-animating': isLeftPanelAnimating }"
            >
                {{ leftPanelVisible ? '◀' : '▶' }}
            </div>
  
            <!-- 右側面板調整 -->
            <div id="right-resizer" class="resizer"
                @mousedown="startRightResize"
                :style="{ right: `calc(1vw + ${rightWidth - 3}px)` }"
                :class="{ 'panel-animating': isRightPanelAnimating }"
            ></div>
            <div class="toggle-button right" 
                @click="toggleRightPanel" 
                :style="{ right: `calc(1vw + ${rightWidth+4}px)` }" 
                :class="{ 'panel-animating': isRightPanelAnimating }"
            >
                {{ rightPanelVisible ? '▶' : '◀' }}
            </div>
        </div>
  
        <!-- 預覽區 -->
        <Suspense>
            <template #default>
                <component :is="components.PreviewArea"
                    v-if="components.PreviewArea"
                    ref="previewArea"
                    @toggle-top-navbar="toggleTopNavbar"
                    @toggle-left-panel="toggleLeftPanel"
                    @toggle-right-panel="toggleRightPanel"
                />
            </template>
            <template #fallback>
                <div class="preview-area error-container">
                    預覽區加載失敗
                </div>
            </template>
        </Suspense>
    </div>
</template>

<script setup>
    import { onMounted, ref, watch } from 'vue';
    import { useSettingsStore } from '@/store/settings';
    import { usePanelResize } from '@/composables/usePanelResize';
    import { usePanelToggle } from '@/composables/usePanelToggle';
    import { logger } from '@/utils/logger';
    import { loadComponent } from '@/utils/componentLoader';

    // 動態導入組件
    const components = ref({
        TopNavbar: loadComponent('@/components/navbar/TopNavbar.vue'),
        LeftPanel: loadComponent('@/components/panels/LeftPanel.vue'),
        RightPanel: loadComponent('@/components/panels/RightPanel.vue'),
        PreviewArea: loadComponent('@/components/preview/PreviewArea.vue'),
    });

    const {
        topNavbarVisible,
        leftPanelVisible,
        rightPanelVisible,
        leftWidth,
        rightWidth,
        toggleTopNavbar,
        toggleLeftPanel,
        toggleRightPanel,
        isLeftPanelAnimating,
        isRightPanelAnimating
    } = usePanelToggle();

    const settingsStore = useSettingsStore();
    // 面板調整
    const { startResize: startLeftResize } = usePanelResize(leftWidth, 'left'); // 左側面板調整
    const { startResize: startRightResize } = usePanelResize(rightWidth, 'right'); // 右側面板調整

    watch(leftPanelVisible, (newVisible) => {
        settingsStore.updateSetting('leftPanelVisible', newVisible); // 更新左側面板可見性
    });
    watch(rightPanelVisible, (newVisible) => {
        settingsStore.updateSetting('rightPanelVisible', newVisible); // 更新右側面板可見性
    });

    onMounted(async () => {
        await settingsStore.loadFromLocalStorage();
        await logger.info('HomePage component mounted', { leftWidth: leftWidth.value, rightWidth: rightWidth.value });
    });
</script>

<style>
    body, html {
        margin: 0;
        padding: 0;
        height: 100%;
        overflow: hidden;
    }

    #app {
        height: 100%;
    }
</style>

<style scoped>
    .home {
        height: 100vh;
        width: 100vw;
        max-height: 99vh;
        max-width: 99vw;
        margin: auto;
        padding: 0.1vh 0.1vw;
        position: relative;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
    }

    .preview-area {
        flex-grow: 1;
        width: 100%;
        height: 100%;
        position: relative;
        z-index: 1;
        isolation: isolate; /* 創建新的堆疊上下文 */
    }

    /* 浮動面板，包含頂部導航欄、左側面板、右側面板 */
    .floating-panels {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
        overflow: hidden;
        z-index: 2;
        isolation: isolate; /* 創建新的堆疊上下文 */
    }

    .floating-panels > * {
        pointer-events: auto;
    }

    .top-navbar,
    .left-panel,
    .right-panel {
        border-radius: 10px; /* 圓角 */
        border: 1px solid rgba(255, 255, 255, 0.2); /* 邊框 */
        box-shadow: 0 4px 6px rgba(6, 5, 6, 0.624); /* 陰影 */
        background-color: rgba(255, 255, 255, 0.9); /* 背景顏色 */
    }

    .top-navbar {
        position: absolute;
        align-items: center;
        justify-content: center;
        top: 1vh;
        left: 1vw;
        right: 1vw;
        height: 4vh;
        width: 97vw;
        min-height: 50px;
        z-index: 1002;
    }

    .left-panel, .right-panel {
        position: absolute;
        top: calc(6vh + 10px);
        bottom: 1vh;
        overflow: hidden;
        z-index: 1000;
    }

    .left-panel.panel-animating,
    .right-panel.panel-animating {
        transition: width 0.3s ease;
    }

    .left-panel {
        position: absolute;
        left: 1vw;
    }

    .right-panel {
        position: absolute;
        right: 1vw;
    }


     /* 確保當面板隱藏時，不會有任何邊距或填充 */
    .left-panel:not(.panel-visible),
    .right-panel:not(.panel-visible) {
        width: 0 !important; /* 寬度設為0 */
        padding: 0 !important; /* 內邊距設為0 */
        border: none !important; /* 邊框設為none */
    }
    .error-container {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 18px;
        color: #ff4d4f;
        background-color: #fff1f0;
        margin: 10px 0;
    }
</style>