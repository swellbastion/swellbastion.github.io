addEventListener('DOMContentLoaded', start)

function start() {
  var back_button = document.querySelector('.back_button')
  back_button.addEventListener('click', close_article)
  var story_view = document.querySelector('.story_view')
  story_view.addEventListener('load', function() {
    toggle_article()
    setTimeout(toggle_transition, 350)
  })
  get_latest(load_thumbs)
}

function open_article() {
  var story_view = document.querySelector('.story_view')
  story_view.src = this.dataset.src
}

function close_article() {
  toggle_transition()
  toggle_article()
}

function toggle_article() {
  var main_div = document.querySelector('.main_div')
  var story_div = document.querySelector('.story_div')
  main_div.classList.toggle('story_mode')
  story_div.classList.toggle('story_mode')
}

function toggle_transition() {
  var main_div = document.querySelector('.main_div')
  var story_div = document.querySelector('.story_div')
  main_div.classList.toggle('transition_off')
  story_div.classList.toggle('transition_off')
}

function load_thumbs(latest) {
  var oldest = latest - 16
  while (latest > oldest && latest > -1) {
    var json_url = 'articles/' + latest + '/thumb.json'
    getJson(json_url, function(thumb_data) {
      make_thumb(thumb_data)
    })
    latest--
  }
}

function make_thumb(thumb_data) {
  var thumb_div = document.createElement('div')
  thumb_div.classList.add('article_thumb')
  thumb_div.dataset.src = thumb_data.src
  thumb_div.addEventListener('click', open_article)

  var thumb_img = document.createElement('img')
  thumb_img.classList.add('article_image')
  var img_src = thumb_data.img
  thumb_img.setAttribute('src', img_src)
  var thumb_title = document.createElement('div')
  thumb_title.classList.add('article_title')
  thumb_title.innerHTML = thumb_data.title
  var darkener = document.createElement('div')
  darkener.classList.add('darkener')

  thumb_div.appendChild(thumb_img)
  thumb_div.appendChild(thumb_title)
  thumb_div.appendChild(darkener)

  var article_box = document.querySelector('.article_box')
  article_box.appendChild(thumb_div)
}

function get(url, callback) {
  var xhr = new XMLHttpRequest()
  xhr.addEventListener('load', function() {
    callback(xhr.response)
  })
  xhr.open('get', url)
  xhr.send()
}

function getJson(url, callback) {
  get(url, function(json) {
    var asObject = JSON.parse(json)
    callback(asObject)
  })
}

function get_latest(callback) {
  get('latest.txt', function(response) {
    callback( parseInt(response) )
  })
}
