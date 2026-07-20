import { useState, useRef, useCallback } from 'react';
import Head from 'next/head';
import { parseCsvRow, CuratedProduct } from '../../lib/curated-products';

interface ParsedRow {
  index: number;
  raw: Record<string, string>;
  product?: CuratedProduct;
  errors: string[];
  selected: boolean;
}

type Step = 'upload' | 'preview' | 'done';

const REQUIRED_COLUMNS = ['name', 'price', 'category'];
const OPTIONAL_COLUMNS = ['description', 'image_url', 'tags', 'original_price', 'affiliate_link', 'shop_name', 'currency', 'free_shipping'];
const ALL_COLUMNS = [...REQUIRED_COLUMNS, ...OPTIONAL_COLUMNS];

export default function AdminImportPage() {
  const [step, setStep] = useState<Step>('upload');
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [fileName, setFileName] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [importSummary, setImportSummary] = useState<{ imported: number; failed: number; errors: string[] } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File | undefined) => {
    if (!file) return;

    setFileName(file.name);
    const text = await file.text();
    const parsed = parseCsv(text);
    setRows(parsed);
    setStep(parsed.length > 0 ? 'preview' : 'upload');
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
  }, [handleFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files?.[0]);
  }, [handleFile]);

  const toggleRow = useCallback((index: number) => {
    setRows(prev => prev.map(r => r.index === index ? { ...r, selected: !r.selected } : r));
  }, []);

  const toggleAll = useCallback(() => {
    const allSelected = rows.every(r => r.selected);
    setRows(prev => prev.map(r => r.errors.length === 0 ? { ...r, selected: !allSelected } : r));
  }, [rows]);

  const handleImport = useCallback(() => {
    const selected = rows.filter(r => r.selected && r.product);
    const imported = selected.map(r => r.product!);
    const failed = rows.filter(r => !r.selected || r.errors.length > 0);
    const allErrors: string[] = [];
    failed.forEach(r => allErrors.push(...r.errors));

    // Generate JSON output
    const json = JSON.stringify(imported, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    setDownloadUrl(url);

    setImportSummary({
      imported: imported.length,
      failed: failed.length,
      errors: allErrors,
    });
    setStep('done');
  }, [rows]);

  const resetAll = useCallback(() => {
    setRows([]);
    setFileName('');
    setDownloadUrl('');
    setImportSummary(null);
    setStep('upload');
  }, []);

  const handleCopyJson = useCallback(() => {
    const selected = rows.filter(r => r.selected && r.product).map(r => r.product!);
    navigator.clipboard.writeText(JSON.stringify(selected, null, 2));
  }, [rows]);

  return (
    <>
      <Head>
        <title>CSV Import | Shopli Admin</title>
        <meta name="robots" content="noindex" />
      </Head>

      <div className="min-h-screen" style={{ background: '#f8f7f4' }}>
        {/* Admin Header */}
        <header className="border-b border-gray-200 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <a href="/" className="font-bold text-lg" style={{ color: 'var(--shopli-navy)' }}>
                shopli
              </a>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: 'oklch(90% 0.06 45)', color: 'var(--shopli-orange)' }}>
                Admin
              </span>
            </div>
            <nav className="flex items-center gap-4 text-sm">
              <a href="/admin/import" className="font-medium" style={{ color: 'var(--shopli-teal)' }}>
                CSV Import
              </a>
              <a href="/" className="hover:underline" style={{ color: 'var(--shopli-warm-gray)' }}>
                View Site
              </a>
            </nav>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="mb-8">
            <h1 className="text-2xl font-extrabold" style={{ color: 'var(--shopli-navy)' }}>
              Bulk CSV Product Import
            </h1>
            <p className="mt-1 text-sm" style={{ color: 'var(--shopli-warm-gray)' }}>
              Upload a CSV file to import 50+ products at once. Download the generated JSON and add it to{' '}
              <code className="bg-gray-100 px-1 rounded text-xs font-mono">lib/data/curated-products.json</code>.
            </p>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-8 text-xs font-medium">
            {(['upload', 'preview', 'done'] as Step[]).map((s, i) => (
              <span key={s} className="flex items-center gap-2">
                {i > 0 && <span style={{ color: 'var(--shopli-warm-gray)' }}>→</span>}
                <span className={`px-2.5 py-1 rounded-full ${
                  step === s
                    ? 'text-white font-semibold'
                    : 'bg-gray-100'
                }`} style={{
                  background: step === s ? 'var(--shopli-teal)' : undefined,
                  color: step === s ? 'white' : 'var(--shopli-warm-gray)',
                }}>
                  {i + 1}. {s === 'upload' ? 'Upload CSV' : s === 'preview' ? 'Preview & Confirm' : 'Export'}
                </span>
              </span>
            ))}
          </div>

          {/* Step 1: Upload */}
          {step === 'upload' && (
            <div
              onDrop={handleDrop}
              onDragOver={e => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer hover:border-teal-400 transition-colors"
              style={{ borderColor: 'var(--shopli-warm-gray)', color: 'var(--shopli-warm-gray)' }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileInput}
                className="hidden"
              />
              <div className="text-4xl mb-3">📄</div>
              <p className="text-lg font-semibold mb-1" style={{ color: 'var(--shopli-navy)' }}>
                Drop your CSV file here
              </p>
              <p className="text-sm mb-6">or click to browse</p>

              <div className="max-w-md mx-auto text-left text-xs bg-gray-50 rounded-xl p-4">
                <p className="font-semibold mb-2" style={{ color: 'var(--shopli-navy)' }}>Required columns:</p>
                <code className="block bg-white px-2 py-1 rounded mb-2 border border-gray-200">
                  name, price, category
                </code>
                <p className="font-semibold mb-2 mt-3" style={{ color: 'var(--shopli-navy)' }}>Optional columns:</p>
                <code className="block bg-white px-2 py-1 rounded border border-gray-200">
                  description, image_url, tags, original_price, affiliate_link, shop_name, currency, free_shipping
                </code>
                <p className="mt-2 text-xs" style={{ color: 'var(--shopli-warm-gray)' }}>
                  Column names are case-insensitive. Aliases like "title" for "name" and "sale price" for "price" also work.
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Preview */}
          {step === 'preview' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--shopli-navy)' }}>
                    {fileName} — {rows.length} rows parsed
                  </p>
                  <p className="text-xs" style={{ color: 'var(--shopli-warm-gray)' }}>
                    {rows.filter(r => r.errors.length === 0).length} valid,{' '}
                    {rows.filter(r => r.errors.length > 0).length} with errors
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={resetAll}
                    className="px-4 py-2 text-sm font-medium rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                    style={{ color: 'var(--shopli-warm-gray)' }}
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handleImport}
                    disabled={rows.filter(r => r.selected && r.product).length === 0}
                    className="px-5 py-2 text-sm font-semibold rounded-xl text-white disabled:opacity-40 transition-opacity"
                    style={{ background: 'var(--shopli-teal)' }}
                  >
                    Import {rows.filter(r => r.selected && r.product).length} products
                  </button>
                </div>
              </div>

              {/* Select all */}
              <div className="flex items-center gap-2 mb-3 text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rows.length > 0 && rows.every(r => r.errors.length > 0 || r.selected)}
                    onChange={toggleAll}
                    className="rounded"
                  />
                  <span style={{ color: 'var(--shopli-navy)' }}>Select all valid rows</span>
                </label>
                <span className="text-xs" style={{ color: 'var(--shopli-warm-gray)' }}>
                  (rows with errors are auto-deselected)
                </span>
              </div>

              {/* Table */}
              <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <th className="text-left py-3 px-3 w-8">
                        <span className="sr-only">Select</span>
                      </th>
                      <th className="text-left py-3 px-3 font-semibold" style={{ color: 'var(--shopli-navy)' }}>#</th>
                      <th className="text-left py-3 px-3 font-semibold" style={{ color: 'var(--shopli-navy)' }}>Name</th>
                      <th className="text-left py-3 px-3 font-semibold" style={{ color: 'var(--shopli-navy)' }}>Price</th>
                      <th className="text-left py-3 px-3 font-semibold" style={{ color: 'var(--shopli-navy)' }}>Category</th>
                      <th className="text-left py-3 px-3 font-semibold" style={{ color: 'var(--shopli-navy)' }}>Description</th>
                      <th className="text-left py-3 px-3 font-semibold" style={{ color: 'var(--shopli-navy)' }}>Tags</th>
                      <th className="text-left py-3 px-3 font-semibold" style={{ color: 'var(--shopli-navy)' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => {
                      const hasErrors = row.errors.length > 0;
                      return (
                        <tr
                          key={row.index}
                          className={`border-b border-gray-50 ${hasErrors ? 'bg-red-50/50' : ''} ${!row.selected ? 'opacity-50' : ''}`}
                        >
                          <td className="py-2.5 px-3">
                            <input
                              type="checkbox"
                              checked={row.selected}
                              onChange={() => toggleRow(row.index)}
                              disabled={hasErrors}
                              className="rounded"
                            />
                          </td>
                          <td className="py-2.5 px-3 font-mono" style={{ color: 'var(--shopli-warm-gray)' }}>
                            {row.index}
                          </td>
                          <td className="py-2.5 px-3 font-medium max-w-[200px] truncate" style={{ color: 'var(--shopli-navy)' }}>
                            {row.product?.name || row.raw.name || '—'}
                          </td>
                          <td className="py-2.5 px-3 font-mono" style={{ color: 'var(--shopli-teal)' }}>
                            {row.product ? `₪${row.product.price.toFixed(2)}` : '—'}
                          </td>
                          <td className="py-2.5 px-3 max-w-[120px] truncate" style={{ color: 'var(--shopli-warm-gray)' }}>
                            {row.product?.category || row.raw.category || '—'}
                          </td>
                          <td className="py-2.5 px-3 max-w-[200px] truncate" style={{ color: 'var(--shopli-warm-gray)' }}>
                            {row.product?.description || '—'}
                          </td>
                          <td className="py-2.5 px-3 max-w-[120px] truncate" style={{ color: 'var(--shopli-warm-gray)' }}>
                            {row.product?.tags?.join(', ') || '—'}
                          </td>
                          <td className="py-2.5 px-3">
                            {hasErrors ? (
                              <span className="inline-flex items-center gap-1 text-red-600 text-[10px] font-medium"
                                title={row.errors.join('; ')}>
                                <span>⚠</span> {row.errors.length} error{row.errors.length > 1 ? 's' : ''}
                              </span>
                            ) : (
                              <span className="text-green-600 text-[10px] font-medium">✓ Valid</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Error summary */}
              {rows.filter(r => r.errors.length > 0).length > 0 && (
                <div className="mt-4 bg-red-50 border border-red-100 rounded-xl p-4">
                  <p className="text-sm font-semibold text-red-800 mb-2">
                    ⚠ {rows.filter(r => r.errors.length > 0).length} row(s) with errors
                  </p>
                  <ul className="space-y-1 text-xs text-red-700">
                    {rows.filter(r => r.errors.length > 0).map(r => (
                      r.errors.map((err, i) => (
                        <li key={`${r.index}-${i}`} className="flex items-start gap-2">
                          <span className="font-mono opacity-50">Row {r.index}:</span>
                          <span>{err}</span>
                        </li>
                      ))
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Done */}
          {step === 'done' && importSummary && (
            <div>
              <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center mb-6">
                <div className="text-4xl mb-3">
                  {importSummary.failed === 0 ? '✅' : '⚠️'}
                </div>
                <h2 className="text-xl font-extrabold mb-2" style={{ color: 'var(--shopli-navy)' }}>
                  Import Complete
                </h2>
                <div className="flex items-center justify-center gap-6 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold" style={{ color: 'var(--shopli-teal)' }}>
                      {importSummary.imported}
                    </div>
                    <div className="text-xs" style={{ color: 'var(--shopli-warm-gray)' }}>
                      Imported
                    </div>
                  </div>
                  <div className="w-px h-8 bg-gray-200" />
                  <div className="text-center">
                    <div className="text-2xl font-bold" style={{ color: importSummary.failed > 0 ? '#dc2626' : 'var(--shopli-teal)' }}>
                      {importSummary.failed}
                    </div>
                    <div className="text-xs" style={{ color: 'var(--shopli-warm-gray)' }}>
                      Failed
                    </div>
                  </div>
                </div>

                {/* Error detail */}
                {importSummary.errors.length > 0 && (
                  <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-left mb-6">
                    <p className="text-xs font-semibold text-red-800 mb-2">Errors:</p>
                    <ul className="space-y-1 text-xs text-red-700">
                      {importSummary.errors.map((err, i) => (
                        <li key={i}>{err}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <a
                    href={downloadUrl}
                    download="curated-products.json"
                    className="px-5 py-2.5 text-sm font-semibold rounded-xl text-white inline-flex items-center gap-2"
                    style={{ background: 'var(--shopli-teal)' }}
                  >
                    ⬇ Download JSON
                  </a>
                  <button
                    onClick={handleCopyJson}
                    className="px-5 py-2.5 text-sm font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors inline-flex items-center gap-2"
                    style={{ color: 'var(--shopli-navy)' }}
                  >
                    📋 Copy to Clipboard
                  </button>
                  <button
                    onClick={resetAll}
                    className="px-5 py-2.5 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors"
                    style={{ color: 'var(--shopli-warm-gray)' }}
                  >
                    Import Another File
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm">
                <p className="font-semibold mb-1" style={{ color: 'var(--shopli-navy)' }}>
                  💡 Next step
                </p>
                <p className="text-xs" style={{ color: 'var(--shopli-warm-gray)' }}>
                  Copy the downloaded JSON into{' '}
                  <code className="bg-white px-1 rounded text-xs font-mono">lib/data/curated-products.json</code>{' '}
                  in your repo and redeploy. The products will be available via the curated products API at{' '}
                  <code className="bg-white px-1 rounded text-xs font-mono">/api/products/curated</code>.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}

/**
 * Parse CSV text into structured rows.
 * Handles quoted fields, commas in values, and flexible column mapping.
 */
function parseCsv(text: string): ParsedRow[] {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return [];

  // Parse header — find the first non-empty line
  let headerLine = 0;
  while (headerLine < lines.length && lines[headerLine].trim() === '') {
    headerLine++;
  }
  if (headerLine >= lines.length - 1) return [];

  const headers = parseCsvLine(lines[headerLine]);
  const results: ParsedRow[] = [];

  for (let i = headerLine + 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values = parseCsvLine(line);
    const raw: Record<string, string> = {};

    headers.forEach((h, idx) => {
      raw[h] = values[idx] || '';
    });

    const { product, errors } = parseCsvRow(raw, i - headerLine);
    results.push({
      index: i - headerLine,
      raw,
      product,
      errors,
      selected: errors.length === 0,
    });
  }

  return results;
}

/**
 * Parse a single CSV line, handling quoted fields.
 */
function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const next = line[i + 1];

    if (inQuotes) {
      if (char === '"' && next === '"') {
        current += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        current += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
  }
  result.push(current.trim());
  return result;
}