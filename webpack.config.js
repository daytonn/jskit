var path = require('path')

module.exports = {
  entry: path.join(__dirname, 'src', 'jskit.js'),
  output: {
    filename: 'jskit.js',
    path: path.join(__dirname, 'dist'),
  },

  resolve: {
    root: path.join(__dirname, 'src'),
    extensions: ['', '.js']
  },

  devtool: 'source-map',

  module: {
    loaders: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: { presets: ['es2015'] },
      }
    ]
  }
}
