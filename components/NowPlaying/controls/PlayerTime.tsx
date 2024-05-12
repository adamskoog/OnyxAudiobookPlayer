import { useAppSelector } from '@/store';
import { formatPlayerDisplay } from '@/utility';

const defaultTimeDisplay = '--:--/--:--';

const formatTime = (currentTime: number | null, duration: number | null): string => {
    if (!currentTime || !duration) return defaultTimeDisplay;
    return formatPlayerDisplay(currentTime, duration);
};

function PlayerTime() {

    const currentTime = useAppSelector(state => state.player.currentTime);
    const duration = useAppSelector(state => state.player.duration);

    return (
        <>{formatTime(currentTime, duration)}</>
    );
}

export default PlayerTime;
