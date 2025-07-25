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
    // Convert LaTeX display math delimiters \[ ... \] to KaTeX $$ ... $$
    .replace(/\\\[\s*([\s\S]*?)\s*\\\]/g, (_match, p1) => `$$${p1}$$`)
    // Convert inline LaTeX delimiters \( ... \) to KaTeX $ ... $
    .replace(/\\\(\s*([\s\S]*?)\s*\\\)/g, (_match, p1) => `$${p1}$`)
    // Escape standalone percentage signs (but not those already escaped)
    .replace(/(\d+(?:\.\d+)?)\s*%/g, '$1\\%')
    // Clean up any double-wrapped expressions
    .replace(/\$\$\$\$/g, '$$')
    .replace(/\$\$\s*\$\$/g, '$$');
};

/**
 * Cleans and formats RAG response content for better readability
 */
export const cleanRAGContent = (content: string): string => {
  if (!content) return '';
  
  // Store math expressions with placeholders to protect them during cleaning
  const mathExpressions: string[] = [];
  let mathIndex = 0;
  
  // Extract and replace math expressions with placeholders
  let contentWithPlaceholders = content
    // Extract display math $$ ... $$
    .replace(/\$\$([\s\S]*?)\$\$/g, (match) => {
      mathExpressions.push(match);
      return `__MATH_PLACEHOLDER_${mathIndex++}__`;
    })
    // Extract inline math $ ... $
    .replace(/\$([^\$]+)\$/g, (match) => {
      mathExpressions.push(match);
      return `__MATH_PLACEHOLDER_${mathIndex++}__`;
    })
    // Extract LaTeX display math \[ ... \]
    .replace(/\\\[([\s\S]*?)\\\]/g, (match) => {
      mathExpressions.push(match);
      return `__MATH_PLACEHOLDER_${mathIndex++}__`;
    })
    // Extract LaTeX inline math \( ... \)
    .replace(/\\\(([\s\S]*?)\\\)/g, (match) => {
      mathExpressions.push(match);
      return `__MATH_PLACEHOLDER_${mathIndex++}__`;
    });
  
  // Clean the content (without affecting math expressions)
  let cleaned = contentWithPlaceholders
    // Remove redundant reference markers like [1], [2], [3] at the end of sentences
    .replace(/\s+\[\d+\](?=[\.\,\;\:]?\s|$)/g, '')
    // Remove any remaining citation brackets in the middle of text
    .replace(/\[\d+\]/g, '')
    // Normalize bullet points to markdown standard while preserving indentation
    .replace(/^(\s*)[\*\+]\s+/gm, '$1- ')
    // Ensure numbered lists are properly formatted
    .replace(/^(\s*)(\d+)[\.\)]\s+/gm, '$1$2. ')
    .trim();
  
  // Restore math expressions
  mathExpressions.forEach((expr, index) => {
    cleaned = cleaned.replace(`__MATH_PLACEHOLDER_${index}__`, expr);
  });
  
  // Apply math expression wrapping after basic cleaning
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