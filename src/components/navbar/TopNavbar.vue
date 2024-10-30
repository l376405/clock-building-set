<template>
	<div class="top-navbar">
		<div class="top-navbar-content" ref="navbarRef">
      <!-- 左側固定組件 -->
      <div class="navbar-left">
        <div class="navbar-item navbar-item-medium">
          <Suspense>
            <div class="component-wrapper">
              <component :is="components.userSetting" />
            </div>
            <template #fallback>
              <div class="error-container">UserSettings 加載失敗</div>
            </template>
          </Suspense>
        </div>
        <div class="navbar-item navbar-item-medium">
          <Suspense>
            <div class="component-wrapper">
              <component :is="components.ExportArea" />
            </div>
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

        <!-- 可拖動組件 -->
        <template v-for="(demo, index) in demoItems" :key="index">
          <div 
            :class="getItemClasses(demo, index)"
            :style="getItemPosition(demo)"
            draggable="true"
            @dragstart="handleDragStart($event, index)"
            @dragend="handleDragEnd"
          >
            <!-- 圖標類型 -->
            <template v-if="demo.type === COMPONENT_TYPES.ICON">
              <el-icon class="navbar-icon">
                <component :is="getIconComponent(demo.iconName)" />
              </el-icon>
            </template>
            
            <!-- 組件類型 -->
            <template v-else>
              <Suspense>
                <div class="component-wrapper">
                  <component :is="components[demo.componentName]" />
                </div>
                <template #fallback>
                  <div class="error-container">組件加載失敗</div>
                </template>
              </Suspense>
            </template>
          </div>
        </template>
      </div>
  
		<!-- 右側固定組件 -->
		<div class="navbar-right">
		  <Suspense>
			<div class="component-wrapper">
				<component :is="components.ThemeSelector" />
			</div>
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
import { useNavbarStore } from '@/store/navbarStore';
import { logger } from '@/utils/logger';
import * as ElementPlusIcons from '@element-plus/icons-vue';
import { storeToRefs } from 'pinia';
import { COMPONENT_TYPES } from '@/constants';

const navbarStore = useNavbarStore();
const { items: demoItems } = storeToRefs(navbarStore);

const GRID_CONFIG = {
	totalCells: 53,
	baseWidth: 38,
	gap: 2,
  };

const navbarRef = ref(null);
const gridRef = ref(null);
const components = shallowRef({});
const draggedItem = ref(null);
const isDragging = ref(false);
const dragStartPosition = ref(null);
const lastPosition = ref(null);
const displacedItems = ref(new Map());

onMounted(async () => {
  components.value = {
    userSetting: await loadComponent(() => import('./UserSettings.vue'), 'UserSettings'),
    ExportArea: await loadComponent(() => import('./ExportArea.vue'), 'ExportArea'),
    ThemeSelector: await loadComponent(() => import('@/components/ThemeSelector.vue'), 'ThemeSelector')
  };
});


const gridCells = computed(() => GRID_CONFIG.totalCells);

const visibleCells = computed(() => {
  if (!gridRef.value || !navbarRef.value) return GRID_CONFIG.totalCells;
  
  const navbarWidth = navbarRef.value.clientWidth;
  const leftPanelWidth = 156; // 2 * medium item (78px each)
  const rightPanelWidth = 38; // 1 * small item
  const gridPadding = 40; // 左右各20px
  
  const availableWidth = navbarWidth - leftPanelWidth - rightPanelWidth - gridPadding;
  const cellWidth = GRID_CONFIG.baseWidth + GRID_CONFIG.gap;
  
  return Math.floor(availableWidth / cellWidth);
});

const getIconComponent = (iconName) => {
  return ElementPlusIcons[iconName];
};

const getItemClasses = (demo, index) => {
  return [
    'navbar-item',
    'navbar-draggable',
    `navbar-item-${demo.size}`,
    'demo-item',
    { 'dragging': isDragging.value && draggedItem.value === index }
  ];
};

const getItemPosition = (item) => {
  const cellWidth = GRID_CONFIG.baseWidth + GRID_CONFIG.gap;
  const left = item.position * cellWidth + 19;
  
  return {
    left: `${left}px`,
    visibility: item.position < visibleCells.value ? 'visible' : 'hidden',
    position: 'absolute'
  };
};

