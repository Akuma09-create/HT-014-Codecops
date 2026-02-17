// Complaint Status — citizen view to track complaint progress
import { useState, useEffect } from 'react';
import { FiCheckCircle, FiClock, FiMapPin, FiLoader } from 'react-icons/fi';
import StatusBadge from '../components/StatusBadge';
import api from '../api';

const ComplaintStatus = () => {
  const [complaints, setComplaints] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchComplaints();
    const interval = setInterval(fetchComplaints, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await api.get('/api/complaints');
      setComplaints(res.data);
    } catch (err) {
      console.error('Failed to fetch complaints', err);
    }
  };

  const filtered = filter === 'all' ? complaints : complaints.filter(c => c.status === filter);

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const statusCounts = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'pending').length,
    in_progress: complaints.filter(c => c.status === 'in_progress').length,
    resolved: complaints.filter(c => c.status === 'resolved').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in-up">
        <h2 className="text-2xl font-extrabold text-accent" style={{ fontFamily: 'var(--font-display)' }}>Complaint Status</h2>
        <p className="text-sm text-slate-500 mt-1">Track the progress of your submitted complaints</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div className="card p-4 text-center">
          <p className="text-2xl font-extrabold text-slate-200">{statusCounts.total}</p>
          <p className="text-[10px] font-bold text-slate-500 uppercase mt-1">Total</p>
        </div>
        <div className="card p-4 text-center border-l-2 border-yellow-500/50">
          <p className="text-2xl font-extrabold text-yellow-400">{statusCounts.pending}</p>
          <p className="text-[10px] font-bold text-slate-500 uppercase mt-1">Pending</p>
        </div>
        <div className="card p-4 text-center border-l-2 border-blue-500/50">
          <p className="text-2xl font-extrabold text-blue-400">{statusCounts.in_progress}</p>
          <p className="text-[10px] font-bold text-slate-500 uppercase mt-1">In Progress</p>
        </div>
        <div className="card p-4 text-center border-l-2 border-emerald-500/50">
          <p className="text-2xl font-extrabold text-emerald-400">{statusCounts.resolved}</p>
          <p className="text-[10px] font-bold text-slate-500 uppercase mt-1">Resolved</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
        {['all', 'pending', 'in_progress', 'resolved'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              filter === f
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                : 'bg-slate-800/50 text-slate-400 border border-slate-700/40 hover:text-slate-200'
            }`}
          >
            {f === 'all' ? 'All' : f === 'in_progress' ? 'In Progress' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Complaint List */}
      <div className="space-y-3 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        {filtered.map((c) => (
          <div key={c.id} className="card p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">#{c.id}</span>
                <StatusBadge status={c.status} />
              </div>
              <span className="text-[10px] text-slate-600 flex items-center gap-1"><FiClock size={10} /> {formatDate(c.createdAt)}</span>
            </div>

            <p className="text-sm font-semibold text-slate-200 mb-1">{c.description}</p>
            <p className="text-[11px] text-slate-500 flex items-center gap-1 mb-3"><FiMapPin size={10} /> {c.location}</p>

            {/* Progress bar */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    c.status === 'resolved' ? 'bg-emerald-500 w-full' :
                    c.status === 'in_progress' ? 'bg-blue-500 w-2/3' :
                    'bg-yellow-500 w-1/3'
                  }`}
                  style={{ width: c.status === 'resolved' ? '100%' : c.status === 'in_progress' ? '66%' : '33%' }}
                />
              </div>
              <span className="text-[10px] text-slate-500 font-semibold whitespace-nowrap">
                {c.status === 'resolved' ? 'Completed' : c.status === 'in_progress' ? 'Working on it' : 'Submitted'}
              </span>
            </div>

            {/* Admin response */}
            {c.response && (
              <div className="mt-3 p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/20">
                <p className="text-[10px] font-bold text-cyan-400 mb-1">Admin Response</p>
                <p className="text-xs text-slate-300">{c.response}</p>
                {c.respondedAt && (
                  <p className="text-[9px] text-slate-600 mt-1">{formatDate(c.respondedAt)}</p>
                )}
              </div>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="card p-8 text-center">
            <p className="text-slate-500 text-sm">No complaints found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplaintStatus;
