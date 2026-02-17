import { FiMenu, FiBell, FiSearch, FiSettings } from 'react-icons/fi';
import { RiRecycleLine } from 'react-icons/ri';

const Navbar = ({ toggleSidebar }) => {
  return (
    <nav className="bg-[#0f172a]/90 backdrop-blur-md border-b border-slate-800 px-5 h-[60px] flex items-center justify-between fixed top-0 left-0 right-0 z-30 animate-fade-in-down">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 lg:hidden transition-all"
        >
          <FiMenu size={20} />
        </button>
        <div className="flex items-center gap-2.5">
          <div className="bg-cyan-500 p-2 rounded-xl animate-neon-pulse">
            <RiRecycleLine size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-accent leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
              Cleanify
            </h1>
            <p className="text-[9px] text-slate-500 uppercase tracking-[0.15em] font-semibold leading-none">
              Waste Management
            </p>
          </div>
        </div>
      </div>

      {/* Center Search */}
      <div className="hidden md:flex items-center flex-1 max-w-sm mx-8">
        <div className="relative w-full">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-9 pr-4 py-2 bg-slate-800/60 border border-slate-700 rounded-lg text-sm text-slate-300 placeholder:text-slate-500 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1.5">
        <button className="relative p-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-all">
          <FiBell size={17} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-cyan-400 rounded-full"></span>
        </button>
        <button className="p-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-all">
          <FiSettings size={17} />
        </button>
        <div className="flex items-center gap-2 ml-2 pl-3 border-l border-slate-700/60">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-violet-600 rounded-lg flex items-center justify-center text-xs font-bold text-white">
            A
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-semibold text-slate-200 leading-tight">Admin</p>
            <p className="text-[10px] text-slate-500 leading-tight">Municipal Corp</p>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