const pushItems = (fromIndex, toIndex) => {
  if (fromIndex === toIndex) return true;
  
  const items = [...demoItems.value];
  const draggedItemObj = items[draggedItem.value];
  const draggedSize = draggedItemObj.size === 'medium' ? 2 : draggedItemObj.size === 'large' ? 3 : 1;
  const direction = toIndex > fromIndex ? 1 : -1;
  
  // 找到目標位置上的物件
  const targetItem = items.find((item, index) => {
    if (index === draggedItem.value) return false;
    
    const itemSize = item.size === 'medium' ? 2 : item.size === 'large' ? 3 : 1;
    
    // 檢查是否在目標位置上有重疊
    return (toIndex < item.position + itemSize) && 
           (toIndex + draggedSize > item.position);
  });
  
  if (!targetItem) return true;
  
  const targetIndex = items.indexOf(targetItem);
  const targetSize = targetItem.size === 'medium' ? 2 : targetItem.size === 'large' ? 3 : 1;
  
  // 計算新位置（只允許反向移動）
  const newPosition = direction > 0
    ? toIndex - targetSize  // 向右移動時，目標往左移
    : toIndex + draggedSize;  // 向左移動時，目標往右移
    
  // 檢查新位置是否有效
  if (newPosition < 0 || newPosition + targetSize > visibleCells.value) {
    return false;
  }
  
  // 檢查新位置是否會與其他物件重疊
  const hasOverlap = items.some((item, index) => {
    if (index === targetIndex || index === draggedItem.value) return false;
    
    const itemSize = item.size === 'medium' ? 2 : item.size === 'large' ? 3 : 1;
    return (newPosition < item.position + itemSize) && 
           (newPosition + targetSize > item.position);
  });
  
  if (hasOverlap) return false;
  
  // 保存原始位置
  if (!displacedItems.value.has(targetIndex)) {
    displacedItems.value.set(targetIndex, targetItem.position);
  }
  
  // 執行推擠
  items[targetIndex].position = newPosition;
  demoItems.value = items;
  return true;
};

// 首先添加一個檢查位置是否有效的輔助函數
const isValidPosition = (position, size, excludeIndex = null) => {
  if (position < 0 || position + size > visibleCells.value) return false;
  
  return !demoItems.value.some((item, index) => {
    if (index === excludeIndex) return false;
    const itemSize = item.size === 'medium' ? 2 : item.size === 'large' ? 3 : 1;
    
    // 修改重疊檢查邏輯，確保完整範圍檢查
    const itemStart = item.position;
    const itemEnd = item.position + itemSize;
    const newStart = position;
    const newEnd = position + size;
    
    return !(itemEnd <= newStart || itemStart >= newEnd);
  });
};

const handleDragStart = (event, index) => {
  draggedItem.value = index;
  isDragging.value = true;
  dragStartPosition.value = demoItems.value[index].position;
  lastPosition.value = dragStartPosition.value;
  
  const draggedElement = event.target;
  draggedElement.classList.add('dragging');
  draggedElement.style.opacity = '0.5';
  
  const dragImage = draggedElement.cloneNode(true);
  dragImage.style.position = 'absolute';
  dragImage.style.top = '-1000px';
  document.body.appendChild(dragImage);
  event.dataTransfer.setDragImage(dragImage, event.offsetX, event.offsetY);
};

const handleDragEnd = (event) => {
  const draggedElement = event.target;
  draggedElement.classList.remove('dragging');
  draggedElement.style.opacity = '1';
  isDragging.value = false;
  draggedItem.value = null;
  dragStartPosition.value = null;
  lastPosition.value = null;
  
  // 清除被推擠物件的位置記錄
  displacedItems.value.clear();
  
  document.querySelectorAll('.grid-cell-active').forEach(el => {
    el.classList.remove('grid-cell-active');
  });
  
  const dragImage = document.querySelector('.drag-image');
  if (dragImage) {
    dragImage.remove();
  }
};

