import styles from './styles/Controls.module.css'

function PlaybackRateControl({ rate }: { rate: number }) {

    return (
        <div className={styles.playbackrate}>
            {rate}x
        </div>
    );
}

export default PlaybackRateControl;
