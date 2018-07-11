/* 
 * @Author: Eleven 
 * @Date: 2018-07-03 10:33:28 
 * @Last Modified by: Eleven
 * @Last Modified time: 2018-07-09 14:47:34
 */

import musicBg from '../../assets/music/dear.mp3'

let Index = function () {

}

/**
 * 1.静态资源,直接require,再写入,webpack可以处理,例如这里的.mp3文件.
 * 2.如果是直接在页面的audio标签写入src,则需要通过html-loader来处理.
 */
Index.prototype.initMusic = function () {
  let music = new Audio()
  music.src = musicBg
  // let music = document.querySelector('#bg_music')

  // 这样无法依靠webpack将文件打包过去
  // music.src = '../assets/music/dear.mp3'

  music.loop = 'loop'
  music.play() && $('#music_switch').addClass('play')

  $('#music_switch').on('click', function () {
    music.paused ? music.play() : music.pause()
    $(this).toggleClass('play', !music.paused)
  })
}

export default Index