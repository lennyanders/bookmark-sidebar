const manifest = require('./src/manifest.json');
const { version } = require('./package.json');

const path = require('path');
const { emptyDir, outputJson, copy } = require('fs-extra');

const { DefinePlugin } = require('webpack');
const { VueLoaderPlugin } = require('vue-loader');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlPlugin = require('html-webpack-plugin');

const resolve = (dir) => path.resolve(__dirname, dir);

module.exports = async ({ NODE_ENV }) => {
  await emptyDir('dist');

  await outputJson('dist/manifest.json', {
    ...manifest,
    version,
    ...(NODE_ENV !== 'production' && {
      content_security_policy: `${manifest.content_security_policy} script-src 'self' 'unsafe-eval'; object-src 'self'`,
    }),
  });

  await copy('public', 'dist');

  return [
    //
    // background script
    //
    {
      mode: NODE_ENV,
      entry: './src/background/main.js',
      output: {
        filename: 'main.js',
        path: resolve('dist/background'),
      },
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
        path: resolve('dist/content'),
      },
      module: {
        rules: [
          {
            test: /\.vue$/,
            loader: 'vue-loader',
          },
          {
            test: /\.css$/,
            use: [
              './raw-to-javascript-variable-loader',
              'css-loader?sourceMap=false',
            ],
          },
          {
            test: /\.scss$/,
            use: [
              './raw-to-javascript-variable-loader',
              'css-loader?sourceMap=false',
              'sass-loader',
            ],
          },
        ],
      },
      plugins: [
        new DefinePlugin({
          __VUE_OPTIONS_API__: JSON.stringify(false),
          __VUE_PROD_DEVTOOLS__: JSON.stringify(false),
        }),
        new VueLoaderPlugin(),
      ],
      resolve: {
        extensions: ['.js', '.json', '.vue'],
      },
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
        path: resolve('dist/newtab'),
      },
      module: {
        rules: [
          {
            test: /\.vue$/,
            loader: 'vue-loader',
          },
          {
            test: /\.css$/,
            use: [MiniCssExtractPlugin.loader, 'css-loader'],
          },
          {
            test: /\.scss$/,
            use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
          },
        ],
      },
      plugins: [
        new DefinePlugin({
          __VUE_OPTIONS_API__: JSON.stringify(false),
          __VUE_PROD_DEVTOOLS__: JSON.stringify(false),
        }),
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin({ filename: 'main.css' }),
        new HtmlPlugin({
          title: 'Neuer Tab',
          filename: 'index.html',
          scriptLoading: 'defer',
          favicon: './src/newtab/favicon.svg',
        }),
      ],
      resolve: {
        extensions: ['.js', '.json', '.vue'],
      },
    },
  ];
};
