const ACCENTS = {
  indigo: { chip: 'bg-indigo-50 text-indigo-600', value: 'text-indigo-700' },
  amber: { chip: 'bg-amber-50 text-amber-600', value: 'text-amber-700' },
  emerald: { chip: 'bg-emerald-50 text-emerald-600', value: 'text-emerald-700' },
  violet: { chip: 'bg-violet-50 text-violet-600', value: 'text-violet-700' },
};

export default function StatCard({ label, value, accent = 'indigo', icon }) {
  const theme = ACCENTS[accent] || ACCENTS.indigo;

  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition hover:shadow-md">
      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-xl ${theme.chip}`}>
        {icon}
      </span>
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className={`text-2xl font-semibold ${theme.value}`}>{value}</p>
      </div>
    </div>
  );
}
