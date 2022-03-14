import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';

const MAX_CONTAINER_HEIGHT = 120;

const TextContainer = styled.div`
    margin: 0.75rem 0;
    font-size: 1rem;
    line-height: 1.5rem;

    overflow: hidden;
    max-height: ${(props) => props.expanded ? 'none' : `${MAX_CONTAINER_HEIGHT}px`};
`;

const TextBlock = styled.div`
    display:flex;
    flex-direction: column;
    gap: .25rem;
`;

const ExpandDivider = styled.div`

    display: ${(props) => props.hasOverflow ? 'flex' : 'none'};
    align-items: center;
    text-align: center;
    margin: 0 -1em .5em -1em;

    &:before,
    &:after {
        content: "";
        flex: 1 1 5%; /* The flex basis here will force the starting value of the lines. */
        height: 1px;
        margin: 0 1em;
        background: ${({ theme }) => theme.CONTAINER_BORDER};
    }
`;
const ExpandButton = styled.button``;

const formatSummary = (summary) => {
    if (summary) {
        var splitted = summary.split("\n");
        return `<p>${splitted.join("</p><p>")}</p>`;
    }
    return "";
}

const AlbumSummary = ({ summary }) => {
    
    const innerRef = useRef(null);
    const [expanded, setExpanded] = useState(false);
    const [hasOverflow, setHasOverflow] = useState(false);

    useEffect(() => {
        if (!innerRef.current) {
            setHasOverflow(false);
            return;
        }
        
        // Check if summary takes more height than our max - if so show
        // expand button to allow user to view entire summary.
        setHasOverflow(innerRef.current.offsetHeight > MAX_CONTAINER_HEIGHT);
    }, [innerRef, summary]);

    return (
        <>
            <TextContainer expanded={expanded}>
                <TextBlock ref={innerRef} dangerouslySetInnerHTML={{__html: formatSummary(summary)}} />
            </TextContainer>
            <ExpandDivider hasOverflow={hasOverflow}>
                <ExpandButton onClick={() => setExpanded(!expanded)}>{(expanded) ? 'Collapse' : 'Expand'}</ExpandButton>
            </ExpandDivider>
        </>
    );
};

export default AlbumSummary;