// Layout wrapper — auth guard + sidebar + navbar shell
import { Outlet, Navigate } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = () => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen bg-[#0b1120] grid-pattern">
      <Navbar />
      <Sidebar />
      <main className="ml-[240px] mt-[60px] p-6 min-h-[calc(100vh-60px)]">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
