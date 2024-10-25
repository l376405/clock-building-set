import { defineAsyncComponent, h } from 'vue'
import { logger } from './logger'

export function loadComponent(path) {
  return defineAsyncComponent({
    loader: () => {
      logger.info(`Starting to load component: ${path}`);
      return import(/* @vite-ignore */ path)
        .then(component => {
          logger.info(`Successfully loaded component: ${path}`);
          return component;
        })
        .catch(async error => {
          await logger.warn(`Failed to load component: ${path}`, error);
          return () => h('div', { class: 'error-container' }, `Failed to load component: ${path}`);
        });
    },
    delay: 200,
    timeout: 3000,
    suspensible: true
  })
}