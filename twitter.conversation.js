/*
 * This script is provided AS IS.
 *
 * Author: Alex Popescu
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
      '<span class="entry-content">&nbsp;{{ text }}</span>' +
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
    var newli = $('<li class="hentry status twittr_conv" style="padding-left:10px;"><ol class="statuses"><li>Conversation:</li></ol></li>')
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
        data['text'] = twittrConv.parse_tweet(data.text);
        conv_ol.append(Mustache.to_html(twittrConv.twit_template, data));
        if(data.in_reply_to_status_id){
          twittrConv.fetch_status(data.in_reply_to_status_id, conv_ol);
        }
      },
      dataType:'jsonp',
    });
  },

  
  parse_tweet:function(text) {
    text=text.replace(/http(s)?:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9-_:%&\?\/.=]+/, function(url) {
  		return url.link(url);
    });
    
    text = text.replace(/[@]+[A-Za-z0-9-_]+/, function(u) {
		  var username = u.replace("@","")
		  return u.link("http://twitter.com/"+username);
	  });
    text = text.replace(/[#]+[A-Za-z0-9-_]+/, function(t) {
  		var tag = t.replace("#","%23")
	  	return t.link("http://search.twitter.com/search?q="+tag);
    });
    return text; 
  },

  attach:function() {
    //alert('attaching');
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
      navmenu.append('<li id="twitter_conv"><a href="javascript:twittrConv.attach();" accesskey="t" title="Activate conversations">Conversations</a></li>');
      $('div#pagination').after('<div style="margin-right: auto; margin-left: auto; text-align: center;" class="twittr_conversation"><a href="javascript:twittrConv.attach()" title="Activate conversations">Conversations</a></div>');
      $('div#side').append('<div class="twittr_conv"><hr/><a href="javascript:twittrConv.attach()" title="Activate conversations" style="margin-left:13px;">Conversations</a></div>');
    }
  },
}
twittrConv.activate();
