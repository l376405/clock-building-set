<template>
    <div class="top-navbar">
        <div class="top-navbar-content">
            <Suspense>
                <template #default>
                    <component :is="components.userSetting" v-if="components.userSetting" />
                </template>
                <template #fallback>
                    <div class="error-container">用戶設置加載失敗</div>
                </template>
            </Suspense>
            <Suspense>
                <template #default>
                    <component :is="components.ExportArea" v-if="components.ExportArea" />
                </template>
                <template #fallback>
                    <div class="error-container">導出區域加載失敗</div>
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
        userSetting: loadComponent('@/components/navbar/UserSetting.vue'),
        ExportArea: loadComponent('@/components/navbar/ExportArea.vue'),
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