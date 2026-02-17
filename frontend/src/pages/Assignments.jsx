// Assignments — admin task management with assign, track, approve worker completion photos, and map view
import { useState, useEffect } from 'react';
import { FiUsers, FiClipboard, FiCheck, FiAlertTriangle, FiMapPin, FiChevronDown, FiChevronUp, FiPlus, FiImage, FiClock, FiX, FiSend, FiExternalLink, FiCheckCircle, FiXCircle, FiThumbsUp, FiThumbsDown, FiUserPlus, FiTrash2, FiMail, FiLock, FiUser } from 'react-icons/fi';
import StatusBadge from '../components/StatusBadge';
import api from '../api';

const Assignments = () => {
  const [tasks, setTasks] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [expandedTask, setExpandedTask] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showWorkerModal, setShowWorkerModal] = useState(false);
  const [filter, setFilter] = useState('all');
  const [photoViewer, setPhotoViewer] = useState(null); // { taskId, photos }

  // New task form
  const [newTask, setNewTask] = useState({ worker_id: '', complaint_id: '', title: '', description: '', location: '', priority: 'medium' });

  // New worker form
  const [newWorker, setNewWorker] = useState({ name: '', email: '', password: '' });
  const [workerError, setWorkerError] = useState('');
  const [creatingWorker, setCreatingWorker] = useState(false);

  useEffect(() => {
    fetchTasks();
    fetchWorkers();
    fetchComplaints();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get('/api/tasks');
      setTasks(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchWorkers = async () => {
    try {
      const res = await api.get('/api/tasks/workers');
      setWorkers(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchComplaints = async () => {
    try {
      const res = await api.get('/api/complaints');
      setComplaints(res.data);
    } catch (err) { console.error(err); }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!newTask.worker_id || !newTask.title.trim() || !newTask.location.trim()) return;
    try {
      await api.post('/api/tasks', {
        worker_id: parseInt(newTask.worker_id),
        complaint_id: newTask.complaint_id ? parseInt(newTask.complaint_id) : null,
        title: newTask.title.trim(),
        description: newTask.description.trim(),
        location: newTask.location.trim(),
        priority: newTask.priority,
      });
      setNewTask({ worker_id: '', complaint_id: '', title: '', description: '', location: '', priority: 'medium' });
      setShowAssignModal(false);
      fetchTasks();
      fetchComplaints();
    } catch (err) { console.error(err); }
  };

  // Auto-fill from complaint
  const handleComplaintSelect = (complaintId) => {
    if (!complaintId) {
      setNewTask(prev => ({ ...prev, complaint_id: '' }));
      return;
    }
    const c = complaints.find(x => x.id === parseInt(complaintId));
    if (c) {
      setNewTask(prev => ({
        ...prev,
        complaint_id: complaintId,
        title: `Resolve: ${c.description.substring(0, 50)}`,
        description: c.description,
        location: c.location,
        priority: 'high',
      }));
    }
  };

  const handleAddWorker = async (e) => {
    e.preventDefault();
    setWorkerError('');
    if (!newWorker.name.trim() || !newWorker.email.trim() || !newWorker.password.trim()) return;
    setCreatingWorker(true);
    try {
      await api.post('/api/tasks/workers', {
        name: newWorker.name.trim(),
        email: newWorker.email.trim(),
        password: newWorker.password.trim(),
      });
      setNewWorker({ name: '', email: '', password: '' });
      setShowWorkerModal(false);
      fetchWorkers();
    } catch (err) {
      setWorkerError(err.response?.data?.detail || 'Failed to add worker');
    }
    setCreatingWorker(false);
  };

  const deleteWorker = async (workerId) => {
    if (!confirm('Remove this worker?')) return;
    try {
      await api.delete(`/api/tasks/workers/${workerId}`);
      fetchWorkers();
      fetchTasks();
    } catch (err) { console.error(err); }
  };

  const approveTask = async (taskId) => {
    try {
      await api.post(`/api/tasks/${taskId}/approve`);
      fetchTasks();
    } catch (err) { console.error(err); }
  };

  const rejectTask = async (taskId) => {
    try {
      await api.post(`/api/tasks/${taskId}/reject`);
      fetchTasks();
    } catch (err) { console.error(err); }
  };

  const getMapUrl = (task) => {
    if (task.latitude && task.longitude) {
      return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${task.latitude},${task.longitude}&zoom=16`;
    }
    return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(task.location + ', Baramati, Maharashtra')}&zoom=15`;
  };

  const getDirectionsUrl = (task) => {
    if (task.latitude && task.longitude) {
      return `https://www.google.com/maps/dir/?api=1&destination=${task.latitude},${task.longitude}`;
    }
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(task.location + ', Baramati, Maharashtra')}`;
  };

  const formatDate = (iso) => {
    if (!iso) return '—';
    const d = new Date(iso);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  const filtered = tasks.filter(t => {
    if (filter === 'all') return true;
    return t.status === filter;
  });

  const pendingCount = tasks.filter(t => t.status === 'pending').length;
  const inProgressCount = tasks.filter(t => t.status === 'in_progress').length;
  const completedCount = tasks.filter(t => t.status === 'completed').length;

  const priorityColors = {
    urgent: { bg: 'bg-red-500/15', border: 'border-red-500/25', text: 'text-red-400', badge: 'bg-red-500/20' },
    high: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400', badge: 'bg-amber-500/20' },
    medium: { bg: 'bg-blue-500/8', border: 'border-blue-500/15', text: 'text-blue-400', badge: 'bg-blue-500/20' },
    low: { bg: 'bg-slate-800/30', border: 'border-slate-700/30', text: 'text-slate-400', badge: 'bg-slate-700/50' },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in-up flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-3" style={{ fontFamily: 'var(--font-display)' }}>
            <span className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <FiClipboard size={20} className="text-white" />
            </span>
            Task Management
          </h2>
          <p className="text-sm text-slate-500 mt-1 ml-[52px]">Assign, track, and review worker tasks</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowWorkerModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-bold hover:shadow-lg hover:shadow-emerald-500/25 transition-all"
          >
            <FiUserPlus size={16} /> Add Worker
          </button>
          <button
            onClick={() => setShowAssignModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 text-white text-sm font-bold hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
          >
            <FiPlus size={16} /> Assign Task
          </button>
        </div>
      </div>

      {/* Workers List */}
      <div className="card p-5 animate-fade-in-up" style={{ animationDelay: '0.03s' }}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2" style={{ fontFamily: 'var(--font-display)' }}>
            <FiUsers size={14} className="text-emerald-400" /> Workers ({workers.length})
          </h3>
        </div>
        <div className="flex gap-3 flex-wrap">
          {workers.map(w => (
            <div key={w.id} className="flex items-center gap-3 bg-slate-800/50 border border-slate-700/40 rounded-xl px-4 py-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs font-bold">
                {w.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-200">{w.name}</p>
                <p className="text-[10px] text-slate-500">{w.email} · ID: {w.id}</p>
              </div>
              <button
                onClick={() => deleteWorker(w.id)}
                className="ml-2 w-6 h-6 rounded-md bg-red-500/0 hover:bg-red-500/15 text-slate-600 hover:text-red-400 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                title="Remove worker"
              >
                <FiTrash2 size={11} />
              </button>
            </div>
          ))}
          {workers.length === 0 && (
            <p className="text-[10px] text-slate-600">No workers added yet. Click "Add Worker" to create one.</p>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
        {[
          { label: 'Total Tasks', value: tasks.length, gradient: 'from-cyan-500/15 to-cyan-500/5', border: 'border-cyan-500/20', color: 'text-cyan-400', icon: FiClipboard },
          { label: 'Pending', value: pendingCount, gradient: 'from-amber-500/15 to-amber-500/5', border: 'border-amber-500/20', color: 'text-amber-400', icon: FiClock },
          { label: 'In Progress', value: inProgressCount, gradient: 'from-blue-500/15 to-blue-500/5', border: 'border-blue-500/20', color: 'text-blue-400', icon: FiAlertTriangle },
          { label: 'Completed', value: completedCount, gradient: 'from-emerald-500/15 to-emerald-500/5', border: 'border-emerald-500/20', color: 'text-emerald-400', icon: FiCheck },
        ].map(({ label, value, gradient, border, color, icon: Icon }) => (
          <div key={label} className={`bg-gradient-to-br ${gradient} border ${border} rounded-2xl p-4 flex items-center gap-3`}>
            <div className={`w-10 h-10 rounded-xl ${gradient.replace('to-', '').split(' ')[0].replace('from-', 'bg-')} flex items-center justify-center ${color}`}>
              <Icon size={18} />
            </div>
            <div>
              <p className="text-xl font-extrabold text-white" style={{ fontFamily: 'var(--font-display)' }}>{value}</p>
              <p className="text-[10px] text-slate-500 font-semibold">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        {[['all', 'All Tasks'], ['pending', 'Pending'], ['in_progress', 'In Progress'], ['completed', 'Completed']].map(([val, label]) => (
          <button
            key={val}
            onClick={() => setFilter(val)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filter === val
                ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                : 'bg-slate-800/40 text-slate-400 border border-slate-700/40 hover:text-slate-300'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="space-y-3 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
        {filtered.map(task => {
          const pc = priorityColors[task.priority] || priorityColors.medium;
          const isExpanded = expandedTask === task.id;

          return (
            <div key={task.id} className={`card overflow-hidden border ${pc.border} ${pc.bg}`}>
              <button
                onClick={() => setExpandedTask(isExpanded ? null : task.id)}
                className="w-full p-5 flex items-center justify-between hover:bg-white/[0.02] transition-colors text-left"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="flex flex-col items-center gap-1">
                    <span className={`text-[8px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded ${pc.badge} ${pc.text}`}>{task.priority}</span>
                    <span className="text-[10px] text-slate-600">#{task.id}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-200 truncate">{task.title}</p>
                    <div className="flex items-center gap-3 mt-1 text-[10px] text-slate-500">
                      <span className="flex items-center gap-1"><FiUsers size={9} /> {task.workerName}</span>
                      <span className="flex items-center gap-1"><FiMapPin size={9} /> {task.location}</span>
                      <span className="flex items-center gap-1"><FiClock size={9} /> {formatDate(task.assignedAt)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 ml-3">
                  <StatusBadge status={task.status} />
                  {/* Approval badge */}
                  {task.status === 'completed' && task.approved === true && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-2 py-0.5">
                      <FiCheckCircle size={9} /> Approved
                    </span>
                  )}
                  {task.status === 'completed' && task.approved === null && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-lg px-2 py-0.5 animate-pulse">
                      <FiClock size={9} /> Needs Review
                    </span>
                  )}
                  {task.completionPhotos && task.completionPhotos.length > 0 && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-violet-400 bg-violet-500/10 border border-violet-500/20 rounded-lg px-2 py-0.5">
                      <FiImage size={9} /> {task.completionPhotos.length}
                    </span>
                  )}
                  {isExpanded ? <FiChevronUp className="text-slate-500" size={14} /> : <FiChevronDown className="text-slate-500" size={14} />}
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-slate-800/40 p-5 bg-slate-900/30 space-y-4">
                  {/* Description */}
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Description</p>
                    <p className="text-xs text-slate-300 leading-relaxed">{task.description || 'No description'}</p>
                  </div>

                  {/* Task details grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-slate-800/40 rounded-lg p-2.5">
                      <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Worker</p>
                      <p className="text-xs text-slate-200 font-semibold mt-0.5">{task.workerName}</p>
                    </div>
                    <div className="bg-slate-800/40 rounded-lg p-2.5">
                      <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Location</p>
                      <p className="text-xs text-slate-200 font-semibold mt-0.5">{task.location}</p>
                    </div>
                    <div className="bg-slate-800/40 rounded-lg p-2.5">
                      <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Assigned</p>
                      <p className="text-xs text-slate-200 font-semibold mt-0.5">{formatDate(task.assignedAt)}</p>
                    </div>
                    <div className="bg-slate-800/40 rounded-lg p-2.5">
                      <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Completed</p>
                      <p className="text-xs text-slate-200 font-semibold mt-0.5">{task.completedAt ? formatDate(task.completedAt) : '—'}</p>
                    </div>
                  </div>

                  {/* Map Section */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                        <FiMapPin size={10} /> Task Location Map
                      </p>
                      <a
                        href={getDirectionsUrl(task)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-[10px] font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
                      >
                        <FiExternalLink size={10} /> Open in Google Maps
                      </a>
                    </div>
                    <div className="rounded-xl overflow-hidden border border-slate-700/40 bg-slate-800/30" style={{ height: '200px' }}>
                      <iframe
                        src={getMapUrl(task)}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title={`Map: ${task.location}`}
                      />
                    </div>
                  </div>

                  {/* Completion Note */}
                  {task.completionNote && (
                    <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-3">
                      <p className="text-[10px] font-bold text-emerald-400 mb-1">Worker's Note</p>
                      <p className="text-xs text-slate-300">{task.completionNote}</p>
                    </div>
                  )}

                  {/* Completion Photos — Admin Review */}
                  {task.completionPhotos && task.completionPhotos.length > 0 && (
                    <div className={`border rounded-xl p-4 ${task.status === 'completed' && task.approved === null ? 'border-amber-500/30 bg-amber-500/5' : 'border-slate-700/30 bg-slate-800/20'}`}>
                      <p className="text-[10px] font-bold uppercase tracking-wider mb-2 flex items-center gap-1 ${task.status === 'completed' && task.approved === null ? 'text-amber-400' : 'text-slate-500'}">
                        <FiImage size={10} /> Worker's Completion Photos {task.status === 'completed' && task.approved === null && '— Review Required'}
                      </p>
                      <div className="flex gap-3 flex-wrap">
                        {task.completionPhotos.map((url, i) => (
                          <button
                            key={i}
                            onClick={() => setPhotoViewer({ photos: task.completionPhotos, index: i })}
                            className="w-28 h-28 rounded-xl overflow-hidden border-2 border-slate-700/50 hover:border-cyan-500/50 transition-colors bg-slate-800/60 group"
                          >
                            <img
                              src={`http://localhost:8000${url}`}
                              alt={`completion-${i + 1}`}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          </button>
                        ))}
                      </div>

                      {/* Approve / Reject buttons */}
                      {task.status === 'completed' && task.approved === null && (
                        <div className="flex gap-3 mt-4 pt-3 border-t border-slate-700/20">
                          <button
                            onClick={() => approveTask(task.id)}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white text-xs font-bold hover:shadow-lg hover:shadow-emerald-500/25 transition-all"
                          >
                            <FiThumbsUp size={13} /> Approve Work
                          </button>
                          <button
                            onClick={() => rejectTask(task.id)}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 text-white text-xs font-bold hover:shadow-lg hover:shadow-red-500/25 transition-all"
                          >
                            <FiThumbsDown size={13} /> Reject & Reassign
                          </button>
                        </div>
                      )}

                      {task.approved === true && (
                        <div className="mt-3 flex items-center gap-2 text-[10px] font-bold text-emerald-400">
                          <FiCheckCircle size={12} /> Work approved {task.approvedAt ? `on ${formatDate(task.approvedAt)}` : ''}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Linked complaint */}
                  {task.complaintId && (
                    <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-xl p-3">
                      <p className="text-[10px] font-bold text-cyan-400 mb-1">Linked Complaint #{task.complaintId}</p>
                      {(() => {
                        const c = complaints.find(x => x.id === task.complaintId);
                        return c ? (
                          <div className="flex items-center gap-3 text-[10px] text-slate-400">
                            <span>{c.description}</span>
                            <StatusBadge status={c.status} />
                          </div>
                        ) : <p className="text-[10px] text-slate-500">Complaint details loading...</p>;
                      })()}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="card p-12 text-center">
            <FiClipboard size={32} className="mx-auto text-slate-700 mb-2" />
            <p className="text-slate-500 text-sm">No tasks found</p>
            <p className="text-[10px] text-slate-600 mt-1">Click "Assign Task" to create one</p>
          </div>
        )}
      </div>

      {/* Assign Task Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-700/60 rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-slate-800/60">
              <h3 className="text-lg font-bold text-white flex items-center gap-2" style={{ fontFamily: 'var(--font-display)' }}>
                <FiPlus className="text-cyan-400" /> Assign New Task
              </h3>
              <button onClick={() => setShowAssignModal(false)} className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 flex items-center justify-center">
                <FiX size={16} />
              </button>
            </div>
            <form onSubmit={handleAssign} className="p-5 space-y-4">
              {/* Link to complaint */}
              <div>
                <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Link to Complaint (optional)</label>
                <select
                  value={newTask.complaint_id}
                  onChange={(e) => handleComplaintSelect(e.target.value)}
                  className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl px-4 py-3 text-sm text-slate-200 outline-none focus:border-cyan-500/50 transition-colors"
                >
                  <option value="">— None —</option>
                  {complaints.filter(c => c.status !== 'resolved').map(c => (
                    <option key={c.id} value={c.id}>#{c.id} — {c.location}: {c.description.substring(0, 40)}...</option>
                  ))}
                </select>
              </div>

              {/* Worker */}
              <div>
                <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Assign to Worker *</label>
                <select
                  value={newTask.worker_id}
                  onChange={(e) => setNewTask(prev => ({ ...prev, worker_id: e.target.value }))}
                  className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl px-4 py-3 text-sm text-slate-200 outline-none focus:border-cyan-500/50 transition-colors"
                  required
                >
                  <option value="">Select worker...</option>
                  {workers.map(w => <option key={w.id} value={w.id}>{w.name} ({w.email})</option>)}
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Task Title *</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. Clear garbage at Market Yard"
                  className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 outline-none focus:border-cyan-500/50 transition-colors"
                  required
                />
              </div>

              {/* Location */}
              <div>
                <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Location *</label>
                <div className="flex items-center bg-slate-800/60 border border-slate-700/50 rounded-xl px-4 py-3 gap-3 focus-within:border-cyan-500/50 transition-colors">
                  <FiMapPin className="text-slate-500" size={14} />
                  <input
                    type="text"
                    value={newTask.location}
                    onChange={(e) => setNewTask(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Enter location..."
                    className="bg-transparent text-sm text-slate-200 placeholder-slate-600 outline-none w-full"
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Description</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the task..."
                  rows={3}
                  className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 outline-none resize-none focus:border-cyan-500/50 transition-colors"
                />
              </div>

              {/* Priority */}
              <div>
                <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Priority</label>
                <div className="flex gap-2">
                  {['low', 'medium', 'high', 'urgent'].map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setNewTask(prev => ({ ...prev, priority: p }))}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border ${
                        newTask.priority === p
                          ? priorityColors[p].badge + ' ' + priorityColors[p].text + ' ' + priorityColors[p].border
                          : 'bg-slate-800/30 text-slate-500 border-slate-700/30'
                      }`}
                    >
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 text-white text-sm font-bold hover:shadow-lg hover:shadow-cyan-500/25 transition-all flex items-center justify-center gap-2"
              >
                <FiSend size={14} /> Assign Task
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Photo Viewer Modal */}
      {photoViewer && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setPhotoViewer(null)}>
          <div className="max-w-3xl max-h-[80vh] w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-end mb-2">
              <button onClick={() => setPhotoViewer(null)} className="w-8 h-8 rounded-lg bg-slate-800/80 text-slate-400 flex items-center justify-center hover:bg-slate-700">
                <FiX size={16} />
              </button>
            </div>
            <img
              src={`http://localhost:8000${photoViewer.photos[photoViewer.index]}`}
              alt="Completion photo"
              className="w-full rounded-2xl border border-slate-700/60 shadow-2xl"
            />
            {photoViewer.photos.length > 1 && (
              <div className="flex gap-2 mt-3 justify-center">
                {photoViewer.photos.map((url, i) => (
                  <button
                    key={i}
                    onClick={() => setPhotoViewer(prev => ({ ...prev, index: i }))}
                    className={`w-14 h-14 rounded-lg overflow-hidden border-2 ${i === photoViewer.index ? 'border-cyan-500' : 'border-slate-700/50'}`}
                  >
                    <img src={`http://localhost:8000${url}`} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Worker Modal */}
      {showWorkerModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-700/60 rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-slate-800/60">
              <h3 className="text-lg font-bold text-white flex items-center gap-2" style={{ fontFamily: 'var(--font-display)' }}>
                <FiUserPlus className="text-emerald-400" /> Add New Worker
              </h3>
              <button onClick={() => { setShowWorkerModal(false); setWorkerError(''); }} className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 flex items-center justify-center">
                <FiX size={16} />
              </button>
            </div>
            <form onSubmit={handleAddWorker} className="p-5 space-y-4">
              {workerError && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5">
                  <p className="text-xs text-red-400 font-medium">{workerError}</p>
                </div>
              )}

              {/* Name */}
              <div>
                <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Full Name *</label>
                <div className="flex items-center bg-slate-800/60 border border-slate-700/50 rounded-xl px-4 py-3 gap-3 focus-within:border-emerald-500/50 transition-colors">
                  <FiUser className="text-slate-500" size={14} />
                  <input
                    type="text"
                    value={newWorker.name}
                    onChange={(e) => setNewWorker(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Rahul Jadhav"
                    className="bg-transparent text-sm text-slate-200 placeholder-slate-600 outline-none w-full"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Email (Login ID) *</label>
                <div className="flex items-center bg-slate-800/60 border border-slate-700/50 rounded-xl px-4 py-3 gap-3 focus-within:border-emerald-500/50 transition-colors">
                  <FiMail className="text-slate-500" size={14} />
                  <input
                    type="email"
                    value={newWorker.email}
                    onChange={(e) => setNewWorker(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="e.g. worker3@cleanify.com"
                    className="bg-transparent text-sm text-slate-200 placeholder-slate-600 outline-none w-full"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Password *</label>
                <div className="flex items-center bg-slate-800/60 border border-slate-700/50 rounded-xl px-4 py-3 gap-3 focus-within:border-emerald-500/50 transition-colors">
                  <FiLock className="text-slate-500" size={14} />
                  <input
                    type="text"
                    value={newWorker.password}
                    onChange={(e) => setNewWorker(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Set a password"
                    className="bg-transparent text-sm text-slate-200 placeholder-slate-600 outline-none w-full"
                    required
                  />
                </div>
                <p className="text-[10px] text-slate-600 mt-1">Worker will use this email & password to log in</p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={creatingWorker}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-bold hover:shadow-lg hover:shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {creatingWorker ? 'Creating...' : <><FiUserPlus size={14} /> Create Worker Account</>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assignments;
