// src/store/settings.js
import { reactive, watch } from 'vue'

export const settingsStore = reactive({

    // 基本設置
    basic: {
        timeFormat: 'HH:mm:ss',
        font: 'Arial',
        fontSize: '5rem',
        textColor: '#000000'
    },

    // 分隔符設置
    separator: {
        character: ':',
        rotation: 0,
        leftMargin: 0.2,
        rightMargin: 0.2
    },

    // 外觀設置
    appearance: {
        strokeColor: '#ffffff',
        strokeWidth: 0,
        backgroundColor: '#ffffff',
        transparentBg: false
    },

    // 動畫設置
    animation: {
        digitDuration: 0.5,
        digitExitAnimation: '',
        digitEnterAnimation: '',
        colonKeyframes: '',
        colonProperties: ''
    },

    // 圖片設置
    images: {
        numbers: {},
        separator: '',
        numberSize: 50,
        separatorSize: 50
    },

    // 自訂 CSS
    customCSS: '',

    // 日期設置
    dateSettings: {
        yearFormat: '',
        monthFormat: '',
        dayFormat: '',
        weekdayFormat: '',
        separator: '',
        fontSize: '5rem'
    },

    // 方法來更新設置
    updateSetting(path, value) {
        const keys = path.split('.');
        let current = this;
        for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
        this.saveToLocalStorage(path, value);
    },

    // 保存到本地存儲
    saveToLocalStorage(path, value) {
        localStorage.setItem(`settings.${path}`, JSON.stringify(value));
    },

    // 從本地存儲加載
    loadFromLocalStorage() {
        Object.keys(this).forEach(key => {
        if (typeof this[key] !== 'function') {
            const value = localStorage.getItem(`settings.${key}`);
            if (value) {
            this[key] = JSON.parse(value);
            }
        }
        });
    }
});

// 監聽變化並保存到本地存儲
watch(
    () => settingsStore,
    (newValue) => {
      Object.keys(newValue).forEach(key => {
        if (typeof newValue[key] !== 'function') {
          localStorage.setItem(`settings.${key}`, JSON.stringify(newValue[key]));
        }
      });
    },
    { deep: true }
);

// 初始加載
settingsStore.loadFromLocalStorage();