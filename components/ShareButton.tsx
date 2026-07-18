import Icon from './icons';

interface ShareButtonProps {
  title: string;
  description?: string;
  className?: string;
  size?: 'sm' | 'md';
}

export default function ShareButton({ title, description, className = '', size = 'sm' }: ShareButtonProps) {
  const handleShare = () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const text = `Check out ${title} on Shopli!${description ? `\n${description}` : ''}\n${url}`;
    const waUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;

    // Track share event
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'share', {
        event_category: 'engagement',
        event_label: 'whatsapp-share',
        value: title,
      });
    }
    console.log(`[Share] WhatsApp share: ${title} — ${url}`);

    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const sizeClass = size === 'sm'
    ? 'text-xs px-2.5 py-1.5 gap-1'
    : 'text-sm px-3 py-2 gap-1.5';

  return (
    <button
      onClick={handleShare}
      className={`inline-flex items-center rounded-lg font-medium transition-colors hover:bg-gray-100 ${sizeClass} ${className}`}
      style={{ color: 'var(--shopli-teal)' }}
      aria-label="Share on WhatsApp"
    >
      <Icon name="share" size={size === 'sm' ? 14 : 16} />
      <span>Share</span>
    </button>
  );
}