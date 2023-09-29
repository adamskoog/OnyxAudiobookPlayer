import { useEffect, useState, useRef, MutableRefObject } from "react"

const OVERFLOW = {
  both: 'both',
  left: 'left',
  right: 'right',
  none: 'none'
}

const SCROLL_DIRECTION = {
  left: 'left',
  right: 'right',
}

const NO_TRANSITION_CLASS = 'hub-no-transition'

type HookProps = {
    containerRef: MutableRefObject<HTMLDivElement | null>,
    contentRef: MutableRefObject<HTMLDivElement | null>
}

type HookReturn = {
    leftScrollDisabled: boolean, 
    rightScrollDisabled: boolean,
    advanceRight: () => void,
    advanceLeft: () => void,
}

const useHubNavigation = ({ containerRef, contentRef }: HookProps): HookReturn => {
    
    const [leftScrollDisabled, setLeftScrollDisabled] = useState<boolean>(true);
    const [rightScrollDisabled, setRightScrollDisabled] = useState<boolean>(true);
    
    const isTickingRef = useRef(false);
    const isTravelingRef = useRef(false);
    const directionRef = useRef('');

    const determineOverflow = (container: HTMLDivElement, content: HTMLDivElement): string => {
        // Adding some 'fuzziness' to the container bounding to make sure
        // we get the correct scroll disabled state.
        const containerMetrics = container.getBoundingClientRect();
        const containerMetricsRight = Math.floor(containerMetrics.right) + 5;
        const containerMetricsLeft = Math.floor(containerMetrics.left) - 5;
        const contentMetrics = content.getBoundingClientRect();
        const contentMetricsRight = Math.floor(contentMetrics.right);
        const contentMetricsLeft = Math.floor(contentMetrics.left);

        if (containerMetricsLeft > contentMetricsLeft && containerMetricsRight < contentMetricsRight) {
          return OVERFLOW.both;
        } else if (contentMetricsLeft < containerMetricsLeft) {
          return OVERFLOW.left;
        } else if (contentMetricsRight > containerMetricsRight) {
          return OVERFLOW.right;
        }
        return OVERFLOW.none;
    };
  
    const checkOverflow = (): void => {
      const container = containerRef.current;
      const content = contentRef.current;
      if (container && content) {
          const overflow = determineOverflow(container, content);
  
          setLeftScrollDisabled(!((overflow === OVERFLOW.both || overflow === OVERFLOW.left)));
          setRightScrollDisabled(!((overflow === OVERFLOW.both || overflow === OVERFLOW.right)));
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
        if (determineOverflow(container, content) === OVERFLOW.right || determineOverflow(container, content) === OVERFLOW.both) {
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
          content.classList.remove(NO_TRANSITION_CLASS);
          // Update our settings
          directionRef.current = SCROLL_DIRECTION.right;
          isTravelingRef.current = true;
        }
        
        checkOverflow();
      }
    };
  
    const advanceLeft = (): void => {
      if (isTravelingRef.current === true) return;
  
      const container = containerRef.current;
      const content = contentRef.current;
      if (container && content) {
        // If we have content overflowing both sides or on the left
        if (determineOverflow(container, content) === OVERFLOW.left || determineOverflow(container, content) === OVERFLOW.both) {
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
          content.classList.remove(NO_TRANSITION_CLASS);
          // Update our settings
          directionRef.current = SCROLL_DIRECTION.left;
          isTravelingRef.current = true;
        }
        
        checkOverflow();
      }
    };
  
    const navTransition = (): void => {
      const container = containerRef.current;
      const content = contentRef.current;
      if (container && content) {
        // get the value of the transform, apply that to the current scroll position 
        // (so get the scroll pos first) and then remove the transform
        const styleOfTransform = window.getComputedStyle(content, null);
        const tr = styleOfTransform.getPropertyValue('-webkit-transform') || styleOfTransform.getPropertyValue('transform');
        
        // If there is no transition we want to default to 0 and not null
        const amount = Math.abs(parseInt(tr.split(',')[4]) || 0);

        // Remove the transform and set the no transition class
        content.style.transform = 'none';
        content.classList.add(NO_TRANSITION_CLASS);

        // Now lets set the scroll position
        if (directionRef.current === SCROLL_DIRECTION.left) {
          container.scrollLeft -= amount;
        } else {
          container.scrollLeft += amount;
        }
      }

      // we're done travelling
      isTravelingRef.current = false;
      checkOverflow();
    };
  
    const scroller = (): void => {
      if (isTickingRef.current) {
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

    return { leftScrollDisabled, rightScrollDisabled, advanceRight, advanceLeft  }
}

export default useHubNavigation;