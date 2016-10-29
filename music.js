var log = function() {
    console.log.apply(console, arguments)
}

var MusicPlayer = function(files) {
    // file 是个包含 歌曲信息 的数组
    this.songs = this.files(files)
    this.nowId = 0
    this.playMode = 'loop'
    this.prevId = 0
}

// 给 每个歌曲file Add id & like
MusicPlayer.prototype.files = function(files) {
    for (var i = 0; i < files.length; i++) {
        files[i].id = i
        files[i].like = false
    }
    return files
}

MusicPlayer.prototype.fileFindById = function(id) {
    for (var i = 0; i < this.songs.length; i++) {
        if(this.songs[i].id == id) {
            return this.songs[i]
        }
    }
    return undefined
}

MusicPlayer.prototype.nowSong = function() {
    var songInfo = this.fileFindById(this.nowId)
    return songInfo
}

var playLoopPrev = function() {
    var length = player.songs.length
    if(player.nowId != 0) {
        player.nowId--
    } else {
        player.nowId = length - 1
    }
    initMusicPlayer()
}

var playLoopNext = function() {
    var length = player.songs.length
    if(player.nowId != (length - 1)) {
        player.nowId++
    } else {
        player.nowId = 0
    }
    initMusicPlayer()
}

var playRandom = function() {
    var len = player.songs.length
    var rId = Math.floor(Math.random() * len)
    player.nowId = (rId == len ?  0: rId)
    initMusicPlayer()
}

var playLoopOne = function() {
    initMusicPlayer()
}

var prevSong = function(element) {
    $('audio').unbind('timeupdate')
    var mode = {
        loop: playLoopPrev,
        random: playRandom,
        loopOne: playLoopOne,
    }
    var type = player.playMode
    mode[type]()
}

var nextSong = function(element) {
    $('audio').unbind('timeupdate')
    player.prevId = player.nowId
    var mode = {
        loop: playLoopNext,
        random: playRandom,
        loopOne: playLoopOne,
    }
    var type = player.playMode
    mode[type]()
}

var playSong = function() {
    $('audio')[0].play()
    $('.BBg-contLeft-pause').removeClass('fa-play-circle-o')
    $('.BBg-contLeft-pause').addClass('fa-pause-circle-o')
    $('.BBg-contLeft-pause').data('action', 'pause')
    $('audio')[0].autoplay = true
}

var pauseSong = function() {
    $('audio')[0].pause()
    $('.BBg-contLeft-pause').removeClass('fa-pause-circle-o')
    $('.BBg-contLeft-pause').addClass('fa-play-circle-o')
    $('.BBg-contLeft-pause').data('action', 'play')
    $('audio')[0].autoplay = false
}

var timeFormatBySecs = function(seconds) {
    var mins = Math.floor(seconds / 60)
    var secs = Math.floor(seconds % 60)
    if(secs < 10) {
        secs = `0${secs}`
    }
    return `${mins}:${secs}`
}

var setCurTime = function(value) {
    // log('setCurTime')
    var curTime = $('audio')[0].currentTime
    var t = timeFormatBySecs(curTime)
    $('.BBg-music-curTime').text(t)
}

// element 是 DOM 型的
var setport = function(element, value) {
    // log('setport')
    var value = Number(value)
    $(element).val(value)
    // 百分比
    var presVal = value / (element.max - element.min)
    // log(presVal)
    var background = `linear-gradient(to right ,#c91818 0%,#c91818 ${presVal * 100}%,#5b5b5b ${presVal* 100 }%, #5b5b5b 100%)`
    $(element).css('background', background)
}

var changeModeLogo = function(mode) {
    var e = $('.BBg-contRight-loop')
    if(mode == 'loop') {
        e.removeClass('fa-random')
        $('.BBg-music-loopOne').css('display', 'none')
        e.addClass('fa-refresh')
    }
    if(mode == 'random') {
        e.removeClass('fa-refresh')
        $('.BBg-music-loopOne').css('display', 'none')
        e.addClass('fa-random')
    }
    if(mode == 'loopOne') {
        e.removeClass('fa-random')
        $('.BBg-music-loopOne').css('display', 'inline-block')
        e.addClass('fa-refresh')
    }

}

var bindPlayerContLeft = function(){
    $('.BBg-music-contLeft').on('click', 'i', function(){
        log('controlLeft', this)
        var type = $(this).data('action')
        var actions = {
            prev: prevSong,
            next: nextSong,
            play: playSong,
            pause: pauseSong,
        }
        if( player.playMode == 'loopOne' && (type == 'prev' || type == 'next')) {
            // log('loopOne')
            $('audio').unbind('timeupdate')
            type == 'prev' ? playLoopPrev() : true
            type == 'next' ? playLoopNext() : true
        } else {
            actions[type](this)
        }
    })
}

