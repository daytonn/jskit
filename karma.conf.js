module.exports = function(config) {
  config.set({
    basePath: "",
    frameworks: [
      "mocha-debug",
      "mocha",
      "sinon-chai"
    ],
    files: [
      "node_modules/lodash/index.js",
      "node_modules/jquery/dist/jquery.js",
      "test/test_helper.js",
      "dist/jskit.js",
      "test/**/*_spec.js"
    ],
    exclude: [],
    preprocessors: {},
    reporters: ["dots"],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ["Chrome", "Safari", "Firefox"],
    singleRun: false
  });
};
