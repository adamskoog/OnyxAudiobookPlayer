# Audiobook Player

This is my feeble attempt to learn both ReactJS as well as better understand the Plex Media Server API.

There is a considerable amount left to implement in this application (which will hopefully happen). Here is a list of things that are working:

* Authentication through Plex.tv
* Loading of library - this loads your full library, I have not yet done anything to lazy load this.
* Album Summary page
* Click on Track to start playing
* Basic play, pause, stop buttons for the audio player.
* Timeline reporting to PMS
* Settings page - this is in progress currently, has basic functionality, but has a lot of edge case issues.

Things to do:

* Styling - there is still lots of work to do here.
* Better handling and selection of server end point
* Better audio player - I'm not sure what all formats the html5 audio tag can play, but I'm guessing it's lacking.
* Play Queue support - when pressing the album play button (not yet added) it should queue up the remaining book.
* Better handle Plex 90% ending of book - I remember others have gotten around this by upping the duration given to the timeline requests.
* Error handling - I'm sure this will break in many a spectacular way currently
* I'm sure there is much more as well...