const handleDragOver = (event, gridIndex) => {
  event.preventDefault();
  
  if (draggedItem.value === null) return;
  
  const item = demoItems.value[draggedItem.value];
  const size = item.size === 'medium' ? 2 : item.size === 'large' ? 3 : 1;
  
  // 確保不超出可見範圍
  if (gridIndex < 0 || gridIndex + size > visibleCells.value) return;
  
  if (dragStartPosition.value !== gridIndex) {
    const canPush = pushItems(dragStartPosition.value, gridIndex);
    if (canPush) {
      const items = [...demoItems.value];
      items[draggedItem.value] = {
        ...items[draggedItem.value],
        position: gridIndex
      };
      demoItems.value = items;
      lastPosition.value = gridIndex;
    }
  }
  
  // 更新高亮顯示
  document.querySelectorAll('.grid-cell-active').forEach(el => {
    el.classList.remove('grid-cell-active');
  });
  
  for (let i = 0; i < size; i++) {
    const cell = document.querySelector(`.grid-cell:nth-child(${gridIndex + i + 1})`);
    if (cell) {
      cell.classList.add('grid-cell-active');
    }
  }
};

const handleDrop = (event, gridIndex) => {
  event.preventDefault();
  
  if (draggedItem.value === null) return;
  if (gridIndex >= visibleCells.value) return;
  
  const items = [...demoItems.value];
  const item = items[draggedItem.value];
  const size = item.size === 'medium' ? 2 : item.size === 'large' ? 3 : 1;
  
  const maxStartPosition = Math.min(visibleCells.value - size, gridCells.value - size);
  let adjustedIndex = Math.min(gridIndex, maxStartPosition);
  adjustedIndex = Math.max(0, adjustedIndex);
  
  // 檢查是否與其他物件重疊
  const hasOverlap = items.some((otherItem, index) => {
    if (index === draggedItem.value) return false;
    
    const otherSize = otherItem.size === 'medium' ? 2 : otherItem.size === 'large' ? 3 : 1;
    const otherLeft = otherItem.position;
    const otherRight = otherItem.position + otherSize - 1;
    
    const newLeft = adjustedIndex;
    const newRight = adjustedIndex + size - 1;
    
    // 檢查是否有任何重疊
    return !(otherRight < newLeft || otherLeft > newRight);
  });
  
  // 如果有重疊，嘗試回到原始位置
  if (hasOverlap) {
    if (dragStartPosition.value !== null) {
      items[draggedItem.value].position = dragStartPosition.value;
      demoItems.value = items;
    }
    return;
  }
  
  // 如果沒有重疊，更新位置
  items[draggedItem.value] = {
    ...items[draggedItem.value],
    position: adjustedIndex
  };
  demoItems.value = items;
  
  document.querySelectorAll('.grid-cell-active').forEach(el => {
    el.classList.remove('grid-cell-active');
  });
};
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
  margin-left: 5px;
}

.navbar-right {
  display: flex;
  align-items: center;
  height: 100%;
  flex-shrink: 0;
  margin: 0 10px 0 5px;
  min-width: 38px;
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
  padding: 0 20px;
  box-sizing: border-box;
  mask-image: linear-gradient(to right, 
    black calc(100% - 40px), 
    transparent 100%
  );
}

.grid-cell {
  flex: 0 0 38px;
  width: 38px;
  height: var(--navbar-height);
  border: 1px dashed transparent;
  box-sizing: border-box;
  transition: border-color 0.3s;
}

.grid-cell-active {
  border-color: var(--el-color-primary);
}

.navbar-item {
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.navbar-draggable {
  cursor: move;
}

.demo-item {
  position: absolute;
  background-color: var(--panelBackground);
  display: flex;
  align-items: center;
  justify-content: center;
  height: var(--navbar-height);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  border-radius: var(--navbar-capsule-radius);
}

.demo-item.navbar-item-small {
  width: 38px;
}

.demo-item.navbar-item-medium {
  width: 78px;
}

.demo-item.navbar-item-large {
  width: 118px;
}

.demo-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

.demo-item.dragging {
  transform: scale(1.05);
  opacity: 0.5;
  z-index: 1000;
}

.demo-item .el-icon {
  font-size: 20px;
  color: var(--textColor);
}

.error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 0 10px;
  color: var(--el-color-danger);
  font-size: 12px;
}

.component-wrapper {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>