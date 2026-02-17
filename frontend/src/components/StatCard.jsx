const StatCard = ({ title, value, icon: Icon, color, trend, trendLabel }) => {
  const colorMap = {
    green: { accent: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
    red: { accent: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
    yellow: { accent: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
    blue: { accent: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    purple: { accent: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
  };

  const c = colorMap[color] || colorMap.green;

  return (
    <div className="card card-hover p-5 group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 tracking-wide">{title}</p>
          <p className="text-2xl font-extrabold mt-1.5 text-white tabular-nums" style={{ fontFamily: 'var(--font-display)' }}>{value}</p>
          {trendLabel && (
            <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
              <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[11px] font-semibold ${
                trend >= 0 ? 'bg-cyan-500/10 text-cyan-400' : 'bg-red-500/10 text-red-400'
              }`}>
                {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
              </span>
              {trendLabel}
            </p>
          )}
        </div>
        <div className={`p-2.5 rounded-xl ${c.bg} ${c.accent} ${c.border} border group-hover:scale-110 transition-transform duration-300`}>
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
