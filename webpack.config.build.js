var nodeExternals = require('webpack-node-externals');
var webpack = require('webpack');
var path = require('path');
var fs = require('fs');
var App = require('./dist');

const config = {
  mode: 'development',
  entry: './example/index.js',
  target: 'node',
  resolve: {
    extensions: ['.ts', '.js'],
    modules: [
      'example',
    ]
  },
  plugins: [
    new App(),
  ],
  externals: [nodeExternals()]
};

module.exports = (env, argv) => {
  return config;
}
