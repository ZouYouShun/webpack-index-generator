var nodeExternals = require('webpack-node-externals');
var webpack = require('webpack');
var path = require('path');

const config = {
  mode: 'development',
  entry: path.join(__dirname, './app/index.ts'),
  target: 'node',
  output: {
    // Puts the output at the root of the dist folder
    path: path.join(__dirname, '../../dist/webpack-index-generator'),
    filename: 'index.js'
  },
  resolve: {
    alias: {
    },
    extensions: ['.ts', '.js'],
    modules: [
      'node_modules',
      'src',
    ]
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      options: {
        test: /\.ts$/,
        ts: {
          compiler: 'typescript',
          configFileName: 'tsconfig.json'
        },
        tslint: {
          emitErrors: true,
          failOnHint: true
        }
      }
    }),
  ],
  module: {
    rules: [{
      test: /\.ts$/,
      use: 'awesome-typescript-loader'
    }]
  },
  externals: [nodeExternals()]
};

module.exports = (env, argv) => {
  if (!argv.prod) {
    config.devtool = 'source-map';
  }
  return config;
}