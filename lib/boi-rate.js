// Plain CommonJS so next.config.js (build time) and pages (revalidation) share it.

const BOI_USD_URL = 'https://boi.org.il/PublicApi/GetExchangeRate?key=USD';

/**
 * Latest Bank of Israel representative USD rate, or null when the lookup
 * failed. Callers fall back to a dated rate and show that date.
 * @returns {Promise<{ rate: number, asOf: string } | null>}
 */
async function fetchBoiUsdIls(timeoutMs = 4000) {
  try {
    const res = await fetch(BOI_USD_URL, { signal: AbortSignal.timeout(timeoutMs) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const body = await res.json();
    const rate = body && body.currentExchangeRate;
    const asOf = String((body && body.lastUpdate) || '').slice(0, 10);
    if (typeof rate !== 'number' || !(rate > 2 && rate < 6) || !/^\d{4}-\d{2}-\d{2}$/.test(asOf)) {
      throw new Error(`unexpected body ${JSON.stringify(body).slice(0, 200)}`);
    }
    return { rate, asOf };
  } catch (err) {
    console.warn(`[boi-rate] lookup failed, using the fallback rate: ${err && err.message}`);
    return null;
  }
}

module.exports = { fetchBoiUsdIls };
