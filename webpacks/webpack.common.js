const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const Dotenv = require('dotenv-webpack');
const tailwindcss = require("tailwindcss");
const autoprefixer = require("autoprefixer");

module.exports = {
  entry: ["./src/index.tsx"],
  output: {
    path: path.resolve("dist"),
    filename: "[name]-[contenthash].js",
  },
  resolve: {
    extensions: [".js", ".ts", ".tsx", ".jsx"],
    alias: {
      'src': path.resolve(__dirname, '../src'),
    },
  },
  watchOptions: {
    poll: true,
    ignored: /node_modules/,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'public/index.html'
    }),
    new MiniCssExtractPlugin({
      filename: "styles/[name].[contenthash].css",
      chunkFilename: "[id].[contenthash].css",
    }),
    new Dotenv(),
  ],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader'
          }
        ],
      },
      {
        test: /\.(css|scss|sass)$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                ident: "postcss",
                plugins: [tailwindcss, autoprefixer],
              },
            },
          },
        ],
      },
    ],
  },
};
