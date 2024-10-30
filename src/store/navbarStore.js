import { defineStore } from 'pinia'
import { COMPONENT_TYPES } from '@/constants';

  export const useNavbarStore = defineStore('navbar', {
	state: () => ({
	  items: [
		{ 
		  type: COMPONENT_TYPES.ICON,
		  iconName: 'Clock', 
		  size: 'small', 
		  position: 0 
		},
		{ 
		  type: COMPONENT_TYPES.ICON,
		  iconName: 'Calendar', 
		  size: 'medium', 
		  position: 2 
		},
		{ 
		  type: COMPONENT_TYPES.COMPONENT,
		  componentName: 'ThemeSelector',
		  size: 'small', 
		  position: 4 
		},
		{ 
		  type: COMPONENT_TYPES.ICON,
		  iconName: 'Timer', 
		  size: 'large', 
		  position: 5 
		}
	  ]
	})
  }, {
	// 添加持久化配置
	persist: true
  })