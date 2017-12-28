var path = require("path")

module.exports = {
  entry: path.join(__dirname, "src", "jskit.js"),
  output: {
    filename: "jskit.js",
    path: path.join(__dirname, "dist"),
  },

  resolve: {
    modules: [
      "node_modules",
      path.join(__dirname, "src")
    ],
    extensions: [".js"]
  },

  devtool: "source-map",

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["env"]
          }
        }
      }
    ]
  }
}
