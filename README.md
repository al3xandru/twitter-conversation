# Description

twitter.conversation.js is a JS script that replaces the "in reply to" link with an action that displays the complete conversation thread. The script also adds a "Conversations" menu item on the right bar that triggers reloading.

The script works only as long as there is not page refresh. But you should trigger a reloaded after any of the following actions:

- posting a new Tweet
- receiving new Tweets
- checking more Tweets
- switching between Home page, @replies, direct messages and favorites

Twitter web page is pretty friendly in terms of not requiring reloading. You can learn how to use it without reloading [here](http://jots.mypopescu.com/post/824229397/twitter-shortcuts).

The "Conversations" menu item can be triggered using the "t" access key (*note*: triggering access keys depends from browser to browser: Safari CTRL+ALT+<key>, Firefox: CTRL+<key>, )

# Bookmarklet

The following bookmarklet can be used to trigger the initial load of this script. The bookmarklet is reload friendly, as in it will not reload itself if already loaded, but will trigger itself to add the conversation action.

Bookmarklet: <a href="javascript:(function(){if(twittrConv){twittrConv.attach()}else{d=document;s=d.createElement('script');s.type='text/javascript';s.src='';d.body.appendChild(s);}})();">Twitter conversations</a>

