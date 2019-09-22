'use strict';

import path from 'path';

import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import VueLoaderPlugin from 'vue-loader/lib/plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import HtmlPlugin from 'html-webpack-plugin';
import WebpackExtensionManifestPlugin from 'webpack-extension-manifest-plugin';

import manifest from './src/manifest';
import pkg from './package';

const resolve = dir => path.resolve(__dirname, dir);

module.exports = ({ NODE_ENV }) => ({
  mode: NODE_ENV,
  entry: {
    background: './src/background/main.js',
    content: './src/content/main.js',
    options: './src/options/main.js',
    newtab: './src/newtab/main.js'
  },
  output: {
    filename: '[name]/main.js',
    path: resolve('dist')
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'resolve-url-loader']
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'resolve-url-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ['file-loader']
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'fonts/[name].[ext]',
              publicPath: __dirname.split('\\').join('/') + '/dist'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
    new CopyPlugin([{ from: 'public', to: resolve('dist'), force: true }]),
    new WebpackExtensionManifestPlugin({
      config: {
        base: manifest,
        extend: {
          version: pkg.version,
          content_security_policy:
            NODE_ENV !== 'production'
              ? (manifest.content_security_policy +=
                  "script-src 'self' 'unsafe-eval'; object-src 'self'")
              : manifest.content_security_policy
        }
      }
    }),
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({ filename: '[name]/main.css' }),
    new HtmlPlugin({
      chunks: ['options'],
      template: './src/options/index.html',
      filename: 'options/index.html'
    }),
    new HtmlPlugin({
      chunks: ['newtab'],
      template: './src/newtab/index.html',
      filename: 'newtab/index.html'
    })
  ],
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      fonts: resolve('src/assets/fonts')
    }
  }
});
