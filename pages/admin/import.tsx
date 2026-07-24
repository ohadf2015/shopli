import { useState, useRef } from 'react';
import type { NextPage } from 'next';

interface RowResult {
  row: number;
  slug: string;
  name_en: string;
  keywords: string[];
  errors: string[];
}

interface ApiResponse {
  rows: RowResult[];
  summary: { total: number; ok: number; failed: number };
  estimatedNewFeedProducts: number;
  committed: boolean;
  commitMessage?: string;
  commitError?: string;
  snippet?: string;
}

const AdminImportPage: NextPage = () => {
  const [csvText, setCsvText] = useState('');
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setCsvText(ev.target?.result as string || '');
    reader.readAsText(file);
  };

  const handlePreview = async () => {
    if (!csvText.trim()) { setError('Paste CSV or upload a file first.'); return; }
    setLoading(true); setError(''); setResult(null);
    try {
      const res = await fetch('/api/admin/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ csv: csvText, commit: false }),
      });
      const data: ApiResponse = await res.json();
      setResult(data);
    } catch (e: any) {
      setError(e.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCommit = async () => {
    if (!csvText.trim()) return;
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/admin/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ csv: csvText, commit: true }),
      });
      const data: ApiResponse = await res.json();
      setResult(data);
    } catch (e: any) {
      setError(e.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadTemplate = async () => {
    const res = await fetch('/api/admin/import');
    const data = await res.json();
    const blob = new Blob([data.template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'shopli-collections-template.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-gray-200 px-6 py-3">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <a href="/" className="text-xl font-bold" style={{ color: '#1e293b' }}>Shopli</a>
          <span className="text-gray-400">/</span>
          <span className="text-sm font-medium text-gray-600">Bulk CSV Import</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-extrabold mb-2" style={{ color: '#1e293b' }}>Bulk Collection Import</h1>
        <p className="text-sm mb-6" style={{ color: '#64748b' }}>
          Upload a CSV of collections. Each valid collection adds 5-10 products to the Google Shopping feed.
        </p>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <input
              ref={fileRef}
              type="file"
              accept=".csv"
              onChange={handleFile}
              className="text-sm file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <button onClick={handleDownloadTemplate} className="text-sm text-blue-600 hover:underline">
              Download template CSV
            </button>
          </div>

          <label className="block text-sm font-medium mb-1" style={{ color: '#374151' }}>Or paste CSV:</label>
          <textarea
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
            rows={8}
            className="w-full border border-gray-300 rounded-lg p-3 text-sm font-mono resize-y"
            placeholder="slug,name_en,name_he,desc_en,desc_he,keywords,icon,google_category"
          />

          <div className="flex gap-3 mt-4">
            <button
              onClick={handlePreview}
              disabled={loading || !csvText.trim()}
              className="px-5 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-50"
              style={{ backgroundColor: '#475569' }}
            >
              {loading ? 'Validating...' : 'Preview'}
            </button>
            <button
              onClick={handleCommit}
              disabled={loading || !csvText.trim()}
              className="px-5 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-50"
              style={{ backgroundColor: '#2563eb' }}
            >
              {loading ? 'Working...' : 'Commit'}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-sm text-red-800">{error}</div>
        )}

        {result && (
          <div className="space-y-4">
            {/* Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex gap-6 text-sm">
              <span><strong>{result.summary.total}</strong> rows</span>
              <span className="text-green-700"><strong>{result.summary.ok}</strong> valid</span>
              {result.summary.failed > 0 && <span className="text-red-700"><strong>{result.summary.failed}</strong> failed</span>}
              <span className="text-blue-700">~{result.estimatedNewFeedProducts} estimated new feed products</span>
            </div>

            {/* Commit status */}
            {result.committed && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-800">
                {result.commitMessage}
              </div>
            )}
            {result.commitError && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm">
                <p className="font-medium text-yellow-800 mb-1">{result.commitError}</p>
                {result.snippet && (
                  <pre className="mt-2 bg-white/50 rounded-lg p-3 text-xs overflow-x-auto">{result.snippet}</pre>
                )}
              </div>
            )}

            {/* Row results */}
            {result.rows.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="text-left px-4 py-2 font-semibold text-gray-600">Row</th>
                      <th className="text-left px-4 py-2 font-semibold text-gray-600">Slug</th>
                      <th className="text-left px-4 py-2 font-semibold text-gray-600">Name</th>
                      <th className="text-left px-4 py-2 font-semibold text-gray-600">Keywords</th>
                      <th className="text-left px-4 py-2 font-semibold text-gray-600">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.rows.map((r) => (
                      <tr key={r.row} className="border-b border-gray-100">
                        <td className="px-4 py-2 text-gray-500">{r.row}</td>
                        <td className="px-4 py-2 font-mono text-xs">{r.slug}</td>
                        <td className="px-4 py-2">{r.name_en}</td>
                        <td className="px-4 py-2 text-xs text-gray-500">{r.keywords.join(', ')}</td>
                        <td className="px-4 py-2">
                          {r.errors.length === 0 ? (
                            <span className="text-green-600 font-medium">OK</span>
                          ) : (
                            <details className="text-red-600">
                              <summary className="cursor-pointer font-medium">Failed</summary>
                              <ul className="mt-1 text-xs list-disc pl-4">
                                {r.errors.map((e, i) => <li key={i}>{e}</li>)}
                              </ul>
                            </details>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminImportPage;