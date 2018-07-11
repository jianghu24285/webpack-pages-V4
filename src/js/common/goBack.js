/* 
 * @Author: Eleven 
 * @Date: 2018-07-03 17:45:50 
 * @Last Modified by: Eleven
 * @Last Modified time: 2018-07-07 17:54:04
 */

export default () => {
  $('.header').on('click', '.back', function(){
    history.go(-1)
  })
}