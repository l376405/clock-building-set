<template>
    <div class="home">
        <!-- 左側容器 -->
        <div id="left-container" :style="{ width: `${leftWidth}px` }">
            <!-- 以下引入左側面板 -->
            <LeftSettingPanel />
        </div>
        <!-- 左側調整器 -->
        <div id="left-resizer"></div>

        <!-- 中間容器 -->
        <div id="center-container">
            <div id="date-settings-panel-container">
                <!-- 以下引入年月日設置面板 -->
                <DateObjectList />
            </div>
            <div id="preview-container">
                <!-- 以下引入時鐘顯示 -->
                <ClockDisplay />
            </div>
            <button id="exportHTML" @click="exportHTML">匯出 HTML</button>
        </div>

        <!-- 右側調整器 -->
        <div id="right-resizer"></div>
        <!-- 右側容器 -->
        <div id="right-container" :style="{ width: `${rightWidth}px` }">
            <!-- 以下引入右側面板 -->
            <RightObjectList />
        </div>
    </div>
</template>
<script>
    import { ref, onMounted} from 'vue';
    import { useSettingsStore } from '@/store/settings';
    import RightObjectList from '@/components/RightObjectList.vue';
    import ClockDisplay from '@/components/ClockDisplay.vue';
    import DateObjectList from '@/components/DateObjectList.vue';
    import LeftSettingPanel from '@/components/LeftSettingPanel.vue';
    export default {
        name: 'Home',
        components: {
            RightObjectList,
            ClockDisplay,
            DateObjectList,
            LeftSettingPanel
        },
        setup() {
            const settingsStore = useSettingsStore();
            const leftWidth = ref(300);
            const rightWidth = ref(300);

            const startLeftResize = (e) => {
                const startX = e.clientX;
                const startWidth = leftWidth.value;

                const resize = (e) => {
                    const newWidth = startWidth + e.clientX - startX;
                    if (newWidth > 200 && newWidth < window.innerWidth / 2) {
                        leftWidth.value = newWidth;
                        settingsStore.updateSetting('leftPanelWidth', newWidth);
                    }
                };

                const stopResize = () => {
                    document.removeEventListener('mousemove', resize);
                    document.removeEventListener('mouseup', stopResize);
                };

                document.addEventListener('mousemove', resize);
                document.addEventListener('mouseup', stopResize);
            };

            const startRightResize = (e) => {
                const startX = e.clientX;
                const startWidth = rightWidth.value;

                const resize = (e) => {
                    const newWidth = startWidth - (e.clientX - startX);
                    if (newWidth > 200 && newWidth < window.innerWidth / 2) {
                        rightWidth.value = newWidth;
                        settingsStore.updateSetting('rightPanelWidth', newWidth);
                    }
                };

                const stopResize = () => {
                    document.removeEventListener('mousemove', resize);
                    document.removeEventListener('mouseup', stopResize);
                };

                document.addEventListener('mousemove', resize);
                document.addEventListener('mouseup', stopResize);
            };

            const exportHTML = () => {
            // 實現匯出 HTML 的邏輯
            };

            onMounted(() => {
                settingsStore.loadFromLocalStorage();
                leftWidth.value = settingsStore.leftPanelWidth || 300;
                rightWidth.value = settingsStore.rightPanelWidth || 300;
            });

            return {
            leftWidth,
            rightWidth,
            startLeftResize,
            startRightResize,
            exportHTML
            };
        }
    }
</script>
<style scoped>
    .home {
        display: flex;
        height: 100vh;
        overflow: hidden;
    }

    #left-container, #right-container {
        overflow-y: auto;
    }

    #left-container {
        border-right: 1px solid #ccc;
    }

    #left-resizer, #right-resizer {
        width: 5px;
        background: #ccc;
        cursor: col-resize;
    }

    #center-container {
        flex: 1;
        display: flex;
        flex-direction: column;
    }

    #right-container {
        border-left: 1px solid #ccc;
    }

    #date-settings-panel-container {
    /* 樣式 */
    }

    #preview-container {
    flex: 1;
    /* 其他樣式 */
    }

    #exportHTML {
    /* 按鈕樣式 */
    }
</style>
