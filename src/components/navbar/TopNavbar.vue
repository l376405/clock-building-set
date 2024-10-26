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
			<ThemeSelector />
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
	import ThemeSelector from '@/components/ThemeSelector.vue';

	const components = shallowRef({
		userSetting: loadComponent('@/components/navbar/UserSetting.vue'),
		ExportArea: loadComponent('@/components/navbar/ExportArea.vue'),
	});

	onMounted(async () => {
		await logger.info('TopNavbar mounted');
	});
</script>

<script>
	export default {
		name: 'TopNavbar'
	}
</script>

<style scoped>
	.top-navbar-content {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 20px;
		height: 50px; /* 設置導航欄高度 */
	}

	.top-navbar-content > * {
		margin: 0 10px;
	}
</style>