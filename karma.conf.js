module.exports = function(config) {
  config.set({
    basePath: "",
    frameworks: [
      "mocha",
      "sinon-chai"
    ],
    files: [
      "node_modules/lodash/index.js",
      "node_modules/jquery/dist/jquery.js",
      "node_modules/chai-jq/chai-jq.js",
      "node_modules/chai-fuzzy/index.js",
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
    browsers: ["Chrome"],
    singleRun: false,
    client: {
      mocha: {
        reporter: 'html'
      }
    },
  });
};
