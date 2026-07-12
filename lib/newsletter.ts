// Deals newsletter — email capture + lead gen for Shopli
// This is a serverless API that stores emails in Supabase
// When SUPABASE vars aren't set, it falls back to console.log for dev

export interface SignupResult {
  ok: boolean;
  message: string;
}

export async function handleNewsletterSignup(email: string, region: string): Promise<SignupResult> {
  if (!email || !email.includes('@')) {
    return { ok: false, message: 'Invalid email address' };
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (supabaseUrl && supabaseKey) {
    try {
      const res = await fetch(`${supabaseUrl}/rest/v1/shopli_newsletter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify({
          email,
          region,
          subscribed_at: new Date().toISOString(),
          source: 'shopli_web',
        }),
      });
      if (res.ok) return { ok: true, message: 'Subscribed!' };
      if (res.status === 409) return { ok: true, message: 'Already subscribed!' };
      return { ok: false, message: 'Subscription failed' };
    } catch {
      return { ok: false, message: 'Service unavailable' };
    }
  }

  // Dev fallback — log and return
  console.log(`[NEWSLETTER] ${email} (${region})`);
  return { ok: true, message: 'Subscribed! (dev mode)' };
}