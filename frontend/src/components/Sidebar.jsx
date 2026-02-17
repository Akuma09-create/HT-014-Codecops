import { NavLink } from 'react-router-dom';
import {
  FiGrid,
  FiTrash2,
  FiAlertTriangle,
  FiTruck,
  FiMessageSquare,
  FiBarChart2,
  FiX,
} from 'react-icons/fi';

const menuItems = [
  { path: '/dashboard', label: 'Dashboard', icon: FiGrid },
  { path: '/bins', label: 'Bin Management', icon: FiTrash2 },
  { path: '/alerts', label: 'Alerts', icon: FiAlertTriangle },
  { path: '/assignments', label: 'Assignments', icon: FiTruck },
  { path: '/complaints', label: 'Complaints', icon: FiMessageSquare },
  { path: '/analytics', label: 'Analytics', icon: FiBarChart2 },
];

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={toggleSidebar} />
      )}

      <aside
        className={`fixed top-[60px] left-0 h-[calc(100vh-60px)] w-[240px] bg-[#0f172a] border-r border-slate-800 z-40
          transform transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        <div className="flex justify-end p-2 lg:hidden">
          <button onClick={toggleSidebar} className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-all">
            <FiX size={18} />
          </button>
        </div>

        <nav className="px-3 py-4">
          <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest px-3 mb-3">Navigation</p>
          <div className="space-y-0.5">
            {menuItems.map((item, index) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => { if (window.innerWidth < 1024) toggleSidebar(); }}
                style={{ animationDelay: `${index * 0.04}s` }}
                className="animate-fade-in-left block"
              >
                {({ isActive }) => (
                  <div
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-200
                    ${isActive
                      ? 'bg-cyan-500/10 text-cyan-400 border-l-2 border-cyan-400'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    <item.icon size={16} className={isActive ? 'text-cyan-400' : ''} />
                    <span>{item.label}</span>
                  </div>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

        <div className="absolute bottom-4 left-0 right-0 px-4">
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-center">
            <p className="text-[11px] text-slate-400 font-semibold">Cleanify v1.0</p>
            <p className="text-[10px] text-slate-600 mt-0.5">Smart Waste Platform</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
