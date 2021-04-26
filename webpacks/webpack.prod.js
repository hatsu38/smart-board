const path = require("path");
const { merge } = require("webpack-merge");
const common = require("./webpack.common");
const webpack = require('webpack');

module.exports = merge(common, {
  mode: "production",
  plugins: [
    new webpack.DefinePlugin({
      'process.env.OPEN_WEATHER_API_KEY': JSON.stringify(process.env.OPEN_WEATHER_API_KEY),
    }),
  ]
});


