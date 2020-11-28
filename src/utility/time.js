class TimeUtils
{
    static pad(n, z) {
        z = z || 2;
        return ('00' + n).slice(-z);
    }

    static convertFromMs(s) {
        let ms = s % 1000;
        s = (s - ms) / 1000;
        let secs = s % 60;
        s = (s - secs) / 60;
        let mins = s % 60;
        let hrs = (s - mins) / 60;
      
        let output = ""
        if (hrs > 0)
            output += `${hrs}:`;
        
        return `${output}${TimeUtils.pad(mins)}:${TimeUtils.pad(secs)}`;
    }

    static convertFromSeconds(s) {
        let secs = s % 60;
        let hrs = s / 60;
        let mins = hrs % 60;
        hrs =  parseInt(hrs / 60, 10);
      
        let output = ""
        if (hrs > 0)
        output += `${hrs}:`;
        
        return `${output}${TimeUtils.pad(parseInt(mins, 10))}:${TimeUtils.pad(parseInt(secs, 10))}`;
    }

    static formatTrackDisplay(duration) {
        return TimeUtils.convertFromMs(duration);
    }

    static formatPlayerDisplay(current, duration) {
        return `${TimeUtils.convertFromSeconds(current)} / ${TimeUtils.convertFromSeconds(duration)}`;
    }
}

export default TimeUtils;