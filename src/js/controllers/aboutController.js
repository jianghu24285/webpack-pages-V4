/* 
 * @Author: Eleven 
 * @Date: 2018-07-03 10:48:40 
 * @Last Modified by: Eleven
 * @Last Modified time: 2018-07-05 23:37:01
 */

import './commonController'

import About from '../components/about'

let AboutController = function () {
  this.init()
}

AboutController.prototype.init = function () {
  let about = new About()

  about.test()
}

export default new AboutController()