const path = require('path');

module.exports = {
  entry: './src/index.js', // або './src/main.js'
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  devServer: {
    static: './public',
    port: 8080,
  },
};