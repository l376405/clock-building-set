<template>
  <div class="left-panel">
      <div class="left-panel-content">
          <Suspense>
              <template #default>
                  <component :is="components.ClockSetting" v-if="components.ClockSetting" />
              </template>
              <template #fallback>
                  <div class="error-container">時鐘設置加載失敗</div>
              </template>
          </Suspense>
          <Suspense>
              <template #default>
                  <component :is="components.DateSetting" v-if="components.DateSetting" />
              </template>
              <template #fallback>
                  <div class="error-container">日期設置加載失敗</div>
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
      ClockSetting: loadComponent(() => import('@/components/panels/ClockSetting.vue')),
      DateSetting: loadComponent(() => import('@/components/panels/DateSetting.vue')),
  });

  onMounted(async () => {
      await logger.info('LeftPanel mounted');
  });
</script>

<script>
  export default {
      name: 'LeftPanel'
  }
</script>