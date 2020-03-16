const path = require("path");
const htmlWebpackPlugin = require("html-webpack-plugin"); //导入插件
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  entry: "./src/index.ts",
  output: {
    path: path.resolve("./dist"), // 转换为绝对路径
    filename: "script/bundle.js"
  },
  module: {
    rules: [
      {
        // 配置ts
        test: /.ts$/,
        use: {
          loader: "ts-loader",
          options: {
            transpileOnly: true
          }
        }
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  plugins: [
    new CleanWebpackPlugin(),
    //配置插件的节点
    new htmlWebpackPlugin({
      // 创建一个在内存中生成html页面的插件
      template: path.join(__dirname, "./public/index.html"), //指定模板页面
      //将来会根据此页面生成内存中的页面
      filename: "index.html" //指定生成页面的名称，index.html浏览器才会默认直接打开
    })
  ]
};
