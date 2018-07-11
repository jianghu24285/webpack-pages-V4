# Webpack多页面打包

> &emsp;&emsp;借助webpack搭建前端工程化、模块化开发, 十分喜欢Vue脚手架的配置, 简洁清晰, 所以大量参考vue-cli的webpack配置.   
> &emsp;&emsp;这里webpack版本是3X, 做个存档, 4X再开一个新的. 除了webpack、gulp、grunt这几个自动化工具，[rollup](http://www.rollupjs.com/)、[parcel](http://www.css88.com/doc/parcel/) 也慢慢流行起来，有空来认真测试填坑.
    
<br>
    
## 编译命令
```bash
# 安装依赖包
npm i

# 启动dev-server运行调试
npm run dev

#  打包发布
npm run build
```

## 主要的依赖包
```bash
"devDependencies": {
    "autoprefixer": "^8.6.5",
    "babel-core": "^6.26.3",
    "babel-loader": "^7.1.4",
    "babel-plugin-transform-runtime": "^6.23.0",
    "babel-polyfill": "^6.26.0",
    "babel-preset-env": "^1.7.0",
    "babel-preset-stage-2": "^6.24.1",
    "babel-runtime": "^6.26.0",
    "cross-env": "^5.2.0",
    "css-loader": "^0.28.11",
    "cssnano": "^4.0.0",
    "extract-text-webpack-plugin": "^3.0.2",
    "file-loader": "^1.1.11",
    "glob": "^7.1.2",
    "html-loader": "^0.5.5",
    "html-webpack-plugin": "^3.2.0",
    "jquery": "^3.3.1",
    "less": "^3.0.4",
    "less-loader": "^4.1.0",****
    "postcss-cssnext": "^3.1.0",
    "postcss-import": "^11.1.0",
    "postcss-loader": "^2.1.5",
    "style-loader": "^0.21.0",
    "url-loader": "^1.0.1",
    "webpack": "^3.6.0",
    "webpack-dev-server": "^2.9.7"
}
```

## 目录结构
```bash
─ website
     ├─ src                  # 源代码
     │   ├─ assets                   # 静态资源
     │   │   ├─ fonts                        # 字体文件
     │   │   ├─ img                          # 图片
     │   │   ├─ music                        # 音乐
     │   │    
     │   ├─ css                      # 样式    
     │   │   ├─ common                       # 通用基础css
     │   │   ├─ lib                          # 第三方工具包
     │   │   ├─ modules                      # 模块样式
     │   │   ├─ pages                        # 页面样式入口
     │   │   
     │   ├─ js                       # js
     │   │   ├─ common                       # 公共基础js
     │   │   ├─ components                   # 模块组件
     │   │   ├─ controllers                  # controller
     │   │   ├─ models                       # 数据处理
     │   │   ├─ pages                        # 打包入口
     │   │   ├─ utils                        # (第三方)工具包
     │   │   
     │   ├─ views                    # 页面html模版
     │      
     ├─ static               # 编译打包生成目录
     │   ├─ assets                  # 静态资源
     │   ├─ css                     # 打包后css
     │   ├─ js                      # 打包后js
     │   ├─ views                   # 打包后html文件(自动插入打包后的css、js及favicon.ico)
     │
     ├─ .babelrc             # babel配置
     ├─ .gitignore
     ├─ package-lock.json
     ├─ package.json         # npm配置
     ├─ postcss.config.js    # postcss配置
     ├─ README.md
     ├─ webpack.config.js    # webpack配置
```
*&emsp;&emsp;这是纯前端的目录结构 ( 其中也不是十分合理 ), 对于不同的项目需求应当对目录做适当的变更, 例如: 某个JAVA后台管理系统, 采用后端渲染, 直接输出页面, 使用velocity模版, 页面文件的后缀是.vm, 用webpack来自动化构建, 怎么办?   
&emsp;&emsp;一样可以自动扫描页面模版, 自动引入( **html-webpack-plugin插件通过识别head和body标签来完成自动引入** ), html模版目录views应当放到其它层级, 打包输出也是其它层级, 配合后端项目的整体风格, 以方便阅读和使用.*

<br><br>

## Webpack配置的几个重点

<br>

> **[Babel](https://www.webpackjs.com/loaders/babel-loader/) - ES6转码**
   
1. 需要安装的依赖
   
   ```bash
   npm i babel-core babel-loader babel-preset-env babel-plugin-transform-runtime babel-runtime babel-preset-stage-2 -D
   ```

2. 在webpack.config.js同级目录新建.babelrc文件   
   
   ```bash
   {
    "presets": [
      ["env", {
        "modules": false,
        "targets": {
          "browsers": ["> 1%", "last 2 versions", "not ie <= 8"]
        }
      }],
      "stage-2"
    ],
    "plugins": ["transform-runtime"]
   }
   ```

3. 最基础的使用, 安装babel-loader babel-core babel-preset-env这3个依赖即可, 其中babel-preset-env取代过去版本中的babel-preset-es2015.

4. 一些es6公共方法等转码后可能会被添加到每一个需要它的文件中, 这种重复的引入造成了转码后体积变大, 通过babel-plugin-transform-runtime插件来解决, 同时要依赖babel-runtime, 所以也需要安装它.

5. > Babel默认只转换新的JavaScript句法（syntax），而不转换新的API，比如Iterator、Generator、Set、Maps、Proxy、Reflect、Symbol、Promise等全局对象，以及一些定义在全局对象上的方法（比如Object.assign）都不会转码。
   
   
   这种情况通过babel-polyfill解决 ( 参考文档: [babel-polyfill的作用?](https://blog.csdn.net/crazyfeeling/article/details/70241285), 以及[babel-polyfill的引用和使用](https://www.cnblogs.com/princesong/p/6728250.html) ), 安装好依赖以后, 并不会自动生效, 需要在js代码的第一行引入才行:   
   ```bash
   import 'babel-polyfill' 或 require('babel-polyfill') 
   ```
   或者, 在webpack.config.js中, 改写entry对应的入口字符串值为数组, 'babel-polyfill'作为数组第一个元素 ( 不推荐 ):   
   ```bash
   entry: {
        index: ['babel-polyfill', './src/js/pages/index.js']
    }
    ```

6. 为了提升转码的速度, 减少耗费的时间, 配置几个参数:    
   
   ```bash
   {
      test: /\.js$/,
      loader: 'babel-loader',
      include: path.resolve(__dirname, 'src'),  // # 仅转码src目录下代码(有时可能需要转其它目录下代码,有需要再加)
      exclude: /node_modules/, // # 排除 node_modules中的文件，否则所有外部库都会通过babel编译，将会降低编译速度
      options: {
          cacheDirectory: true   // # 缓存转码结果,提升编译速度
      }
   }
   ```

<br><br>

> **CSS 的处理 - less编译和postcss工具**
1. 需要安装的依赖包

   ```bash      
   npm i less less-loader css-loader style-loader postcss-loader postcss-import postcss-cssnext cssnano autoprefixer -D
   ```

2. 配置
   
   *默认会将css一起打包到js里, 借助extract-text-webpack-plugin将css分离出来并自动在生成的html中link引入.*

   ```bash
   const ExtractTextPlugin = require('extract-text-webpack-plugin')
   ```
   
   ```bash
   {
        test: /\.(less|css)$/,
        loader: ExtractTextPlugin.extract({
            fallback: 'style-loader',
          // # postcss-loader需要在less-loader之后执行, 在css-loader之前执行
            use: ['css-loader', 'postcss-loader', 'less-loader']
        })
    }
   ```
   ```bash
    // # 单独使用link标签加载css并设置路径，相对于output配置中的publickPath
    new ExtractTextPlugin('css/[name].css')
   ```

3. [PostCSS](https://www.webpackjs.com/loaders/postcss-loader/) 本身不会对你的 CSS 做任何事情, 你需要安装一些 plugins 才能开始工作.   
参考文档:   
    - [PostCSS自学笔记（一）【安装使用篇】](https://segmentfault.com/a/1190000010926812),   
    - [展望未来：使用 PostCSS 和 cssnext 书写 CSS](https://www.cnblogs.com/nzbin/p/5744672.html),   
    - [使用PostCSS+cssnext来写css](http://www.zhaiqianfeng.com/2017/07/postcss-autoprefixer-cssnext.html) ),   
    - [PostCSS及其常用插件介绍](http://www.css88.com/archives/7317)   

    使用时在webpack.config.js同级目录新建postcss.config.js文件:
   
   ```bash
   module.exports = {
      // parser: 'sugarss', # 一种更简洁的css语法格式
      plugins: {
        'postcss-import': {},
        'postcss-cssnext': {},
        'cssnano': {}
      }
   }
   ```

   *常用的插件*:
   - autoprefixer     ——*插件在编译时自动给css新特性添加浏览器厂商前缀, 因此, 借助[Modernizr](http://modernizr.cn/)来添加厂商前缀已经不需要了( 还是可以用来做js检测浏览器兼容性的 ).*   
   - postcss-cssnext ——*让你使用下一代css语法, 在最新的css规范里, 已经包含了大量less的内置功能*
   - cssnano ——*会压缩你的 CSS 文件来确保在开发环境中下载量尽可能的小*
 
   *其它有用的插件*:   
   - postcss-pxtorem        ——*px单位自动转换rem*
   - postcss-assets         ——*插件用来处理图片和SVG, 类似url-load*
   - postcss-sprites        ——*将扫描你CSS中使用的所有图像，自动生成优化的 Sprites 图像和 CSS Sprites 代码*
   - postcss-font-magician        ——*使用自定义字体时, 自动搞定@font-face声明*
    
   Less是预处理, 而PostCSS是后处理, 基本支持less等预处理器的功能, 自动添加浏览器厂商前缀向前兼容, 允许书写下一代css语法 , 可以在编译时去除冗余的css代码, PostCSS 声称比预处理器快 3-30 倍.   **因为PostCSS, 可能我们要放弃less/sass/stylus了**.

<br><br>

> **图片、字体及多媒体等文件的处理**
   
   1. css中引入的图片( 或其它资源 ) ==> url-loader   
   配置了url-loader以后, webpack编译时可以自动将小图转成base64编码, 将大图改写url并将文件生成到指定目录下 ( *file-loader可以完成文件生成, 但是不能小图转base64, 所以统一用url-loader, 但url-loader在处理大图的时候是自动去调用file-loader, 所以你仍然需要install file-loader* ).
      
      ```bash
      // # 处理图片(雷同file-loader，更适合图片)
      {
          test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
          loader: 'url-loader',
          options: {
              limit: 10000, // # 小图转成base64
              name: 'assets/img/[name].[hash:7].[ext]'
          }
      },
      // # 处理多媒体文件
      {
          test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
          loader: 'url-loader',
          options: {
              limit: 10000,
              name: 'assets/media/[name].[hash:7].[ext]'
          }
      },
      // # 处理字体文件
      {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          loader: 'url-loader',
          options: {
              limit: 10000,
              name: 'assets/fonts/[name].[hash:7].[ext]'
          }
      }
      ```
   2. html页面中引入的图片( 或其它资源 ) ==> html-loader   
   css中的图片url-loader处理即可, 而html中img标签引入的图片, 不做工作的情况下: 图片将不会被处理, 路径也不会被改写, 即最终编译完成后这部分图片是找不到的, 怎么办? [html-loader](https://www.webpackjs.com/loaders/html-loader/) ! ( *这个时候你应该是url-loader和html-loader都配置了, 所以css中图片、页面引入的图片、css中的字体文件、页面引入的多媒体文件等， 统统都会在编译时被处理* ).
      
      ```bash
      // # html中引用的静态资源在这里处理,默认配置参数attrs=img:src,处理图片的src引用的资源.
      {
          test: /\.html$/,
          loader: 'html-loader',
          options: {
              // # 除了img的src,还可以继续配置处理更多html引入的资源(不能在页面直接写路径,又需要webpack处理怎么办?先require再js写入).
              attrs: ['img:src', 'img:data-src', 'audio:src'],
              minimize: false,
              removeComments: true,
              collapseWhitespace: false
          }
      }
      ```

    3. 有的时候, 图片可能既不在css中, 也不在html中引入, 怎么办?   

       ```bash   
       import img from 'xxx/xxx/123.jpg'   
       或 let img = require('xxx/xxx/123.jpg')
       ```
       js中引用img, webpack将会自动搞定它.

    4. 图片等资源的访问路径问题:    
    经过上面的处理, 静态资源处理基本没有问题了, webpack编译时将会将文件打包到你指定的生成目录, 但是不同位置的图片路径改写会是一个问题.   
    *全部通过绝对路径访问即可, 在output下的publicPath填上适当的server端头, 来保证所有静态资源文件路径能被访问到, 具体要根据服务器部署的目录结构来做修改.*   
       
       ```bash
       output: {
        path: path.resolve(__dirname, 'static'), // # 输出目录的配置，模板、样式、脚本、图片等资源的路径配置都相对于它
        publicPath: '/', // # 模板、样式、脚本、图片等资源对应的server上的路径
       }
       ```

<br><br>

> **自动将打包js引入生成的html文件**
   
   - [html-webpack-plugin](https://www.webpackjs.com/plugins/html-webpack-plugin/)插件, 配置:  
      
      ```bash
      const HtmlWebpackPlugin = require('html-webpack-plugin')
      ```

      
      ```bash
      new HtmlWebpackPlugin({
        favicon: './src/assets/img/favicon.ico', // # favicon路径，通过webpack引入同时可以生成hash值
        filename: './views/index.html', // # 生成的html存放路径，相对于path
        template: './src/views/index.html', // # html模板路径
        title: '首页', // # 页面title
        meta: '', // # 允许插入meta标签,如=>meta: {viewport: 'width=device-width,initial-scale=1, shrink-to-fit=no'}
        inject: 'body', // # js插入的位置，true/'head'/'body'/false
        hash: true, // # 为静态资源生成hash值(js和css)
        chunks: ['vendors', 'index'], // # 需要在此页面引入的chunk，不配置就会引入所有页面的资源
        minify: { // # 压缩html文件    
            removeComments: true, // # 移除html中的注释
            collapseWhitespace: true // # 删除空白符与换行符
        }
      })
      ```

<br><br>
      
> **自动扫描webpack入口文件和html模版文件**
   
   - *正常如果有多个入口, 需要在entry中, 以对象形式将所有入口都配置一遍, html模版目录也需要new很多个HtmlWebpackPlugin来配置对应的页面模版, 是否可以自动扫描? 无论多少个入口, 只管新建, 而不用管理入口配置? 可以的 !* 
      
     a. 安装node模块glob ( 扫描文件就靠它了 ). 
      
     ```bash
     npm i glob -D
     ```
     ```bash
     const glob = require('glob')   
     ```
     b. 自动扫描获取入口文件, 定义工具函数过滤文件名和需要的传参.
     ```bash
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

      let entries = getEntries() // # 打包入口
      let pages = getFilesName('src/views/**/*.html') // # html模版文件
     ```
     c. webpack打包入口
     ```bash
     module.exports = {
       entry: entries
     }
     ```
     d. html模版自动引入打包资源.
     ```bash
     // # 遍历html模版,自动将入口对应的打包文件引入
      pages.forEach(function (fileName) {
          let setting = {
              filename: 'views/' + fileName + '.html', // # 生成的html存放路径，相对于path
              template: 'src/views/' + fileName + '.html', // # html模板路径
              inject: false // # js插入的位置，true/'head'/'body'/false
          };

          // # (仅)有入口的模版自动引入资源
          if (fileName in config.entry) {
              setting.favicon = './src/assets/img/favicon.ico'
              setting.inject = 'body'
              setting.chunks = ['vendors', fileName]
              setting.hash = true
          }
          config.plugins.push(new HtmlWebpackPlugin(setting))
      })
     ```

<br><br>

> **[如何在webpack中引入未模块化的库, 如Zepto](https://blog.csdn.net/sinat_17775997/article/details/70495891)**
   
   *script-loader 把我们指定的模块 JS 文件转成纯字符串, exports-loader将需要的js对象module.exports导出, 以支持import或require导入.*
   
   1. 安装依赖包
      
      ```bash
      npm i script-loader exports-loader -D
      ```

   2. 配置
      
      ```bash
      {
        test: require.resolve('zepto'),
        loader: 'exports-loader?window.Zepto!script-loader'
      }
      ```

      > *以上是正常处理一个 *"可以NPM安装但又不符合webpack模块化规范"* 的库, 例如其它库XX, 处理后可以直接 import xx from XX 后使用; 但是, zepto有点特殊, 默认npm安装的包或者从github clone的包, 都是仅包含5个模块, 其它如常用的touch模块是未包含的, 想要正常使用还需做得更多.*

  3. 怎样拿到一个包含更多模块的zepto包 ?
     
     a) [打包出一个包含更多需要模块的zepto包 ](https://www.cnblogs.com/czf-zone/p/4433657.html)  
        从github clone官方的包下来, 找到名为make的文件 ( 在package.json同级目录 ), 用记事本打开, 找到这一行 `modules = (env['MODULES'] || 'zepto event ajax form ie').split(' ')`, 应该是在第41行, 手动修改加入你想要引入的模块, 然后保存;   

     b) 在make文件同级目录 => 右键打开终端或git bash => 敲npm i安装zepto源码需要的node包 ( 这里你应当是已经已安装过nodejs了, 如果没有, 安装好后再做这一步 ), 等待安装结束.

     c) 在刚才打开的 终端/git bash 敲命令 npm run-script dist, 如果没有报错, 你应该在这个打开的文件夹里可以看到生成了一个文件夹 dist, 打开它, 包含新模块的zepto包就在这了, Over !
     
  4. 拿到新的zepto包后, 建议放到自己的src下lib目录( 第三方工具包目录 ), 不再通过npm的方式去安装和更新zepto了 ( *因为将来npm update后的zepto又将缺少模块,将来别人也会出现误操作* ); 现在开始对这个放在lib目录下的zepto.min.js进行处理: 
     
     a) 通过script-loader、exports-loader转成符合webpack模块化规范的包
     ```bash
     {
        // # require.resolve()是nodejs用来查找模块位置的发放,返回模块的入口文件
        test: require.resolve('./src/js/lib/zepto.min.js'),
        loader: 'exports-loader?window.Zepto!script-loader'
     }
     ```

     b) 给模块配置别名
     ```bash
     resolve: {
        alias: {
            'zepto': path.resolve(__dirname, './src/js/lib/zepto.min.js')
        }
     }
     ```

     c) 自动加载模块, 不再到处import或require
     ```bash
     new webpack.ProvidePlugin({
        $: 'zepto',
        Zepto: 'zepto'
     })
     ```

      *大功告成, 现在使用zepto跟你使用jquery或其它node包是一样的开发体验了 !*

     > *以上, 演示的是对于一个第三方库( 不能npm安装,也不符合webpack规范 ), 如何去处理, 达到和正常npm安装一样的开发体验, 仅就zepto来说, npm库有符合webpack规范的不同版本 ([zepto-webpack](https://www.npmjs.com/package/zepto-webpack), 或 [zepto-modules](https://www.npmjs.com/package/zepto-modules)), 有需要可以试试.  
     平时意图使用某个包, 先去[NPM官网](https://www.npmjs.com/)搜一搜比较好.*

<br><br>
     
> **配置开发服务器, [webpack-dev-server](https://www.webpackjs.com/configuration/dev-server/).**
   
   - 安装依赖包
      
      ```
      npm i webpack-dev-server -D
      ```
   - 常用配置
      ```bash
      devServer: {
        contentBase: path.join(__dirname, 'static'),    // # 告诉服务器从哪里提供内容(默认当前工作目录)
        host: 'localhost',  // # 默认localhost,想外部可访问用'0.0.0.0'
        openPage: 'views/index.html',  // # 指定默认启动浏览器时打开的页面
        index: 'views/index.html',  // # 指定首页位置
        port: 9090, // # 默认8080
        inline: true, // # 可以监控js变化
        hot: true, // # 热启动
        open: true, // # 自动打开浏览器
        compress: true,  // # 一切服务都启用gzip 压缩
        watchContentBase: true  // # contentBase下文件变动将reload页面(默认false)
      }
      ```
   - 运行命令 ( package.json配置命令 => npm run dev )
      ```bash
      "dev": "webpack-dev-server --hot --inline --colors"
      ```
     *根据目录结构的不同, contentBase、openPage参数要配置合适的值, 否则运行时应该不会立刻访问到你的首页; 同时要注意你的publicPath, 静态资源打包后生成的路径是一个需要思考的点, 这与你的目录结构有关.*
     
<br><br>

> **配置node express服务, 访问打包后资源**
   
   1. 新建prod.server.js文件
      
      ```bash
      let express = require('express')
      let compression = require('compression')

      let app = express()
      let port = 9898
  
      app.use(compression())
      app.use(express.static('./static/'))
  
      module.exports = app.listen(port, function (err) {
        if (err) {
            console.log(err)
            return
        }
        console.log('Listening at http://localhost:' + port +   '\n')
      })
      ```

    2. 运行命令
       
       ```bash
       node prod.server.js
       ```

    3. 访问路径
       
       ```bash
       localhost:9898/views/
       ```

<br><br>

## 参考文档:
- [webpack中文文档](https://www.webpackjs.com/concepts/) —— 直接阅读它非常有用, 百度出来的教程99%都是管中窥豹, 只见一斑, 会形成误导 ( 不要问我是怎么知道的 -_- ) .
- [基于webpack的前端工程化开发之多页站点篇（一）](https://segmentfault.com/a/1190000004511992)
- [基于webpack的前端工程化开发之多页站点篇（二）](https://segmentfault.com/a/1190000004516832)
- [webpack在前端项目中使用心得一二](https://segmentfault.com/a/1190000009243487)
- [NPM中文文档](https://www.npmjs.com.cn/getting-started/what-is-npm/)