<template>
    <div class="preview-area">
        <div class="preview-area-content">
            <Suspense>
                <template #default>
                    <component :is="components.ClockObject" v-if="components.ClockObject" />
                </template>
                <template #fallback>
                    <div class="error-container">時鐘對象加載失敗</div>
                </template>
            </Suspense>
            <Suspense>
                <template #default>
                    <component :is="components.DateObject" v-if="components.DateObject" />
                </template>
                <template #fallback>
                    <div class="error-container">日期對象加載失敗</div>
                </template>
            </Suspense>
        </div>
    </div>
</template>
<script setup>
    import { shallowRef, onMounted } from 'vue';
    import { useSettingsStore } from '@/store/settings';
    import { logger } from '@/utils/logger';
    import { loadComponent } from '@/utils/componentLoader';

    const components = shallowRef({
        ClockObject: loadComponent('@/components/preview/ClockObject.vue'),
        DateObject: loadComponent('@/components/preview/DateObject.vue'),
    });

    onMounted(async () => {
        await logger.info('PreviewArea mounted');
    });
</script>

<script>
    export default {
        name: 'PreviewArea'
    }
</script>

<style scoped>
.preview-area {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.preview-area-content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
</style>
