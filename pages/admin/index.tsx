import type { NextPage } from 'next';

const LINKS = [
  {
    href: '/admin/import',
    label: 'Bulk CSV Import',
    desc: 'Upload a CSV of collections to batch-add 5-10 feed products per row.',
    icon: '📥',
  },
];

const AdminPage: NextPage = () => {
  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-gray-200 px-6 py-3">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <a href="/" className="text-xl font-bold" style={{ color: '#1e293b' }}>Shopli</a>
          <span className="text-gray-400">/</span>
          <span className="text-sm font-medium text-gray-600">Admin</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-extrabold mb-2" style={{ color: '#1e293b' }}>Admin Dashboard</h1>
        <p className="text-sm mb-8" style={{ color: '#64748b' }}>
          Manage collections, imports, and catalog growth.
        </p>

        <div className="grid gap-4">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="block bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md hover:border-blue-300 transition-all"
            >
              <div className="flex items-start gap-4">
                <span className="text-2xl mt-0.5">{link.icon}</span>
                <div>
                  <div className="text-base font-semibold mb-0.5" style={{ color: '#1e293b' }}>{link.label}</div>
                  <div className="text-sm" style={{ color: '#64748b' }}>{link.desc}</div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminPage;
