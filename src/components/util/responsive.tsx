const SMALL_VIEWPORT: string = '640px';
const MEDIUM_VIEWPORT: string = '768px';
const LARGE_VIEWPORT: string = '1024px';
const XL_VIEWPORT: string = '1280px';

const baseMediaQuery = (content: string, viewport: string): string => {
    return `
        @media (min-width: ${viewport}) {
            ${content}
        }
    `;
};

export const smallMediaQuery = (content: string): string => {
    return baseMediaQuery(content, SMALL_VIEWPORT);
};

export const mediumMediaQuery = (content: string): string => {
    return baseMediaQuery(content, MEDIUM_VIEWPORT);
};

export const largeMediaQuery = (content: string): string => {
    return baseMediaQuery(content, LARGE_VIEWPORT);
};

export const xlMediaQuery = (content: string): string => {
    return baseMediaQuery(content, XL_VIEWPORT);
};