const GenerateJsonPlugin = require('generate-json-webpack-plugin')
const ZipPlugin = require('zip-webpack-plugin')
const packageJson = require('./package.json')

// vue.config.js
module.exports = {
  devServer: {
    // In CI mode, Safari cannot contact "localhost", so as a workaround, run the dev server using the jenkins agent pod dns instead.
    host: process.env.JENKINS_AGENT_NAME || 'localhost',
    // Do not proxy in production to allow for mocking api response in e2e test ( e2e tests are run in production mode)
    proxy: process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:8080'
  },
  publicPath: process.env.NODE_ENV === 'production' ? '/plugin/app/molgenis-app-mosaic-calculator/' : '/',
  configureWebpack: {
    plugins: [
      new GenerateJsonPlugin('config.json', {
        name: packageJson.name,
        label: packageJson.name,
        description: packageJson.description,
        version: packageJson.version,
        apiDependency: 'v2',
        includeMenuAndFooter: true,
        runtimeOptions: {
          language: 'en',
          showCountryFacet: true,
          preConfiguredCountyCode: ''
        }
      }),
      new ZipPlugin({
        filename: packageJson.name + '.zip'
      })
    ]
  },
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        if (process.env.NODE_ENV === 'production') {
          args[0].template = 'app-template.html'
        }
        return args
      })
    config.module
      .rule('worker')
      .test(/\.worker\.js$/)
      .use('worker-loader')
      .loader('worker-loader')
      .options({
        name: 'js/[name].[hash].js'
      })
      .end()
  }
}
