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
    currentTheme: 'light'
  }),
  actions: {
    setTheme(themeName) {
      if (themes[themeName]) {
        this.currentTheme = themeName
        try {
          localStorage.setItem('theme', themeName)
        } catch (e) {
          console.error('Failed to save theme to localStorage:', e)
        }
        this.applyTheme()
      }
    },
    applyTheme() {
      const theme = themes[this.currentTheme]
      Object.entries(theme).forEach(([key, value]) => {
        document.documentElement.style.setProperty(`--${key}`, value)
      })
    },
    initTheme() {
      let savedTheme
      try {
        savedTheme = localStorage.getItem('theme')
      } catch (e) {
        console.error('Failed to get theme from localStorage:', e)
      }
      if (savedTheme && themes[savedTheme]) {
        this.currentTheme = savedTheme
      }
      this.applyTheme()
    }
  },
  getters: {
    themeNames: () => Object.keys(themes)
  }
})