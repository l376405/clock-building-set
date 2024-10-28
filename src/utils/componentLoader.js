import { defineAsyncComponent, h, markRaw } from 'vue'
import { logger } from './logger'

export function loadComponent(importFunc, componentName) {
	if (typeof importFunc !== 'function') {
		console.error('importFunc must be a function')
		return null;
	}

return markRaw(defineAsyncComponent({
    loader: async () => {
		try {
			logger.info(`Starting to load component: ${componentName || 'Unknown'}`);
			await new Promise(resolve => setTimeout(resolve, 100));
			const component = await importFunc();
			logger.info(`Successfully loaded component: ${componentName || 'Unknown'}`);
			return component;
		} catch (error) {
			await logger.warn(`Failed to load component: ${componentName || 'Unknown'}`, error);
			throw error;
		}
    },
    delay: 200,
    timeout: 3000,
    suspensible: true,
    errorComponent: {
		setup() {
			return () => h('div', {
			  	class: ['error-container', componentName ? componentName.toLowerCase().replace(/\s+/g, '-') : 'unknown']
			}, `${componentName || 'Component'} 加載失敗`);
		}
    },
    loadingComponent: {
		setup() {
			return () => h('div', { class: 'loading' }, 'Loading...');
		}
    },
    onError: (error, retry, fail, attempts) => {
			if (attempts <= 3) {
				retry()
			} else {
				fail()
			}
		}
	}))
}