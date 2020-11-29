class AlbumHelpers
{
    // Value in which we consider a track completed. This will hopefully only be temporary
    // and can be tightened up a bit once things are a bit more fully implemented.
    static TRACK_COMPLETE_PERCENT = 0.95;

    static trackPercentComplete(offset, duration) {
        if (!offset || !duration) return 0;

        return offset / duration;
    }

    static trackIsComplete(offset, duration) {
        if (!offset) return false;

        const percentComplete = AlbumHelpers.trackPercentComplete(offset, duration);
        if (percentComplete > AlbumHelpers.TRACK_COMPLETE_PERCENT)
            return true;
        return false;
    }
}

export default AlbumHelpers;