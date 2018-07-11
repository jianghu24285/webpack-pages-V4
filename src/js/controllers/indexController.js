/* 
 * @Author: Eleven 
 * @Date: 2018-07-03 10:28:43 
 * @Last Modified by: Eleven
 * @Last Modified time: 2018-07-07 01:08:19
 */

import './commonController'

import Index from '../components/index'

let IndexController = function () {
  this.init()
}

IndexController.prototype.init = function () {
  let index = new Index()

  index.initMusic()
}

export default new IndexController()