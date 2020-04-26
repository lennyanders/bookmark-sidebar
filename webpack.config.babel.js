'use strict';

import path from 'path';

import { CleanWebpackPlugin as Clean } from 'clean-webpack-plugin';
import Copy from 'copy-webpack-plugin';
import Vue from 'vue-loader/lib/plugin';
import MiniCssExtract from 'mini-css-extract-plugin';
import Html from 'html-webpack-plugin';

import { version } from './package';

const resolve = dir => path.resolve(__dirname, dir);

module.exports = [
  //
  // background script + copy public files + generate manifest + clean
  //
  ({ NODE_ENV }) => ({
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
    },
    plugins: [
      new Copy([
        { from: 'public', to: resolve('dist'), force: true },
        {
          from: 'src/manifest.json',
          to: resolve('dist/manifest.json'),
          toType: 'file',
          force: true,
          transform(content) {
            const manifest = JSON.parse(content.toString());
            return JSON.stringify({
              ...manifest,
              version,
              ...(NODE_ENV !== 'production' && {
                content_security_policy: `${manifest.content_security_policy} script-src 'self' 'unsafe-eval'; object-src 'self'`
              })
            });
          }
        }
      ]),
      new Clean({
        cleanOnceBeforeBuildPatterns: [resolve('dist/**/*')]
      })
    ]
  }),
  //
  // content script
  //
  ({ NODE_ENV }) => ({
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
    plugins: [new Vue(), new Clean()],
    resolve: {
      extensions: ['.js', '.json', '.vue']
    }
  }),
  //
  // new tab page
  //
  ({ NODE_ENV }) => ({
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
          use: [MiniCssExtract.loader, 'css-loader']
        },
        {
          test: /\.scss$/,
          use: [MiniCssExtract.loader, 'css-loader', 'sass-loader']
        }
      ]
    },
    plugins: [
      new Vue(),
      new MiniCssExtract({ filename: 'main.css' }),
      new Html({
        template: './src/newtab/index.html',
        filename: 'index.html'
      }),
      new Clean()
    ],
    resolve: {
      extensions: ['.js', '.json', '.vue']
    }
  })
];
