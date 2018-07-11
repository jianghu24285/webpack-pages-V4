/* 
 * @Author: Eleven 
 * @Date: 2018-07-03 17:48:26 
 * @Last Modified by: Eleven
 * @Last Modified time: 2018-07-05 23:33:21
 */

import back from '../common/goBack'

let CommonController = function(){
  this.init()
}

CommonController.prototype.init = function(){
  // 返回
  back()
}

export default new CommonController()