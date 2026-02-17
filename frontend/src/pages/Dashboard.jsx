// Dashboard — interactive admin command center with live API data
import { useState, useEffect } from 'react';
import { FiAlertTriangle, FiMessageSquare, FiUsers, FiActivity, FiTrendingUp, FiMapPin, FiClock, FiCheckCircle, FiChevronRight, FiNavigation, FiImage, FiZap, FiClipboard } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import StatusBadge from '../components/StatusBadge';
import api from '../api';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/api/stats');
        setStats(res.data);
      } catch (err) {
        console.error('Failed to fetch stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-3 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  const complaintPie = [
    { name: 'Pending', value: stats.pendingComplaints, color: '#f59e0b' },
    { name: 'In Progress', value: stats.inProgressComplaints, color: '#3b82f6' },
    { name: 'Resolved', value: stats.resolvedComplaints, color: '#10b981' },
  ].filter(d => d.value > 0);

  const taskPie = [
    { name: 'Pending', value: stats.pendingTasks, color: '#f59e0b' },
    { name: 'In Progress', value: stats.inProgressTasks, color: '#3b82f6' },
    { name: 'Completed', value: stats.completedTasks, color: '#10b981' },
  ].filter(d => d.value > 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1e293b] border border-slate-600 rounded-lg px-3 py-2 shadow-xl">
          <p className="text-xs font-bold text-slate-200">{payload[0].payload.day || payload[0].name}</p>
          <p className="text-xs text-cyan-400 font-bold">{payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="animate-fade-in-up">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-white flex items-center gap-3" style={{ fontFamily: 'var(--font-display)' }}>
              <span className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <FiActivity size={20} className="text-white" />
              </span>
              Command Center
            </h2>
            <p className="text-sm text-slate-500 mt-1.5 ml-[52px]">Real-time overview — Baramati Smart Waste</p>
          </div>
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-3 py-1.5">
            <span className="relative w-2 h-2 rounded-full bg-emerald-500">
              <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping-slow" />
            </span>
            <span className="text-[10px] font-bold text-emerald-400">LIVE</span>
          </div>
        </div>
      </div>

      {/* KPI Cards — 5 columns */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
        {[
          { icon: FiMessageSquare, label: 'Total Complaints', value: stats.totalComplaints, gradient: 'from-cyan-500/15 to-cyan-500/5', border: 'border-cyan-500/20', iconBg: 'bg-cyan-500/15', iconColor: 'text-cyan-400', sub: `${stats.pendingComplaints} pending` },
          { icon: FiAlertTriangle, label: 'Active Alerts', value: stats.pendingAlerts, gradient: 'from-red-500/15 to-red-500/5', border: 'border-red-500/20', iconBg: 'bg-red-500/15', iconColor: 'text-red-400', sub: 'require attention' },
          { icon: FiClipboard, label: 'Tasks Assigned', value: stats.totalTasks, gradient: 'from-violet-500/15 to-violet-500/5', border: 'border-violet-500/20', iconBg: 'bg-violet-500/15', iconColor: 'text-violet-400', sub: `${stats.completedTasks} completed` },
          { icon: FiUsers, label: 'Active Workers', value: stats.activeWorkers, gradient: 'from-blue-500/15 to-blue-500/5', border: 'border-blue-500/20', iconBg: 'bg-blue-500/15', iconColor: 'text-blue-400', sub: 'on duty' },
          { icon: FiTrendingUp, label: 'Resolution Rate', value: stats.totalComplaints > 0 ? `${Math.round(stats.resolvedComplaints / stats.totalComplaints * 100)}%` : '0%', gradient: 'from-emerald-500/15 to-emerald-500/5', border: 'border-emerald-500/20', iconBg: 'bg-emerald-500/15', iconColor: 'text-emerald-400', sub: 'complaints resolved' },
        ].map(({ icon: Icon, label, value, gradient, border, iconBg, iconColor, sub }, i) => (
          <div key={label} className={`bg-gradient-to-br ${gradient} border ${border} rounded-2xl p-5 group hover:scale-[1.02] transition-all duration-300 animate-fade-in-up`} style={{ animationDelay: `${0.05 + i * 0.04}s` }}>
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center ${iconColor} group-hover:scale-110 transition-transform`}>
                <Icon size={18} />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-white" style={{ fontFamily: 'var(--font-display)' }}>{value}</p>
            <p className="text-xs text-slate-400 font-medium mt-1">{label}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      {/* Main Grid — 3 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Col 1: Complaint Status Pie + Worker Performance */}
        <div className="space-y-5">
          {/* Complaint Breakdown */}
          <div className="card p-5 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2 mb-4" style={{ fontFamily: 'var(--font-display)' }}>
              <span className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <FiMessageSquare size={13} />
              </span>
              Complaint Overview
            </h3>
            {complaintPie.length > 0 ? (
              <div className="flex items-center justify-center">
                <ResponsiveContainer width={180} height={180}>
                  <PieChart>
                    <Pie data={complaintPie} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={4} dataKey="value" stroke="none">
                      {complaintPie.map((d, i) => <Cell key={i} fill={d.color} />)}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-sm text-slate-600 text-center py-8">No complaints</p>
            )}
            <div className="flex justify-center gap-4 mt-2">
              {complaintPie.map(d => (
                <div key={d.name} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-[10px] text-slate-400 font-medium">{d.name} ({d.value})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Worker Performance */}
          <div className="card p-5 animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2 mb-4" style={{ fontFamily: 'var(--font-display)' }}>
              <span className="w-7 h-7 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                <FiUsers size={13} />
              </span>
              Worker Performance
            </h3>
            <div className="space-y-3">
              {stats.workerStats && stats.workerStats.map(w => {
                const pct = w.totalTasks > 0 ? Math.round(w.completedTasks / w.totalTasks * 100) : 0;
                return (
                  <div key={w.id} className="bg-slate-800/30 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold shadow">
                          {w.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-200">{w.name}</p>
                          <p className="text-[10px] text-slate-500">{w.activeTasks} active · {w.completedTasks} done</p>
                        </div>
                      </div>
                      <span className="text-sm font-extrabold text-cyan-400">{pct}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-cyan-500 to-violet-500 rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Col 2: Recent Complaints with locations */}
        <div className="card p-5 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2" style={{ fontFamily: 'var(--font-display)' }}>
              <span className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <FiAlertTriangle size={13} />
              </span>
              Recent Complaints
            </h3>
            <a href="/complaints" className="text-[10px] text-cyan-400 font-bold flex items-center gap-0.5 hover:text-cyan-300">
              View All <FiChevronRight size={10} />
            </a>
          </div>
          <div className="space-y-3">
            {stats.recentComplaints && stats.recentComplaints.map(c => (
              <div key={c.id} className="bg-slate-800/30 rounded-xl p-3.5 hover:bg-slate-800/50 transition-colors group">
                <div className="flex items-start justify-between mb-1.5">
                  <span className="text-[10px] font-bold text-slate-500">#{c.id}</span>
                  <StatusBadge status={c.status} />
                </div>
                <p className="text-xs font-semibold text-slate-200 mb-1.5 leading-relaxed">{c.description}</p>
                <div className="flex items-center gap-3 text-[10px] text-slate-500">
                  <span className="flex items-center gap-1"><FiMapPin size={9} /> {c.location}</span>
                  <span className="flex items-center gap-1"><FiClock size={9} /> {formatDate(c.createdAt)}</span>
                </div>

                {/* Location link */}
                {c.latitude && c.longitude && (
                  <a
                    href={`https://www.google.com/maps?q=${c.latitude},${c.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-[9px] font-bold text-cyan-400 hover:text-cyan-300 bg-cyan-500/5 border border-cyan-500/20 rounded-lg px-2 py-0.5"
                  >
                    <FiNavigation size={8} /> View on Map
                  </a>
                )}

                {/* Media indicator */}
                {c.mediaUrls && c.mediaUrls.length > 0 && (
                  <span className="ml-2 inline-flex items-center gap-1 text-[9px] font-bold text-violet-400 bg-violet-500/5 border border-violet-500/20 rounded-lg px-2 py-0.5">
                    <FiImage size={8} /> {c.mediaUrls.length} file{c.mediaUrls.length > 1 ? 's' : ''}
                  </span>
                )}
              </div>
            ))}
            {(!stats.recentComplaints || stats.recentComplaints.length === 0) && (
              <p className="text-sm text-slate-600 text-center py-6">No complaints yet</p>
            )}
          </div>
        </div>

        {/* Col 3: Tasks + Collection Chart */}
        <div className="space-y-5">
          {/* Recent Tasks */}
          <div className="card p-5 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2" style={{ fontFamily: 'var(--font-display)' }}>
                <span className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <FiClipboard size={13} />
                </span>
                Active Tasks
              </h3>
              <a href="/assignments" className="text-[10px] text-cyan-400 font-bold flex items-center gap-0.5 hover:text-cyan-300">
                Manage <FiChevronRight size={10} />
              </a>
            </div>
            <div className="space-y-2">
              {stats.recentTasks && stats.recentTasks.filter(t => t.status !== 'completed').slice(0, 4).map(t => (
                <div key={t.id} className={`rounded-xl p-3 border ${
                  t.priority === 'urgent' ? 'bg-red-500/5 border-red-500/15' :
                  t.priority === 'high' ? 'bg-amber-500/5 border-amber-500/15' :
                  'bg-slate-800/30 border-slate-700/30'
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                      t.priority === 'urgent' ? 'bg-red-500/20 text-red-400' :
                      t.priority === 'high' ? 'bg-amber-500/20 text-amber-400' :
                      t.priority === 'medium' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-slate-700/50 text-slate-400'
                    }`}>{t.priority}</span>
                    <StatusBadge status={t.status} />
                  </div>
                  <p className="text-xs font-semibold text-slate-200 mt-1">{t.title}</p>
                  <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-500">
                    <span className="flex items-center gap-1"><FiUsers size={9} /> {t.workerName}</span>
                    <span className="flex items-center gap-1"><FiMapPin size={9} /> {t.location}</span>
                  </div>
                </div>
              ))}
              {(!stats.recentTasks || stats.recentTasks.filter(t => t.status !== 'completed').length === 0) && (
                <div className="text-center py-4">
                  <FiCheckCircle size={24} className="mx-auto text-emerald-500/40 mb-1" />
                  <p className="text-sm text-slate-600">All tasks completed!</p>
                </div>
              )}
            </div>
          </div>

          {/* Collection Trends Chart */}
          <div className="card p-5 animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2 mb-4" style={{ fontFamily: 'var(--font-display)' }}>
              <span className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <FiTrendingUp size={13} />
              </span>
              Weekly Collections
            </h3>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={stats.collections} barSize={20}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="collections" fill="url(#barGrad)" radius={[6, 6, 0, 0]} />
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Row: Hotspot Areas */}
      <div className="card p-5 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2 mb-4" style={{ fontFamily: 'var(--font-display)' }}>
          <span className="w-7 h-7 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
            <FiZap size={13} />
          </span>
          Complaint Hotspots
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {stats.areaComplaints && Object.entries(stats.areaComplaints)
            .sort(([, a], [, b]) => b - a)
            .map(([loc, count]) => (
              <div key={loc} className="bg-slate-800/30 rounded-xl p-3 border border-slate-700/30 hover:border-red-500/20 transition-colors group">
                <div className="flex items-center gap-2 mb-1">
                  <FiMapPin size={12} className="text-red-400 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-slate-200">{loc}</span>
                </div>
                <p className="text-lg font-extrabold text-red-400 ml-5">{count}</p>
                <p className="text-[9px] text-slate-500 ml-5">complaint{count > 1 ? 's' : ''}</p>
              </div>
            ))}
          {(!stats.areaComplaints || Object.keys(stats.areaComplaints).length === 0) && (
            <p className="text-sm text-slate-600 col-span-full text-center py-4">No complaint data</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
