/**
 * ProductFlagBadge — V5
 * Displays product flag chips (New, Hot, Sale, Featured, etc.)
 */
const FLAG_STYLES = {
  new:        'bg-green-500 text-white',
  hot:        'bg-red-500 text-white',
  sale:       'bg-orange-500 text-white',
  featured:   'bg-blue-500 text-white',
  trending:   'bg-purple-500 text-white',
  bestseller: 'bg-yellow-500 text-white',
  limited:    'bg-gray-800 text-white',
};

const FLAG_LABELS = {
  new:        'New',
  hot:        '🔥 Hot',
  sale:       'Sale',
  featured:   '⭐ Featured',
  trending:   '📈 Trending',
  bestseller: '🏆 Bestseller',
  limited:    '⏳ Limited',
};

export default function ProductFlagBadge({ flags = [], className = '' }) {
  const activeFlags = flags.filter((f) => {
    if (f.expiresAt && new Date(f.expiresAt) < new Date()) return false;
    return true;
  });

  if (activeFlags.length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-1 ${className}`}>
      {activeFlags.map((flag, i) => (
        <span
          key={i}
          className={`text-xs font-bold px-2 py-0.5 rounded-full ${FLAG_STYLES[flag.type] || 'bg-surface-200 text-surface-700'}`}
        >
          {flag.label || FLAG_LABELS[flag.type] || flag.type}
        </span>
      ))}
    </div>
  );
}
