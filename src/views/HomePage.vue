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
                        :style="{ width: `${displayLeftWidth}px` }"
                    >
                    </component>
                </template>
                <template #fallback>
                    <div class="left-panel panel-visible error-container" 
                        :style="{ width: `${displayLeftWidth}px` }"
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
                        :style="{ width: `${displayRightWidth}px` }"
                    >
                    </component>
                </template>
                <template #fallback>
                    <div 
                    class="right-panel panel-visible error-container" 
                        :style="{ width: `${displayRightWidth}px` }"
                        :class="{ 'panel-animating': isRightPanelAnimating }"
                    >
                        右側面板加載失敗
                    </div>
                </template>
            </Suspense>
  
            <!-- 左側面板調整 -->
            <div id="left-resizer" class="resizer"
                @mousedown="startLeftResize"
                :style="{ left: `calc(1vw + ${displayLeftWidth - 3}px)` }"
                :class="{ 'panel-animating': isLeftPanelAnimating }"
            ></div>
            <div class="toggle-button left" 
                @click="toggleLeftPanel" 
                :style="{ left: `calc(1vw + ${displayLeftWidth+4}px)` }" 
                :class="{ 'panel-animating': isLeftPanelAnimating }"
            >
                {{ leftPanelVisible ? '◀' : '▶' }}
            </div>
  
            <!-- 右側面板調整 -->
            <div id="right-resizer" class="resizer"
                @mousedown="startRightResize"
                :style="{ right: `calc(1vw + ${displayRightWidth - 3}px)` }"
                :class="{ 'panel-animating': isRightPanelAnimating }"
            ></div>
            <div class="toggle-button right" 
                @click="toggleRightPanel" 
                :style="{ right: `calc(1vw + ${displayRightWidth+4}px)` }" 
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
    import { shallowRef, computed, ref, onMounted, onUnmounted } from 'vue';
    import { useSettingsStore } from '@/store/settings';
    import { usePanelResize } from '@/composables/usePanelResize';
    import { usePanelToggle } from '@/composables/usePanelToggle';
    import { loadComponent } from '@/utils/componentLoader';

    const emit = defineEmits(['components-loaded']);

    // 動態導入組件
    const components = shallowRef({
        TopNavbar: loadComponent(() => import('@/components/navbar/TopNavbar.vue')),
        LeftPanel: loadComponent(() => import('@/components/panels/LeftPanel.vue')),
        RightPanel: loadComponent(() => import('@/components/panels/RightPanel.vue')),
        PreviewArea: loadComponent(() => import('@/components/preview/PreviewArea.vue')),
    });

    const settingsStore = useSettingsStore();

    const {
        topNavbarVisible,
        leftPanelVisible,
        rightPanelVisible,
        toggleTopNavbar,
        toggleLeftPanel,
        toggleRightPanel,
        isLeftPanelAnimating,
        isRightPanelAnimating
    } = usePanelToggle();

    const windowWidth = ref(window.innerWidth);
    const updateWindowWidth = () => {
        windowWidth.value = window.innerWidth;
    };

    onMounted(async () => {
        window.addEventListener('resize', updateWindowWidth);
        try {
            await logger.info('HomePage mounted');
            await Promise.all(Object.values(components.value).map(comp => comp()));
            emit('components-loaded');
        } catch (error) {
            console.error('Error loading components:', error);
            // 即使出錯也發送事件，以避免無限加載
            emit('components-loaded');
        }
    });

    onUnmounted(async () => {
        window.removeEventListener('resize', updateWindowWidth);
        await logger.info('HomePage unmounted');
    });

    // 面板調整
    const { width: leftWidth, startResize: startLeftResize, isPanelVisible: isLeftPanelVisible } = usePanelResize('left');
    const { width: rightWidth, startResize: startRightResize, isPanelVisible: isRightPanelVisible } = usePanelResize('right');
    

    // 計算實際顯示寬度
    const maxPanelWidth = computed(() => windowWidth.value * 0.4); // 最大寬度為窗口寬度的 40%

    const displayLeftWidth = computed(() => {
        if (!leftPanelVisible.value) return 0;
        return Math.min(leftWidth.value, maxPanelWidth.value);
    });

    const displayRightWidth = computed(() => {
        if (!rightPanelVisible.value) return 0;
        return Math.min(rightWidth.value, maxPanelWidth.value);
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
        border-radius: 20px; /* 圓角 */
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