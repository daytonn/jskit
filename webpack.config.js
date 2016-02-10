module.exports = {
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        cacheDirectory: true,
        query: {
          presets: ['es2015']
        }
      }
    ]
  }
}
