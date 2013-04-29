function loadJsFile(filename){
    var fileref=document.createElement('script');
    fileref.setAttribute("type","text/javascript");
    fileref.setAttribute("src", filename);
}

// Load jQuery
loadJsFile"http://code.jquery.com/jquery-latest.min.js");
jQuery.noConflict();

// Remote Ads
setTimeout(function() {
    $('.sidebar').hide();
    $('.BottomBanner').hide();
    $('.BroSocial').hide();
    $('.footer-shell').hide();
}, 1000);

// VK Audio API
loadJsFile("http://vk.com/js/api/xd_connection.js?2");

setTimeout(function() {
    VK.Auth.login(function() { if(response.session) console.log(response.session.mid); }, VK.access.AUDIO);
    VK.init({apiId: 3611758});
    VK.Auth.getLoginStatus(function() { if(response.session) console.log(response.session.mid); });
    VK.UI.button('login_button');
}, 1000);

function vkFindSongsByName(song) {
    VK.Api.call('audio.search', {q:song}, function(data) {
        return data.response;
    });
}

var queue = new Array();
queue[0] = "Kincade – Dreams Are Ten A Penny";
queue[1] = "The Black Keys – Tighten Up";
queue[2] = "Dinah Shore – Don't Fence Me In";
queue[3] = "Reamonn – Tonight";
queue[4] = "Stereophonics – Devil";
queue[5] = "Stereophonics – You're My Star";
queue[6] = "Reamonn – Tonight";
queue[7] = "Stereophonics – Devil";
queue[8] = "Stereophonics – You're My Star";

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
    }, 1000 * index);
}

function robot(user, msg) {
    setTimeout(function() {
        var meassage = '';
        switch (msg) {
            case "/help": meassage = "/help - help /song - current song /queue - playlist /time - local time (" + new Date() + ")"; break;
            case "/time": meassage = new Date(); break;
            case "/song": meassage = "Bon Jovi - It's My Life"; break;
            case "/queue": for (var i = 0; i < queue.length && i < 5; i++) { showQueue(i+1, queue[i]); } break;
        }
        if (meassage != '') {
            sendMsg(meassage);
            console.log('robot("' + user + ', '+ msg + '")');
        }
    }, 1000);
}

function update_messages(data)
{
    var need_scroll = false;

    var scroll_pos = $('chat_messages').scrollTop + $('chat_messages').getStyle('height').substring(0, $('chat_messages').getStyle('height').length - 2)*1;

    if (scroll_pos >= $('chat_messages_inside').offsetHeight ) need_scroll = true;
    for (i in data.lines)
    {
        robot(data.lines[i].login, data.lines[i].text);

        var text = '<div class="ChatLine"><span class="ChatLineNick va_bottom">';
        // крестик для бана
        if ((window.broadcast_owner || window.broadcast_moderator) && data.lines[i].login && login && data.lines[i].login != login && !data.lines[i].guest)
            text += '<a href="#" onclick="ignoreUser(\'' + data.lines[i].login + '\', 1, this,'+data.lines[i].id+'); return false;"><img src="/images/loadup.ru/ignore.gif" alt="X" title=""></a> ';

        if (data.lines[i].guest)
            text += htmlspecialchars(data.lines[i].nick) + '</span><span class="va_bottom">: </span>' + data.lines[i].text + '</div>';
        else
        {
            text += '<a target="_blank" class="Nick" href="/user/' + data.lines[i].login + '/"';

            if (data.lines[i].owner)
                text += ' style="font-weight: bold;"';
            text += '>' + htmlspecialchars(data.lines[i].nick) + '</a></span><span class="va_bottom">: </span><span class="TextRow" ' +
            (data.lines[i].owner ? 'style="font-weight:bold;"' : '') + 
            '>' + data.lines[i].text + '</span></div>';
        }

        new Insertion.Bottom('chat_messages_inside', text);

        //drag-and-drop for urls
        if ((jQuery.browser.msie) && (jQuery.browser.version > 7)) jQuery('a[href!="#"]', '.ChatLine').attr('ondragstart','onDragIE()');//ie9-8
        if ((jQuery.browser.msie) && (jQuery.browser.version == 7))//ie7
        {
            var urls_array=jQuery('a[href!="#"]', '.ChatLine');
            for (var i=0; i<urls_array.length; i++)
                urls_array[i].setAttribute('ondragstart',(new Function('onDragIE()')));
        }
        if (jQuery.browser.opera) jQuery('a[href!="#"]', '.ChatLine').attr('onmouseover','onDragOpera(this)');//opera

        //del old messages
        var messages_block = document.getElementById('chat_messages_inside');
        if(messages_block.getElementsByTagName('div').length > 100)
        {
            for(i=0;i<=(messages_block.getElementsByTagName('div').length -100);i++)
            {
                messages_block.removeChild(messages_block.getElementsByTagName('div')[i]);
            }
        }
    }

    if (data.update_onliners)
        update_onliners(data.update_onliners);

    if (need_scroll)
        scroll_bottom();
}

function send_message()
{
    var warn = $('SpammerWarning');
    if (warn.visible() && spammer_warning_shown)
    {
        spammer_warning_shown = false;
        warn.hide();
    }
    var mess = $('chat_text').value.replace(/^\s+/, '').replace(/\s+$/, '');
    broadcast_control.sendChatMess(mess);
    $('chat_text').value = '';
    $('chat_text').focus();

    scroll_bottom();

    return false;
}