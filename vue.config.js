//https://github.com/staven630/vue-cli3-config
const path = require("path");
const PurgecssPlugin = require("purgecss-webpack-plugin");
const glob = require("glob-all"); //If you need multiple paths use the npm package glob-all instead of glob
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const CompressionWebpackPlugin = require("compression-webpack-plugin");
const IS_PROD = ["production", "prod"].includes(process.env.NODE_ENV); //是否生产环境
const IS_CDN = false; //是否开启CDN引用
const IS_GZIP = true; //是否开启Gzip压缩
const resolve = dir => path.join(__dirname, dir);

module.exports = {
  chainWebpack: config => {
    // 目录别名alias
    config.resolve.alias
      .set("@", resolve("src"))
      .set("assets", resolve("src/assets"))
      .set("components", resolve("src/components"))
      .set("icons", resolve("src/icons"))
      .set("view", resolve("src/view"));

    // 压缩图片
    config.module
      .rule("images")
      .test(/\.(gif|png|jpe?g|svg)$/i)
      .use("image-webpack-loader")
      .loader("image-webpack-loader")
      .options({
        bypassOnDebug: true
      })
      .end();

    // 打包分析
    process.env.NODE_ENV === "analyz" &&
      config
        .plugin("webpack-bundle-analyzer")
        .use(require("webpack-bundle-analyzer").BundleAnalyzerPlugin);

    //svg-sprite-loader配置
    //config.module.rules.delete("svg");
    config.module
      .rule("svg")
      .exclude.add(path.resolve(__dirname, "src/icons"))
      .end();

    config.module
      .rule("icons")
      .test(/\.svg$/)
      .include.add(path.resolve(__dirname, "src/icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "[name]"
      });
  },
  configureWebpack: config => {
    if (IS_PROD) {
      const plugins = [];
      //去除无效css
      plugins.push(
        new PurgecssPlugin({
          paths: glob.sync([
            path.join(__dirname, "./src/index.html"),
            path.join(__dirname, "./**/*.vue"),
            path.join(__dirname, "./src/**/*.js")
          ])
        })
      );
      //生产环境去除console
      plugins.push(
        new UglifyJsPlugin({
          uglifyOptions: {
            compress: {
              warnings: false, //在UglifyJs删除没有用到的代码时不输出警告
              drop_console: true, // 删除所有的 `console` 语句
              collapse_vars: true, // 内嵌定义了但是只用到一次的变量
              reduce_vars: true, // 提取出出现多次但是没有定义成变量去引用的静态值
              drop_debugger: false,
              pure_funcs: ["console.log"] //移除console
            }
          },
          sourceMap: false,
          parallel: true
        })
      );
      //开启Gzip压缩
      if (IS_GZIP) {
        plugins.push(
          new CompressionWebpackPlugin({
            filename: "[path].gz[query]",
            algorithm: "gzip",
            test: /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i,
            threshold: 10240,
            minRatio: 0.8
          })
        );
      }
      config.plugins = [...config.plugins, ...plugins];
    }

    //cdn引用时配置externals
    if (IS_CDN) {
      config.externals = {
        vue: "Vue",
        "vue-router": "VueRouter",
        vuex: "Vuex",
        axios: "axios"
      };
    }
  },
  css: {
    loaderOptions: {
      // 配置scss全局变量
      sass: {
        data: `@import "@/assets/scss/variable.scss";` //!!!切记;不能丢
      }
    }
  }
};