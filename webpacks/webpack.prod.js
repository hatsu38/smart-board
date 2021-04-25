const path = require("path");
const { merge } = require("webpack-merge");
const common = require("./webpack.common");

const dist = path.join(__dirname, "dist");

module.exports = merge(common, {
  mode: "production",
});


