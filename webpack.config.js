const path = require('path');
const slsw = require('serverless-webpack');
const CopyPlugin = require('copy-webpack-plugin');

const entries = {};

console.log(JSON.stringify(slsw.lib.entries, null, 2))

//prevent serverless-webpack trying to transpile .py
Object.keys(slsw.lib.entries).forEach(
  key => {
    if (!slsw.lib.entries[key].match(/\.py$/)) {
      entries[key] = slsw.lib.entries[key]
    }
  }
);
console.log(JSON.stringify(entries, null, 2))
module.exports = {
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  entry: entries,
  target: 'node',
  devtool: 'source-map',
  resolve: {
    extensions: ['.wasm', '.mjs', '.js', '.jsx', '.json', '.ts', '.tsx'],
    alias: {
      src: path.resolve(__dirname, 'src/'),
    }
  },
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js',
  },
  module: {
    rules: [
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      {
        test: /\.tsx?$/,
        loader: 'ts-loader'
      },
    ],
  },
  plugins: [
    new CopyPlugin([
      './python/**/*.py',
      './bin/**'
    ])
  ],
};