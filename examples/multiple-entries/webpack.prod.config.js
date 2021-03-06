/* eslint-disable import/no-extraneous-dependencies */
// Very similar to webpack.dev.config.js. Common parts could be extracted to a base config.
// See example at:
// https://github.com/shakacode/react-webpack-rails-tutorial/blob/master/client%2Fwebpack.client.base.config.js
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
const autoprefixer = require('autoprefixer');

module.exports = {
  // For production build we want to extract CSS to stand-alone file
  // Provide `extractStyles` param and `bootstrap-loader` will handle it
  entry: {
    bs3: [
      'font-awesome-loader',
      `bootstrap-loader/lib/bootstrap.loader?extractStyles&configFilePath=${__dirname}/bs3.yml!bootstrap-loader/no-op.js`,
      'tether',
      './app/scripts/app',
    ],
    bs4: [
      'font-awesome-loader',
      `bootstrap-loader/lib/bootstrap.loader?extractStyles&configFilePath=${__dirname}/bs4.yml!bootstrap-loader/no-op.js`,
      'tether',
      './app/scripts/app',
    ],
  },

  output: {
    path: path.join(__dirname, 'public', 'assets'),
    filename: '[name].js',
  },

  resolve: { extensions: ['*', '.js'] },

  plugins: [
    new ExtractTextPlugin({ filename: '[name].css', allChunks: true }),
    new webpack.ProvidePlugin({
      'window.Tether': 'tether',
    }),
    new webpack.LoaderOptionsPlugin({
      postcss: [autoprefixer],
    }),
  ],

  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use:
            'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]__[hash:base64:5]' +
            '!postcss-loader',
        }),
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use:
            'css-loader?modules&importLoaders=2&localIdentName=[name]__[local]__[hash:base64:5]' +
            '!postcss-loader' +
            '!sass-loader',
        }),
      },

      {
        test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        // Limiting the size of the woff fonts breaks font-awesome ONLY for the extract text plugin
        // use: "url?limit=10000"
        use: 'url-loader',
      },
      {
        test: /\.(ttf|eot|svg)(\?[\s\S]+)?$/,
        use: 'file-loader',
      },

      // Use one of these to serve jQuery for Bootstrap scripts:

      // Bootstrap 4
      { test: /bootstrap\/dist\/js\/umd\//, use: 'imports-loader?jQuery=jquery' },

      // Bootstrap 3
      { test: /bootstrap-sass\/assets\/javascripts\//, use: 'imports-loader?jQuery=jquery' },
    ],
  },
};
