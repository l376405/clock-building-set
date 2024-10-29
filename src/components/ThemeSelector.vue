<template>
	<div class="theme-selector navbar-item navbar-item-small">
	  <el-dropdown
		ref="dropdown"
		trigger="click"
		@command="changeTheme"
		@visible-change="handleDropdownVisibleChange"
		:hide-on-click="false"
	  >
		<el-button class="theme-button navbar-button">
			<el-icon>
				<component :is="getCurrentThemeIcon"></component>
			</el-icon>
		</el-button>
		<template #dropdown>
			<el-dropdown-menu>
				<el-dropdown-item v-for="theme in themeNames" :key="theme" :command="theme">
					<el-icon class="navbar-icon">
						<component :is="getThemeIcon(theme)"></component>
					</el-icon>
					{{ theme }}
					</el-dropdown-item>
					<el-dropdown-item @click.stop="openCustomEditor">
					<el-icon class="navbar-icon">
						<Edit />
					</el-icon>
					自定義
				</el-dropdown-item>
			</el-dropdown-menu>
		</template>
	  </el-dropdown>
	  <Teleport to="body">
		<transition name="fade">
			<div v-if="showCustomEditor" class="custom-editor-wrapper" @click.self="closeCustomEditor">
				<CustomThemeEditor 
				v-show="showCustomEditor" 
				@close="closeCustomEditor" 
				:show="showCustomEditor"
				/>
			</div>
		</transition>
    </Teleport>
	</div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import { useThemeStore } from '../store/theme'
  import CustomThemeEditor from './CustomThemeEditor.vue'
  import { Edit } from '@element-plus/icons-vue'
  import '../assets/styles/navbar.css'
  
  const themeStore = useThemeStore()
  const dropdown = ref(null)
  
  const currentTheme = computed(() => themeStore.currentTheme)
  const themeNames = computed(() => themeStore.themeNames.filter(theme => theme !== 'custom'))
  
  const themeIcons = {
	light: 'Sunny',
	dark: 'Moon',
	colorful: 'Brush',
	custom: 'Edit',
  }
  
  const getCurrentThemeIcon = computed(() => getThemeIcon(currentTheme.value))
  
  function getThemeIcon(theme) {
	return themeIcons[theme] || 'Brush'
  }
  
  const showCustomEditor = ref(false)
  
  function changeTheme(themeName) {
	console.log("changeTheme", themeName)
	themeStore.setTheme(themeName)
	if (themeName !== 'custom') {
	  closeDropdown()
	}
  }
  
  function openCustomEditor(event) {
	event.stopPropagation()
	showCustomEditor.value = true
	console.log("openCustomEditor", showCustomEditor.value)
	themeStore.setTheme('custom')
	closeDropdown()
  }
  
  function closeDropdown() {
	console.log("closeDropdown")
	if (dropdown.value) {
	  dropdown.value.handleClose()
	}
  }
  
  function handleDropdownVisibleChange(visible) {
	console.log("handleDropdownVisibleChange", visible)
	if (!visible && !showCustomEditor.value) {
	  closeDropdown()
	}
  }
  
  function closeCustomEditor() {
	console.log("closeCustomEditor")
	showCustomEditor.value = false
  }
  </script>
  
  <style scoped>
  .theme-selector {
	position: relative;
  }
  
  .theme-button {
	padding: 0;
  }
  
  .theme-button .el-icon {
	font-size: 20px;
  }
  
  .theme-icon {
	margin-right: 8px;
  }
  
  :deep(.el-dropdown-menu__item) {
	display: flex;
	align-items: center;
  }
  
/* 只保留背景遮罩的淡入淡出效果 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.custom-editor-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 100;
}
  </style>