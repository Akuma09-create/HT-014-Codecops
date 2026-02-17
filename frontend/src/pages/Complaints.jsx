// Complaints — citizen issue reporting and tracking
import { useState } from 'react';
import { FiMessageSquare, FiSend, FiUser, FiMapPin, FiClock } from 'react-icons/fi';
import StatusBadge from '../components/StatusBadge';
import { complaints } from '../data/mockData';

const Complaints = () => {
  const [allComplaints, setAllComplaints] = useState(complaints);
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!location.trim() || !description.trim()) return;

    const newComplaint = {
      id: allComplaints.length + 1,
      userId: 4,
      userName: JSON.parse(localStorage.getItem('user') || '{}').name || 'User',
      location: location.trim(),
      description: description.trim(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setAllComplaints([newComplaint, ...allComplaints]);
    setLocation('');
    setDescription('');
  };

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in-up">
        <h2 className="text-2xl font-extrabold text-accent" style={{ fontFamily: 'var(--font-display)' }}>Complaints</h2>
        <p className="text-sm text-slate-500 mt-1">Report waste issues and track their resolution</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Submit Form */}
        <div className="card p-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-display)' }}>
            <span className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <FiMessageSquare size={13} />
            </span>
            New Complaint
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Location</label>
              <div className="flex items-center bg-slate-800/60 border border-slate-700/50 rounded-xl px-4 py-3 gap-3 focus-within:border-cyan-500/50 transition-colors">
                <FiMapPin className="text-slate-500" size={14} />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter location..."
                  className="bg-transparent text-sm text-slate-200 placeholder-slate-600 outline-none w-full"
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the issue..."
                rows={4}
                className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 outline-none resize-none focus:border-cyan-500/50 transition-colors"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 text-white text-sm font-bold hover:shadow-lg hover:shadow-cyan-500/25 transition-all flex items-center justify-center gap-2"
            >
              <FiSend size={14} /> Submit Complaint
            </button>
          </form>
        </div>

        {/* Complaint List */}
        <div className="lg:col-span-2 space-y-3 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-300" style={{ fontFamily: 'var(--font-display)' }}>All Complaints</h3>
            <span className="text-[10px] text-slate-600 font-semibold">{allComplaints.length} total</span>
          </div>

          {allComplaints.map((c) => (
            <div key={c.id} className="card p-5 card-hover">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500">#{c.id}</span>
                  <StatusBadge status={c.status} />
                </div>
                <span className="text-[10px] text-slate-600 flex items-center gap-1"><FiClock size={10} /> {formatDate(c.createdAt)}</span>
              </div>
              <p className="text-sm font-semibold text-slate-200 mb-1">{c.description}</p>
              <div className="flex items-center gap-4 text-[11px] text-slate-500">
                <span className="flex items-center gap-1"><FiMapPin size={10} /> {c.location}</span>
                <span className="flex items-center gap-1"><FiUser size={10} /> {c.userName}</span>
              </div>
            </div>
          ))}

          {allComplaints.length === 0 && (
            <div className="card p-8 text-center">
              <p className="text-slate-500 text-sm">No complaints yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Complaints;
