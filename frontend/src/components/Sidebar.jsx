// Sidebar navigation — role-based navigation links
import { NavLink } from 'react-router-dom';
import { FiGrid, FiTrash2, FiAlertTriangle, FiUsers, FiMessageSquare, FiBarChart2, FiInbox, FiCheckCircle, FiAward } from 'react-icons/fi';

const adminLinks = [
  { to: '/dashboard', icon: FiGrid, label: 'Dashboard' },
  { to: '/bins', icon: FiTrash2, label: 'Bins' },
  { to: '/alerts', icon: FiAlertTriangle, label: 'Alerts' },
  { to: '/assignments', icon: FiUsers, label: 'Assignments' },
  { to: '/complaints', icon: FiMessageSquare, label: 'Complaints' },
  { to: '/analytics', icon: FiBarChart2, label: 'Analytics' },
];

const citizenLinks = [
  { to: '/complaints', icon: FiMessageSquare, label: 'My Complaints' },
  { to: '/complaint-status', icon: FiCheckCircle, label: 'Complaint Status' },
  { to: '/responses', icon: FiInbox, label: 'Responses' },
  { to: '/rewards', icon: FiAward, label: 'Rewards' },
];

const Sidebar = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const links = user.role === 'citizen' ? citizenLinks : adminLinks;
  return (
    <aside className="fixed left-0 top-[60px] bottom-0 w-[240px] bg-[#0f172a] border-r border-slate-800/60 overflow-y-auto z-40">
      <div className="p-4 pt-6">
        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-4 px-3">Navigation</p>
        <nav className="space-y-1">
          {links.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                }`
              }
            >
              <Icon size={16} className="group-hover:scale-110 transition-transform" />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom info */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800/40">
        <div className="card-surface rounded-xl p-3">
          <p className="text-[10px] font-bold text-slate-500 mb-1">Cleanify v1.0.1</p>
          <p className="text-[10px] text-slate-600">Smart Waste Management</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
