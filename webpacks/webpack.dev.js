const path = require("path");
const Dotenv = require('dotenv-webpack');
const { merge } = require("webpack-merge");
const common = require("./webpack.common");

const dist = path.join(__dirname, "dist");

module.exports = merge(common, {
  mode: "development",
  output: {
    path: dist,
    publicPath: "/",
    filename: "[name].js",
  },
  devtool: "eval", // FYI：https://webpack.js.org/configuration/devtool/#development
  devServer: {
    historyApiFallback: true,
    hot: true,
    host: 'localhost',
    port: 3045,
    clientLogLevel: 'info',
    headers: { 'Access-Control-Allow-Origin': '*' },
  },
  plugins: [
    new Dotenv({
      path: ".env",
    }),
  ]
});


