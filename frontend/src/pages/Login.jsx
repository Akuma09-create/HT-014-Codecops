// Login page — authentication with demo quick-login buttons
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.access_token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const demoAccounts = [
    { label: 'Admin', email: 'admin@cleanify.com', password: 'admin123' },
    { label: 'Worker', email: 'worker1@cleanify.com', password: 'worker123' },
    { label: 'Citizen', email: 'citizen@cleanify.com', password: 'citizen123' },
  ];

  return (
    <div className="min-h-screen bg-[#0b1120] grid-pattern flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-600 mx-auto mb-4 flex items-center justify-center shadow-lg shadow-cyan-500/25">
            <span className="text-white text-2xl font-black">C</span>
          </div>
          <h1 className="text-3xl font-extrabold text-accent" style={{ fontFamily: 'var(--font-display)' }}>Cleanify</h1>
          <p className="text-sm text-slate-500 mt-1">Smart City Waste Management System</p>
        </div>

        {/* Form Card */}
        <div className="card p-8">
          <h2 className="text-lg font-bold text-slate-200 mb-6" style={{ fontFamily: 'var(--font-display)' }}>Sign in to your account</h2>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-4">
              <p className="text-xs text-red-400 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Email</label>
              <div className="flex items-center bg-slate-800/60 border border-slate-700/50 rounded-xl px-4 py-3 gap-3 focus-within:border-cyan-500/50 transition-colors">
                <FiMail className="text-slate-500" size={15} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@cleanify.com"
                  className="bg-transparent text-sm text-slate-200 placeholder-slate-600 outline-none w-full"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Password</label>
              <div className="flex items-center bg-slate-800/60 border border-slate-700/50 rounded-xl px-4 py-3 gap-3 focus-within:border-cyan-500/50 transition-colors">
                <FiLock className="text-slate-500" size={15} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="bg-transparent text-sm text-slate-200 placeholder-slate-600 outline-none w-full"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 text-white text-sm font-bold hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
              {!loading && <FiArrowRight size={15} />}
            </button>
          </form>

          {/* Demo Accounts */}
          <div className="mt-6 pt-5 border-t border-slate-800/60">
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-3">Quick Login</p>
            <div className="grid grid-cols-3 gap-2">
              {demoAccounts.map((acc) => (
                <button
                  key={acc.label}
                  onClick={() => { setEmail(acc.email); setPassword(acc.password); }}
                  className="py-2 px-3 rounded-lg bg-slate-800/40 border border-slate-700/40 text-[11px] font-semibold text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all"
                >
                  {acc.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
