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
	},
	custom: {
		appBackground: 'var(--custom-appBackground)',
		previewBackground: 'var(--custom-previewBackground)',
		panelBackground: 'var(--custom-panelBackground)',
		textColor: 'var(--custom-textColor)',
		panelHoverColor: 'var(--custom-panelHoverColor)',
		borderColor: 'var(--custom-borderColor)'
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
				let cssValue = value
				if (this.currentTheme === 'custom') {
					cssValue = this.customTheme[key]
				}
				document.documentElement.style.setProperty(`--${key}`, cssValue)
				document.documentElement.style.setProperty(`--custom-${key}`, this.customTheme[key])
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
		},
		loadCustomTheme() {
			this.customTheme = JSON.parse(localStorage.getItem('customTheme')) || this.customTheme
		},
		updateCustomTheme(newCustomTheme) {
			this.customTheme = { ...this.customTheme, ...newCustomTheme }
			if (this.currentTheme === 'custom') {
				this.applyTheme()
			}
			localStorage.setItem('customTheme', JSON.stringify(this.customTheme))
		},
		loadCustomTheme() {
			const savedCustomTheme = localStorage.getItem('customTheme')
			if (savedCustomTheme) {
				try {
					this.customTheme = JSON.parse(savedCustomTheme)
				} catch (e) {
					console.error('Failed to parse custom theme from localStorage:', e)
				}
			}
		}
	},
	getters: {
		themeNames: () => Object.keys(themes)
	}
})