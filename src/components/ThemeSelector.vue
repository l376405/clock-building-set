<template>
	<el-dropdown trigger="click" @command="changeTheme">
		<el-button class="theme-button">
			<el-icon>
			<component :is="getCurrentThemeIcon"></component>
			</el-icon>
		</el-button>
		<template #dropdown>
			<el-dropdown-menu>
				<el-dropdown-item v-for="theme in themeNames" :key="theme" :command="theme">
					<el-icon class="theme-icon">
					<component :is="getThemeIcon(theme)"></component>
					</el-icon>
					{{ theme }}
				</el-dropdown-item>
				<el-dropdown-item command="custom">
					<el-icon class="theme-icon">
					<Edit />
					</el-icon>
					自定義
				</el-dropdown-item>
			</el-dropdown-menu>
		</template>
	</el-dropdown>
	<CustomThemeEditor v-if="currentTheme === 'custom'" />
</template>
  
<script setup>
	import { computed } from 'vue'
	import { useThemeStore } from '../store/theme'
	import { Sunny, Moon, Brush, Edit } from '@element-plus/icons-vue'
	import CustomThemeEditor from './CustomThemeEditor.vue'

	const themeStore = useThemeStore()

	const currentTheme = computed(() => themeStore.currentTheme)
	const themeNames = computed(() => themeStore.themeNames)

	const themeIcons = {
		light: Sunny,
		dark: Moon,
		colorful: Brush,
		custom: Edit,
	}

	const getCurrentThemeIcon = computed(() => getThemeIcon(currentTheme.value))

	function getThemeIcon(theme) {
		return themeIcons[theme] || Brush
	}

	function changeTheme(themeName) {
		themeStore.setTheme(themeName)
	}
</script>

<style scoped>
	.theme-button {
		width: 38px;
		height: 38px;
		padding: 0;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.theme-button .el-icon {
		font-size: 20px; /* 調整圖標大小 */
	}

	.theme-icon {
		margin-right: 8px;
	}

	:deep(.el-dropdown-menu__item) {
		display: flex;
		align-items: center;
	}
</style>