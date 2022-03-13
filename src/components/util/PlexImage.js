
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

import { getThumbnailTranscodeUrl } from '../../plex/Api';

const Image = styled.img`
    ${props => (props.xheight) ? `height: ${props.xheight}px;` : ''}
    ${props => (props.xwidth) ? `width: ${props.xwidth}px;` : ''}
    object-fit: none;
    display: inline-block;
    ${props => (props.hideRadius) ? '' : `border-radius: 0.375rem;`}
`;

const ImagePlaceholder = styled.div`
    ${props => (props.xheight) ? `height: ${props.xheight}px` : ''};
    ${props => (props.xwidth) ? `width: ${props.xwidth}px` : ''};
`;

const PlexImage = ({ height, width, url, alt, isLazy, hideRadius }) => {
    
    const [imageUrl, setImageUrl] = useState(null);

    const accessToken = useSelector(state => state.settings.accessToken);
    const baseUrl = useSelector(state => state.application.baseUrl);
   
    useEffect(() => {
        if (accessToken && baseUrl && url) {
            setImageUrl(getThumbnailTranscodeUrl(height, width, baseUrl, url, accessToken));
        } else {
            setImageUrl(null);
        }
    }, [baseUrl, accessToken, url, width, height]);

    return (
        <>
        {imageUrl && (
            <Image xheight={height} xwidth={width} hideRadius={hideRadius} src={imageUrl} alt={alt} loading={(isLazy) ? 'lazy' : 'eager' } />
        )}
        {!imageUrl && (
            <ImagePlaceholder xheight={height} xwidth={width} />
        )}
        </>
        ); 
}

export default PlexImage;