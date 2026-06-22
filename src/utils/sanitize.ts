import DOMPurify from "dompurify";

// Tags/attributes we allow in article "content" (rich text from react-quill).
// Anything else — <script>, event handlers, <iframe>, javascript: URIs — is
// stripped. This is the render-time defense against stored XSS; the backend
// should also sanitize on write (defense in depth) once it exists.
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
    return DOMPurify.sanitize(dirty, {
        ALLOWED_TAGS,
        ALLOWED_ATTR,
        // Forbid javascript:/data: URIs on links and only allow safe schemes.
        ALLOWED_URI_REGEXP: /^(?:https?|mailto|tel|#|\/)/i,
    });
};
