<template>
    <div class="right-panel">
        <div class="right-panel-content">
            <Suspense>
                <template #default>
                    <component :is="components.ImageUpload" v-if="components.ImageUpload" />
                </template>
                <template #fallback>
                    <div class="error-container">圖片上傳加載失敗</div>
                </template>
            </Suspense>
            <Suspense>
                <template #default>
                    <component :is="components.ObjectList" v-if="components.ObjectList" />
                </template>
                <template #fallback>
                    <div class="error-container">對象列表加載失敗</div>
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
        ImageUpload: loadComponent(() => import('@/components/navbar/ImageUpload.vue')),
        ObjectList: loadComponent(() => import('@/components/panels/ObjectList.vue')),
    });

    onMounted(async () => {
        await logger.info('RightPanel mounted');
    });
</script>

<script>
    export default {
        name: 'RightPanel'
    }
</script>
