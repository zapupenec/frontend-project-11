import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import url from 'url';
import path from 'path';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDev = process.env.NODE_ENV === 'development';
const genFilename = (ext) => (isDev ? `[name].${ext}` : `[name].[contenthash].${ext}`);

export default {
  mode: process.env.NODE_ENV,
  entry: './src/index.js',
  devtool: isDev ? 'source-map' : 'eval',
  output: {
    filename: genFilename('js'),
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    // open: {
    //   target: ['/main.html'],
    //   app: {
    //     arguments: ['--new-window'],
    //   },
    // },
    hot: isDev,
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: genFilename('html'),
      template: 'index.html',
      cache: true,
    }),
    new MiniCssExtractPlugin({
      filename: genFilename('css'),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader', 'postcss-loader'],
      },
    ],
  },
};
