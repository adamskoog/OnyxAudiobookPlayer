import { useEffect, useState } from 'react';
import PlexJavascriptApi from '@/plex';

import styles from './styles/PlexImage.module.css'

type PlexImageProps = {
    height: number,
    width: number,
    url: string | undefined,
    alt: string | undefined,
    isLazy?: boolean,
    hideRadius?: boolean
}

function PlexImage({ height, width, url, alt, isLazy = true, hideRadius = false }: PlexImageProps) {

    const [imageUrl, setImageUrl]: [any, any] = useState(null);

    const classes = [styles.item_image];
    if (hideRadius) classes.push(styles.no_radius);

    useEffect(() => {
        if (url) {
          setImageUrl(PlexJavascriptApi.getThumbnailTranscodeUrl(height, width, url));
        } else {
          setImageUrl(null);
        }
    }, [url, width, height]);

    return (
        <>
            {imageUrl !== null ? (
                <img className={classes.join(' ')} src={imageUrl} alt={alt} loading={(isLazy) ? 'lazy' : 'eager'} />
            ) : (
                <div className={`${styles.item_image}`}></div>
            )}
        </>
    );
}

export default PlexImage;