module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: [
      'browserify',
      'source-map-support',
      'mocha-debug',
      'mocha',
      'sinon-chai'
    ],
    files: [
      'node_modules/karma-babel-preprocessor/node_modules/babel-core/browser-polyfill.js',
      'node_modules/lodash/index.js',
      'node_modules/jquery/dist/jquery.js',
      'test/test_helper.js',
      'test/**/*_spec.js'
    ],
    exclude: [],
    preprocessors: {
      'src/**/*.js': ['browserify'],
      'test/**/*.js': ['browserify']
    },
    browserify: {
      debug: true,
      transform: ['babelify']
    },
    reporters: ['dots'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false
  });
};
