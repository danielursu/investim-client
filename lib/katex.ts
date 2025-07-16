/**
 * Utility to dynamically load KaTeX CSS when needed
 */
let katexCssLoaded = false;

export const loadKatexCss = (): Promise<void> => {
  return new Promise((resolve) => {
    if (katexCssLoaded) {
      resolve();
      return;
    }

    // Check if CSS is already loaded
    if (document.querySelector('link[href*="katex"]')) {
      katexCssLoaded = true;
      resolve();
      return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css';
    link.onload = () => {
      katexCssLoaded = true;
      resolve();
    };
    link.onerror = () => {
      console.warn('Failed to load KaTeX CSS');
      katexCssLoaded = true; // Prevent infinite retry
      resolve();
    };

    document.head.appendChild(link);
  });
};