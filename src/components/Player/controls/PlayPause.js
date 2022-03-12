import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

import { PlayState } from "../../../context/actions/playerActions";
import { ReactComponent as PauseTrackSvg } from '../../../assets/playerPause.svg';
import { ReactComponent as PlayTrackSvg } from '../../../assets/playerPlay.svg';

const PlayerLargeButton = styled.button`
    margin-left: 0.5rem;
    margin-right: 0.5rem;
    font-size: 2.25rem;
    line-height: 2.5rem;
`;

const PlayPauseControl = ({ playTrack, pauseTrack }) => {

    const playState = useSelector(state => state.player.mode);

    return (
        <>
        {playState === PlayState.PLAY_STATE_PAUSED && (
            <PlayerLargeButton onClick={() => playTrack()}>
                <PauseTrackSvg />
            </PlayerLargeButton>
        )}
        {playState === PlayState.PLAY_STATE_PLAYING && (
            <PlayerLargeButton onClick={() => pauseTrack()}>
                <PlayTrackSvg />
            </PlayerLargeButton>
        )}
        </>
    ); 
}

export default PlayPauseControl;