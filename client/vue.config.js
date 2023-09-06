const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  // resolve: {
  //   alias: {
  //     '@': __dirname
  //   }
  // },
  css: {
    loaderOptions: {
      sass: {
        additionalData: `@import "@/assets/scss/abstract/mixins.scss";`,
      },
    }
  },

  chainWebpack: config => {
    config.module.rule('vue').use('vue-loader').loader('vue-loader').tap(options => {
      options.compilerOptions = {
        ...options.compilerOptions,
        isCustomElement: tag => tag.startsWith('ion-')
      }
      return options
    })
  },
  devServer: {
    proxy: {
      '^/api': {
        target: 'http://localhost:5000',
        // target: 'https://chitchat-sx7y.onrender.com',
        changeOrigin: true
      }
    }
  }
})
