/* 
 * 启动express服务,访问打包后的资源
 *  命令: node prod.server.js
 *  访问路径: localhost:port/static/views/
 * 
 * @Author: Eleven 
 * @Date: 2018-06-08 17:10:14 
 * @Last Modified by: Eleven
 * @Last Modified time: 2018-07-10 02:00:02
 */

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
  console.log('Listening at http://localhost:' + port + '\n')
})