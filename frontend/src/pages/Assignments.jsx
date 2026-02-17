// Assignments — worker-bin task management with expandable details
import { useState } from 'react';
import { FiUsers, FiTrash2, FiCheck, FiAlertTriangle, FiMapPin, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import StatusBadge from '../components/StatusBadge';
import { workers, bins } from '../data/mockData';

const Assignments = () => {
  const [expandedWorker, setExpandedWorker] = useState(null);

  const unassignedBins = bins.filter(b =>
    !workers.some(w => w.assignedBins.includes(b.id))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in-up">
        <h2 className="text-2xl font-extrabold text-accent" style={{ fontFamily: 'var(--font-display)' }}>Assignments</h2>
        <p className="text-sm text-slate-500 mt-1">Manage worker-bin assignments and collection routes</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <FiUsers size={16} />
          </div>
          <div>
            <p className="text-lg font-extrabold text-white" style={{ fontFamily: 'var(--font-display)' }}>{workers.length}</p>
            <p className="text-[10px] text-slate-500 font-semibold">Active Workers</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
            <FiCheck size={16} />
          </div>
          <div>
            <p className="text-lg font-extrabold text-white" style={{ fontFamily: 'var(--font-display)' }}>{workers.reduce((s, w) => s + w.assignedBins.length, 0)}</p>
            <p className="text-[10px] text-slate-500 font-semibold">Assigned Bins</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <FiAlertTriangle size={16} />
          </div>
          <div>
            <p className="text-lg font-extrabold text-white" style={{ fontFamily: 'var(--font-display)' }}>{unassignedBins.length}</p>
            <p className="text-[10px] text-slate-500 font-semibold">Unassigned Bins</p>
          </div>
        </div>
      </div>

      {/* Worker Cards */}
      <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <h3 className="text-sm font-bold text-slate-300" style={{ fontFamily: 'var(--font-display)' }}>Workers</h3>
        {workers.map((worker) => {
          const workerBins = bins.filter(b => worker.assignedBins.includes(b.id));
          const isExpanded = expandedWorker === worker.id;

          return (
            <div key={worker.id} className="card overflow-hidden">
              <button
                onClick={() => setExpandedWorker(isExpanded ? null : worker.id)}
                className="w-full p-5 flex items-center justify-between hover:bg-slate-800/20 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center text-white text-sm font-bold shadow-lg">
                    {worker.name.charAt(0)}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-slate-200">{worker.name}</p>
                    <p className="text-xs text-slate-500">{worker.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-bold text-cyan-400">{workerBins.length} bins</p>
                    <p className="text-[10px] text-slate-600">assigned</p>
                  </div>
                  {isExpanded ? <FiChevronUp className="text-slate-500" size={16} /> : <FiChevronDown className="text-slate-500" size={16} />}
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-slate-800/40 p-4 space-y-2 bg-slate-900/30">
                  {workerBins.map(bin => (
                    <div key={bin.id} className="flex items-center justify-between bg-slate-800/50 rounded-xl px-4 py-3">
                      <div className="flex items-center gap-3">
                        <FiTrash2 className="text-slate-500" size={13} />
                        <div>
                          <p className="text-xs font-semibold text-slate-300">{bin.location}</p>
                          <p className="text-[10px] text-slate-600 flex items-center gap-1"><FiMapPin size={9} /> {bin.area}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-bold ${bin.fillLevel >= 80 ? 'text-red-400' : bin.fillLevel >= 50 ? 'text-amber-400' : 'text-emerald-400'}`}>{bin.fillLevel}%</span>
                        <StatusBadge status={bin.status} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Unassigned Bins */}
      <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
        <h3 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2" style={{ fontFamily: 'var(--font-display)' }}>
          <span className="w-6 h-6 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <FiAlertTriangle size={11} />
          </span>
          Unassigned Bins ({unassignedBins.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {unassignedBins.slice(0, 6).map(bin => (
            <div key={bin.id} className="card p-4 card-hover">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-400">#{bin.id}</span>
                <StatusBadge status={bin.status} />
              </div>
              <p className="text-xs font-semibold text-slate-300">{bin.location}</p>
              <p className="text-[10px] text-slate-600 mt-0.5 flex items-center gap-1"><FiMapPin size={9} /> {bin.area} — {bin.fillLevel}%</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Assignments;
