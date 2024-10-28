const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/js/controller.js',

  output: {
    filename: 'src/js/controller.js',
    path: path.resolve(__dirname, 'docs'),
  },
  module: {
    rules: [
      {
        test: /\.(svg|png|jpg)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      hash: true,
      template: 'index.html',
      filename: 'index.html',
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/img', to: 'src/img/' },
        { from: 'src/css/style.css', to: 'src/css/' },
      ],
    }),
  ],
};
