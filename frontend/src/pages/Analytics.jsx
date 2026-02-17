// Analytics — charts, KPIs, and performance insights
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, AreaChart, Area } from 'recharts';
import { FiTrash2, FiAlertTriangle, FiMessageSquare, FiUsers, FiTrendingUp, FiActivity } from 'react-icons/fi';
import { collectionsOverTime, fillDistribution, bins, stats, complaints } from '../data/mockData';

const Analytics = () => {
  const areaData = ['Central', 'South', 'East', 'West', 'North'].map(area => ({
    area,
    bins: bins.filter(b => b.area === area).length,
    avgFill: Math.round(bins.filter(b => b.area === area).reduce((s, b) => s + b.fillLevel, 0) / (bins.filter(b => b.area === area).length || 1)),
  }));

  const pieColors = ['#06b6d4', '#f59e0b', '#f97316', '#ef4444'];

  const kpiCards = [
    { icon: FiTrash2, label: 'Total Bins', value: stats.totalBins, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
    { icon: FiAlertTriangle, label: 'Full/Overflow', value: stats.fullBins, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
    { icon: FiActivity, label: 'Active Alerts', value: stats.pendingAlerts, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
    { icon: FiMessageSquare, label: 'Complaints', value: stats.pendingComplaints, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    { icon: FiUsers, label: 'Active Workers', value: stats.activeWorkers, color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
    { icon: FiTrendingUp, label: 'Collection Rate', value: `${stats.collectionRate}%`, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1e293b] border border-slate-600 rounded-lg px-4 py-3 shadow-xl">
          <p className="text-xs font-bold text-slate-200">{label}</p>
          {payload.map((p, i) => (
            <p key={i} className="text-xs text-slate-400 mt-0.5">
              <span className="font-bold" style={{ color: p.color }}>{p.name}: </span>{p.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in-up">
        <h2 className="text-2xl font-extrabold text-accent" style={{ fontFamily: 'var(--font-display)' }}>Analytics</h2>
        <p className="text-sm text-slate-500 mt-1">Waste management insights and performance trends</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        {kpiCards.map((kpi, i) => (
          <div key={kpi.label} className="card p-4 text-center card-hover group" style={{ animationDelay: `${i * 0.06}s` }}>
            <div className={`w-9 h-9 rounded-lg ${kpi.bg} border ${kpi.border} mx-auto mb-2 flex items-center justify-center ${kpi.color} group-hover:scale-110 transition-transform`}>
              <kpi.icon size={16} />
            </div>
            <p className="text-xl font-extrabold text-white" style={{ fontFamily: 'var(--font-display)' }}>{kpi.value}</p>
            <p className="text-[10px] text-slate-500 font-semibold mt-0.5">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Collections Over Time */}
        <div className="card p-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2.5" style={{ fontFamily: 'var(--font-display)' }}>
            <span className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <FiTrendingUp size={13} />
            </span>
            Weekly Collections
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={collectionsOverTime}>
              <defs>
                <linearGradient id="colorCollections" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="collections" stroke="#06b6d4" strokeWidth={2.5} fill="url(#colorCollections)" name="Collections" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Fill Distribution */}
        <div className="card p-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2.5" style={{ fontFamily: 'var(--font-display)' }}>
            <span className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <FiActivity size={13} />
            </span>
            Fill Level Distribution
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={fillDistribution} cx="50%" cy="50%" outerRadius={80} innerRadius={45} dataKey="count" nameKey="range" paddingAngle={4} strokeWidth={0}>
                {fillDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={pieColors[index]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11, fontWeight: 600 }} formatter={(value) => <span style={{ color: '#94a3b8' }}>{value}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Area-wise Bins */}
        <div className="card p-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2.5" style={{ fontFamily: 'var(--font-display)' }}>
            <span className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <FiTrash2 size={13} />
            </span>
            Bins by Area
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={areaData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="area" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="bins" name="Bins" fill="#06b6d4" radius={[6, 6, 0, 0]} />
              <Bar dataKey="avgFill" name="Avg Fill %" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Insights */}
        <div className="card p-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2.5" style={{ fontFamily: 'var(--font-display)' }}>
            <span className="w-7 h-7 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
              <FiActivity size={13} />
            </span>
            Quick Insights
          </h3>
          <div className="space-y-3">
            {[
              { icon: FiUsers, text: 'Most Active Worker', value: 'Ravi Kumar (3 tasks)', color: 'text-cyan-400', bg: 'bg-cyan-500/5', border: 'border-cyan-500/10' },
              { icon: FiAlertTriangle, text: 'Hotspot Area', value: `South (${bins.filter(b => b.area === 'South').length} bins)`, color: 'text-red-400', bg: 'bg-red-500/5', border: 'border-red-500/10' },
              { icon: FiTrendingUp, text: 'Avg Fill Level', value: `${Math.round(bins.reduce((s, b) => s + b.fillLevel, 0) / bins.length)}%`, color: 'text-amber-400', bg: 'bg-amber-500/5', border: 'border-amber-500/10' },
              { icon: FiMessageSquare, text: 'Pending Complaints', value: `${complaints.filter(c => c.status === 'pending').length} unresolved`, color: 'text-blue-400', bg: 'bg-blue-500/5', border: 'border-blue-500/10' },
              { icon: FiTrash2, text: 'Overflow Bins', value: `${bins.filter(b => b.status === 'overflow').length} need attention`, color: 'text-violet-400', bg: 'bg-violet-500/5', border: 'border-violet-500/10' },
            ].map((insight, i) => (
              <div key={i} className={`flex items-center gap-3 ${insight.bg} border ${insight.border} rounded-xl px-4 py-3 group hover:scale-[1.01] transition-transform`}>
                <div className={`${insight.color}`}><insight.icon size={16} /></div>
                <div className="flex-1">
                  <p className="text-[11px] text-slate-500 font-semibold">{insight.text}</p>
                  <p className="text-sm font-bold text-slate-200">{insight.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
