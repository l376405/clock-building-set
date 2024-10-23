const { defineConfig } = require('@vue/cli-service')

// 從環境變量中讀取配置，如果未設置，預設為 false
const skipDebug = process.env.VUE_APP_SKIP_DEBUG === 'true'

module.exports = defineConfig({
  transpileDependencies: true,
  
  devServer: {
    client: {
      overlay: skipDebug ? false : {
        errors: true,
        warnings: false
      }
    }
  },
  
  lintOnSave: !skipDebug,

  chainWebpack: config => {
    if (skipDebug && config.plugins.has('eslint')) {
      config.plugin('eslint').tap(args => {
        if (args[0]) {
          args[0].failOnError = false
        }
        return args
      })
    }
  }
})