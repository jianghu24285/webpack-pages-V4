/* 
 * @Author: Eleven 
 * @Date: 2018-07-03 10:38:31 
 * @Last Modified by: Eleven
 * @Last Modified time: 2018-07-05 23:36:20
 */

import './commonController'

import List from '../components/list'

let ListController = function () {
  this.init()
}

ListController.prototype.init = function () {
  let list = new List()

  list.test()
}

export default new ListController()