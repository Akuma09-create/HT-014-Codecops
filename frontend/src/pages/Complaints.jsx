// Complaints — citizen issue reporting with media upload & live location + admin management
import { useState, useEffect, useRef } from 'react';
import { FiMessageSquare, FiSend, FiUser, FiMapPin, FiClock, FiCornerDownRight, FiCamera, FiVideo, FiX, FiNavigation, FiImage } from 'react-icons/fi';
import StatusBadge from '../components/StatusBadge';
import api from '../api';

const Complaints = () => {
  const [allComplaints, setAllComplaints] = useState([]);
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [mediaFiles, setMediaFiles] = useState([]);      // { file, preview, type }
  const [mediaPreviews, setMediaPreviews] = useState([]); // preview URLs
  const [uploadedUrls, setUploadedUrls] = useState([]);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [respondingTo, setRespondingTo] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [responseStatus, setResponseStatus] = useState('in_progress');
  const fileInputRef = useRef(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await api.get('/api/complaints');
      setAllComplaints(res.data);
    } catch (err) {
      console.error('Failed to fetch complaints', err);
    }
  };

  // --- Media upload ---
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map(file => {
      const isVideo = file.type.startsWith('video/');
      return {
        file,
        preview: URL.createObjectURL(file),
        type: isVideo ? 'video' : 'image',
      };
    });
    setMediaFiles(prev => [...prev, ...newFiles]);
  };

  const removeMedia = (index) => {
    setMediaFiles(prev => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const uploadAllMedia = async () => {
    const urls = [];
    for (const m of mediaFiles) {
      const formData = new FormData();
      formData.append('file', m.file);
      try {
        const res = await api.post('/api/complaints/upload-media', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        urls.push(res.data.url);
      } catch (err) {
        console.error('Upload failed', err);
      }
    }
    return urls;
  };

  // --- Live location ---
  const shareLocation = () => {
    if (!navigator.geolocation) {
      setLocError('Geolocation is not supported by your browser');
      return;
    }
    setLocating(true);
    setLocError('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude);
        setLongitude(pos.coords.longitude);
        setLocating(false);
      },
      (err) => {
        setLocError('Unable to get location. Please allow location access.');
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const clearLocation = () => {
    setLatitude(null);
    setLongitude(null);
  };

  // --- Submit ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!location.trim() || !description.trim()) return;
    setSubmitting(true);
    try {
      // Upload media first
      const urls = mediaFiles.length > 0 ? await uploadAllMedia() : [];

      await api.post('/api/complaints', {
        location: location.trim(),
        description: description.trim(),
        latitude,
        longitude,
        media_urls: urls,
      });
      setLocation('');
      setDescription('');
      setMediaFiles([]);
      setLatitude(null);
      setLongitude(null);
      fetchComplaints();
    } catch (err) {
      console.error('Failed to submit complaint', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRespond = async (complaintId) => {
    if (!responseText.trim()) return;
    try {
      await api.post(`/api/complaints/${complaintId}/respond`, { response: responseText.trim(), status: responseStatus });
      setRespondingTo(null);
      setResponseText('');
      setResponseStatus('in_progress');
      fetchComplaints();
    } catch (err) {
      console.error('Failed to respond', err);
    }
  };

  const handleResolve = async (complaintId) => {
    try {
      await api.post(`/api/complaints/${complaintId}/resolve`);
      fetchComplaints();
    } catch (err) {
      console.error('Failed to resolve', err);
    }
  };

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in-up">
        <h2 className="text-2xl font-extrabold text-white flex items-center gap-3" style={{ fontFamily: 'var(--font-display)' }}>
          <span className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-red-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <FiMessageSquare size={20} className="text-white" />
          </span>
          {user.role === 'citizen' ? 'My Complaints' : 'Citizen Complaints'}
        </h2>
        <p className="text-sm text-slate-500 mt-1.5 ml-[52px]">{user.role === 'citizen' ? 'Report waste issues and track resolution' : 'Review, respond, and manage citizen complaints'}</p>
      </div>

      {/* Admin Summary Cards */}
      {user.role === 'admin' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
          {[
            { label: 'Total', value: allComplaints.length, gradient: 'from-cyan-500/15 to-cyan-500/5', border: 'border-cyan-500/20', color: 'text-cyan-400' },
            { label: 'Pending', value: allComplaints.filter(c => c.status === 'pending').length, gradient: 'from-amber-500/15 to-amber-500/5', border: 'border-amber-500/20', color: 'text-amber-400' },
            { label: 'In Progress', value: allComplaints.filter(c => c.status === 'in_progress').length, gradient: 'from-blue-500/15 to-blue-500/5', border: 'border-blue-500/20', color: 'text-blue-400' },
            { label: 'Resolved', value: allComplaints.filter(c => c.status === 'resolved').length, gradient: 'from-emerald-500/15 to-emerald-500/5', border: 'border-emerald-500/20', color: 'text-emerald-400' },
          ].map(({ label, value, gradient, border, color }) => (
            <div key={label} className={`bg-gradient-to-br ${gradient} border ${border} rounded-2xl p-4`}>
              <p className="text-2xl font-extrabold text-white" style={{ fontFamily: 'var(--font-display)' }}>{value}</p>
              <p className={`text-[10px] font-bold ${color}`}>{label}</p>
            </div>
          ))}
        </div>
      )}

      <div className={`grid grid-cols-1 ${user.role === 'citizen' ? 'lg:grid-cols-3' : ''} gap-5`}>
        {/* Submit Form — only for citizens */}
        {user.role === 'citizen' && (
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

            {/* Live Location */}
            <div>
              <button
                type="button"
                onClick={shareLocation}
                disabled={locating}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-cyan-500/30 text-cyan-400 text-xs font-bold hover:bg-cyan-500/5 transition-colors disabled:opacity-50"
              >
                <FiNavigation size={13} className={locating ? 'animate-pulse' : ''} />
                {locating ? 'Getting location...' : latitude ? 'Location shared ✓' : 'Share Live Location'}
              </button>
              {latitude && longitude && (
                <div className="mt-2 flex items-center justify-between bg-emerald-500/5 border border-emerald-500/20 rounded-lg px-3 py-2">
                  <span className="text-[10px] text-emerald-400 font-mono">{latitude.toFixed(6)}, {longitude.toFixed(6)}</span>
                  <button type="button" onClick={clearLocation} className="text-slate-500 hover:text-red-400"><FiX size={12} /></button>
                </div>
              )}
              {locError && <p className="text-[10px] text-red-400 mt-1">{locError}</p>}
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the issue..."
                rows={3}
                className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 outline-none resize-none focus:border-cyan-500/50 transition-colors"
                required
              />
            </div>

            {/* Media Upload */}
            <div>
              <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Photos / Videos</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
              <div className="flex gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-violet-500/30 text-violet-400 text-xs font-bold hover:bg-violet-500/5 transition-colors"
                >
                  <FiCamera size={13} /> Add Photo
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-violet-500/30 text-violet-400 text-xs font-bold hover:bg-violet-500/5 transition-colors"
                >
                  <FiVideo size={13} /> Add Video
                </button>
              </div>

              {/* Media previews */}
              {mediaFiles.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {mediaFiles.map((m, i) => (
                    <div key={i} className="relative rounded-lg overflow-hidden border border-slate-700/50 aspect-square bg-slate-800/60">
                      {m.type === 'image' ? (
                        <img src={m.preview} alt="preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FiVideo size={20} className="text-slate-400" />
                          <span className="text-[9px] text-slate-500 absolute bottom-1 left-1">Video</span>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => removeMedia(i)}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500/80 text-white flex items-center justify-center hover:bg-red-500"
                      >
                        <FiX size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 text-white text-sm font-bold hover:shadow-lg hover:shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : <><FiSend size={14} /> Submit Complaint</>}
            </button>

            {/* Points info */}
            {user.role === 'citizen' && (
              <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl px-3 py-2 text-center">
                <p className="text-[10px] font-bold text-amber-400">🏆 Earn Reward Points!</p>
                <p className="text-[9px] text-slate-500 mt-0.5">+50 for complaint · +20 for photo/video · +10 for location</p>
              </div>
            )}
          </form>
        </div>
        )}

        {/* Complaint List */}
        <div className={`${user.role === 'citizen' ? 'lg:col-span-2' : ''} space-y-3 animate-fade-in-up`} style={{ animationDelay: '0.2s' }}>
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

              {/* Location coordinates */}
              {c.latitude && c.longitude && (
                <div className="mt-2">
                  <a
                    href={`https://www.google.com/maps?q=${c.latitude},${c.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] font-bold text-cyan-400 hover:text-cyan-300 bg-cyan-500/5 border border-cyan-500/20 rounded-lg px-2 py-1"
                  >
                    <FiNavigation size={9} /> View on Map ({c.latitude.toFixed(4)}, {c.longitude.toFixed(4)})
                  </a>
                </div>
              )}

              {/* Media thumbnails */}
              {c.mediaUrls && c.mediaUrls.length > 0 && (
                <div className="mt-2 flex gap-2 flex-wrap">
                  {c.mediaUrls.map((url, i) => (
                    <a key={i} href={`http://localhost:8000${url}`} target="_blank" rel="noopener noreferrer"
                      className="w-16 h-16 rounded-lg overflow-hidden border border-slate-700/50 bg-slate-800/60 flex items-center justify-center hover:border-cyan-500/50 transition-colors">
                      {url.match(/\.(mp4|webm|mov)$/i) ? (
                        <FiVideo size={16} className="text-slate-400" />
                      ) : (
                        <img src={`http://localhost:8000${url}`} alt="evidence" className="w-full h-full object-cover" />
                      )}
                    </a>
                  ))}
                </div>
              )}

              {/* Show response if exists */}
              {c.response && (
                <div className="mt-3 p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/20">
                  <p className="text-[10px] font-bold text-cyan-400 mb-1 flex items-center gap-1"><FiCornerDownRight size={10} /> Admin Response</p>
                  <p className="text-xs text-slate-300">{c.response}</p>
                </div>
              )}

              {/* Admin actions */}
              {user.role === 'admin' && c.status !== 'resolved' && (
                <div className="mt-3 flex items-center gap-2">
                  {respondingTo === c.id ? (
                    <div className="w-full space-y-2">
                      <textarea
                        value={responseText}
                        onChange={(e) => setResponseText(e.target.value)}
                        placeholder="Type your response..."
                        rows={2}
                        className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-600 outline-none resize-none focus:border-cyan-500/50"
                      />
                      <div className="flex items-center gap-2">
                        <select
                          value={responseStatus}
                          onChange={(e) => setResponseStatus(e.target.value)}
                          className="bg-slate-800/60 border border-slate-700/50 rounded-lg px-2 py-1.5 text-xs text-slate-300 outline-none"
                        >
                          <option value="in_progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                        </select>
                        <button onClick={() => handleRespond(c.id)} className="px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 text-xs font-bold hover:bg-cyan-500/30 transition-colors">Send</button>
                        <button onClick={() => setRespondingTo(null)} className="px-3 py-1.5 rounded-lg bg-slate-700/50 text-slate-400 text-xs font-bold hover:bg-slate-700 transition-colors">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <button onClick={() => setRespondingTo(c.id)} className="px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[11px] font-bold hover:bg-cyan-500/20 transition-colors">Respond</button>
                      <button onClick={() => handleResolve(c.id)} className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold hover:bg-emerald-500/20 transition-colors">Resolve</button>
                    </>
                  )}
                </div>
              )}
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
