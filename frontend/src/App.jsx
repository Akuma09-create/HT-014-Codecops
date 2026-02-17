// App router — defines all application routes
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
        <Route path="/login" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/bins" element={<BinManagement />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/assignments" element={<Assignments />} />
          <Route path="/complaints" element={<Complaints />} />
          <Route path="/analytics" element={<Analytics />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
