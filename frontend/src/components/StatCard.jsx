// Reusable stat card with icon, value, and color accent
const colorMap = {
  cyan:   { bg: 'bg-cyan-500/10',   border: 'border-cyan-500/20',   text: 'text-cyan-400',   icon: 'text-cyan-400' },
  red:    { bg: 'bg-red-500/10',     border: 'border-red-500/20',     text: 'text-red-400',    icon: 'text-red-400' },
  amber:  { bg: 'bg-amber-500/10',   border: 'border-amber-500/20',   text: 'text-amber-400',  icon: 'text-amber-400' },
  blue:   { bg: 'bg-blue-500/10',    border: 'border-blue-500/20',    text: 'text-blue-400',   icon: 'text-blue-400' },
  violet: { bg: 'bg-violet-500/10',  border: 'border-violet-500/20',  text: 'text-violet-400', icon: 'text-violet-400' },
};

const StatCard = ({ icon: Icon, label, value, color = 'cyan', delay = 0 }) => {
  const c = colorMap[color] || colorMap.cyan;

  return (
    <div
      className="card p-5 card-hover group animate-fade-in-up"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center ${c.icon} group-hover:scale-110 transition-transform`}>
          <Icon size={18} />
        </div>
      </div>
      <p className="text-2xl font-extrabold text-white" style={{ fontFamily: 'var(--font-display)' }}>{value}</p>
      <p className="text-xs text-slate-500 font-medium mt-1">{label}</p>
    </div>
  );
};

export default StatCard;