var bindSlideBar = function() {
    $('#id-input-SlideBar').on('input', function(){
        log('range')
        var value = $(this).val()
        var curTime = value * $('audio')[0].duration / 100
        $('audio')[0].currentTime = curTime
        setport(this, value)
        setCurTime(value)
    })
}

var bindTimeUpdate = function() {
    $('audio').on('timeupdate', function(){
        // log('timeupdate')
        var curTime = this.currentTime
        var value = curTime / this.duration * 100
        var e = $('#id-input-SlideBar')[0]
        // log(e, value)
        // log('time update', value)
        setport(e, value)
        setCurTime(value)
    })
}

var bindLike = function() {
    $('.BBg-contRight-like').on('click', function(){
        if(player.nowSong().like == false) {
            player.songs[player.nowId].like = true
            $(this).removeClass('fa-heart-o')
            $(this).addClass('fa-heart')
        } else {
            player.songs[player.nowId].like = false
            $(this).removeClass('fa-heart')
            $(this).addClass('fa-heart-o')
        }
    })
}

var bindEnd = function() {
    $('audio').on('ended', function(){
        // pauseSong()
        nextSong()
    })
}

var bindVolButton = function() {
    $('.BBg-contRight-vol').on('click', function(){
        var type = $('#id-input-vol').css('display')
        if(type != 'none') {
            $('#id-input-vol').css('display', 'none')
        } else {
            $('#id-input-vol').css('display', 'inline-block')
        }
    })
}

var bindVolSlideBar = function() {
    $('#id-input-vol').on('input', function(){
        var value = $(this).val()
        $('audio')[0].volume = value / 10
        setport(this, value)
        if (value == 0) {
            $('.BBg-contRight-vol').removeClass('fa-volume-up')
            $('.BBg-contRight-vol').addClass('fa-volume-off')
        } else {
            $('.BBg-contRight-vol').removeClass('fa-volume-off')
            $('.BBg-contRight-vol').addClass('fa-volume-up')
        }
    })
}

var bindModeButton = function() {
    $('.BBg-contRight-loop').on('click', function(){
        var mode = ['loop', 'random', 'loopOne']
        for (var i = 0; i < mode.length; i++) {
            if(mode[i] == player.playMode) {
                break
            }
        }
        var m = mode[(i + 1) % 3]
        player.playMode =  m
        changeModeLogo(m)
    })
}

var bindEvents = function() {
    bindPlayerContLeft()
    bindSlideBar()
    bindTimeUpdate()
    bindLike()
    bindEnd()
    bindVolSlideBar()
    bindVolButton()
    bindModeButton()
}

var initMusicPlayer = function() {
    var song = player.nowSong().name
    var singer = player.nowSong().singer
    var path = player.nowSong().path
    $('.BBg-music-song').text(song)
    $('.BBg-music-singer').text(singer)
    $('audio')[0].src = `song/${path}`
    $('#id-a-song').attr('href', 'https://www.baidu.com/s?ie=UTF-8&wd='+song)
    $('#id-a-singer').attr('href', 'https://www.baidu.com/s?ie=UTF-8&wd='+singer)
    setport($('#id-input-SlideBar')[0], 0)
    $('audio').on('canplay', function(){
        var duration = $('audio')[0].duration
        var d = timeFormatBySecs(duration)
        $('.BBg-music-timeIndica').html(`<span class="BBg-music-curTime">0:00</span>/${d}`)
        bindTimeUpdate()
    })
}

var s0 = {
    name: 'Australia',
    singer: 'Jenyfa Duncan',
    path: 'Australia.ogg',
}
var s1 = {
    name: 'Through The Years',
    singer: 'Nathan Haines',
    path: 'ThroughTheYears.ogg',
}
var s2 = {
    name: 'A.I.N.Y',
    singer: 'GEM',
    path: 'A.I.N.Y.（爱你）.mp3',
}
var s3 = {
    name: 'If I WERE A BOY',
    singer: 'Beyoncé',
    path: 'If I Were A Boy.mp3',
}
var s4 = {
    name: "I'm Yours",
    singer: 'Jason Mraz',
    path: "I'm+Yours.mp3",
}
var s5 = {
    name: '蓝雨',
    singer: '张学友',
    path: '蓝雨.mp3',
}
var s6 = {
    name: '瓶中沙',
    singer: 'Twins',
    path: '瓶中沙.mp3',
}


var files = [s0, s1, s2, s3, s4, s5, s6]

var player = new MusicPlayer(files)

var musicPlayer = function() {
    initMusicPlayer()

    bindEvents()


}
