import { useEffect, useState } from 'react';
import PlexJavascriptApi from '@adamskoog/jsapi-for-plex';

import styles from './styles/PlexImage.module.css'

type PlexImageProps = {
    height: number,
    width: number,
    url: string | undefined,
    alt: string | undefined,
    isLazy?: boolean,
    hideRadius?: boolean,
    upscale?: boolean,
    minSize?: boolean
}

function PlexImage({ height, width, url, alt, upscale = false, minSize = false, isLazy = true, hideRadius = false }: PlexImageProps) {

    const [imageUrl, setImageUrl] = useState<string | null>(null);

    const classes = [styles.item_image];
    if (hideRadius) classes.push(styles.no_radius);

    useEffect(() => {
        if (url) {
          setImageUrl(PlexJavascriptApi.getThumbnailTranscodeUrl(height, width, url, minSize, upscale));
        } else {
          setImageUrl(null);
        }
    }, [url, width, height, minSize, upscale]);

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