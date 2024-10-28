export function applyCustomTheme(theme) {
	Object.entries(theme).forEach(([key, value]) => {
	  document.documentElement.style.setProperty(`--${key}`, value)
	})
  }