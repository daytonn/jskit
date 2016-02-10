module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['mocha'],
    plugins: [
      'karma-sinon',
      'karma-chrome-launcher',
      'karma-mocha',
      'karma-sourcemap-loader',
      require('karma-webpack')
    ],
    files: ['test/bundle.js'],
    exclude: [],
    preprocessors: {
      'test/bundle.js': ['webpack', 'sourcemap']
    },
    webpack: {
      devtool: 'inline-source-map',
      module: {
        loaders: [
          {
            exclude: /node_modules/,
            loader: 'babel-loader',
            test: /\.js$/
          },
          {
            test: /sinon\.js$/,
            loader: "imports?define=>false"
          }
        ]
      }
    },
    webpackMiddleware: {
      noInfo: true,
    },
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,
    concurrency: Infinity,
    client: {
      mocha: {
        reporter: 'html'
      }
    }
  })
}
