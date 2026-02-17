// Top navigation bar with logo, search, and user controls
import { FiMenu, FiSearch, FiBell } from 'react-icons/fi';

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

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
        <button className="relative p-2 text-slate-400 hover:text-cyan-400 transition-colors">
          <FiBell size={18} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-cyan-500 rounded-full"></span>
        </button>
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
