// Status badge pill — displays colored status indicator
const statusConfig = {
  empty:       { label: 'Empty',       bg: 'bg-emerald-500/10', text: 'text-emerald-400', dot: 'bg-emerald-400' },
  half:        { label: 'Half',        bg: 'bg-amber-500/10',   text: 'text-amber-400',   dot: 'bg-amber-400' },
  full:        { label: 'Full',        bg: 'bg-orange-500/10',  text: 'text-orange-400',  dot: 'bg-orange-400' },
  overflow:    { label: 'Overflow',    bg: 'bg-red-500/10',     text: 'text-red-400',     dot: 'bg-red-400' },
  active:      { label: 'Active',      bg: 'bg-red-500/10',     text: 'text-red-400',     dot: 'bg-red-400' },
  resolved:    { label: 'Resolved',    bg: 'bg-emerald-500/10', text: 'text-emerald-400', dot: 'bg-emerald-400' },
  pending:     { label: 'Pending',     bg: 'bg-amber-500/10',   text: 'text-amber-400',   dot: 'bg-amber-400' },
  in_progress: { label: 'In Progress', bg: 'bg-blue-500/10',    text: 'text-blue-400',    dot: 'bg-blue-400' },
};

const StatusBadge = ({ status }) => {
  const cfg = statusConfig[status] || statusConfig.pending;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}></span>
      {cfg.label}
    </span>
  );
};

export default StatusBadge;
