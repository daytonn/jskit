var BROWSER_LIMIT = Infinity
var PORT = 9876
var karmaWebpack = require('karma-webpack')
var webpackConfig = require('./webpack.config.js')

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['mocha', 'sinon-chai'],
    plugins: [
      'karma-mocha',
      'karma-sinon',
      'karma-chai',
      'karma-sinon-chai',
      'karma-chrome-launcher',
      'karma-sourcemap-loader',
      karmaWebpack,
    ],
    files: ['tests.js'],
    exclude: [],
    preprocessors: {
      'tests.js': ['webpack', 'sourcemap'],
    },
    webpack: {
      devtool: 'source-map',
      resolve: webpackConfig.resolve,
      module: {
        loaders: [
          {
            test: /\.js?$/,
            exclude: /node_modules/,
            loader: 'babel',
            query: { presets: ['es2015'] },
          },
          {
            test: /sinon\.js$/,
            loader: 'imports?define=>false',
          },
        ],
      },
    },
    webpackMiddleware: { noInfo: true },
    reporters: ['progress'],
    port: PORT,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,
    concurrency: BROWSER_LIMIT,
    client: {
      mocha: {
        reporter: 'html',
      },
    },
  })
}
