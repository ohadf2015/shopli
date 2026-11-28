import type { MoodBoardLink } from '../lib/moodboards';

/** Entry point to the mood boards, which nothing else on the site links to. */
export default function MoodBoardsRow({ links, region, rtl }: { links: MoodBoardLink[]; region: string; rtl: boolean }) {
  if (!links?.length) return null;
  return (
    <section aria-labelledby="mood-boards" className="flex flex-col gap-3">
      <h2 id="mood-boards" className="text-xl sm:text-2xl font-bold m-0">
        {rtl ? 'בנו סט שלם' : 'Build a whole setup'}
      </h2>
      <p className="text-sm m-0" style={{ color: '#5C554C' }}>
        {rtl ? 'כל הפריטים שהולכים ביחד, בעמוד אחד' : 'Every piece that goes together, on one page'}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {links.map((l) => (
          <a
            key={l.slug}
            href={`/${region}/mood/${l.slug}`}
            data-track="mood-board-row"
            className="px-4 py-3 rounded-xl bg-white text-sm font-semibold flex items-center justify-between gap-2"
            style={{ border: '2.5px solid var(--shopli-ink)', color: 'var(--shopli-ink)', textDecoration: 'none' }}
          >
            <span>{l.title}</span>
            <span aria-hidden="true">{rtl ? '←' : '→'}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
