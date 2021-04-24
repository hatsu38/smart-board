const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: ["./src/index.tsx"],
  resolve: {
    extensions: [".js", ".ts", ".tsx", ".jsx"],
    alias: {
      "@smartBoard/src": path.resolve(__dirname, 'src/'),
    },
  },
  watchOptions: {
    poll: true,
    ignored: /node_modules/,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'public/index.html'
    })
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
    ],
  },
};
