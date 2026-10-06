import { STATUS_OPTIONS, STATUS_LABELS, STATUS_STYLES } from '../constants/status.js';

export default function ApplicationCard({ application, onClick, onStatusChange }) {
  const formattedDate = new Date(application.dateApplied).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const styles = STATUS_STYLES[application.status];

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onClick(application)}
      onKeyDown={(e) => { if (e.key === 'Enter') onClick(application); }}
      className={`cursor-pointer rounded-lg border border-l-4 border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${styles.cardBorder}`}
    >
      <p className="font-semibold text-slate-900">{application.company}</p>
      <p className="text-sm text-slate-500">{application.role}</p>
      <p className="mt-2 flex items-center gap-1 text-xs text-slate-400">
        <span>🗓</span> {formattedDate}
      </p>

      <select
        value={application.status}
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => onStatusChange(application._id, e.target.value)}
        className={`mt-3 w-full rounded-md border px-2 py-1 text-xs font-medium focus:outline-none focus:ring-2 ${styles.select}`}
      >
        {STATUS_OPTIONS.map((status) => (
          <option key={status} value={status}>{STATUS_LABELS[status]}</option>
        ))}
      </select>
    </div>
  );
}
