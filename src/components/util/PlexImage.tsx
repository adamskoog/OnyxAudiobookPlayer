import React, { useState, useEffect, ReactElement } from 'react';
import styled from 'styled-components';

import { useAppSelector } from '../../context/hooks';
import { getThumbnailTranscodeUrl } from '../../plex/Api';

const Image: any = styled.img`
    ${(props: any) => ((props.xheight) ? `height: ${props.xheight}px;` : '')}
    ${(props: any) => ((props.xwidth) ? `width: ${props.xwidth}px;` : '')}
    object-fit: none;
    display: inline-block;
    ${(props: any) => ((props.hideRadius) ? '' : 'border-radius: 0.375rem;')}
`;

const ImagePlaceholder: any = styled.div`
    ${(props: any) => ((props.xheight) ? `height: ${props.xheight}px` : '')};
    ${(props: any) => ((props.xwidth) ? `width: ${props.xwidth}px` : '')};
`;

type Props = {
    height: number,
    width: number,
    url: string,
    alt: string,
    isLazy?: boolean,
    hideRadius?: boolean
}

function PlexImage({
  height, width, url, alt, isLazy, hideRadius,
}: Props): ReactElement {
  const [imageUrl, setImageUrl]: [any, any] = useState(null);

  const accessToken = useAppSelector((state) => state.settings.accessToken);
  const baseUrl = useAppSelector((state) => state.application.baseUrl);

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
      <Image xheight={height} xwidth={width} hideRadius={hideRadius} src={imageUrl} alt={alt} loading={(isLazy) ? 'lazy' : 'eager'} />
      )}
      {!imageUrl && (
      <ImagePlaceholder xheight={height} xwidth={width} />
      )}
    </>
  );
}

PlexImage.defaultProps = {
  isLazy: false,
  hideRadius: false,
};

export default PlexImage;
