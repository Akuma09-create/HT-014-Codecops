import { FiMenu, FiBell, FiUser } from 'react-icons/fi';
import { RiRecycleLine } from 'react-icons/ri';

const Navbar = ({ toggleSidebar }) => {
  return (
    <nav className="bg-white border-b border-green-100 shadow-sm px-4 py-3 flex items-center justify-between fixed top-0 left-0 right-0 z-30">
      {/* Left: Menu + Logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-green-50 text-gray-600 lg:hidden transition-colors"
        >
          <FiMenu size={22} />
        </button>
        <div className="flex items-center gap-2">
          <div className="bg-green-600 text-white p-2 rounded-xl">
            <RiRecycleLine size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-green-700 leading-tight">Cleanify</h1>
            <p className="text-[10px] text-gray-400 leading-none">Smart Waste Management</p>
          </div>
        </div>
      </div>

      {/* Right: Notifications + Profile */}
      <div className="flex items-center gap-2">
        <button className="relative p-2 rounded-lg hover:bg-green-50 text-gray-600 transition-colors">
          <FiBell size={20} />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <FiUser size={16} className="text-green-700" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-700">Admin</p>
            <p className="text-xs text-gray-400">Municipal</p>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
