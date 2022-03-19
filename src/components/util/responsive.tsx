const SMALL_VIEWPORT = '640px';
const MEDIUM_VIEWPORT = '768px';
const LARGE_VIEWPORT = '1024px';
const XL_VIEWPORT = '1280px';

const baseMediaQuery = (content: string, viewport: string): string => `
        @media (min-width: ${viewport}) {
            ${content}
        }
    `;

export const smallMediaQuery = (content: string): string => baseMediaQuery(content, SMALL_VIEWPORT);

export const mediumMediaQuery = (content: string): string => baseMediaQuery(content, MEDIUM_VIEWPORT);

export const largeMediaQuery = (content: string): string => baseMediaQuery(content, LARGE_VIEWPORT);

export const xlMediaQuery = (content: string): string => baseMediaQuery(content, XL_VIEWPORT);
