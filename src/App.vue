<template>
	<el-container id="app">
		<LoadingAnimation v-show="isLoading" />
		<HomePage @components-loaded="onComponentsLoaded" />
	</el-container>
</template>

<script setup>
	import { ref, onMounted, onErrorCaptured } from 'vue'
	import { useTitle } from '@vueuse/core'
	import HomePage from './views/HomePage.vue'
	import LoadingAnimation from './components/LoadingAnimation.vue'
	import { useThemeStore } from './store/theme'

	useTitle('Clock Creator -- 給你的網頁時鐘來點自己的創意吧')

	const isLoading = ref(true)
	const themeStore = useThemeStore()

	onErrorCaptured((err, instance, info) => {
		console.error('Error captured in App.vue:', err, instance, info)
		isLoading.value = false
		return false
	})

	onMounted(() => {
  console.log('App mounted')
  console.log('Initial localStorage state:', {
    theme: localStorage.getItem('theme'),
    customTheme: localStorage.getItem('customTheme')
  })
  
  try {
    themeStore.initTheme()
    console.log('Theme initialized:', {
      currentTheme: themeStore.currentTheme,
      customTheme: themeStore.customTheme
    })
  } catch (error) {
    console.error('Error initializing theme:', error)
  }
})

	const hideLoadingWithDelay = () => {
		setTimeout(() => {
			isLoading.value = false
			console.log('Loading finished')
		}, 600)
	}

	const onComponentsLoaded = () => {
	console.log('Components loaded event received')
	hideLoadingWithDelay()
}
</script>

<style>
	#app {
		font-family: var(--el-font-family);
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-align: center;
		height: 100vh;
		background-color: var(--appBackground);
		color: var(--textColor);
	}
</style>
