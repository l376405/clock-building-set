import { defineStore } from 'pinia'

const themes = {
  light: {
    appBackground: 'var(--light-appBackground)',
    previewBackground: 'var(--light-previewBackground)',
    panelBackground: 'var(--light-panelBackground)',
    textColor: 'var(--light-textColor)',
    panelHoverColor: 'var(--light-panelHoverColor)',
    borderColor: 'var(--light-borderColor)'
  },
  dark: {
    appBackground: 'var(--dark-appBackground)',
    previewBackground: 'var(--dark-previewBackground)',
    panelBackground: 'var(--dark-panelBackground)',
    textColor: 'var(--dark-textColor)',
    panelHoverColor: 'var(--dark-panelHoverColor)',
    borderColor: 'var(--dark-borderColor)'
  },
  colorful: {
    appBackground: 'var(--colorful-appBackground)',
    previewBackground: 'var(--colorful-previewBackground)',
    panelBackground: 'var(--colorful-panelBackground)',
    textColor: 'var(--colorful-textColor)',
    panelHoverColor: 'var(--colorful-panelHoverColor)',
    borderColor: 'var(--colorful-borderColor)'
  }
}

export const useThemeStore = defineStore('theme', {
  state: () => ({
    currentTheme: 'light',
    customTheme: {
      appBackground: '#ffffff',
      previewBackground: '#f0f0f0',
      panelBackground: '#ffffff',
      textColor: '#333333',
      panelHoverColor: '#e6e6e6',
      borderColor: '#cccccc'
    }
  }),

  getters: {
    themeNames() {
      return Object.keys(themes)
    }
  },

  actions: {
    setTheme(themeName) {
      if (themes[themeName] || themeName === 'custom') {
        this.currentTheme = themeName
        localStorage.setItem('currentTheme', themeName)
        this.applyTheme()
      }
    },

    updateCustomTheme(updates) {
      this.customTheme = { ...this.customTheme, ...updates }
      localStorage.setItem('customTheme', JSON.stringify(this.customTheme))
      if (this.currentTheme === 'custom') {
        this.applyTheme()
      }
    },

    applyTheme() {
      const currentThemeColors = this.currentTheme === 'custom' 
        ? this.customTheme 
        : themes[this.currentTheme]

      if (!currentThemeColors) return

      Object.entries(currentThemeColors).forEach(([key, value]) => {
        if (this.currentTheme === 'custom') {
          document.documentElement.style.setProperty(`--${key}`, value)
        } else {
          const cssVar = value.replace('var(', '').replace(')', '')
          const actualValue = getComputedStyle(document.documentElement)
            .getPropertyValue(cssVar)
            .trim()
          document.documentElement.style.setProperty(`--${key}`, actualValue)
        }
      })
    },

    initTheme() {
      // 加載自定義主題
      const savedCustomTheme = localStorage.getItem('customTheme')
      if (savedCustomTheme) {
        try {
          this.customTheme = JSON.parse(savedCustomTheme)
        } catch (e) {
          console.error('Failed to parse custom theme:', e)
        }
      }

      // 加載當前主題
      const savedTheme = localStorage.getItem('currentTheme')
      if (savedTheme && (themes[savedTheme] || savedTheme === 'custom')) {
        this.currentTheme = savedTheme
      }

      // 應用主題
      this.applyTheme()
    }
  }
})