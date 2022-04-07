import React, {
  useRef, useEffect, useState, ReactElement,
} from 'react';
import styled from 'styled-components';

import { useAppSelector } from '../../context/hooks';

import LibraryItem from '../Library/AlbumItem';
import Loader from '../Loader';

import HubScrollLeftSvg from '-!svg-react-loader!../../assets/hubScrollLeft.svg';
import HubScrollRightSvg from '-!svg-react-loader!../../assets/hubScrollRight.svg';

const Container = styled.div`
`;

const Title = styled.div`
    display: inline-block;
    font-weight: 700;

    font-size: 1.25rem;
    line-height: 1.75rem;

    margin-bottom: 0.5rem;
`;

const ButtonContainer = styled.div`
    float: right;

    font-size: 1.25rem;
    line-height: 1.75rem;
`;

const HubScrollButton = styled.button`
`;

const HubContainer = styled.div`
    width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    margin-bottom: 1.5rem;
    min-height: 240px;
    position: relative;

    &::-webkit-scrollbar {
        display: none;
    }
`;
const HubContents = styled.div`
    display: flex;
    flex-direction: row;
    gap: 1rem;
    width: max-content;
    transition: transform .2s ease-in-out;

    &.hub-no-transition {
        transition: none;
    }
`;

type Props = {
    title: string,
    getItems: () => Promise<Array<PlexAlbumMetadata>>
}

