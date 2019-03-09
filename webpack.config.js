const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devtool: 'inline-source-map',
  target: 'node',
  devServer: {
    // contentBase: './dist',
  },
  module: {
    noParse: /express|ws/,
  }
};