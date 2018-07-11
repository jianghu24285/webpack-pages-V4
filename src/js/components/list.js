/* 
 * @Author: Eleven 
 * @Date: 2018-07-03 10:40:20 
 * @Last Modified by: Eleven
 * @Last Modified time: 2018-07-05 23:31:26
 */

let List = function () {

}

List.prototype.test = function () {
  let list = ''

  for (let i = 0; i < 25; i++) {
    list += '<li>' + (i + 1) + '</li>'
  }
  $('#test_list').find('ul').append(list)
}

export default List