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
  { path: '/assignments', label: 'Route Assignment', icon: FiTruck },
  { path: '/complaints', label: 'Complaints', icon: FiMessageSquare },
  { path: '/analytics', label: 'Analytics', icon: FiBarChart2 },
];

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-[65px] left-0 h-[calc(100vh-65px)] w-64 bg-white border-r border-green-100 shadow-sm z-40 
          transform transition-transform duration-200 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
          lg:translate-x-0`}
      >
        {/* Close button - mobile */}
        <div className="flex justify-end p-2 lg:hidden">
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-lg hover:bg-green-50 text-gray-500"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Menu */}
        <nav className="px-3 py-4 space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => {
                if (window.innerWidth < 1024) toggleSidebar();
              }}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150
                ${
                  isActive
                    ? 'bg-green-600 text-white shadow-md shadow-green-200'
                    : 'text-gray-600 hover:bg-green-50 hover:text-green-700'
                }`
              }
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-6 left-0 right-0 px-5">
          <div className="bg-green-50 rounded-xl p-4 text-center">
            <p className="text-xs text-green-700 font-medium">🌿 Cleanify v1.0</p>
            <p className="text-[10px] text-green-500 mt-1">Making cities cleaner</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
