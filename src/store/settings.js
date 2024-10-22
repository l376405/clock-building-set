// src/store/settings.js
import { reactive } from 'vue'

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
    }
    })