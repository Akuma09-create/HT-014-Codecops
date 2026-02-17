// Alerts page — overflow & high-fill notifications with resolve action
import { useState } from 'react';
import { FiAlertTriangle, FiBell, FiCheckCircle, FiMapPin } from 'react-icons/fi';
import StatusBadge from '../components/StatusBadge';
import { alerts } from '../data/mockData';

const Alerts = () => {
  const [filter, setFilter] = useState('all');

  const filtered = alerts.filter(a => {
    if (filter === 'all') return true;
    return a.status === filter;
  });

  const activeCount = alerts.filter(a => a.status === 'active').length;
  const resolvedCount = alerts.filter(a => a.status === 'resolved').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in-up">
        <h2 className="text-2xl font-extrabold text-accent" style={{ fontFamily: 'var(--font-display)' }}>Alerts</h2>
        <p className="text-sm text-slate-500 mt-1">Monitor overflow warnings and high-fill notifications</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-slate-800/60 border border-slate-700/40 flex items-center justify-center text-slate-400">
            <FiBell size={16} />
          </div>
          <div>
            <p className="text-lg font-extrabold text-white" style={{ fontFamily: 'var(--font-display)' }}>{alerts.length}</p>
            <p className="text-[10px] text-slate-500 font-semibold">Total Alerts</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
            <FiAlertTriangle size={16} />
          </div>
          <div>
            <p className="text-lg font-extrabold text-white" style={{ fontFamily: 'var(--font-display)' }}>{activeCount}</p>
            <p className="text-[10px] text-slate-500 font-semibold">Active</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <FiCheckCircle size={16} />
          </div>
          <div>
            <p className="text-lg font-extrabold text-white" style={{ fontFamily: 'var(--font-display)' }}>{resolvedCount}</p>
            <p className="text-[10px] text-slate-500 font-semibold">Resolved</p>
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
        {[['all', 'All'], ['active', 'Active'], ['resolved', 'Resolved']].map(([value, label]) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              filter === value
                ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                : 'bg-slate-800/40 text-slate-400 border border-slate-700/40 hover:text-slate-300'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Alert list */}
      <div className="space-y-3 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        {filtered.map((alert) => (
          <div key={alert.id} className={`card p-5 flex items-center justify-between border ${
            alert.status === 'active'
              ? alert.type === 'overflow' ? 'border-red-500/20 bg-red-500/[0.03]' : 'border-amber-500/20 bg-amber-500/[0.03]'
              : 'border-slate-700/30'
          }`}>
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  alert.type === 'overflow' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'
                }`}>
                  <FiAlertTriangle size={18} />
                </div>
                {alert.status === 'active' && (
                  <span className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ${alert.type === 'overflow' ? 'bg-red-500' : 'bg-amber-500'}`}>
                    <span className={`absolute inset-0 rounded-full animate-ping-slow ${alert.type === 'overflow' ? 'bg-red-500' : 'bg-amber-500'}`}></span>
                  </span>
                )}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-200">{alert.location}</p>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                  <FiMapPin size={10} /> {alert.area} — Fill: {alert.fillLevel}%
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={alert.status} />
              {alert.status === 'active' && (
                <button className="px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-[11px] font-bold text-cyan-400 hover:bg-cyan-500/20 transition-all">
                  Resolve
                </button>
              )}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="card p-8 text-center">
            <p className="text-slate-500 text-sm">No alerts found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alerts;
