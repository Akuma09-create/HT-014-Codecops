// Dashboard — real-time overview with stats, critical bins, and alerts
import { FiTrash2, FiAlertTriangle, FiMessageSquare, FiUsers, FiActivity, FiTrendingUp, FiMapPin } from 'react-icons/fi';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import { bins, alerts, stats } from '../data/mockData';

const Dashboard = () => {
  const criticalBins = bins.filter(b => b.fillLevel >= 75).sort((a, b) => b.fillLevel - a.fillLevel).slice(0, 5);
  const recentAlerts = alerts.filter(a => a.status === 'active').slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in-up">
        <h2 className="text-2xl font-extrabold text-accent" style={{ fontFamily: 'var(--font-display)' }}>Dashboard</h2>
        <p className="text-sm text-slate-500 mt-1">Real-time overview of the waste management system</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard icon={FiTrash2} label="Total Bins" value={stats.totalBins} color="cyan" delay={0} />
        <StatCard icon={FiAlertTriangle} label="Full / Overflow" value={stats.fullBins} color="red" delay={0.05} />
        <StatCard icon={FiActivity} label="Avg Fill Level" value={`${stats.avgFillLevel}%`} color="amber" delay={0.1} />
        <StatCard icon={FiAlertTriangle} label="Active Alerts" value={stats.pendingAlerts} color="red" delay={0.15} />
        <StatCard icon={FiMessageSquare} label="Complaints" value={stats.pendingComplaints} color="blue" delay={0.2} />
        <StatCard icon={FiUsers} label="Workers" value={stats.activeWorkers} color="violet" delay={0.25} />
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Critical Bins */}
        <div className="card p-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2" style={{ fontFamily: 'var(--font-display)' }}>
              <span className="w-7 h-7 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                <FiTrendingUp size={13} />
              </span>
              Critical Bins
            </h3>
            <span className="text-[10px] text-slate-600 font-semibold">{criticalBins.length} bins</span>
          </div>
          <div className="space-y-2">
            {criticalBins.map((bin) => (
              <div key={bin.id} className="flex items-center justify-between bg-slate-800/30 rounded-xl px-4 py-3 group hover:bg-slate-800/60 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                    <FiTrash2 size={14} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-300">{bin.location}</p>
                    <p className="text-[10px] text-slate-600 flex items-center gap-1"><FiMapPin size={9} /> {bin.area}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-20 h-1.5 rounded-full bg-slate-700 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${bin.fillLevel >= 90 ? 'bg-red-500' : 'bg-amber-500'}`}
                      style={{ width: `${bin.fillLevel}%` }}
                    />
                  </div>
                  <span className={`text-xs font-bold ${bin.fillLevel >= 90 ? 'text-red-400' : 'text-amber-400'}`}>{bin.fillLevel}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="card p-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2" style={{ fontFamily: 'var(--font-display)' }}>
              <span className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <FiAlertTriangle size={13} />
              </span>
              Active Alerts
            </h3>
            <span className="text-[10px] text-slate-600 font-semibold">{recentAlerts.length} alerts</span>
          </div>
          <div className="space-y-2">
            {recentAlerts.map((alert) => (
              <div key={alert.id} className={`flex items-center justify-between rounded-xl px-4 py-3 border transition-colors ${
                alert.type === 'overflow'
                  ? 'bg-red-500/5 border-red-500/15 hover:bg-red-500/10'
                  : 'bg-amber-500/5 border-amber-500/15 hover:bg-amber-500/10'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`relative w-2.5 h-2.5 rounded-full ${alert.type === 'overflow' ? 'bg-red-500' : 'bg-amber-500'}`}>
                    <span className={`absolute inset-0 rounded-full animate-ping-slow ${alert.type === 'overflow' ? 'bg-red-500' : 'bg-amber-500'}`}></span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-300">{alert.location}</p>
                    <p className="text-[10px] text-slate-600">{alert.type === 'overflow' ? 'Overflow Alert' : 'High Fill Alert'} — {alert.fillLevel}%</p>
                  </div>
                </div>
                <StatusBadge status={alert.status} />
              </div>
            ))}
            {recentAlerts.length === 0 && (
              <p className="text-sm text-slate-600 text-center py-4">No active alerts</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
