export const STATUS_OPTIONS = ['applied', 'interview', 'offer', 'rejected'];

export const STATUS_LABELS = {
  applied: 'Applied',
  interview: 'Interview',
  offer: 'Offer',
  rejected: 'Rejected',
};

// Centralized color system so every component (cards, columns, badges,
// the status <select>) stays visually in sync.
export const STATUS_STYLES = {
  applied: {
    dot: 'bg-sky-500',
    bar: 'bg-sky-500',
    badge: 'bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-200',
    select: 'bg-sky-50 text-sky-700 border-sky-200 focus:ring-sky-400',
    cardBorder: 'border-l-sky-400',
  },
  interview: {
    dot: 'bg-amber-500',
    bar: 'bg-amber-500',
    badge: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200',
    select: 'bg-amber-50 text-amber-700 border-amber-200 focus:ring-amber-400',
    cardBorder: 'border-l-amber-400',
  },
  offer: {
    dot: 'bg-emerald-500',
    bar: 'bg-emerald-500',
    badge: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200',
    select: 'bg-emerald-50 text-emerald-700 border-emerald-200 focus:ring-emerald-400',
    cardBorder: 'border-l-emerald-400',
  },
  rejected: {
    dot: 'bg-rose-500',
    bar: 'bg-rose-500',
    badge: 'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200',
    select: 'bg-rose-50 text-rose-700 border-rose-200 focus:ring-rose-400',
    cardBorder: 'border-l-rose-400',
  },
};
