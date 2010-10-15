function fetch_conversation(jelem) {
  var id= jelem.attr('href').split('/').pop();
  var result = []
  while(id > -1) {
    data = fetch_status(id);
    if(data) {
      result.push(data);
      id = data.in_reply_to_status_id
    }
    else {
      id = -1
    }
  }
  alert(result);
}
function fetch_status(id) {
  var result;
  $.getJSON('http://api.twitter.com/1/statuses/show/' + id + '.json?callback=?', function(data) {
    result = data;
  });
  return result
}

$('span.status-body span.meta > a').each(function(idx, elem) {
  $(elem).click(function(){$(this).text($(this).text() + ' updated')})
    fetch_conversation($(this));
  });
});

$('span.status-body span.meta > a').each(function(idx,elem){
  if($(elem).text().indexOf('in reply') > -1){
    $(elem).click(function(){fetch_conversation($(elem));return false});
  }
});


function fetchconv(je){
 var id= je.attr('href').split('/').pop();
 var par_li = je.parent('li.status');
 alert(par_li);
 par_li.append('<ol class="statuses"><li>just a test</li></ol>');
 var conv_ol = par_li.find('ol.statuses');
 fetchstatus(id, conv_ol)
};
function fetchstatus(id, conv_ol){
  alert('fetch:' + id);
  var r;
  $.ajax({
    url:'http://api.twitter.com/1/statuses/show/'+id+'.json', 
    success: function(data) {
        alert('recv:'+data.text);
        conv_ol.append("<li id='status_"+id+"' class='hentry status'>data.text</li>");
        if(data.in_reply_to_status_id){
          fetchstatus(data.in_reply_to_status_id, conv_ol);
        }
    },
    dataType:'jsonp',
  });
}
$('span.status-body span.meta > a').each(function(idx,elem){
if($(elem).text().indexOf('in reply') > -1){
  $(elem).click(function(){fetchconv($(elem));return false});
}
})





var templ = '<li id="status_{{ id }}" class="hentry u-{{ user.screen_name }} status">
  <span class="thumb vcard author">
    <a class="tweet-url profile-pic url" href="http://twitter.com/{{ user.screen_name }}">
      <img width="48" height="48" src="{{ user.profile_image_url }}" class="photo fn" alt="{{ user.name }}">
    </a>
  </span>  
  <span class="status-body">
    <span class="status-content">
      <strong><a class="tweet-url screen-name" href="http://twitter.com/{{ user.screen_name }}">{{ user.screen_name }}</a></strong>
      <span class="actions">
        <div>
          <a title="favorite this tweet" class="fav-action non-fav" id="status_star_{{ id }}">&nbsp;&nbsp;</a>
        </div>
      </span>
      <span class="entry-content">{{ text }}</span>
    </span>
    <span data="{}" class="meta entry-meta">
      <a href="http://twitter.com/{{ user.screen_name }}/status/{{ id }}" rel="bookmark" class="entry-date">
        <span data="{time:'{{ created_at }}'}" class="published timestamp">minutes ago</span>
      </a>
    </span>

    <ul class="actions-hover">
      <li>
        <span class="reply">
          <span class="reply-icon icon"></span>
          <a title="reply to {{ user.screen_name }}" href="/?status=@{{ user.screen_name }}&amp;in_reply_to_status_id={{ id }}&amp;in_reply_to={{ user.screen_name }}">Reply</a>
        </span>
      </li>
      <li>
        <span class="retweet-link">
          <span class="retweet-icon icon"></span>
          <a href="#" title="Retweet">Retweet</a>
        </span>
      </li>
    </ul>
    <ul class="meta-data clearfix">
    </ul>
  </span>
</li>'

