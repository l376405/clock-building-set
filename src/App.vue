<template>
  <div id="app">
    <LoadingAnimation v-show="isLoading" />
    <HomePage @components-loaded="onComponentsLoaded" />
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import { useTitle } from '@vueuse/core'
  import HomePage from './views/HomePage.vue'
  import LoadingAnimation from './components/LoadingAnimation.vue'

  useTitle('Clock Creator -- 給你的網頁時鐘來點自己的創意吧')

  const isLoading = ref(true)

  onMounted(() => {
    // 5秒後強制結束加載
    setTimeout(() => {
      if (isLoading.value) {
        console.warn('Loading timeout, forcing component display');
        isLoading.value = false;
      }
    }, 5000);
  });

  const hideLoadingWithDelay = () => {
    setTimeout(() => {
      isLoading.value = false;
    }, 500); // 500毫秒的延遲，您可以根據需要調整這個值
  }

  const onComponentsLoaded = () => {
    console.log('Components loaded event received');
    hideLoadingWithDelay();
  }
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 5px;
  height: 100vh;
}
</style>