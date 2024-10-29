<template>
	<div class="top-navbar">
	  <div class="top-navbar-content" ref="navbarRef">
		<!-- 左側固定組件 -->
		<div class="navbar-left">
		  <div class="navbar-item navbar-item-medium">
			<Suspense>
			  <component :is="components.userSetting" />
			  <template #fallback>
				<div class="error-container">UserSettings 加載失敗</div>
			  </template>
			</Suspense>
		  </div>
		  <div class="navbar-item navbar-item-medium">
			<Suspense>
			  <component :is="components.ExportArea" />
			  <template #fallback>
				<div class="error-container">ExportArea 加載失敗</div>
			  </template>
			</Suspense>
		  </div>
		</div>
  
		<!-- 中間可拖動區域的網格 -->
		<div class="navbar-grid" ref="gridRef">
		  <!-- 網格背景 -->
		  <div 
			v-for="index in gridCells" 
			:key="index"
			class="grid-cell"
			@dragover.prevent="handleDragOver($event, index - 1)"
			@drop="handleDrop($event, index - 1)"
		  ></div>
  
		  <!-- 示例可拖動組件 -->
		  <template v-for="(demo, index) in demoItems" :key="index">
			<div 
			  :class="[
				'navbar-item',
				'navbar-draggable',
				`navbar-item-${demo.size}`,
				'demo-item',
				{ 'navbar-dragging': isDragging && draggedItem === index }
			  ]"
			  :style="getItemPosition(demo)"
			  draggable="true"
			  @dragstart="handleDragStart($event, index)"
			  @dragend="handleDragEnd"
			>
			  <el-icon class="navbar-icon">
				<component :is="getIconComponent(demo.iconName)" />
			  </el-icon>
			</div>
		  </template>
		</div>
  
		<!-- 右側固定組件 -->
		<div class="navbar-right">
		  <Suspense>
			<component :is="components.ThemeSelector" />
			<template #fallback>
			  <div class="error-container">ThemeSelector 加載失敗</div>
			</template>
		  </Suspense>
		</div>
	  </div>
	</div>
  </template>
<script setup>
import { shallowRef, ref, computed, onMounted } from 'vue';
import { loadComponent } from '@/utils/componentLoader';
import { logger } from '@/utils/logger';
import * as ElementPlusIcons from '@element-plus/icons-vue';

// 組件引用
const components = shallowRef({
  userSetting: loadComponent(() => import('./UserSettings.vue'), 'UserSettings'),
  ExportArea: loadComponent(() => import('./ExportArea.vue'), 'ExportArea'),
  ThemeSelector: loadComponent(() => import('@/components/ThemeSelector.vue'), 'ThemeSelector')
});

// 示例組件數據
const demoItems = ref([
  { iconName: 'Clock', size: 'small', position: 0 },
  { iconName: 'Calendar', size: 'medium', position: 2 },
  { iconName: 'Timer', size: 'large', position: 5 }
]);

// 獲取圖標組件的方法
const getIconComponent = (iconName) => {
  return ElementPlusIcons[iconName];
};