function fetchconv(je){
 var id= je.attr('href').split('/').pop();
 var par_li = je.parents('li.status');
 alert(par_li.attr('id'));
 par_li.append('<ol class="statuses"><li>Conversation:</li></ol>');
 var conv_ol = par_li.find('ol.statuses');
 fetchstatus(id, conv_ol)
};
function fetchstatus(id, conv_ol){
  alert('fetch:' + id);
  var r;
  $.ajax({
    url:'http://api.twitter.com/1/statuses/show/'+id+'.json', 
    success: function(data) {
        alert('recv:'+data.text);
        conv_ol.append(Mustache.to_html(templ, data));
        if(data.in_reply_to_status_id){
          fetchstatus(data.in_reply_to_status_id, conv_ol);
        }
    },
    dataType:'jsonp',
  });
}
$('span.status-body span.meta > a').each(function(idx,elem){
if($(elem).text().indexOf('in reply') > -1){
  $(elem).click(function(){fetchconv($(elem));return false});
}
})



var templ = '<li id="status_{{ id }}" class="hentry u-{{ user_screen_name }} status">' +
  '<span class="thumb vcard author">' +
    '<a class="tweet-url profile-pic url" href="http://twitter.com/{{ user_screen_name }}">' +
      '<img width="48" height="48" src="{{ user_profile_image_url }}" class="photo fn" alt="{{ user_name }}">' +
    '</a>' +
  '</span>  ' +
  '<span class="status-body">' +
    '<span class="status-content">' +
      '<strong><a class="tweet-url screen-name" href="http://twitter.com/{{ user_screen_name }}">{{ user_screen_name }}</a></strong>' + 
      '<span class="actions">' +
        '<div>' + 
          '<a title="favorite this tweet" class="fav-action non-fav" id="status_star_{{ id }}">&nbsp;&nbsp;</a>' +
        '</div>' + 
      '</span>' +
      '<span class="entry-content">{{ text }}</span>' +
    '</span>' +
    '<span data="{}" class="meta entry-meta">' +
      '<a href="http://twitter.com/{{ user_screen_name }}/status/{{ id }}" rel="bookmark" class="entry-date">' +
        '<span data="{time:\'{{ created_at }}\'}" class="published timestamp">minutes ago</span>' +
      '</a>'+
    '</span>' +
    '<ul class="actions-hover">' + 
      '<li>' +
        '<span class="reply">' +
          '<span class="reply-icon icon"></span>' + 
          '<a title="reply to {{ user_screen_name }}" href="/?status=@{{ user_screen_name }}&amp;in_reply_to_status_id={{ id }}&amp;in_reply_to={{ user_screen_name }}">Reply</a>' +
        '</span>' +
      '</li>' +
      '<li>' + 
        '<span class="retweet-link">' +
          '<span class="retweet-icon icon"></span>' +
          '<a href="#" title="Retweet">Retweet</a>' +
        '</span>' +
      '</li>' +
    '</ul>' +
    '<ul class="meta-data clearfix">' + 
    '</ul>' +
  '</span>' +
'</li>';


/*
javascript:function fetch_conversation(jelem){var id=jelem.attr('href').split('/').pop();var result=[];while(id>-1){data=fetch_status(id);if(data){result.push(data);id=data.in_reply_to_status_id}else{id=-1}}alert(result);};function fetch_status(id){var result;$.getJSON('http://api.twitter.com/1/statuses/show/'+id+'.json?callback=?',function(data){result=data});return result};$('span.status-body span.meta > a').each(function(idx,elem){if($(elem).text().indexOf('in reply')>-1){$(elem).click(function(){fetch_conversation($(elem));return false});}});


javascript:$('span.status-body span.meta > a').each(function(idx,elem){$(elem).click(function(){$(this).text($(this).text() + ' updated')})})

$('span.status-body span.meta > a').each(function(idx,elem){if($(elem).text().indexOf('in reply')>-1){$(elem).click(function(){fetch_conversation($(elem));return false});}});

*/

