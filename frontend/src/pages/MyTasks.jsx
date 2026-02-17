// MyTasks — Worker view: see assigned tasks, upload completion photos, start/complete tasks with embedded map
import { useState, useEffect, useRef } from 'react';
import { FiClipboard, FiMapPin, FiClock, FiCamera, FiCheck, FiPlay, FiImage, FiX, FiUpload, FiAlertTriangle, FiChevronDown, FiChevronUp, FiExternalLink, FiCheckCircle } from 'react-icons/fi';
import api from '../api';

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [expandedTask, setExpandedTask] = useState(null);
  const [filter, setFilter] = useState('all');
  const [uploading, setUploading] = useState(null);
  const [photoViewer, setPhotoViewer] = useState(null);
  const fileInputRef = useRef(null);
  const [activeUploadTaskId, setActiveUploadTaskId] = useState(null);

  useEffect(() => { fetchTasks(); }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get('/api/tasks');
      setTasks(res.data);
    } catch (err) { console.error(err); }
  };

  const startTask = async (taskId) => {
    try {
      await api.post(`/api/tasks/${taskId}/start`);
      fetchTasks();
    } catch (err) { console.error(err); }
  };

  const completeTask = async (taskId) => {
    try {
      await api.post(`/api/tasks/${taskId}/complete`);
      fetchTasks();
    } catch (err) { console.error(err); }
  };

  const handlePhotoUpload = async (taskId, file) => {
    setUploading(taskId);
    try {
      const formData = new FormData();
      formData.append('file', file);
      await api.post(`/api/tasks/${taskId}/upload-photo`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      fetchTasks();
    } catch (err) { console.error(err); }
    setUploading(null);
  };

  const triggerFileInput = (taskId) => {
    setActiveUploadTaskId(taskId);
    setTimeout(() => fileInputRef.current?.click(), 50);
  };

  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && activeUploadTaskId) {
      handlePhotoUpload(activeUploadTaskId, file);
    }
    e.target.value = '';
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
    urgent: { bg: 'bg-red-500/15', border: 'border-red-500/25', text: 'text-red-400', badge: 'bg-red-500/20', glow: 'shadow-red-500/10' },
    high: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400', badge: 'bg-amber-500/20', glow: 'shadow-amber-500/10' },
    medium: { bg: 'bg-blue-500/8', border: 'border-blue-500/15', text: 'text-blue-400', badge: 'bg-blue-500/20', glow: 'shadow-blue-500/10' },
    low: { bg: 'bg-slate-800/30', border: 'border-slate-700/30', text: 'text-slate-400', badge: 'bg-slate-700/50', glow: '' },
  };

  const statusColors = {
    pending: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
    in_progress: 'bg-blue-500/15 text-blue-400 border-blue-500/25',
    completed: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
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

  return (
    <div className="space-y-6">
      {/* Hidden file input */}
      <input ref={fileInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={onFileChange} />

      {/* Header */}
      <div className="animate-fade-in-up">
        <h2 className="text-2xl font-extrabold text-white flex items-center gap-3" style={{ fontFamily: 'var(--font-display)' }}>
          <span className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <FiClipboard size={20} className="text-white" />
          </span>
          My Tasks
        </h2>
        <p className="text-sm text-slate-500 mt-1 ml-[52px]">View your assignments, upload work photos & track progress</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
        {[
          { label: 'Pending', value: pendingCount, color: 'text-amber-400', bg: 'from-amber-500/15 to-amber-500/5', border: 'border-amber-500/20', icon: FiClock },
          { label: 'In Progress', value: inProgressCount, color: 'text-blue-400', bg: 'from-blue-500/15 to-blue-500/5', border: 'border-blue-500/20', icon: FiPlay },
          { label: 'Completed', value: completedCount, color: 'text-emerald-400', bg: 'from-emerald-500/15 to-emerald-500/5', border: 'border-emerald-500/20', icon: FiCheck },
        ].map(({ label, value, color, bg, border, icon: Icon }) => (
          <div key={label} className={`bg-gradient-to-br ${bg} border ${border} rounded-2xl p-4 flex items-center gap-3`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color} bg-white/5`}>
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
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : 'bg-slate-800/40 text-slate-400 border border-slate-700/40 hover:text-slate-300'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
        {filtered.map(task => {
          const pc = priorityColors[task.priority] || priorityColors.medium;
          const isExpanded = expandedTask === task.id;

          return (
            <div key={task.id} className={`card overflow-hidden border ${pc.border} ${pc.bg} ${pc.glow ? 'shadow-lg ' + pc.glow : ''}`}>
              {/* Task Header - clickable */}
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
                      <span className="flex items-center gap-1"><FiMapPin size={9} /> {task.location}</span>
                      <span className="flex items-center gap-1"><FiClock size={9} /> {formatDate(task.assignedAt)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 ml-3">
                  {/* Approval status */}
                  {task.status === 'completed' && task.approved === true && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-2 py-0.5">
                      <FiCheckCircle size={9} /> Approved
                    </span>
                  )}
                  {task.status === 'completed' && task.approved === null && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-lg px-2 py-0.5">
                      <FiClock size={9} /> Pending Review
                    </span>
                  )}
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${statusColors[task.status]}`}>
                    {task.status.replace('_', ' ')}
                  </span>
                  {task.completionPhotos?.length > 0 && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-violet-400 bg-violet-500/10 border border-violet-500/20 rounded-lg px-2 py-0.5">
                      <FiImage size={9} /> {task.completionPhotos.length}
                    </span>
                  )}
                  {isExpanded ? <FiChevronUp className="text-slate-500" size={14} /> : <FiChevronDown className="text-slate-500" size={14} />}
                </div>
              </button>

              {/* Expanded Detail */}
              {isExpanded && (
                <div className="border-t border-slate-800/40 bg-slate-900/30">
                  {/* Description & details */}
                  <div className="p-5 space-y-4">
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Description</p>
                      <p className="text-xs text-slate-300 leading-relaxed">{task.description || 'No description'}</p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div className="bg-slate-800/40 rounded-lg p-2.5">
                        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Priority</p>
                        <p className={`text-xs font-bold mt-0.5 ${pc.text}`}>{task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}</p>
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
                          <FiMapPin size={10} /> Task Location
                        </p>
                        <a
                          href={getDirectionsUrl(task)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-[10px] font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
                        >
                          <FiExternalLink size={10} /> Get Directions
                        </a>
                      </div>
                      <div className="rounded-xl overflow-hidden border border-slate-700/40 bg-slate-800/30" style={{ height: '220px' }}>
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
                      <p className="text-[10px] text-slate-600 mt-1 flex items-center gap-1">
                        <FiMapPin size={9} /> {task.location}
                        {task.latitude && task.longitude && (
                          <span className="text-emerald-500 ml-1">({task.latitude.toFixed(4)}, {task.longitude.toFixed(4)})</span>
                        )}
                      </p>
                    </div>

                    {/* Uploaded Photos */}
                    {task.completionPhotos?.length > 0 && (
                      <div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">My Uploaded Photos</p>
                        <div className="flex gap-3 flex-wrap">
                          {task.completionPhotos.map((url, i) => (
                            <button
                              key={i}
                              onClick={() => setPhotoViewer({ photos: task.completionPhotos, index: i })}
                              className="w-20 h-20 rounded-xl overflow-hidden border-2 border-slate-700/50 hover:border-emerald-500/50 transition-colors bg-slate-800/60 group"
                            >
                              <img
                                src={`http://localhost:8000${url}`}
                                alt={`work-${i + 1}`}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 flex-wrap pt-2">
                      {task.status === 'pending' && (
                        <button
                          onClick={() => startTask(task.id)}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-600 text-white text-xs font-bold hover:shadow-lg hover:shadow-blue-500/25 transition-all"
                        >
                          <FiPlay size={13} /> Start Task
                        </button>
                      )}

                      {(task.status === 'in_progress' || task.status === 'pending') && (
                        <button
                          onClick={() => triggerFileInput(task.id)}
                          disabled={uploading === task.id}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white text-xs font-bold hover:shadow-lg hover:shadow-violet-500/25 transition-all disabled:opacity-50"
                        >
                          {uploading === task.id ? (
                            <><span className="animate-spin">⏳</span> Uploading...</>
                          ) : (
                            <><FiCamera size={13} /> Upload Work Photo</>
                          )}
                        </button>
                      )}

                      {task.status === 'in_progress' && (
                        <button
                          onClick={() => completeTask(task.id)}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white text-xs font-bold hover:shadow-lg hover:shadow-emerald-500/25 transition-all"
                        >
                          <FiCheck size={13} /> Mark Complete
                        </button>
                      )}

                      {task.status === 'completed' && task.approved === null && (
                        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold">
                          <FiClock size={13} /> Awaiting admin approval...
                        </div>
                      )}

                      {task.status === 'completed' && task.approved === true && (
                        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
                          <FiCheckCircle size={13} /> Work approved by admin ✓
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="card p-12 text-center">
            <FiClipboard size={32} className="mx-auto text-slate-700 mb-2" />
            <p className="text-slate-500 text-sm">No tasks found</p>
            <p className="text-[10px] text-slate-600 mt-1">Tasks assigned by admin will appear here</p>
          </div>
        )}
      </div>

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
              alt="Work photo"
              className="w-full rounded-2xl border border-slate-700/60 shadow-2xl"
            />
            {photoViewer.photos.length > 1 && (
              <div className="flex gap-2 mt-3 justify-center">
                {photoViewer.photos.map((url, i) => (
                  <button
                    key={i}
                    onClick={() => setPhotoViewer(prev => ({ ...prev, index: i }))}
                    className={`w-14 h-14 rounded-lg overflow-hidden border-2 ${i === photoViewer.index ? 'border-emerald-500' : 'border-slate-700/50'}`}
                  >
                    <img src={`http://localhost:8000${url}`} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTasks;
