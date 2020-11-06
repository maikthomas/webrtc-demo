const webpack = require('webpack');
const path = require('path');

const socketProtocol =
  process.env.NODE_ENV === 'production' ? '"https"' : '"ws"';

const config = {
  entry: ['react-hot-loader/patch', './src/index.js'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'public/bundle.js',
    publicPath: 'dist',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      'react-dom': '@hot-loader/react-dom',
    },
  },
  devServer: {
    contentBase: './dist',
    proxy: {
      '/signalling': 'ws://localhost:8000/signalling',
      ws: true,
    },
  },
  plugins: [new webpack.DefinePlugin({ SOCKET_PROTOCOL: socketProtocol })],
};

module.exports = config;
