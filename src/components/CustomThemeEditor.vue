<template>
	<div class="custom-theme-editor">
		<h3>自定義主題</h3>
		<div v-for="(color, key) in customTheme" :key="key" class="color-picker">
			<label>{{ key }}</label>
			<input type="color" :value="color" @input="updateColor(key, $event.target.value)">
		</div>
	</div>
</template>

<script setup>
	import { useThemeStore } from '@/store/theme'
	import { storeToRefs } from 'pinia'

	const themeStore = useThemeStore()
	const { customTheme } = storeToRefs(themeStore)

	function updateColor(key, value) {
		themeStore.updateCustomTheme({ [key]: value })
	}
</script>

<style scoped>
	.custom-theme-editor {
		/* 添加樣式 */
	}
	.color-picker {
		display: flex;
		align-items: center;
		margin-bottom: 10px;
	}
	.color-picker label {
		margin-right: 10px;
	}
</style>