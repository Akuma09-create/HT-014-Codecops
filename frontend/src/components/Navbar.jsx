// Top navigation bar with logo, search, notifications, and user controls
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiBell, FiX, FiAlertTriangle, FiCheckCircle, FiClock, FiMessageSquare, FiTrash2 } from 'react-icons/fi';
import api from '../api';

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const navigate = useNavigate();
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setShowNotifs(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch notifications when dropdown opens
  useEffect(() => {
    if (!showNotifs) return;
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const notifs = [];

        if (user.role === 'citizen') {
          // Citizen: fetch their complaints for status updates
          const res = await api.get('/api/complaints/');
          const complaints = res.data;
          complaints.forEach((c) => {
            if (c.linkedTask && c.linkedTask.approved === true) {
              notifs.push({
                id: `task-approved-${c.id}`,
                type: 'success',
                title: 'Complaint Resolved',
                message: `Your complaint at "${c.location}" has been resolved by ${c.linkedTask.workerName}.`,
                time: c.linkedTask.completedAt || c.createdAt,
              });
            } else if (c.linkedTask && c.linkedTask.status === 'in_progress') {
              notifs.push({
                id: `task-progress-${c.id}`,
                type: 'info',
                title: 'Work In Progress',
                message: `${c.linkedTask.workerName} is working on your complaint at "${c.location}".`,
                time: c.createdAt,
              });
            }
            if (c.response) {
              notifs.push({
                id: `response-${c.id}`,
                type: 'message',
                title: 'Admin Response',
                message: `Response on "${c.location}": ${c.response.length > 60 ? c.response.slice(0, 60) + '...' : c.response}`,
                time: c.createdAt,
              });
            }
          });
        } else {
          // Admin & Worker: fetch alerts
          try {
            const alertRes = await api.get('/api/alerts/');
            alertRes.data.slice(0, 10).forEach((a) => {
              notifs.push({
                id: `alert-${a.id}`,
                type: a.status === 'resolved' ? 'success' : 'warning',
                title: a.status === 'resolved' ? 'Alert Resolved' : 'Bin Alert',
                message: a.message || `Bin #${a.binId} overflow alert at ${a.location || 'unknown location'}`,
                time: a.createdAt,
              });
            });
          } catch {}

          // Admin: also show recent complaints
          if (user.role === 'admin') {
            try {
              const compRes = await api.get('/api/complaints/');
              compRes.data.slice(0, 5).forEach((c) => {
                if (c.status === 'pending') {
                  notifs.push({
                    id: `complaint-${c.id}`,
                    type: 'warning',
                    title: 'New Complaint',
                    message: `${c.userName}: "${c.description.length > 50 ? c.description.slice(0, 50) + '...' : c.description}"`,
                    time: c.createdAt,
                  });
                }
              });
            } catch {}
          }
        }

        // Sort by time descending
        notifs.sort((a, b) => new Date(b.time) - new Date(a.time));
        setNotifications(notifs);
      } catch {
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [showNotifs]);

  const unreadCount = notifications.length;

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <FiCheckCircle className="text-emerald-400" size={16} />;
      case 'warning': return <FiAlertTriangle className="text-amber-400" size={16} />;
      case 'message': return <FiMessageSquare className="text-cyan-400" size={16} />;
      default: return <FiClock className="text-blue-400" size={16} />;
    }
  };

  const formatTime = (t) => {
    if (!t) return '';
    const d = new Date(t);
    const now = new Date();
    const diff = Math.floor((now - d) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return d.toLocaleDateString();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-[60px] bg-[#0f172a]/90 backdrop-blur-xl border-b border-slate-800/60 z-50 flex items-center justify-between px-6">
      {/* Left — Logo */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
          <span className="text-white text-sm font-black">C</span>
        </div>
        <span className="text-lg font-extrabold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
          <span className="text-accent">Cleanify</span>
        </span>
      </div>

      {/* Center — Search */}
      <div className="hidden md:flex items-center bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-2 w-80 gap-2">
        <FiSearch className="text-slate-500" size={14} />
        <input
          type="text"
          placeholder="Search bins, alerts..."
          className="bg-transparent text-sm text-slate-300 placeholder-slate-500 outline-none w-full"
        />
      </div>

      {/* Right — User */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <div className="relative" ref={panelRef}>
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="relative p-2 text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <FiBell size={18} />
            {!showNotifs && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></span>
            )}
          </button>

          {/* Notification Dropdown */}
          {showNotifs && (
            <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-[#111827] border border-slate-700/60 rounded-2xl shadow-2xl shadow-black/40 overflow-hidden z-[100]">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/60">
                <h3 className="text-sm font-bold text-slate-200" style={{ fontFamily: 'var(--font-display)' }}>
                  Notifications
                </h3>
                <button onClick={() => setShowNotifs(false)} className="text-slate-500 hover:text-slate-300 transition-colors">
                  <FiX size={16} />
                </button>
              </div>

              {/* Body */}
              <div className="max-h-80 overflow-y-auto scrollbar-thin">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="py-10 text-center">
                    <FiBell className="mx-auto text-slate-600 mb-2" size={24} />
                    <p className="text-xs text-slate-500">No notifications yet</p>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className="flex gap-3 px-4 py-3 border-b border-slate-800/40 hover:bg-slate-800/30 transition-colors cursor-pointer"
                    >
                      <div className="mt-0.5 shrink-0">{getIcon(n.type)}</div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-slate-200">{n.title}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{n.message}</p>
                        <p className="text-[10px] text-slate-600 mt-1">{formatTime(n.time)}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="px-4 py-2.5 border-t border-slate-800/60 text-center">
                  <button
                    onClick={() => { setShowNotifs(false); setNotifications([]); }}
                    className="text-[10px] font-semibold text-slate-500 hover:text-cyan-400 transition-colors flex items-center gap-1 mx-auto"
                  >
                    <FiTrash2 size={10} /> Clear all
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold">
            {user.name?.charAt(0) || 'U'}
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-semibold text-slate-200">{user.name || 'User'}</p>
            <p className="text-[10px] text-slate-500 capitalize">{user.role || 'guest'}</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-[10px] text-slate-500 hover:text-red-400 transition-colors ml-2 font-semibold"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
