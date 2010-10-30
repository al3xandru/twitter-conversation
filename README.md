# Description

twitter.conversation.js is a JS script that add a small arrow link close to the conversation icon. Once the action is triggered the complete conversation will be pulled and displayed in the details right panel.

After loading the script there will be a Conversations menu item at the top of the page. That label will also be used to provide some sort of visual feedback while retrieving a conversation.

The script works only as long as there is no complete page refresh. With the #newtwitter UI, you'll not need to reload the script. It will allow you to switch between the timeline and @replies without having to reload. It will also work for new tweets received after loading twitter.conversation.js through its bookmarklet. 


# Bookmarklet

The following bookmarklet can be used to trigger the initial load of this script. The bookmarklet is reload friendly, as in it will not reload itself if already loaded, but will trigger itself to add the conversation action.

Bookmarklet: <a href="javascript:(function(){if(typeof(twittrConv)!='undefined'){twittrConv.attach()}else{d=document;s=d.createElement('script');s.type='text/javascript';s.src='http://github.com/al3xandru/twitter-conversation/raw/master/twitter.conversation.js';d.body.appendChild(s)}})();" title="Twitter Conversations Bookmarklet">Twitter Conversations</a>

Bookmarklet code:

    javascript:(function(){if(typeof(twittrConv)!='undefined'){twittrConv.attach()}else{d=document;s=d.createElement('script');s.type='text/javascript';s.src='http://github.com/al3xandru/twitter-conversation/raw/master/twitter.conversation.js';d.body.appendChild(s)}})();
