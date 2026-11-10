declare module '*.css';

/**
 * React 18 has no typed `fetchPriority` prop and drops the camelCase spelling at
 * runtime with a warning — the hint only reaches the DOM spelled all-lowercase,
 * which React passes straight through. Declared here so the LCP images can use
 * it. Remove once this app is on React 19, which supports `fetchPriority`.
 */
declare namespace React {
  interface ImgHTMLAttributes<T> {
    fetchpriority?: 'high' | 'low' | 'auto';
  }
}
