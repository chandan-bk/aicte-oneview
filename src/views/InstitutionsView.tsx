import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Institution } from '../types';
import { 
  Building2, Search, Filter, ShieldCheck, MapPin, 
  ExternalLink, AlertTriangle, GitMerge, FileText, ChevronRight 
} from 'lucide-react';

export const InstitutionsView: React.FC = () => {
  const { institutions, setSelectedInstitution, setCurrentView, setSihDemoStep } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredInstitutions = institutions.filter(inst => {
    const matchesSearch = 
      inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.aictePermanentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.state.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRegion = selectedRegion === 'All' || inst.region === selectedRegion;
    const matchesCategory = selectedCategory === 'All' || inst.category === selectedCategory;

    return matchesSearch && matchesRegion && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap justify-between items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold text-xs">
              Section 3: Centralized Registry
            </span>
            <span className="text-xs text-slate-500 font-medium">Unique AICTE Permanent ID Anchor</span>
          </div>
          <h2 className="text-xl font-bold font-['Outfit'] text-slate-900">
            National Technical Institution Master Registry
          </h2>
          <p className="text-xs text-slate-500 max-w-2xl mt-0.5">
            Consolidated digital profiles connecting complaints across all AICTE Bureaus. Prevents duplicate institution records and enforces verified Permanent ID lookup.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Permanent ID Verification Active</span>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap gap-3 items-center justify-between">
        <div className="relative flex-1 min-w-[280px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by AICTE Permanent ID (e.g. 1-43598711), Institution Name, State or City..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg text-xs py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
          >
            <option value="All">All Regions</option>
            <option value="Western">Western Region</option>
            <option value="Northern">Northern Region</option>
            <option value="Eastern">Eastern Region</option>
            <option value="South-Western">South-Western Region</option>
            <option value="Central">Central Region</option>
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg text-xs py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
          >
            <option value="All">All Categories</option>
            <option value="Engineering & Tech">Engineering & Tech</option>
            <option value="Management">Management</option>
            <option value="Pharmacy">Pharmacy</option>
          </select>

          {(searchQuery || selectedRegion !== 'All' || selectedCategory !== 'All') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedRegion('All');
                setSelectedCategory('All');
              }}
              className="text-xs text-rose-600 font-semibold px-2 py-1 hover:underline"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Institutions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredInstitutions.map(inst => (
          <div
            key={inst.id}
            onClick={() => setSelectedInstitution(inst)}
            className={`bg-white rounded-xl border p-5 shadow-sm hover:shadow-md transition-all cursor-pointer relative flex flex-col justify-between ${
              inst.aictePermanentId === '1-43598711'
                ? 'border-amber-400 ring-2 ring-amber-300/40 bg-gradient-to-b from-amber-50/20 to-white'
                : 'border-slate-200 hover:border-blue-400'
            }`}
          >
            <div>
              {/* Badge row */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="font-mono text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  ID: {inst.aictePermanentId}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  inst.riskRating === 'High' ? 'bg-rose-100 text-rose-700' :
                  inst.riskRating === 'Moderate' ? 'bg-amber-100 text-amber-700' :
                  'bg-emerald-100 text-emerald-700'
                }`}>
                  {inst.riskRating} Risk
                </span>
              </div>

              {/* Institution Title */}
              <h3 className="font-bold text-sm text-slate-900 font-['Outfit'] mb-1">
                {inst.name}
              </h3>

              <div className="text-xs text-slate-500 mb-3 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{inst.city}, {inst.state} ({inst.region} Region)</span>
              </div>

              <div className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 mb-3 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Category:</span>
                  <span className="font-semibold text-slate-700">{inst.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Affiliation:</span>
                  <span className="font-semibold text-slate-700 truncate max-w-[170px]" title={inst.affiliatingUniversity}>
                    {inst.affiliatingUniversity}
                  </span>
                </div>
              </div>
            </div>

            <div>
              {/* Complaint Counters */}
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-center text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] block">Total</span>
                  <strong className="text-slate-800 font-bold">{inst.totalComplaints}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Pending</span>
                  <strong className="text-blue-600 font-bold">{inst.pendingComplaints}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Overlaps</span>
                  <strong className={`font-bold ${inst.activeOverlaps > 0 ? 'text-amber-600 animate-pulse' : 'text-slate-400'}`}>
                    {inst.activeOverlaps}
                  </strong>
                </div>
              </div>

              {inst.aictePermanentId === '1-43598711' && (
                <div className="mt-3 py-1.5 px-2 bg-amber-100/70 border border-amber-300 rounded text-[11px] text-amber-900 font-medium flex items-center justify-between">
                  <span>★ SIH Scenario Demo College</span>
                  <span className="text-xs font-bold text-amber-700">Open Dossier →</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
