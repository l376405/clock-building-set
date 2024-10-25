<template>
    <div class="left-panel">
      <div class="left-panel-content">
        <h2>Left Panel Static Content</h2>
        <p>This is some static content for debugging.</p>
        <!-- 保留原有的動態組件，但添加錯誤處理 -->
        <Suspense v-for="(component, name) in components" :key="name">
          <template #default>
            <component :is="component" v-if="component" />
          </template>
          <template #fallback>
            <div class="error-container">{{ name }} 加載中...</div>
          </template>
        </Suspense>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { logger } from '@/utils/logger';
  import { loadComponent } from '@/utils/componentLoader';
  
  const components = ref({
    ClockSetting: loadComponent('@/components/panels/ClockSetting.vue'),
    DateSetting: loadComponent('@/components/panels/DateSetting.vue'),
  });
  
  onMounted(async () => {
    await logger.info('LeftPanel mounted');
  });