// src/store/settings.js
import { defineStore } from 'pinia'
import { logger } from '../utils/logger'

export const useSettingsStore = defineStore('settings', {
  // 狀態儲存位置
  state: () => ({

    // 面板設置
    leftPanelWidth: 300, // 左側面板寬度
    rightPanelWidth: 300, // 右側面板寬度
    leftPanelVisible: true, // 左側面板是否可見
    rightPanelVisible: true, // 右側面板是否可見

    // 時鐘設定
    basic: {
      timeFormat: 'HH:mm:ss', // 時間格式
      fontFamily: 'Arial', // 字體
      fontSize: '5rem', // 字體大小
      textColor: '#000000' // 文字顏色
    },
    // 分隔符設定
    separator: {
      character: ':', // 分隔符號
      rotation: 0, // 旋轉角度
      leftMargin: 0.2, // 左邊距
      rightMargin: 0.2 // 右邊距
    },
    // 時鐘外觀設定
    appearance: {
      strokeColor: '#ffffff', // 邊框顏色
      strokeWidth: 0, // 邊框寬度
      backgroundColor: '#ffffff', // 背景顏色
      transparentBg: false // 是否透明背景
    },
    // 時鐘動畫設定
    animation: {
      digitDuration: 0.5, // 數字動畫持續時間
      digitExitAnimation: '', // 數字退出動畫
      digitEnterAnimation: '', // 數字進入動畫
      colonKeyframes: '', // 冒號動畫關鍵幀
      colonProperties: '' // 冒號動畫屬性
    },
    // 時鐘元件圖片設定
    images: {
      numbers: {}, // 數字圖片
      separator: '', // 分隔符圖片
      numberSize: 50, // 數字圖片大小
      separatorSize: 50 // 分隔符圖片大小
    },

    // 其他自定義CSS
    customCSS: '',

    // 日期設定
    dateSettings: {
      yearFormat: '', // 年份格式
      monthFormat: '', // 月份格式
      dayFormat: '', // 日期格式
      weekdayFormat: '', // 星期格式
      separator: '', // 分隔符號
      fontSize: '5rem' // 字體大小
    }
  }),

  // 執行動作設定
  actions: {
    //更新設定
    async updateSetting(path, value) {
      const keys = path.split('.'); // 分割路徑
      let current = this; // 當前狀態
      await logger.debug('Updating setting', { path, value }); // 記錄更新設定
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]]; // 更新當前狀態
      }
      current[keys[keys.length - 1]] = value; // 更新當前狀態
      this.saveToLocalStorage(path, value); // 保存到本地儲存
      await logger.info('Updated setting', { path }); // 記錄更新設定
    },
    // 保存到本地儲存
    saveToLocalStorage(path, value) {
      localStorage.setItem(`settings.${path}`, JSON.stringify(value));
    },
    // 從本地儲存加載
    async loadFromLocalStorage() {
      Object.keys(this.$state).forEach(async (key) => {
        const value = localStorage.getItem(`settings.${key}`); // 從本地儲存取得值
        if (value) {
          this.$patch({ [key]: JSON.parse(value) }); // 更新狀態
          await logger.debug(`Loaded setting from localStorage: ${key}`, { value: JSON.parse(value) });  // 新增日誌
        }
      });
      await logger.info('Finished loading settings from localStorage');  // 新增日誌
    }
  }
})