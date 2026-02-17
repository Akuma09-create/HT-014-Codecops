import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import BinManagement from './pages/BinManagement';
import Alerts from './pages/Alerts';
import Assignments from './pages/Assignments';
import Complaints from './pages/Complaints';
import Analytics from './pages/Analytics';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />

        {/* Protected (layout with sidebar) */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/bins" element={<BinManagement />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/assignments" element={<Assignments />} />
          <Route path="/complaints" element={<Complaints />} />
          <Route path="/analytics" element={<Analytics />} />
        </Route>

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
