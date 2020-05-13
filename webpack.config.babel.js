'use strict';

import manifest from './src/manifest.json';
import { version } from './package';

import path from 'path';
import { emptyDir, outputJson, copy } from 'fs-extra';

import { VueLoaderPlugin } from 'vue-loader';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import HtmPlugin from 'html-webpack-plugin';

const resolve = dir => path.resolve(__dirname, dir);

module.exports = async ({ NODE_ENV }) => {
  await emptyDir('dist');

  await outputJson('dist/manifest.json', {
    ...manifest,
    version,
    ...(NODE_ENV !== 'production' && {
      content_security_policy: `${manifest.content_security_policy} script-src 'self' 'unsafe-eval'; object-src 'self'`
    })
  });

  await copy('public', 'dist');

  return [
    //
    // background script + copy public files + generate manifest + clean
    //
    {
      mode: NODE_ENV,
      entry: './src/background/main.js',
      output: {
        filename: 'main.js',
        path: resolve('dist/background')
      },
      module: {
        rules: [
          {
            test: /\.js$/,
            loader: 'babel-loader'
          }
        ]
      }
    },
    //
    // content script
    //
    {
      mode: NODE_ENV,
      devtool: NODE_ENV === 'development' && 'inline-source-map',
      entry: './src/content/main.js',
      output: {
        filename: 'main.js',
        path: resolve('dist/content')
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
            use: [
              {
                loader: 'style-loader',
                options: {
                  injectType: 'singletonStyleTag',
                  insert: element => (window.styles = element)
                }
              },
              'css-loader'
            ]
          },
          {
            test: /\.scss$/,
            use: [
              {
                loader: 'style-loader',
                options: {
                  injectType: 'singletonStyleTag',
                  insert: element => (window.styles = element)
                }
              },
              'css-loader',
              'sass-loader'
            ]
          }
        ]
      },
      plugins: [new VueLoaderPlugin()],
      resolve: {
        extensions: ['.js', '.json', '.vue']
      }
    },
    //
    // new tab page
    //
    {
      mode: NODE_ENV,
      devtool: NODE_ENV === 'development' && 'inline-source-map',
      entry: './src/newtab/main.js',
      output: {
        filename: 'main.js',
        path: resolve('dist/newtab')
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
            use: [MiniCssExtractPlugin.loader, 'css-loader']
          },
          {
            test: /\.scss$/,
            use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
          }
        ]
      },
      plugins: [
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin({ filename: 'main.css' }),
        new HtmPlugin({
          template: './src/newtab/index.html',
          filename: 'index.html'
        })
      ],
      resolve: {
        extensions: ['.js', '.json', '.vue']
      }
    }
  ];
};
