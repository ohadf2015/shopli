import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

// Shared validation core (plain JS, no build step needed)
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { validateCSV, renderCollectionsTS, appendToCollectionsSource, TEMPLATE_CSV } = require('../../../scripts/csv-import-core');

const COLLECTIONS_PATH = path.join(process.cwd(), 'lib', 'collections.ts');

function existingSlugs(): string[] {
  try {
    const src = fs.readFileSync(COLLECTIONS_PATH, 'utf8');
    return [...src.matchAll(/slug:\s*'([^']+)'/g)].map(m => m[1]);
  } catch {
    return [];
  }
}

function authorized(req: NextApiRequest): boolean {
  const token = process.env.ADMIN_TOKEN;
  if (!token) return false; // no token configured => server-side commit disabled
  return req.headers['x-admin-token'] === token;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    res.status(200).json({ template: TEMPLATE_CSV });
    return;
  }
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { csv, commit } = req.body || {};
  if (!csv || typeof csv !== 'string') {
    res.status(400).json({ error: 'Missing "csv" string in request body' });
    return;
  }
  if (csv.length > 512 * 1024) {
    res.status(413).json({ error: 'CSV too large (max 512KB)' });
    return;
  }

  const { rows, valid, errors, summary } = validateCSV(csv, existingSlugs());

  const response: any = {
    rows,
    summary,
    estimatedNewFeedProducts: valid.length * 10,
    committed: false,
  };

  if (commit && valid.length > 0) {
    if (authorized(req)) {
      try {
        const src = fs.readFileSync(COLLECTIONS_PATH, 'utf8');
        const next = appendToCollectionsSource(src, valid);
        fs.writeFileSync(COLLECTIONS_PATH, next);
        response.committed = true;
        response.commitMessage = `Appended ${valid.length} collections to lib/collections.ts`;
      } catch (e: any) {
        // Serverless FS is read-only — fall back to snippet
        response.committed = false;
        response.commitError = `Server-side write unavailable (${e?.code || e?.message}). Apply the snippet below via the CLI importer instead.`;
        response.snippet = renderCollectionsTS(valid);
      }
    } else {
      response.commitError = 'Server-side commit disabled (no valid x-admin-token). Apply the snippet below via: node scripts/import-collections.js <file.csv> --commit';
      response.snippet = renderCollectionsTS(valid);
    }
  }

  res.status(200).json(response);
}
