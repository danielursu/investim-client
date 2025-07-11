import DOMPurify from 'dompurify';

// Configure DOMPurify for safe markdown rendering
const createDOMPurify = () => {
  if (typeof window !== 'undefined') {
    const purify = DOMPurify(window as any);
    
    // Configure allowed tags and attributes for markdown content
    purify.setConfig({
      ALLOWED_TAGS: [
        'p', 'br', 'strong', 'em', 'u', 'strike', 'del', 'ins',
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'ul', 'ol', 'li',
        'blockquote', 'pre', 'code',
        'a', 'img',
        'table', 'thead', 'tbody', 'tr', 'th', 'td',
        'hr', 'div', 'span'
      ],
      ALLOWED_ATTR: [
        'href', 'title', 'target', 'rel',
        'src', 'alt', 'width', 'height',
        'class', 'id',
        'colspan', 'rowspan'
      ],
      ALLOW_DATA_ATTR: false,
      ALLOW_UNKNOWN_PROTOCOLS: false,
      SANITIZE_DOM: true,
      SANITIZE_NAMED_PROPS: true,
      KEEP_CONTENT: true,
      // Force target="_blank" and rel="noopener noreferrer" for external links
      FORBID_ATTR: ['style', 'onclick', 'onload', 'onerror'],
    });
    
    return purify;
  }
  
  // Server-side fallback (basic sanitization)
  return {
    sanitize: (input: string) => {
      // Basic server-side sanitization - remove script tags and dangerous attributes
      return input
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '');
    }
  };
};

let purifyInstance: ReturnType<typeof createDOMPurify> | null = null;

const getPurifyInstance = () => {
  if (!purifyInstance) {
    purifyInstance = createDOMPurify();
  }
  return purifyInstance;
};

/**
 * Sanitizes HTML content to prevent XSS attacks
 * Safe for use with ReactMarkdown output
 */
export const sanitizeHtml = (html: string): string => {
  const purify = getPurifyInstance();
  return purify.sanitize(html);
};

/**
 * Detects and wraps mathematical expressions for KaTeX rendering
 */
export const wrapMathExpressions = (content: string): string => {
  if (!content) return '';
  
  return content
    // Wrap standalone mathematical equations (e.g., "FV = 10,000", "PMT = 250")
    .replace(/\b([A-Z]{1,4})\s*=\s*([\d,\.\-]+(?:%|\$)?)/g, '$$' + '$1 = $2' + '$$')
    // Wrap percentage expressions (lowercase variables like "r = 0.03")
    .replace(/\b([a-z]+)\s*=\s*(\d+(?:\.\d+)?%?)/g, '$$' + '$1 = $2' + '$$')
    // Wrap expressions in brackets that look like formulas
    .replace(/\[\s*([^[\]]*[+\-\*/\^=][^[\]]*)\s*\]/g, '$$' + '[$1]' + '$$')
    // Clean up any double-wrapped expressions
    .replace(/\$\$\$\$/g, '$$')
    .replace(/\$\$\s*\$\$/g, '$$');
};

/**
 * Cleans and formats RAG response content for better readability
 */
export const cleanRAGContent = (content: string): string => {
  if (!content) return '';
  
  let cleaned = content
    // Remove redundant reference markers like [1], [2], [3] at the end of sentences
    .replace(/\s+\[\d+\](?=[\.\,\;\:]?\s|$)/g, '')
    // Clean up multiple consecutive spaces
    .replace(/\s{2,}/g, ' ')
    // Fix spacing around punctuation
    .replace(/\s+([\.,;:!?])/g, '$1')
    // Ensure proper spacing after periods
    .replace(/\.([A-Z])/g, '. $1')
    // Remove extra newlines but preserve paragraph breaks
    .replace(/\n{3,}/g, '\n\n')
    // Clean up bullet points and formatting
    .replace(/^\s*[\*\-\+]\s+/gm, '• ')
    // Remove any remaining citation brackets in the middle of text
    .replace(/\[\d+\]/g, '')
    .trim();
  
  // Apply math expression wrapping
  return wrapMathExpressions(cleaned);
};

/**
 * Sanitizes markdown content before rendering
 * Removes potentially dangerous markdown that could lead to XSS
 */
export const sanitizeMarkdown = (markdown: string): string => {
  if (!markdown) return '';
  
  // First clean the RAG content, then sanitize
  const cleanedContent = cleanRAGContent(markdown);
  
  // Remove dangerous markdown patterns
  return cleanedContent
    // Remove HTML script tags
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove javascript: protocols
    .replace(/\[([^\]]*)\]\(javascript:[^)]*\)/gi, '[$1](#)')
    // Remove data: protocols (except data:image)
    .replace(/\[([^\]]*)\]\(data:(?!image)[^)]*\)/gi, '[$1](#)')
    // Remove dangerous attributes from HTML tags
    .replace(/<([^>]+)(on\w+\s*=\s*[^>]*)/gi, '<$1>')
    // Limit to reasonable length to prevent DoS
    .slice(0, 50000);
};

/**
 * Sanitizes source content for display
 * Used for RAG source citations
 */
export const sanitizeSourceContent = (content: string): string => {
  if (!content) return '';
  
  return content
    .replace(/[<>&'"]/g, (char) => {
      switch (char) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case "'": return '&#x27;';
        case '"': return '&quot;';
        default: return char;
      }
    })
    .slice(0, 10000); // Limit length
};