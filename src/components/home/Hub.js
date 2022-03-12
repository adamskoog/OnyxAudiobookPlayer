import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';

import LibraryItem from '../Library/AlbumItem';

import { ReactComponent as HubScrollLeftSvg } from '../../assets/hubScrollLeft.svg';
import { ReactComponent as HubScrollRightSvg } from '../../assets/hubScrollRight.svg';

const Container = styled.div``;

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

// Horizontal scrolling based on: https://webdevtrick.com/horizontal-scroll-navigation/
const Hub = ({ title, items, baseUrl, userInfo }) => {

    const [leftScrollDisabled, setLeftScrollDisabled] = useState(true);
    const [rightScrollDisabled, setRightScrollDisabled] = useState(true);

    const containerRef = useRef(null);
    const contentRef = useRef(null);

    const isTickingRef = useRef(false);
    const isTravelingRef = useRef(false);
    const directionRef = useRef("");
    
    const determineOverflow = (container, content) => {
        var containerMetrics = container.getBoundingClientRect();
        var containerMetricsRight = Math.floor(containerMetrics.right);
        var containerMetricsLeft = Math.floor(containerMetrics.left);
        var contentMetrics = content.getBoundingClientRect();
        var contentMetricsRight = Math.floor(contentMetrics.right);
        var contentMetricsLeft = Math.floor(contentMetrics.left);
        if (containerMetricsLeft > contentMetricsLeft && containerMetricsRight < contentMetricsRight) {
            return "both";
        } else if (contentMetricsLeft < containerMetricsLeft) {
            return "left";
        } else if (contentMetricsRight > containerMetricsRight) {
            return "right";
        } else {
            return "none";
        }
    }

    const checkOverflow = () => {
        const overflow = determineOverflow(containerRef.current, contentRef.current);

        setLeftScrollDisabled((overflow === "both" || overflow === "left") ? false : true);
        setRightScrollDisabled((overflow === "both" || overflow === "right") ? false : true);

        containerRef.current.setAttribute("data-overflowing", overflow);
    }

    const advanceRight = () => {
        // If in the middle of a move return
        if (isTravelingRef.current === true) return;
        // If we have content overflowing both sides or on the right
        if (determineOverflow(containerRef.current, contentRef.current) === "right" || determineOverflow(containerRef.current, contentRef.current) === "both") {
            // Get the right edge of the container and content
            var navBarRightEdge = contentRef.current.getBoundingClientRect().right;
            var navBarScrollerRightEdge = containerRef.current.getBoundingClientRect().right;
            // get width of scroll area - this will change all contents
            var navBarScrollerWidth = containerRef.current.getBoundingClientRect().width;
            // Now we know how much space we have available to scroll
            var availableScrollRight = Math.floor(navBarRightEdge - navBarScrollerRightEdge);
            // If the space available is less than two lots of our desired distance, just move the whole amount
            // otherwise, move by the amount in the settings
            if (availableScrollRight < navBarScrollerWidth) {
                contentRef.current.style.transform = `translateX(-${availableScrollRight}px)`;
            } else {
                contentRef.current.style.transform = `translateX(-${navBarScrollerWidth}px)`;
            }
            // We do want a transition (this is set in CSS) when moving so remove the class that would prevent that
            contentRef.current.classList.remove("hub-no-transition");
            // Update our settings
            directionRef.current = "right";
            isTravelingRef.current = true;
        }
        // Now update the attribute in the DOM
        containerRef.current.setAttribute("data-overflowing", determineOverflow(containerRef.current, contentRef.current));

    }

    const advanceLeft = () => {
        if (isTravelingRef.current === true) return;
        // If we have content overflowing both sides or on the left
        if (determineOverflow(containerRef.current, contentRef.current) === "left" || determineOverflow(containerRef.current, contentRef.current) === "both") {
            // Find how far this panel has been scrolled
            var availableScrollLeft = containerRef.current.scrollLeft;
            var navBarScrollerWidth = containerRef.current.getBoundingClientRect().width;
            // If the space available is less than two lots of our desired distance, just move the whole amount
            // otherwise, move by the amount in the settings
            if (availableScrollLeft < navBarScrollerWidth) {
                contentRef.current.style.transform = `translateX(${availableScrollLeft}px)`;
            } else {
                contentRef.current.style.transform = `translateX(${navBarScrollerWidth}px)`;
            }
            // We do want a transition (this is set in CSS) when moving so remove the class that would prevent that
            contentRef.current.classList.remove("hub-no-transition");
            // Update our settings
            directionRef.current = "left";
            isTravelingRef.current = true;
        }
        // Now update the attribute in the DOM
        containerRef.current.setAttribute("data-overflowing", determineOverflow(containerRef.current, contentRef.current));
    }

    const navTransition = () => {
        // get the value of the transform, apply that to the current scroll position (so get the scroll pos first) and then remove the transform
        var styleOfTransform = window.getComputedStyle(contentRef.current, null);
        var tr = styleOfTransform.getPropertyValue("-webkit-transform") || styleOfTransform.getPropertyValue("transform");
        // If there is no transition we want to default to 0 and not null
        var amount = Math.abs(parseInt(tr.split(",")[4]) || 0);
        contentRef.current.style.transform = "none";
        contentRef.current.classList.add("hub-no-transition");
        // Now lets set the scroll position
        if (directionRef.current === "left") {
            containerRef.current.scrollLeft = containerRef.current.scrollLeft - amount;
        } else {
            containerRef.current.scrollLeft = containerRef.current.scrollLeft + amount;
        }
        isTravelingRef.current = false;
    }

    const scroller = () => {
        if (!isTickingRef.current) {
            window.requestAnimationFrame(function() {
                checkOverflow();
                isTickingRef.current = false;
            });
        }
        isTickingRef.current = true;
    }

    useEffect(() => {
        const container = containerRef.current;
        const content = contentRef.current;
        if (!container && !content) return;
        container.addEventListener("scroll", scroller);
        content.addEventListener("transitionend", navTransition);
        window.addEventListener("resize", checkOverflow);

        checkOverflow();
        return () => {
            container.removeEventListener("scroll", scroller);
            content.removeEventListener("transitionend", navTransition);
            window.removeEventListener("resize", checkOverflow);
        }
    });

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
                <HubContents ref={contentRef}>            
                    {items.map((item) => (
                        <LibraryItem key={item.ratingKey} metadata={item} showAuthor={true} />
                    ))}
                </HubContents>
            </HubContainer>
        </Container>
    ); 
}

export default Hub;
