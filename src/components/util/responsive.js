const SMALL_VIEWPORT = '640px';
const MEDIUM_VIEWPORT = '768px';
const LARGE_VIEWPORT = '1024px';
const XL_VIEWPORT = '1280px';

const baseMediaQuery = (content, viewport) => {
    return `
        @media (min-width: ${viewport}) {
            ${content}
        }
    `;
};

export const smallMediaQuery = (content) => {
    return baseMediaQuery(content, SMALL_VIEWPORT);
};

export const mediumMediaQuery = (content) => {
    return baseMediaQuery(content, MEDIUM_VIEWPORT);
};

export const largeMediaQuery = (content) => {
    return baseMediaQuery(content, LARGE_VIEWPORT);
};

export const xlMediaQuery = (content) => {
    return baseMediaQuery(content, XL_VIEWPORT);
};