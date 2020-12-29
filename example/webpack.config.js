/* eslint-disable @typescript-eslint/no-var-requires */
const HTMLWebpackPlugin = require('html-webpack-plugin')
const ReleaseVersionWebpackPlugin = require('../')
module.exports = {
  entry: './index.js',
  plugins: [new HTMLWebpackPlugin(), new ReleaseVersionWebpackPlugin()],
}
