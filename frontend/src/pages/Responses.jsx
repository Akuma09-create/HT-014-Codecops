// Responses — citizen view to see admin replies to their complaints
import { useState, useEffect } from 'react';
import { FiInbox, FiClock, FiMapPin, FiCornerDownRight } from 'react-icons/fi';
import StatusBadge from '../components/StatusBadge';
import api from '../api';

const Responses = () => {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    fetchResponses();
    const interval = setInterval(fetchResponses, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchResponses = async () => {
    try {
      const res = await api.get('/api/complaints');
      // Only show complaints that have a response from admin
      setComplaints(res.data.filter(c => c.response));
    } catch (err) {
      console.error('Failed to fetch responses', err);
    }
  };

  const formatDate = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in-up">
        <h2 className="text-2xl font-extrabold text-accent" style={{ fontFamily: 'var(--font-display)' }}>Responses</h2>
        <p className="text-sm text-slate-500 mt-1">Admin replies to your complaints</p>
      </div>

      {/* Response count */}
      <div className="card p-4 flex items-center gap-3 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
          <FiInbox size={18} />
        </div>
        <div>
          <p className="text-lg font-extrabold text-slate-200">{complaints.length}</p>
          <p className="text-[10px] font-bold text-slate-500 uppercase">Responses Received</p>
        </div>
      </div>

      {/* Response list */}
      <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        {complaints.map((c) => (
          <div key={c.id} className="card p-5">
            {/* Original complaint */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500">#{c.id}</span>
                  <StatusBadge status={c.status} />
                </div>
                <span className="text-[10px] text-slate-600 flex items-center gap-1"><FiClock size={10} /> {formatDate(c.createdAt)}</span>
              </div>
              <p className="text-sm text-slate-400 mb-1">{c.description}</p>
              <p className="text-[11px] text-slate-600 flex items-center gap-1"><FiMapPin size={10} /> {c.location}</p>
            </div>

            {/* Admin response */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-500/5 to-violet-500/5 border border-cyan-500/20">
              <div className="flex items-center gap-2 mb-2">
                <FiCornerDownRight size={12} className="text-cyan-400" />
                <p className="text-[11px] font-bold text-cyan-400">Admin Response</p>
                {c.respondedAt && (
                  <span className="text-[9px] text-slate-600 ml-auto">{formatDate(c.respondedAt)}</span>
                )}
              </div>
              <p className="text-sm text-slate-200 font-medium">{c.response}</p>
            </div>
          </div>
        ))}

        {complaints.length === 0 && (
          <div className="card p-10 text-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-800/60 mx-auto mb-4 flex items-center justify-center">
              <FiInbox size={24} className="text-slate-600" />
            </div>
            <p className="text-slate-400 text-sm font-semibold mb-1">No responses yet</p>
            <p className="text-slate-600 text-xs">Admin responses to your complaints will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Responses;
