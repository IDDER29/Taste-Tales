import sanitizeHtmlLib from "sanitize-html";

// Tags we allow in article "content" (rich text from react-quill). Anything
// else — <script>, event handlers, <iframe>, javascript: URIs — is stripped.
// This is the render-time defense against stored XSS; the API also sanitizes on
// write (defense in depth). sanitize-html is used (rather than DOMPurify) so the
// same code runs in the browser, in server route handlers, and in tests without
// pulling in jsdom.
const ALLOWED_TAGS = [
    "h1", "h2", "h3", "h4", "h5", "h6",
    "p", "br", "hr", "span", "div",
    "strong", "b", "em", "i", "u", "s", "blockquote",
    "ul", "ol", "li",
    "a", "img",
    "pre", "code",
    "table", "thead", "tbody", "tr", "th", "td",
];

const ALLOWED_ATTR = ["href", "src", "alt", "title", "target", "rel", "class"];

/**
 * Sanitize untrusted HTML before rendering it with dangerouslySetInnerHTML.
 * Strips scripts, event handlers, and dangerous URIs while preserving the
 * formatting produced by the rich-text editor.
 */
export const sanitizeHtml = (dirty?: string | null): string => {
    if (!dirty) return "";
    return sanitizeHtmlLib(dirty, {
        allowedTags: ALLOWED_TAGS,
        // Allow the curated attribute set on any permitted tag.
        allowedAttributes: { "*": ALLOWED_ATTR },
        // Only safe URL schemes; relative URLs (/path) and anchors (#id) are
        // permitted by default. javascript:/data: are dropped.
        allowedSchemes: ["http", "https", "mailto", "tel"],
    });
};