var twittrConv = {
  twit_template: '<li id="status_{{ id }}" class="hentry u-{{ user_screen_name }} status">' +
  '<span class="thumb vcard author">' +
    '<a class="tweet-url profile-pic url" href="http://twitter.com/{{ user_screen_name }}">' +
      '<img width="48" height="48" src="{{ user_profile_image_url }}" class="photo fn" alt="{{ user_name }}">' +
    '</a>' +
  '</span>  ' +
  '<span class="status-body">' +
    '<span class="status-content">' +
      '<strong><a class="tweet-url screen-name" href="http://twitter.com/{{ user_screen_name }}">{{ user_screen_name }}</a></strong>' + 
      '<span class="actions">' +
        '<div>' + 
          '<a title="favorite this tweet" class="fav-action non-fav" id="status_star_{{ id }}">&nbsp;&nbsp;</a>' +
        '</div>' + 
      '</span>' +
      '<span class="entry-content">{{ text }}</span>' +
    '</span>' +
    '<span data="{}" class="meta entry-meta">' +
      '<a href="http://twitter.com/{{ user_screen_name }}/status/{{ id }}" rel="bookmark" class="entry-date">' +
        '<span data="{time:\'{{ created_at }}\'}" class="published timestamp">{{ created_at }}</span>' +
      '</a>'+
    '</span>' +
    '<ul class="actions-hover">' + 
      '<li>' +
        '<span class="reply">' +
          '<span class="reply-icon icon"></span>' + 
          '<a title="reply to {{ user_screen_name }}" href="/?status=@{{ user_screen_name }}&amp;in_reply_to_status_id={{ id }}&amp;in_reply_to={{ user_screen_name }}">Reply</a>' +
        '</span>' +
      '</li>' +
      '<li>' + 
        '<span class="retweet-link">' +
          '<span class="retweet-icon icon"></span>' +
          '<a href="#" title="Retweet">Retweet</a>' +
        '</span>' +
      '</li>' +
    '</ul>' +
    '<ul class="meta-data clearfix">' + 
    '</ul>' +
  '</span>' +
'</li>',

  fetch_conversation:function(je) {
    var id= je.attr('href').split('/').pop();
    var par_li = je.parents('li.status');
    //alert(par_li.attr('id'));
    var newli = $('<li class="hentry status twittr_conv" style="padding-left:5px;"><ol class="statuses"><li>Conversation:</li></ol></li>')
    par_li.after(newli);
    var conv_ol = newli.find('ol.statuses');
    twittrConv.fetch_status(id, conv_ol)
  },

  fetch_status:function(id, conv_ol){
    //alert('fetch:' + id);
    $.ajax({
      url:'http://api.twitter.com/1/statuses/show/'+id+'.json', 
      success: function(data) {
        for(var a in data.user) {
          data['user_' + a] = data.user[a]
        }
        conv_ol.append(Mustache.to_html(twittrConv.twit_template, data));
        if(data.in_reply_to_status_id){
          twittrConv.fetch_status(data.in_reply_to_status_id, conv_ol);
        }
      },
      dataType:'jsonp',
    });
  },

  attach:function() {
    alert('attaching');
    $('span.status-body span.meta > a').each(function(idx,elem){
      var a_elem=$(elem);
      if(!a_elem.hasClass('twittr_conv') && a_elem.text().indexOf('in reply to') > -1) {
        a_elem.addClass('twittr_conv');
        a_elem.text('show thread w/' + a_elem.text().substring(11));
        a_elem.click(function(){twittrConv.fetch_conversation(a_elem);return false});
      }
    });
  },

  activate:function() {
    twittrConv.attach();
    var navmenu = $('ul#primary_nav');
    if(!navmenu.hasClass('twittr_conv')) {
      navmenu.addClass('twittr_conv');
      navmenu.append('<li id="twitter_conv"><a href="javascript:twittrConv.attach();" accesskey="">Conversations</a></li>');
    }
  },
}

