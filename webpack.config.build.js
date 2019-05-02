var nodeExternals = require('webpack-node-externals');
var webpack = require('webpack');
var path = require('path');
var fs = require('fs');
var IndexGenerator = require('./dist');

const config = {
  mode: 'development',
  entry: './example/index.js',
  target: 'node',
  output: {
    // Puts the output at the root of the dist folder
    path: path.join(__dirname, 'dist2'),
    filename: 'index.js'
  },
  resolve: {
    extensions: ['.ts', '.js'],
    modules: [
      'example',
    ]
  },
  plugins: [
    new IndexGenerator(),
  ],
  externals: [nodeExternals()]
};

module.exports = (env, argv) => {
  return config;
}
