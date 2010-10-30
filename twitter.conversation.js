var twittrConv = {
  attach:function() {
    $('div.tweet').live('mouseover', function(){
      var parentTweet = $(this);
      parentTweet.find('span.reply-icon').each(function(idx, e) {
        var areply = $(e);
        if(!areply.hasClass('twittr_conv')) {
          var conv_span=$('<span class="twittr_conv"></span>');
          var conv_link=$('<a style="color:blue;font-size:1.2em;font-weight:bold;" href="#">&#8618;</a>');
          conv_link.click(function(){parentTweet.click();twittrConv.fetch_conversation(parentTweet);return false});
          conv_span.append(conv_link);
          areply.parent().prepend(conv_span);
          areply.addClass('twittr_conv');
        } 
      });
    });
    $('div#global-nav ul').append('<li id="twitconv-nav"><a href="/#!/messages">Conversations</a></li>');
  },
  
  fetch_conversation:function(je) {
    var id= $(je).attr('data-tweet-id');
    var detailsPanel = $('div.details-pane');
    if(detailsPanel && detailsPanel.hasClass('opened')) {
      var panel = $('div.inner-pane'); 
      var convPanel = panel.find('div#conv_' + id);
      if(!convPanel || !convPanel.length) {
        var feedback = $('div#global-nav ul li#twitconv-nav a');
        feedback.css('color', 'red').text('Loading conversation .');
        var newComponent = $('<div class="component twittr_conv" id="conv_' + id + '"></div>')
        var newContainer = $('<div class="related-tweets"><h3>Loading conversation...</h3></div>');
        newComponent.append(newContainer);
        twittrConv.fetch_status(id, id, false, panel, newContainer);
      }
    }
  },

  fetch_status:function(conv_id, id, append, rootParentContainer, parentContainer){
    $.ajax({
      url:'http://api.twitter.com/1/statuses/show/'+id+'.json', 
      success: function(data) {
        for(var a in data.user) {
          data['user_' + a] = data.user[a]
        }
        data.text = twittrConv.parse_tweet(data.text);
        //alert('appending:' + id + ' to ' + parentContainer);
        parentContainer.find('h3').after(Mustache.to_html(twittrConvTemplate.TEMPLATE, data));  
              
        if(data.in_reply_to_status_id){
          //alert('fetching:' + data.in_reply_to_status_id + ' parent of ' + data.id);
          var feedback = $('div#global-nav ul li#twitconv-nav a');
          feedback.text(feedback.text() + '.');          
          twittrConv.fetch_status(conv_id, data.in_reply_to_status_id, true, rootParentContainer, parentContainer);
        }
        else {
          //alert('conversation done');
          parentContainer.find('h3').text('Conversation');
          var attachTo =  $(rootParentContainer).find('div.component div.tweet-pane');
          if(attachTo && attachTo.length) {
            attachTo.parent().after(parentContainer.parent());
          }
          var feedback = $('div#global-nav ul li#twitconv-nav a');
          feedback.css('color', '#BABABA').text('Conversations');
        }
      },
      error:function(xhr, textStatus, errorThrown) {
          //alert('conversation fetching error:' + textStatus);
          var feedback = $('div#global-nav ul li#twitconv-nav a');
          feedback.css('color', '#BABABA').text('Conversations');          
          parentContainer.find('h3').after('<div class="stream-item"><div class="tweet-content simple-tweet-content"><div class="tweet-row"><div class="tweet-text">'+
            'Error fetching conversation:' + textStatus + '</div></div></div></div>'); 
          var isAttached = $(rootParentContainer).find('div#conv_' + conv_id);
          if(!isAttached || !isAttached.length) { 
            var attachTo =  $(rootParentContainer).find('div.component div.tweet-pane');
            if(attachTo && attachTo.length) {
              attachTo.parent().after(parentContainer.parent());
            }
          }
      },
      dataType:'jsonp',
      timeout: 2000,
    });
  },

  parse_tweet:function(text) {
    text=text.replace(/http(s)?:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9-_:%&\?\/.=]+/g, function(url) {
  		return '<a href="' + url + '" target="_blank">' + url + '</a>';
    });

    text = text.replace(/[@]+[A-Za-z0-9-_]+/g, function(u) {
		  var username = u.replace("@","")
		  return '@<a href="' + username + '" data-screen-name="' + username + '" class="twitter-atreply" target="_blank">' + username + '</a>';
	  });
    text = text.replace(/[#]+[A-Za-z0-9-_]+/g, function(t) {
  		var tag = t.replace("#","%23")
	  	return t.link("http://search.twitter.com/search?q="+tag);
    });
    return text; 
  },  
};
var twittrConvTemplate = {
  TEMPLATE: '<div class="stream-item">' +
'<div class="more">»</div>' +
'<div data-user-id="{{ user_id }}" data-screen-name="{{ user_screen_name }}" data-item-id="{{ id }}" data-tweet-id="{{ id }}" class="stream-item-content tweet stream-tweet simple-tweet ">' +
' <div class="tweet-dogear "></div>' +
' <div class="tweet-image simple-tweet-image">' +
'   <img width="32" height="32" data-user-id="{{ user_id }}" class="user-profile-link" alt="{{ user_name }}" src="{{ user_profile_image_url }}">' +
' </div>' +
' <div class="tweet-content simple-tweet-content">' +
'   <div class="tweet-row">' +
'     <span class="tweet-user-name">' +
'       <a title="{{ user_name }}" href="/#!/{{ user_screen_name }}" data-user-id="{{ user_id }}" class="tweet-screen-name user-profile-link">{{ user_screen_name }}</a>'+
'       <span class="tweet-full-name">{{ user_screen_name }}</span>' +
'     </span>' +
'     <div class="tweet-corner">' +
'       <div class="tweet-meta">' + 
'         <span class="icons"><div class="extra-icons"><span class="inlinemedia-icons"></span></div></span>' +
'       </div>' +
'     </div>' +
'   </div>' +
'   <div class="tweet-row"><div class="tweet-text">{{{ text }}}</div></div>' +
'   <div class="tweet-row"></div>' +
'   <div class="tweet-row">' +
'     <a title="{{ created_at }}" class="tweet-timestamp" href="/#!/{{ user_screen_name }}/status/{{ id }}"><span data-long-form="true" data-time="" class="_timestamp">{{ created_at }}</span></a>' +
'   </div>' + 
'   <div class="tweet-row"></div>' +
' </div></div></div>',

  TWEET_ACTIONS: '     <span data-tweet-id="{{ id }}" class="tweet-actions">' + 
  '       <a class="favorite-action" href="#"><span><i></i><b>Favorite</b></span></a>' +
  '       <a class="retweet-action" href="#"><span><i></i><b>Retweet</b></span></a>' +
  '       <a data-screen-name="{{ user_screen_name }}" class="reply-action" href="#"><span><i></i><b>Reply</b></span></a>' +
  '     </span>'
}

twittrConv.attach();
/*
javascript:(function(){if(typeof(twittrConv)!='undefined'){alert('twittrConv%20already%20loaded');twittrConv.attach()}else{d=document;s=d.createElement('script');s.type='text/javascript';s.src='http://friendfeedredux.appspot.com/js/twitter.conversation.js?'+(new%20Date()).getTime();d.body.appendChild(s)}})();
*/