// Horizontal scrolling based on: https://webdevtrick.com/horizontal-scroll-navigation/
function Hub({ title, getItems }: Props): ReactElement {

  const section = useAppSelector((state) => state.settings.librarySection);
  const applicationState = useAppSelector((state) => state.application.applicationState);

  const [isLoading, setIsLoading] = useState(true);
  const [hubItems, setHubItems] = useState([] as Array<PlexAlbumMetadata>);

  const [leftScrollDisabled, setLeftScrollDisabled] = useState(true);
  const [rightScrollDisabled, setRightScrollDisabled] = useState(true);

  const containerRef = useRef(null as HTMLDivElement | null);
  const contentRef = useRef(null as HTMLDivElement | null);

  const isTickingRef = useRef(false);
  const isTravelingRef = useRef(false);
  const directionRef = useRef('');

  const determineOverflow = (container: HTMLDivElement, content: HTMLDivElement): string => {
    const containerMetrics = container.getBoundingClientRect();
    const containerMetricsRight = Math.floor(containerMetrics.right);
    const containerMetricsLeft = Math.floor(containerMetrics.left);
    const contentMetrics = content.getBoundingClientRect();
    const contentMetricsRight = Math.floor(contentMetrics.right);
    const contentMetricsLeft = Math.floor(contentMetrics.left);
    if (containerMetricsLeft > contentMetricsLeft && containerMetricsRight < contentMetricsRight) {
      return 'both';
    } if (contentMetricsLeft < containerMetricsLeft) {
      return 'left';
    } if (contentMetricsRight > containerMetricsRight) {
      return 'right';
    }
    return 'none';
  };

  const checkOverflow = (): void => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (container && content) {
        const overflow = determineOverflow(container, content);

        setLeftScrollDisabled(!((overflow === 'both' || overflow === 'left')));
        setRightScrollDisabled(!((overflow === 'both' || overflow === 'right')));
        container.setAttribute('data-overflowing', overflow);
    }
  };

  const advanceRight = (): void => {
    // If in the middle of a move return
    if (isTravelingRef.current === true) return;

    const container = containerRef.current;
    const content = contentRef.current;
    if (container && content) {
      // If we have content overflowing both sides or on the right
      if (determineOverflow(container, content) === 'right' || determineOverflow(container, content) === 'both') {
        // Get the right edge of the container and content
        const navBarRightEdge = content.getBoundingClientRect().right;
        const navBarScrollerRightEdge = container.getBoundingClientRect().right;
        // get width of scroll area - this will change all contents
        const navBarScrollerWidth = container.getBoundingClientRect().width;
        // Now we know how much space we have available to scroll
        const availableScrollRight = Math.floor(navBarRightEdge - navBarScrollerRightEdge);
        // If the space available is less than two lots of our desired distance, just move the whole amount
        // otherwise, move by the amount in the settings
        if (availableScrollRight < navBarScrollerWidth) {
          content.style.transform = `translateX(-${availableScrollRight}px)`;
        } else {
          content.style.transform = `translateX(-${navBarScrollerWidth}px)`;
        }
        // We do want a transition (this is set in CSS) when moving so remove the class that would prevent that
        content.classList.remove('hub-no-transition');
        // Update our settings
        directionRef.current = 'right';
        isTravelingRef.current = true;
      }
      // Now update the attribute in the DOM
      container.setAttribute('data-overflowing', determineOverflow(container, content));
    }
  };

  const advanceLeft = (): void => {
    if (isTravelingRef.current === true) return;

    const container = containerRef.current;
    const content = contentRef.current;
    if (container && content) {
      // If we have content overflowing both sides or on the left
      if (determineOverflow(container, content) === 'left' || determineOverflow(container, content) === 'both') {
        // Find how far this panel has been scrolled
        const availableScrollLeft = container.scrollLeft;
        const navBarScrollerWidth = container.getBoundingClientRect().width;
        // If the space available is less than two lots of our desired distance, just move the whole amount
        // otherwise, move by the amount in the settings
        if (availableScrollLeft < navBarScrollerWidth) {
          content.style.transform = `translateX(${availableScrollLeft}px)`;
        } else {
          content.style.transform = `translateX(${navBarScrollerWidth}px)`;
        }
        // We do want a transition (this is set in CSS) when moving so remove the class that would prevent that
        content.classList.remove('hub-no-transition');
        // Update our settings
        directionRef.current = 'left';
        isTravelingRef.current = true;
      }
      // Now update the attribute in the DOM
      container.setAttribute('data-overflowing', determineOverflow(container, content));
    }
  };

  const navTransition = (): void => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (container && content) {
      // get the value of the transform, apply that to the current scroll position (so get the scroll pos first) and then remove the transform
      const styleOfTransform = window.getComputedStyle(content, null);
      const tr = styleOfTransform.getPropertyValue('-webkit-transform') || styleOfTransform.getPropertyValue('transform');
      // If there is no transition we want to default to 0 and not null
      const amount = Math.abs(parseInt(tr.split(',')[4]) || 0);
      content.style.transform = 'none';
      content.classList.add('hub-no-transition');
      // Now lets set the scroll position
      if (directionRef.current === 'left') {
        container.scrollLeft -= amount;
      } else {
        container.scrollLeft += amount;
      }
    }
    isTravelingRef.current = false;
  };

  const scroller = (): void => {
    if (!isTickingRef.current) {
      window.requestAnimationFrame(() => {
        checkOverflow();
        isTickingRef.current = false;
      });
    }
    isTickingRef.current = true;
  };

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (container && content) {
        container.addEventListener('scroll', scroller);
        content.addEventListener('transitionend', navTransition);
        window.addEventListener('resize', checkOverflow);
    }

    checkOverflow();
    return () => {
      if (container && content) {
          container.removeEventListener('scroll', scroller);
          content.removeEventListener('transitionend', navTransition);
          window.removeEventListener('resize', checkOverflow);
      }
    };
  });

  useEffect(() => {
    const doFetch = async (): Promise<void> => {
      if (applicationState === 'ready' && section) {
        setIsLoading(true);
        const data = await getItems();
        setHubItems(data);
        setIsLoading(false);
      } else setHubItems([]);
    }; 
    doFetch();
  }, [section, applicationState]);

  return (
    <Container>
      <Title>{title}</Title>
      <ButtonContainer>
        <HubScrollButton onClick={() => advanceLeft()} disabled={leftScrollDisabled}>
          <HubScrollLeftSvg />
        </HubScrollButton>
        <HubScrollButton onClick={() => advanceRight()} disabled={rightScrollDisabled}>
          <HubScrollRightSvg />
        </HubScrollButton>
      </ButtonContainer>
      <HubContainer ref={containerRef}>
        <Loader isLoading={isLoading} zIndex={49} hideBackground={true}/>
        <HubContents ref={contentRef}>
          {hubItems.map((item) => (
            <LibraryItem key={item.ratingKey} metadata={item} showAuthor />
          ))}
        </HubContents>
      </HubContainer>
    </Container>
  );
}

export default Hub;