const draggedItem = ref(null);
const navbarRef = ref(null);
const isDragging = ref(false);
  
  // 計算網格數量
  const gridCells = computed(() => {
	if (!navbarRef.value) return 0;
	const totalWidth = navbarRef.value.clientWidth;
	const leftWidth = 156; // 2 * medium item
	const rightWidth = 42; // 1 * small item
	const spacing = 30; // 左右間距總和
	const availableWidth = totalWidth - leftWidth - rightWidth - spacing;
	return Math.max(0, Math.floor(availableWidth / 40)); // 40 = item width(38) + gap(2)
  });
  
  // 計算組件位置
  const getItemPosition = (item) => {
	const baseWidth = 40; // 基礎網格寬度 (38px + 2px gap)
	const left = item.position * baseWidth;
	return {
	  left: `${left}px`
	};
  };
  
  // 拖曳相關方法
  const handleDragStart = (event, index) => {
	draggedItem.value = index;
	isDragging.value = true;
	event.target.classList.add('dragging');
  };
  
  const handleDragEnd = (event) => {
	event.target.classList.remove('dragging');
	isDragging.value = false;
	draggedItem.value = null;
	// 清除所有活動狀態
	document.querySelectorAll('.grid-cell-active').forEach(el => {
	  el.classList.remove('grid-cell-active');
	});
  };
  
  const handleDragOver = (event, gridIndex) => {
	event.preventDefault();
	// 先清除所有活動狀態
	document.querySelectorAll('.grid-cell-active').forEach(el => {
	  el.classList.remove('grid-cell-active');
	});
	
	if (isValidDropPosition(gridIndex)) {
	  // 獲取當前拖曳項目的大小
	  const item = demoItems.value[draggedItem.value];
	  const size = item.size === 'medium' ? 2 : item.size === 'large' ? 3 : 1;
	  
	  // 高亮顯示所有會被佔用的格子
	  for (let i = 0; i < size; i++) {
		const cell = document.querySelector(`.grid-cell:nth-child(${gridIndex + i + 1})`);
		if (cell) {
		  cell.classList.add('grid-cell-active');
		}
	  }
	}
  };
  
  const handleDrop = (event, gridIndex) => {
	event.preventDefault();
	if (!isValidDropPosition(gridIndex)) return;
  
	const items = [...demoItems.value];
	const item = items[draggedItem.value];
	item.position = gridIndex;
	
	// 更新位置
	demoItems.value = items;
	
	// 清理狀態
	document.querySelectorAll('.grid-cell-active').forEach(el => {
	  el.classList.remove('grid-cell-active');
	});
  };
  
  // 檢查是否可以放置
  const isValidDropPosition = (gridIndex) => {
	if (draggedItem.value === null) return false;
	
	const item = demoItems.value[draggedItem.value];
	const size = item.size === 'medium' ? 2 : item.size === 'large' ? 3 : 1;
	
	// 檢查是否超出範圍
	if (gridIndex < 0 || gridIndex + size > gridCells.value) {
	  return false;
	}
	
	// 檢查是否與其他組件重疊
	for (let i = 0; i < demoItems.value.length; i++) {
	  if (i === draggedItem.value) continue;
	  
	  const otherItem = demoItems.value[i];
	  const otherSize = otherItem.size === 'medium' ? 2 : otherItem.size === 'large' ? 3 : 1;
	  
	  if (!(gridIndex + size <= otherItem.position || 
			gridIndex >= otherItem.position + otherSize)) {
		return false;
	  }
	}
	
	return true;
  };
  
  onMounted(() => {
	logger.info('TopNavbar mounted', { gridCells: gridCells.value });
  });
  </script>
  
  <style scoped>
  .top-navbar-content {
	position: relative;
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 100%;
	width: 100%;
	max-height: 50px;
	overflow: hidden;
	box-sizing: border-box;
  }
  
  .navbar-left {
	display: flex;
	gap: 2px;
	height: 100%;
	flex-shrink: 0;
	margin: 0 5px 0 10px;
	align-items: center;
  }
  
  .navbar-grid {
	position: relative;
	flex: 1;
	display: flex;
	justify-content: flex-start;
	align-items: center;
	gap: 2px;
	height: 100%;
	min-width: 0;
	overflow: hidden;
  }
  
  .grid-cell {
	width: var(--navbar-item-small);
	height: 100%;
	background-color: transparent;
	border: 1px dashed rgba(var(--primary-color-rgb), 0.1);
	flex-shrink: 0;
	transition: background-color 0.2s ease;
  }
  
  .grid-cell-active {
	background-color: rgba(var(--primary-color-rgb), 0.1);
  }
  
  .navbar-right {
	display: flex;
	align-items: center;
	height: 100%;
	flex-shrink: 0;
	margin: 0 10px 0 5px;
  }
  
  .demo-item {
	position: absolute;
	background-color: var(--panelBackground);
	display: flex;
	align-items: center;
	justify-content: center;
	height: var(--navbar-height);
	transition: all 0.3s ease;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .demo-item .el-icon {
	font-size: 20px;
	color: var(--textColor);
  }
  </style>