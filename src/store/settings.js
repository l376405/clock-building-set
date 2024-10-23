// src/store/settings.js
import { defineStore } from 'pinia'
import { Logger } from '../utils/logger'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    basic: {
      timeFormat: 'HH:mm:ss',
      font: 'Arial',
      fontSize: '5rem',
      textColor: '#000000'
    },
    separator: {
      character: ':',
      rotation: 0,
      leftMargin: 0.2,
      rightMargin: 0.2
    },
    appearance: {
      strokeColor: '#ffffff',
      strokeWidth: 0,
      backgroundColor: '#ffffff',
      transparentBg: false
    },
    animation: {
      digitDuration: 0.5,
      digitExitAnimation: '',
      digitEnterAnimation: '',
      colonKeyframes: '',
      colonProperties: ''
    },
    images: {
      numbers: {},
      separator: '',
      numberSize: 50,
      separatorSize: 50
    },
    customCSS: '',
    dateSettings: {
      yearFormat: '',
      monthFormat: '',
      dayFormat: '',
      weekdayFormat: '',
      separator: '',
      fontSize: '5rem'
    }
  }),

  actions: {
    updateSetting(path, value) {
      const keys = path.split('.');
      let current = this;
      Logger.debug('Updating setting', { path, value });
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      this.saveToLocalStorage(path, value);
      Logger.info('Updated setting', { path });
    },

    saveToLocalStorage(path, value) {
      localStorage.setItem(`settings.${path}`, JSON.stringify(value));
    },

    loadFromLocalStorage() {
      Object.keys(this.$state).forEach(key => {
        const value = localStorage.getItem(`settings.${key}`);
        if (value) {
          this.$patch({ [key]: JSON.parse(value) });
        }
      });
    }
  }
})