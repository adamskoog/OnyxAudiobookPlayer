import { createGlobalStyle } from 'styled-components';

export const HEADER_HEIGHT = '64px';
export const PLAYER_HEIGHT = '100px';

export const GlobalStyle = createGlobalStyle`

    body {
        background-color: #ddd;
    }

    /* Remove the default scrollbar for WebKit implementations */
    button:disabled {
        color: #aaa;
    }

    img,
    video {
        max-width: 100%;
        height: auto;
    }

    /**
     * Add resets from Tailwind to make app match previous styling.
     * /
    /**
     * Reset links to optimize for opt-in styling instead of
     * opt-out.
     */
    
    a {
      color: inherit;
      text-decoration: inherit;
    }

    /**
     * Reset form element properties that are easy to forget to
     * style explicitly so you don't inadvertently introduce
     * styles that deviate from your design system. These styles
     * supplement a partial reset that is already applied by
     * normalize.css.
     */
    
    button,
    input,
    optgroup,
    select,
    textarea {
      padding: 0;
      line-height: inherit;
      color: inherit;
    }

    /**
     * Make replaced elements 'display: block' by default as that's
     * the behavior you want almost all of the time. Inspired by
     * CSS Remedy, with 'svg' added as well.
     *
     * https://github.com/mozdevs/cssremedy/issues/14
     */
    
    img,
    svg,
    video,
    canvas,
    audio,
    iframe,
    embed,
    object {
      display: block;
      vertical-align: middle;
    }

    button,
    [role="button"] {
        cursor: pointer;
    }

    body {   
        font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
        background-color: rgba(229, 231, 235, 1);
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
`;

