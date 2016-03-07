module.exports = {
  entry: './src/jskit.js',
  output: {
    path: './dist',
    filename: 'jskit.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        cacheDirectory: true,
        query: {
          presets: ['es2015', 'stage-0']
        }
      }
    ]
  }
}
