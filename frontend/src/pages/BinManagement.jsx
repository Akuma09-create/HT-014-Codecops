// Bin Management — searchable & filterable table of all smart bins
import { useState } from 'react';
import { FiSearch, FiMapPin, FiBattery, FiTrash2 } from 'react-icons/fi';
import StatusBadge from '../components/StatusBadge';
import { bins } from '../data/mockData';

const BinManagement = () => {
  const [search, setSearch] = useState('');
  const [areaFilter, setAreaFilter] = useState('All');

  const areas = ['All', ...new Set(bins.map(b => b.area))];

  const filtered = bins.filter(b => {
    const matchSearch = b.location.toLowerCase().includes(search.toLowerCase()) || b.area.toLowerCase().includes(search.toLowerCase());
    const matchArea = areaFilter === 'All' || b.area === areaFilter;
    return matchSearch && matchArea;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in-up">
        <h2 className="text-2xl font-extrabold text-accent" style={{ fontFamily: 'var(--font-display)' }}>Bin Management</h2>
        <p className="text-sm text-slate-500 mt-1">Monitor and manage all smart bins across the city</p>
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-2.5 flex-1 gap-2">
          <FiSearch className="text-slate-500" size={14} />
          <input
            type="text"
            placeholder="Search bins by location or area..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm text-slate-300 placeholder-slate-600 outline-none w-full"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {areas.map(area => (
            <button
              key={area}
              onClick={() => setAreaFilter(area)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                areaFilter === area
                  ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                  : 'bg-slate-800/40 text-slate-400 border border-slate-700/40 hover:text-slate-300'
              }`}
            >
              {area}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="text-xs text-slate-600 font-semibold">{filtered.length} bins found</p>

      {/* Table */}
      <div className="card overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-800/40 border-b border-slate-700/40">
                <th className="text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider px-5 py-3">ID</th>
                <th className="text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider px-5 py-3">Location</th>
                <th className="text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider px-5 py-3">Area</th>
                <th className="text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider px-5 py-3">Fill Level</th>
                <th className="text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider px-5 py-3">Status</th>
                <th className="text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider px-5 py-3">Battery</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((bin, i) => (
                <tr key={bin.id} className="border-b border-slate-800/30 hover:bg-slate-800/20 transition-colors">
                  <td className="px-5 py-3.5">
                    <span className="text-xs font-bold text-slate-400">#{bin.id}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <FiTrash2 className="text-slate-600" size={13} />
                      <span className="text-xs font-medium text-slate-300">{bin.location}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs text-slate-400 flex items-center gap-1"><FiMapPin size={10} /> {bin.area}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 rounded-full bg-slate-700 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            bin.fillLevel >= 90 ? 'bg-red-500' : bin.fillLevel >= 75 ? 'bg-orange-500' : bin.fillLevel >= 40 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${bin.fillLevel}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-slate-300">{bin.fillLevel}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={bin.status} />
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-semibold flex items-center gap-1 ${bin.sensorBattery > 60 ? 'text-emerald-400' : bin.sensorBattery > 30 ? 'text-amber-400' : 'text-red-400'}`}>
                      <FiBattery size={12} /> {bin.sensorBattery}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BinManagement;