export const NormalizeGlobalStyle = createGlobalStyle`
    /*! modern-normalize v1.1.0 | MIT License | https://github.com/sindresorhus/modern-normalize */

    /*
    Document
    ========
    */

    /**
    Use a better box model (opinionated).
    */

    *,
    ::before,
    ::after {
        box-sizing: border-box;
    }

    /**
    Use a more readable tab size (opinionated).
    */

    html {
        -moz-tab-size: 4;
        tab-size: 4;
    }

    /**
    1. Correct the line height in all browsers.
    2. Prevent adjustments of font size after orientation changes in iOS.
    */

    html {
        line-height: 1.15; /* 1 */
        -webkit-text-size-adjust: 100%; /* 2 */
    }

    /*
    Sections
    ========
    */

    /**
    Remove the margin in all browsers.
    */

    body {
        margin: 0;
    }

    /**
    Improve consistency of default fonts in all browsers. (https://github.com/sindresorhus/modern-normalize/issues/3)
    */

    body {
        font-family:
            system-ui,
            -apple-system, /* Firefox supports this but not yet 'system-ui' */
            'Segoe UI',
            Roboto,
            Helvetica,
            Arial,
            sans-serif,
            'Apple Color Emoji',
            'Segoe UI Emoji';
    }

    /*
    Grouping content
    ================
    */

    /**
    1. Add the correct height in Firefox.
    2. Correct the inheritance of border color in Firefox. (https://bugzilla.mozilla.org/show_bug.cgi?id=190655)
    */

    hr {
        height: 0; /* 1 */
        color: inherit; /* 2 */
    }

    /*
    Text-level semantics
    ====================
    */

    /**
    Add the correct text decoration in Chrome, Edge, and Safari.
    */

    abbr[title] {
        text-decoration: underline dotted;
    }

    /**
    Add the correct font weight in Edge and Safari.
    */

    b,
    strong {
        font-weight: bolder;
    }

    /**
    1. Improve consistency of default fonts in all browsers. (https://github.com/sindresorhus/modern-normalize/issues/3)
    2. Correct the odd 'em' font sizing in all browsers.
    */

    code,
    kbd,
    samp,
    pre {
        font-family:
            ui-monospace,
            SFMono-Regular,
            Consolas,
            'Liberation Mono',
            Menlo,
            monospace; /* 1 */
        font-size: 1em; /* 2 */
    }

    /**
    Add the correct font size in all browsers.
    */

    small {
        font-size: 80%;
    }

    /**
    Prevent 'sub' and 'sup' elements from affecting the line height in all browsers.
    */

    sub,
    sup {
        font-size: 75%;
        line-height: 0;
        position: relative;
        vertical-align: baseline;
    }

    sub {
        bottom: -0.25em;
    }

    sup {
        top: -0.5em;
    }

    /*
    Tabular data
    ============
    */

    /**
    1. Remove text indentation from table contents in Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=999088, https://bugs.webkit.org/show_bug.cgi?id=201297)
    2. Correct table border color inheritance in all Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=935729, https://bugs.webkit.org/show_bug.cgi?id=195016)
    */

    table {
        text-indent: 0; /* 1 */
        border-color: inherit; /* 2 */
    }

    /*
    Forms
    =====
    */

    /**
    1. Change the font styles in all browsers.
    2. Remove the margin in Firefox and Safari.
    */

    button,
    input,
    optgroup,
    select,
    textarea {
        font-family: inherit; /* 1 */
        font-size: 100%; /* 1 */
        line-height: 1.15; /* 1 */
        margin: 0; /* 2 */
    }

    /**
    Remove the inheritance of text transform in Edge and Firefox.
    1. Remove the inheritance of text transform in Firefox.
    */

    button,
    select { /* 1 */
        text-transform: none;
    }

    /**
    Correct the inability to style clickable types in iOS and Safari.
    */

    button,
    [type='button'],
    [type='reset'],
    [type='submit'] {
        -webkit-appearance: button;
    }

    /**
    Remove the inner border and padding in Firefox.
    */

    ::-moz-focus-inner {
        border-style: none;
        padding: 0;
    }

    /**
    Restore the focus styles unset by the previous rule.
    */

    :-moz-focusring {
        outline: 1px dotted ButtonText;
    }

    /**
    Remove the additional ':invalid' styles in Firefox.
    See: https://github.com/mozilla/gecko-dev/blob/2f9eacd9d3d995c937b4251a5557d95d494c9be1/layout/style/res/forms.css#L728-L737
    */

    :-moz-ui-invalid {
        box-shadow: none;
    }

    /**
    Remove the padding so developers are not caught out when they zero out 'fieldset' elements in all browsers.
    */

    legend {
        padding: 0;
    }

    /**
    Add the correct vertical alignment in Chrome and Firefox.
    */

    progress {
        vertical-align: baseline;
    }

    /**
    Correct the cursor style of increment and decrement buttons in Safari.
    */

    ::-webkit-inner-spin-button,
    ::-webkit-outer-spin-button {
        height: auto;
    }

    /**
    1. Correct the odd appearance in Chrome and Safari.
    2. Correct the outline style in Safari.
    */

    [type='search'] {
        -webkit-appearance: textfield; /* 1 */
        outline-offset: -2px; /* 2 */
    }

    /**
    Remove the inner padding in Chrome and Safari on macOS.
    */

    ::-webkit-search-decoration {
        -webkit-appearance: none;
    }

    /**
    1. Correct the inability to style clickable types in iOS and Safari.
    2. Change font properties to 'inherit' in Safari.
    */

    ::-webkit-file-upload-button {
        -webkit-appearance: button; /* 1 */
        font: inherit; /* 2 */
    }

    /*
    Interactive
    ===========
    */

    /*
    Add the correct display in Chrome and Safari.
    */

    summary {
        display: list-item;
    }


    /**
     * A thin layer on top of normalize.css that provides a starting point more
     * suitable for web applications: https://github.com/suitcss/base
     */

    /**
     * 1. Prevent padding and border from affecting element width
     *    https://goo.gl/pYtbK7.
     * 2. Change the default font family in all browsers (opinionated).
     */

    html {
        box-sizing: border-box; /* 1 */
        font-family: sans-serif; /* 2 */
    }

    *,
    *::before,
    *::after {
        box-sizing: inherit;
    }

    /**
     * Removes the default spacing and border for appropriate elements.
     */

    blockquote,
    dl,
    dd,
    figure,
    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    p,
    pre {
        margin: 0;
    }

    button {
        background: transparent;
        border: 0;
        padding: 0;
    }

    /**
     * Work around a Firefox/IE bug where the transparent 'button' background
     * results in a loss of the default 'button' focus styles.
     */

    button:focus {
        outline: 1px dotted;
        outline: 5px auto -webkit-focus-ring-color;
    }

    fieldset {
        border: 0;
        margin: 0;
        padding: 0;
    }

    iframe {
        border: 0;
    }

    ol,
    ul {
        list-style: none;
        margin: 0;
        padding: 0;
    }
`;