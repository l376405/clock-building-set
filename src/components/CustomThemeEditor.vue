<template>
	<el-collapse-transition>
		<el-card v-if="visible" class="custom-theme-editor">
			<template #header>
			<div class="card-header">
				<el-icon><Brush /></el-icon>
				<span>自定義主題</span>
			</div>
			</template>
			<div v-for="(value, key) in colors" :key="key" class="color-section">
			<label>{{ getLabel(key) }}：</label>
			<div class="color-picker-wrapper">
				<input type="color" v-model="colors[key]" @input="updateTheme(key)">
				<el-input
				v-model="colors[key]"
				class="hex-input"
				size="small"
				@input="validateAndUpdateHex(key)"
				maxlength="7"
				>
					<template #prefix>#</template>
				</el-input>
			</div>
			</div>
			<el-button type="primary" @click="confirmCustomTheme" class="confirm-button">確定</el-button>
		</el-card>
	</el-collapse-transition>
</template>
  
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useThemeStore } from '@/store/theme'
  import { storeToRefs } from 'pinia'
  import { ElCard, ElButton, ElIcon, ElCollapseTransition } from 'element-plus'
  import { Brush } from '@element-plus/icons-vue'
  import { logger } from '@/utils/logger'
  
  const themeStore = useThemeStore()
  const { customTheme } = storeToRefs(themeStore)
  
  const visible = ref(true)
  const colors = ref({
	appBackground: '',
	previewBackground: '',
	panelBackground: '',
	textColor: '',
	panelHoverColor: '',
	borderColor: '',
  })
  
  const labels = {
	appBackground: '應用背景色',
	previewBackground: '預覽背景色',
	panelBackground: '面板背景色',
	textColor: '文字顏色',
	panelHoverColor: '面板懸停色',
	borderColor: '邊框顏色',
  }
  
  function getLabel(key) {
	return labels[key] || key
  }
  
  onMounted(async () => {
	await logger.debug('CustomThemeEditor mounted', { 
		themeStore: themeStore.$state,
		colors: colors.value 
	})
	Object.keys(colors.value).forEach(key => {
	  colors.value[key] = customTheme.value[key] || '#000000'
	})
  })
  
  function updateTheme(key) {
	themeStore.updateCustomTheme({ [key]: colors.value[key] })
  }
  
  function confirmCustomTheme() {
	themeStore.setTheme('custom')
	closeEditor()
  }
  
  function closeEditor() {
	visible.value = false
	setTimeout(() => emit('close'), 300) // 等待動畫完成後再關閉
  }

  function validateAndUpdateHex(key) {
  // 移除 # 號（如果有的話）
  let hex = colors.value[key].replace('#', '')
  
  // 驗證 HEX 格式
  const hexRegex = /^[0-9A-Fa-f]{6}$/
  
  if (hexRegex.test(hex)) {
    // 如果是有效的 HEX 值，確保格式為 #XXXXXX
    colors.value[key] = '#' + hex.toUpperCase()
    updateTheme(key)
  } else {
    // 如果不是有效的 HEX 值，恢復為之前的值
    colors.value[key] = customTheme.value[key] || '#000000'
  }
}
  
  const emit = defineEmits(['close'])
  </script>
  
  <style scoped>
.custom-theme-editor {
  background-color: var(--el-bg-color);
  border: 1px solid var(--el-border-color);
  border-radius: var(--el-border-radius-base);
  padding: 20px;
  width: 400px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

/* 優化折疊過渡效果，使用 !important 確保覆蓋其他可能的樣式 */
:deep(.el-collapse-transition-enter-active),
:deep(.el-collapse-transition-leave-active) {
  transition: all 0.3s ease-in-out !important;
  transform-origin: center top;
}

:deep(.el-collapse-transition-enter-from),
:deep(.el-collapse-transition-leave-to) {
  opacity: 0;
  transform: scaleY(0.3) scaleX(0.8);
}

:deep(.el-collapse-transition-enter-to),
:deep(.el-collapse-transition-leave-from) {
  opacity: 1;
  transform: scaleY(1) scaleX(1);
}
  
  .card-header {
	display: flex;
	align-items: center;
	font-size: 18px;
	margin-bottom: 20px;
  }
  
  .card-header .el-icon {
	margin-right: 10px;
  }
  
  .close-button {
	margin-left: auto;
  }
  
  .color-section {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 15px;
  }
  
  .color-section label {
	flex: 1;
	margin-right: 10px;
  }
  
  .color-picker-wrapper {
	display: flex;
	align-items: center;
	gap: 8px; /* 添加間距 */
  }
  
  .color-picker-wrapper input[type="color"] {
  width: 40px;
  height: 30px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  overflow: hidden;
  padding: 0;
}

.hex-input {
  width: 100px;
}

:deep(.el-input__wrapper) {
  padding: 0 8px;
}

:deep(.el-input__prefix) {
  color: var(--el-text-color-secondary);
}

.confirm-button {
  margin-top: 20px;
  width: 100%;
}
  </style>