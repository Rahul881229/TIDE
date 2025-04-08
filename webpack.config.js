const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const uglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');
const libraryName = 'tide';
const outputFile = `${libraryName}.min.js`;

module.exports = {
  mode: 'development',
  entry: './app/index.js',
  output: {
    library: libraryName,
    libraryTarget: 'umd',
    libraryExport: 'default',
    path: path.resolve(__dirname, 'dist'),
    filename: outputFile,
  },

  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: [{
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env',
            "@babel/preset-react",
            {
              'plugins': ['@babel/plugin-proposal-class-properties']
            }],
        },
      },],
    },
    {
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader',
        'sass-loader'
      ],
    },
    {
      test: /\.(ttf|eot|svg|png|woff(2)?)(\?[a-z0-9]+)?$/,
      use: [{
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'assets/fonts/'
        }
      }]
    },
    {
      test: /\.s[ac]ss$/i,
      //loader: 'style-loader!css-loader!sass-loader'
      use: [
        'css-loader',
        'postcss-loader',
        'sass-loader'
      ],
    },
    {
      test: /\.html$/i,
      loader: 'html-loader',
    },
    /* {
      test: /\.scss$/,
      use: [
        'style-loader',
        'css-loader',
        'postcss-loader',
        'sass-loader'
      ]
    }, */
    {
      test: /\.(png|jp(e*)g|svg)$/,
      /* use: [{
        loader: 'file-loader',
        options: {
          name: '[name]-[hash].[ext]',
          outputPath: "images"
        },
      }], */
      use: [{
        loader: 'url-loader',
        options: {
          limit: 20000, // Convert images < 8kb to base64 strings.
          name: 'img/[hash]-[name].[ext]',
          outputPath: "imgs"
        },
      }],
    },

      /*
        {
          test: /\.(woff|woff2|ttf|eot)$/,
          loader: 'file-loader',
          options: {
              limit: 1024,
              name: '[name].[ext]',
              publicPath: 'fonts/',
              outputPath: 'fonts/'
          }
         }
      */

      /*
        {
         test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
         use: [
           {
             loader: 'file-loader',
             options: {
               name: '[name].[ext]',
               outputPath: 'fonts/'
             }
           }
         ]
       }
       */

      /*
       {
         test: /\.(png|woff|woff2|eot|ttf|svg)$/,
          use: ['url-loader?limit=100000']
       } */

    ],


  },
  plugins: [
    new uglifyJsPlugin(),
    new HTMLWebpackPlugin({
      template: path.resolve(__dirname, 'index.html')
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
};