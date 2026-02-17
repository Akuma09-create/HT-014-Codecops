// Register page — citizen self-registration
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { FiMail, FiLock, FiUser, FiArrowRight, FiCheckCircle } from 'react-icons/fi';

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 4) {
      setError('Password must be at least 4 characters');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/api/auth/register', { name, email, password });
      localStorage.setItem('token', res.data.access_token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/complaints');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

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
          <h2 className="text-lg font-bold text-slate-200 mb-1" style={{ fontFamily: 'var(--font-display)' }}>Create your account</h2>
          <p className="text-xs text-slate-500 mb-6">Register as a citizen to report complaints & earn rewards</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-4">
              <p className="text-xs text-red-400 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Full Name</label>
              <div className="flex items-center bg-slate-800/60 border border-slate-700/50 rounded-xl px-4 py-3 gap-3 focus-within:border-cyan-500/50 transition-colors">
                <FiUser className="text-slate-500" size={15} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="bg-transparent text-sm text-slate-200 placeholder-slate-600 outline-none w-full"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Email</label>
              <div className="flex items-center bg-slate-800/60 border border-slate-700/50 rounded-xl px-4 py-3 gap-3 focus-within:border-cyan-500/50 transition-colors">
                <FiMail className="text-slate-500" size={15} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
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
                  placeholder="Create a password"
                  className="bg-transparent text-sm text-slate-200 placeholder-slate-600 outline-none w-full"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Confirm Password</label>
              <div className="flex items-center bg-slate-800/60 border border-slate-700/50 rounded-xl px-4 py-3 gap-3 focus-within:border-cyan-500/50 transition-colors">
                <FiCheckCircle className="text-slate-500" size={15} />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
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
              {loading ? 'Creating account...' : 'Register'}
              {!loading && <FiArrowRight size={15} />}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 pt-5 border-t border-slate-800/60 text-center">
            <p className="text-xs text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
