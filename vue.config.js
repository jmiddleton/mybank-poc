module.exports = {
    configureWebpack: {
      devtool: 'source-map'
    },
    devServer: {
      proxy: {
        // proxy all requests starting with /dev/payees to AWS Lambda
        '^/dev/payees': {
          target: 'https://5a2u1vztie.execute-api.ap-southeast-2.amazonaws.com/dev/payees',
          changeOrigin: true
        }
      }
    }
  }