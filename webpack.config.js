/* 
 * webpack多页面打包
 * @Author: Eleven 
 * @Date: 2018-07-03 00:17:01 
 * @Last Modified by: Eleven
 * @Last Modified time: 2018-07-10 01:57:22
 */

const path = require('path')
const glob = require('glob')
const webpack = require('webpack')
// extract-text-webpack-plugin插件,将样式提取到单独的css文件里,而不是直接打包到js里.
const ExtractTextPlugin = require('extract-text-webpack-plugin')
// html-webpack-plugin插件,重中之重,webpack中生成html的插件.
const HtmlWebpackPlugin = require('html-webpack-plugin')

const ROOT_PATH = path.resolve(__dirname)
const SRC_PATH = path.resolve(ROOT_PATH, 'src')

// 是否是生产环境
let isProduction = process.env.NODE_ENV === 'production' ? true : false

/**
 * 获取文件名
 * @param {String} filesPath 文件目录
 * @returns {Array} 文件名列表
 */
let getFilesName = (filesPath) => {
    let files = glob.sync(filesPath)
    let entries = []
    let entry, basename, extname

    for (let i = 0; i < files.length; i++) {
        entry = files[i]
        extname = path.extname(entry) // 扩展名 eg: .html
        basename = path.basename(entry, extname) // 文件名 eg: index
        entries.push(basename);
    }
    return entries
}

// 获取打包入口
let getEntries = () => {
    let obj = {}

    getFilesName('src/js/pages/**/*.js').forEach(fileName => {
        obj[fileName] = './src/js/pages/' + fileName + '.js';
    });
    return obj
}

let entries = getEntries() // 打包入口
let chunks = Object.keys(entries)   // 待提取公共模块
let pages = getFilesName('src/views/**/*.html') // html模版文件

let config = {
    entry: entries,
    output: {
        path: path.resolve(__dirname, 'static'), // 输出目录的配置，模板、样式、脚本、图片等资源的路径配置都相对于它
        publicPath: '/', // 模板、样式、脚本、图片等资源对应的server上的路径
        filename: 'js/[name].js', // 每个页面对应的主js的生成配置
        chunkFilename: 'js/[id].chunk.js' // chunk生成的配置
    },
    resolve: {
        //自动扩展文件后缀名，意味着我们require模块可以省略不写后缀名
        extensions: ['.js', '.json', '.css', '.less'],
        //模块别名定义，方便后续直接引用别名，无须多写长长的地址
        alias: {
            'src': SRC_PATH
        }
    },
    devtool: 'source-map',
    devServer: { // 使用webpack-dev-server,提高开发效率
        contentBase: path.join(__dirname, 'static'),    // 告诉服务器从哪里提供内容(默认当前工作目录)
        host: 'localhost',  // 默认localhost,想外部可访问用'0.0.0.0'
        openPage: 'views/index.html',  // 指定默认启动浏览器时打开的页面
        index: 'views/index.html',  // 指定首页位置
        port: 9090, // 默认8080
        inline: true, // 可以监控js变化
        hot: true, // 热启动
        open: true, // 自动打开浏览器
        compress: true,  // 一切服务都启用gzip 压缩
        watchContentBase: true  // contentBase下文件变动将reload页面(默认false)
    },
    module: {
        rules: [
            // 处理less/css文件(从右到左依次调用less、css、style加载器，前一个的输出是后一个的输入)
            {
                test: /\.(less|css)$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'postcss-loader', 'less-loader']
                })
            },
            /**
             * es6转码
             *  (npm install babel-core babel-loader babel-preset-env babel-plugin-transform-runtime babel-runtime babel-preset-stage-2 -D)
             */
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: SRC_PATH,
                exclude: /node_modules/, // 排除 node_modules中的文件，否则所有外部库都会通过babel编译，将会降低编译速度
                options: {
                    cacheDirectory: true    // 缓存转码结果,提升编译速度
                }
            },
            // html中引用的静态资源在这里处理,默认配置参数attrs=img:src,处理图片的src引用的资源.
            {
                test: /\.html$/,
                loader: 'html-loader',
                options: {
                    // 除了img的src,还可以继续配置处理更多html引入的资源(不能在页面直接写路径,又需要webpack处理怎么办?先require再js写入).
                    attrs: ['img:src', 'img:data-src', 'audio:src'],
                    minimize: false,
                    removeComments: true,
                    collapseWhitespace: false
                }
            },
            // 处理图片(雷同file-loader，更适合图片)
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000, // 小图转成base64
                    name: 'assets/img/[name].[hash:7].[ext]'
                }
            },
            // 处理多媒体文件
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'assets/media/[name].[hash:7].[ext]'
                }
            },
            // 处理字体文件
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'assets/fonts/[name].[hash:7].[ext]'
                }
            }
        ]
    },
    plugins: [
        // 自动加载模块，而不必到处 import 或 require.
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        }),
        // 提取公共模块
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendors', // 将公共模块提取，生成名为vendors的chunk
            chunks: chunks, // 提取哪些模块共有的部分
            minChunks: chunks.length // 被多少个模块公用的部分才提取
        }),
        // 单独使用link标签加载css并设置路径，相对于output配置中的publickPath
        new ExtractTextPlugin('css/[name].css'),
        // 热加载
        new webpack.HotModuleReplacementPlugin()
    ]
}

// 遍历html模版,自动将入口对应的打包文件引入
pages.forEach(function (fileName) {
    let setting = {
        filename: 'views/' + fileName + '.html', // 生成的html存放路径，相对于path
        template: 'src/views/' + fileName + '.html', // html模板路径
        inject: false // js插入的位置，true/'head'/'body'/false
    };

    // (仅)有入口的模版自动引入资源
    if (fileName in config.entry) {
        setting.favicon = './src/assets/img/favicon.ico'
        setting.chunks = ['vendors', fileName]
        setting.inject = 'body'
        setting.hash = true
    }
    config.plugins.push(new HtmlWebpackPlugin(setting))
})

// 生产环境配置
if (isProduction) {
    config.devtool = false  // 关闭source-map
    config.plugins.push(
        // 代码压缩
        new webpack.optimize.UglifyJsPlugin({
            parallel: true, // 使用多进程并行和文件缓存来提高构建速度
            compress: {
                drop_console: true,     // 删除所有的 `console` 语句
                warnings: false          // 在删除没有用到的代码时不输出警告
            },
            output: {
                beautify: false, // 不美化输出
                comments: false   // 删除所有的注释
            }
        })
    )
}

module.exports = config