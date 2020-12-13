# Onxy Audiobook Player
This is my feeble attempt to learn both ReactJS as well as better understand the Plex Media Server API. The goal is to create a web based Audiobook player that works with Plex Media Server's audio library with Stored Progress enabled.

## Things to do:
* Styling - there is still lots of work to do here.
* Better handling and selection of server end point
* Better audio player - I'm not sure what all formats the html5 audio tag can play, but I'm guessing it's lacking.
* Error handling - I'm sure this will break in many a spectacular way currently
* I'm sure there is much more as well...

## Patch Notes
### Version: 0.3.1
* Central State Management (Redux)
* Complete Rework of Player Components to allow better rendering.

### Version: 0.2.2
* Better handling of play queue and properly clear when play is stopped.
* Lazy load images on Album list.
* Transcode images to lower resolution for better load speeds.
* Huge rework to the player itself to avoid some really annoying edge case issues.

### Version: 0.2.1
* Large refactor - change from React Components to React Hooks

### Version: 0.1.2
* Play Queue support - when pressing the on deck play button the remaining tracks will be queued for play.
* Handling of greater than 90% of book playback - doing this by inflating duration when doing timeline updates.

### Version: 0.1.1
* Authentication through Plex.tv
* Loading of library - this loads your full library, I have not yet done anything to lazy load this.
* Album Summary page
* Click on Track to start playing
* Basic play, pause, stop buttons for the audio player.
* Timeline reporting to PMS
* Settings page - this is in progress currently, has basic functionality, but has a lot of edge case issues.
