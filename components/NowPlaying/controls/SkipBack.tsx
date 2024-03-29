import { memo } from 'react';
import BaseControl from './BaseControl';

type Props = {
    skipBackward: () => void,
}

function SkipBackControl({ skipBackward }: Props) {

    return (
        <BaseControl title={'Skip Back'} onClick={() => skipBackward()}>
            <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-skip-backward-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M.5 3.5A.5.5 0 0 0 0 4v8a.5.5 0 0 0 1 0V4a.5.5 0 0 0-.5-.5z"/>
                <path d="M.904 8.697l6.363 3.692c.54.313 1.233-.066 1.233-.697V4.308c0-.63-.692-1.01-1.233-.696L.904 7.304a.802.802 0 0 0 0 1.393z"/>
                <path d="M8.404 8.697l6.363 3.692c.54.313 1.233-.066 1.233-.697V4.308c0-.63-.693-1.01-1.233-.696L8.404 7.304a.802.802 0 0 0 0 1.393z"/>
            </svg>
        </BaseControl>
    );
}

export default memo(SkipBackControl);
