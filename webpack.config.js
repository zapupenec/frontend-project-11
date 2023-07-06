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
  entry: ['@babel/polyfill', path.resolve(__dirname, 'src', 'index.js')],
  devtool: isDev ? 'source-map' : 'eval',
  output: {
    // filename: 'index.js',
    filename: genFilename('js'),
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    hot: isDev,
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      cache: true,
    }),
    new MiniCssExtractPlugin({
      // filename: 'styles.css',
      filename: genFilename('css'),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(c|sa|sc)ss$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader', 'postcss-loader'],
      },
      {
        test: /\.js$/i,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.html$/i,
        loader: 'html-loader',
      },
    ],
  },
};
