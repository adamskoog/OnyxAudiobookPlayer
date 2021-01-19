import React, { useRef, useEffect } from 'react';
import LibraryItem from '../library/LibraryItem';

//https://webdevtrick.com/horizontal-scroll-navigation/
function Hub(props) {

    const containerRef = useRef(null);
    const contentRef = useRef(null);

    const isTickingRef = useRef(false);
    const scrollPosRef = useRef(0);
    const isTravelingRef = useRef(false);
    const directionRef = useRef("");
    const travelDistance = useRef(400);
    
    function determineOverflow(container, content) {
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

    function checkOverflow(scroll_pos) {
        const overflow = determineOverflow(containerRef.current, contentRef.current);

        const left = document.getElementById(`${props.prefix}_left`);
        const right = document.getElementById(`${props.prefix}_right`);
        left.disabled = (overflow === "both" || overflow === "left") ? "" : "disabled";
        right.disabled = (overflow === "both" || overflow === "right") ? "" : "disabled";

        containerRef.current.setAttribute("data-overflowing", determineOverflow(containerRef.current, contentRef.current));
    }

    const advanceRight = () => {
        // If in the middle of a move return
        if (isTravelingRef.current === true) return;
        // If we have content overflowing both sides or on the right
        if (determineOverflow(containerRef.current, contentRef.current) === "right" || determineOverflow(containerRef.current, contentRef.current) === "both") {
            // Get the right edge of the container and content
            var navBarRightEdge = contentRef.current.getBoundingClientRect().right;
            var navBarScrollerRightEdge = containerRef.current.getBoundingClientRect().right;
            // Now we know how much space we have available to scroll
            var availableScrollRight = Math.floor(navBarRightEdge - navBarScrollerRightEdge);
            // If the space available is less than two lots of our desired distance, just move the whole amount
            // otherwise, move by the amount in the settings
            if (availableScrollRight < travelDistance.current * 2) {
                contentRef.current.style.transform = `translateX(-${availableScrollRight}px)`;
            } else {
                contentRef.current.style.transform = `translateX(-${travelDistance.current}px)`;
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
            // If the space available is less than two lots of our desired distance, just move the whole amount
            // otherwise, move by the amount in the settings
            if (availableScrollLeft < travelDistance.current * 2) {
                contentRef.current.style.transform = `translateX(${availableScrollLeft}px)`;
            } else {
                contentRef.current.style.transform = `translateX(${travelDistance.current}px)`;
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

    function navTransition() {
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

    function scroller() {
        scrollPosRef.current = window.scrollY;
        if (!isTickingRef.current) {
            window.requestAnimationFrame(function() {
                checkOverflow(scrollPosRef.current);
                isTickingRef.current = false;
            });
        }
        isTickingRef.current = true;
    }

    useEffect(() => {
        if (!containerRef.current || contentRef.current) {
            containerRef.current = document.getElementById(`${props.prefix}_outer`);
            contentRef.current = document.getElementById(`${props.prefix}_inner`);
        }

        if (!containerRef.current && !contentRef.current) return;
        containerRef.current.addEventListener("scroll", scroller);
        contentRef.current.addEventListener("transitionend", navTransition);
        window.addEventListener("resize", checkOverflow);

        checkOverflow();
        return () => {
            containerRef.current.removeEventListener("scroll", scroller);
            contentRef.current.removeEventListener("transitionend", navTransition);
            window.removeEventListener("resize", checkOverflow);
        }
    });

    return (
        <React.Fragment>
        <div className="inline-block font-bold mb-2 text-xl">{props.title}</div>
        <div className="float-right text-2xl">
            <button id={`${props.prefix}_left`} className="focus:outline-none hub-button" onClick={() => advanceLeft()}>
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" className="bi bi-caret-left-fill" viewBox="0 0 16 16">
                    <path d="M3.86 8.753l5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z"/>
                </svg>
            </button>
            <button id={`${props.prefix}_right`} className="focus:outline-none hub-button" onClick={() => advanceRight()}>
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" className="bi bi-caret-right-fill" viewBox="0 0 16 16">
                    <path d="M12.14 8.753l-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"/>
                </svg>
            </button>
        </div>
        <div id={`${props.prefix}_outer`} className="hub-container w-full overflow-x-scroll overflow-y-hidden mb-6">
            <div id={`${props.prefix}_inner`} className="hub-contents flex flex-row w-max gap-4">            
                {props.items.map((item) => (
                    <LibraryItem key={item.ratingKey} baseUrl={props.baseUrl} userInfo={props.userInfo} albumInfo={item} />
                ))}
            </div>
        </div>
        </React.Fragment>
    ); 
}

export default Hub;
