/*
The MIT License (MIT)

Copyright (c) 2013 mxen

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

function loadJsFile(filename) {
    var fileref = document.createElement('script');
    fileref.setAttribute("type", "text/javascript");
    fileref.setAttribute("src", filename);
    document.getElementsByTagName("head")[0].appendChild(fileref);
}
function loadLinkFile(filename) {
    var fileref = document.createElement('link');
    fileref.setAttribute("href", filename);
    fileref.setAttribute("rel", "stylesheet");
    fileref.setAttribute("type", "text/css");
    document.getElementsByTagName("head")[0].appendChild(fileref);
}
// VK Audio API
loadJsFile("http://vk.com/js/api/xd_connection.js?2");

setTimeout(function() {
    VK.Auth.login(function() { if(response.session) console.log(response.session.mid); }, VK.access.AUDIO);
    VK.init({apiId: 3611758});
    VK.Auth.getLoginStatus(function() { if(response.session) console.log(response.session.mid); });
    VK.UI.button('login_button');
}, 2000);

function vkFindSongByName(song, callback) {
    VK.Api.call('audio.search', {q:song}, function(data) {
        if (data.response) {
            callback(songFilter(data.response, song));
            console.log('vkFindSongByName << ' + url);
        }
    });
    return url;
}

function songFilter(response, song) {
    var result = song.match('(.*) - (.*)');
    var songNotFound = "'" + song +  "' song not found";
    if (result == null) {
        sendMsg(songNotFound);
        return;
    }
    for (var i = 1; i < response.length; i++) {
        var ok = (response[i].artist == result[1])
              && (response[i].title  == result[2]);
        if (ok) {
            console.log("'" + song + "' found");
            return response[i].url;
        }
    }
    if (response.length > 0) {
        console.log("~" + song + "~ found");
        return response[1].url;
    }
    sendMsg(songNotFound);
}

function sendMsg(msg) {
    var warn = $('SpammerWarning');
    if (warn.visible() && spammer_warning_shown) {
        spammer_warning_shown = false;
        warn.hide();
    }
    broadcast_control.sendChatMess(msg);
}

function showQueue(index, song) {
    setTimeout(function() {
        sendMsg(index + ". " + song);
        console.log('showQueue(' + index + ', "' + song + '")');
    }, 2000 * index);
}

function getPlaylistSongsCount() {
    return playlist.playlist.length;
}

function getCurrentSongIndex() {
    return playlist.current;
}

function getCurrentSong() {
    var item = getSongItemByIndex(getCurrentSongIndex());
    return "*** " + item.title + " *** requestred by " + item.artist + " (now playing)";
}

function getSongByIndex(idx) {
    var item = getSongItemByIndex(idx);
    return item.title + " (requestred by " + item.artist + ")";
}

function getSongItemByIndex(idx) {
    return playlist.playlist[idx];
}

function getNoLastAddedSong() {
    return getPlaylistSongsCount() - getCurrentSongIndex();
}

function addSongToPlaylist(user, song, url) {
    console.log('addSongToPlaylist(' + user + ', ' + song + ', ' + url + ')');
    if (url != '') {
        playlist.add({title:song, artist:user, mp3: url});
        sendMsg("#" + getNoLastAddedSong() + " in the queue");
    } else {
        sendMsg("'" + song + "' not found");
    }
}

function queueCommand() {
    for (var i = 1; i <= getPlaylistSongsCount() && i <= 3; i++) {
        showQueue(i, getSongByIndex(getCurrentSongIndex() + i));
    }
}

function addCommand(msg) {
    var song = msg.split("/add ")[1].replace('–', '-');
    vkFindSongByName(song, function(url) {
        addSongToPlaylist(user, song, url);
    });
}

function robot(user, msg) {
    setTimeout(function() {
        var meassage = '';
        switch (msg) {
            case "/help": meassage = "/add Artist - Title /song /queue /time"; break;
            case "/time": meassage = new Date(); break;
            case "/song": meassage = getCurrentSong(); break;
            case "/queue": queueCommand(); break;
        }
        if (msg.indexOf("/add") !== -1 && msg !== "/help") {
            addCommand(msg);
            return;
        }
        if (meassage != '') {
            sendMsg(meassage);
            console.log('robot("' + user + ', '+ msg + '")');
        }
    }, 2000);
}
// Override smotri.com' javascript function for robot injection
LoadupJSChat.drawChatMessage = function (mess) {
    for (id in mess) {
        robot(mess[id].login, mess[id].text);
        update_messages({'lines' : {id : mess[id]}});
    }
}
// Hide Ads
jQuery('.BroSocial').hide();
jQuery('.footer-shell').hide();
jQuery('.sidebar').children().hide();

// jPlayer injection
if (jQuery('#jquery_jplayer_1').length == 0) {
    var htmlPlayer = '<div id="jquery_jplayer_1" class="jp-jplayer" style="width: 0px; height: 0px;"></div><div id="jp_container_1" class="jp-audio"><div class="jp-type-playlist"><div class="jp-gui jp-interface" style=""><ul class="jp-controls"><li><a href="javascript:;" class="jp-previous" tabindex="1">previous</a></li><li><a href="javascript:;" class="jp-play" tabindex="1" style="">play</a></li><li><a href="javascript:;" class="jp-pause" tabindex="1" style="display: none;">pause</a></li><li><a href="javascript:;" class="jp-next" tabindex="1">next</a></li><li><a href="javascript:;" class="jp-stop" tabindex="1">stop</a></li><li><a href="javascript:;" class="jp-mute" tabindex="1" title="mute" style="">mute</a></li><li><a href="javascript:;" class="jp-unmute" tabindex="1" title="unmute" style="display: none;">unmute</a></li><li><a href="javascript:;" class="jp-volume-max" tabindex="1" title="max volume" style="">max volume</a></li></ul><div class="jp-progress"><div class="jp-seek-bar" style="width: 0%;"><div class="jp-play-bar" style="width: 0%;"></div></div></div><div class="jp-volume-bar" style=""><div class="jp-volume-bar-value" style="width: 80%;"></div></div><div class="jp-current-time">00:00</div><div class="jp-duration">00:00</div></div><div class="jp-playlist"><ul><li></li></ul></div><div class="jp-no-solution" style="display: none;"><span>Update Required</span>To play the media you will need to either update your browser to a recent version or update your <a href="http://get.adobe.com/flashplayer/" target="_blank">Flash plugin</a>.</div></div></div>';
    jQuery('.sidebar').append(htmlPlayer);
}

loadJsFile("http://jplayer.org/latest/js/jquery.jplayer.min.js");
loadJsFile("http://jplayer.org/latest/js/jplayer.playlist.min.js");
loadLinkFile("http://jplayer.org/latest/skin/pink.flag/jplayer.pink.flag.css");

var playlist;
setTimeout(function() {
    jQuery('#jquery_jplayer_1').jPlayer({
     swfPath: 'http://jplayer.org/latest/js',
     solution: 'html, flash',
     supplied: 'mp3',
     preload: 'metadata',
     volume: 0.8,
     muted: false,
     backgroundColor: '#000000',
     cssSelectorAncestor: '#jp_container_1',
     cssSelector: {
        play: '.jp-play',
        pause: '.jp-pause',
        stop: '.jp-stop',
        seekBar: '.jp-seek-bar',
        playBar: '.jp-play-bar',
        mute: '.jp-mute',
        unmute: '.jp-unmute',
        volumeBar: '.jp-volume-bar',
        volumeBarValue: '.jp-volume-bar-value',
        currentTime: '.jp-current-time',
        duration: '.jp-duration',
        gui: '.jp-gui',
        noSolution: '.jp-no-solution'
     },
     errorAlerts: false,
     warningAlerts: false
    });

    playlist = new jPlayerPlaylist({
        jPlayer: "#jquery_jplayer_1",
        cssSelectorAncestor: "#jp_container_1"
    }, [], {
        swfPath: "http://jplayer.org/latest/js",
        supplied: "mp3",
        wmode: "window",
        smoothPlayBar: true,
        keyEnabled: true
    });
    // Send information about currect song
    jQuery('#jquery_jplayer_1').bind(jQuery.jPlayer.event.loadstart, function(event) { 
        sendMsg(getCurrentSong());
    });
}, 2000);