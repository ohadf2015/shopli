/** Server-side feature flags. Toggle via env without a code change. */
export function trendingEnabled(): boolean {
  return process.env.FEATURE_TRENDING !== '0';
}
