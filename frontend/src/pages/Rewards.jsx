// Rewards page — citizen points, levels, and history
import { useState, useEffect } from 'react';
import { FiAward, FiStar, FiTrendingUp, FiGift, FiZap } from 'react-icons/fi';
import api from '../api';

const levelColors = {
  Bronze: { bg: 'from-amber-900/40 to-amber-800/20', border: 'border-amber-600/30', text: 'text-amber-400', bar: 'bg-amber-500' },
  Silver: { bg: 'from-slate-500/30 to-slate-600/20', border: 'border-slate-400/30', text: 'text-slate-300', bar: 'bg-slate-400' },
  Gold: { bg: 'from-yellow-600/30 to-yellow-700/20', border: 'border-yellow-500/30', text: 'text-yellow-400', bar: 'bg-yellow-500' },
  Platinum: { bg: 'from-cyan-500/30 to-cyan-600/20', border: 'border-cyan-400/30', text: 'text-cyan-300', bar: 'bg-cyan-400' },
};

const milestones = [
  { level: 'Bronze', min: 0, icon: '🥉' },
  { level: 'Silver', min: 100, icon: '🥈' },
  { level: 'Gold', min: 300, icon: '🥇' },
  { level: 'Platinum', min: 500, icon: '💎' },
];

const Rewards = () => {
  const [rewards, setRewards] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const res = await api.get('/api/complaints/rewards');
        setRewards(res.data);
      } catch {
        setRewards({ points: 0, level: 'Bronze', history: [] });
      } finally {
        setLoading(false);
      }
    };
    fetchRewards();
    const interval = setInterval(fetchRewards, 15000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const colors = levelColors[rewards.level] || levelColors.Bronze;
  const currentMilestone = milestones.filter(m => rewards.points >= m.min).pop();
  const nextMilestone = milestones.find(m => m.min > rewards.points);
  const progress = nextMilestone
    ? ((rewards.points - currentMilestone.min) / (nextMilestone.min - currentMilestone.min)) * 100
    : 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <FiAward className="text-cyan-400" /> My Rewards
        </h1>
        <p className="text-slate-500 text-sm mt-1">Earn points by reporting waste issues and helping keep Baramati clean</p>
      </div>

      {/* Level Card */}
      <div className={`bg-gradient-to-br ${colors.bg} border ${colors.border} rounded-2xl p-6`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Current Level</p>
            <h2 className={`text-3xl font-black ${colors.text} flex items-center gap-2`}>
              {currentMilestone?.icon} {rewards.level}
            </h2>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Points</p>
            <p className="text-3xl font-black text-white">{rewards.points}</p>
          </div>
        </div>

        {/* Progress to next level */}
        {nextMilestone && (
          <div>
            <div className="flex justify-between text-[11px] text-slate-400 mb-2">
              <span>{currentMilestone.icon} {currentMilestone.level}</span>
              <span>{Math.round(progress)}% to {nextMilestone.level} {nextMilestone.icon}</span>
            </div>
            <div className="h-3 bg-slate-800/60 rounded-full overflow-hidden">
              <div
                className={`h-full ${colors.bar} rounded-full transition-all duration-700`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-500 mt-1.5">
              {nextMilestone.min - rewards.points} more points to reach {nextMilestone.level}
            </p>
          </div>
        )}
        {!nextMilestone && (
          <div className="text-center py-2">
            <p className="text-sm text-cyan-300 font-semibold">🎉 Highest level achieved!</p>
          </div>
        )}
      </div>

      {/* How to Earn Points */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { icon: FiStar, label: 'Submit Complaint', points: '+50', desc: 'Report a waste issue' },
          { icon: FiZap, label: 'Add Photo/Video', points: '+20', desc: 'Include media evidence' },
          { icon: FiTrendingUp, label: 'Share Location', points: '+10', desc: 'Pin exact spot on map' },
          { icon: FiGift, label: 'Issue Resolved', points: '+50', desc: 'When complaint is fixed' },
        ].map(({ icon: Icon, label, points, desc }) => (
          <div key={label} className="card-surface rounded-xl p-4 border border-slate-800/50">
            <div className="flex items-center gap-2 mb-1.5">
              <Icon size={14} className="text-cyan-400" />
              <span className="text-xs font-bold text-slate-300">{label}</span>
            </div>
            <p className="text-lg font-black text-emerald-400">{points}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">{desc}</p>
          </div>
        ))}
      </div>

      {/* Milestones */}
      <div>
        <h3 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
          <FiTrendingUp size={14} className="text-cyan-400" /> Level Milestones
        </h3>
        <div className="flex gap-3">
          {milestones.map(m => {
            const reached = rewards.points >= m.min;
            return (
              <div
                key={m.level}
                className={`flex-1 rounded-xl p-3 border text-center transition-all ${
                  reached
                    ? `${levelColors[m.level].bg} ${levelColors[m.level].border}`
                    : 'bg-slate-900/40 border-slate-800/30 opacity-50'
                }`}
              >
                <p className="text-2xl mb-1">{m.icon}</p>
                <p className={`text-xs font-bold ${reached ? levelColors[m.level].text : 'text-slate-600'}`}>{m.level}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{m.min} pts</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Points History */}
      <div>
        <h3 className="text-sm font-bold text-slate-300 mb-3">Points History</h3>
        {rewards.history && rewards.history.length > 0 ? (
          <div className="space-y-2">
            {rewards.history.slice().reverse().map((h, i) => (
              <div key={i} className="card-surface rounded-xl p-3 border border-slate-800/40 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-300">{h.action}</p>
                  <p className="text-[10px] text-slate-500">{new Date(h.date).toLocaleString()}</p>
                </div>
                <span className="text-sm font-black text-emerald-400">+{h.points}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="card-surface rounded-xl p-8 text-center border border-slate-800/40">
            <FiAward size={32} className="mx-auto text-slate-700 mb-2" />
            <p className="text-sm text-slate-500">No points earned yet</p>
            <p className="text-[10px] text-slate-600 mt-1">Submit a complaint to start earning!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Rewards;
