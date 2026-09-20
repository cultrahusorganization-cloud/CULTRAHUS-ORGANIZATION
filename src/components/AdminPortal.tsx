import React, { useState, useMemo } from 'react';
import { RegistrationRecord, RegistrationStats } from '../types';
import { useTheme } from '../context/ThemeContext';
import { 
  updateParticipantStatus, 
  deleteParticipant,
  ensureInitialCollectionsAndData
} from '../services/registrationService';
import { 
  Users, 
  Ticket, 
  UserCheck, 
  Search, 
  Download, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  Trash2, 
  ExternalLink,
  Shield,
  Filter,
  DollarSign,
  QrCode,
  Globe,
  Database
} from 'lucide-react';

interface Props {
  records: RegistrationRecord[];
  isLoading: boolean;
  onRefresh?: () => void;
}

export const AdminPortal: React.FC<Props> = ({ records, isLoading, onRefresh }) => {
  const { theme, config } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'delegate' | 'ticket'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'confirmed' | 'checked-in'>('all');
  const [filterSource, setFilterSource] = useState<'all' | 'vercel' | 'gemini_app' | 'direct'>('all');
  const [quickVerifyCode, setQuickVerifyCode] = useState('');
  const [verifyResult, setVerifyResult] = useState<RegistrationRecord | null | 'not_found'>(null);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; name: string } | null>(null);
  const [seedingStatus, setSeedingStatus] = useState<string | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);

  const handleSeedCollections = async () => {
    setIsSeeding(true);
    setSeedingStatus(null);
    const result = await ensureInitialCollectionsAndData();
    setSeedingStatus(result.message);
    setIsSeeding(false);
    if (onRefresh) {
      onRefresh();
    }
  };

  // Statistics
  const stats: RegistrationStats = useMemo(() => {
    return records.reduce(
      (acc, curr) => {
        acc.total += 1;
        if (curr.type === 'delegate') acc.delegates += 1;
        else if (curr.type === 'ticket') acc.tickets += 1;
        else if (curr.type === 'troupe') acc.plays += 1;
        else if (curr.type === 'secretariat') acc.secretariat += 1;
        else if (curr.type === 'sponsor') acc.sponsors += 1;
        else if (curr.type === 'inquiry') acc.inquiries += 1;

        if (curr.amountPaid) acc.totalRevenue += curr.amountPaid;
        if (curr.status === 'checked-in') acc.checkedIn += 1;
        return acc;
      },
      { total: 0, delegates: 0, tickets: 0, plays: 0, secretariat: 0, sponsors: 0, inquiries: 0, checkedIn: 0, totalRevenue: 0 }
    );
  }, [records]);

  // Filtered records
  const filteredRecords = useMemo(() => {
    return records.filter((rec) => {
      const matchesSearch =
        rec.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rec.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rec.uniqueCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (rec.organization && rec.organization.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesType = filterType === 'all' || rec.type === filterType;
      const matchesStatus = filterStatus === 'all' || rec.status === filterStatus;
      const matchesSource = filterSource === 'all' || rec.source === filterSource;

      return matchesSearch && matchesType && matchesStatus && matchesSource;
    });
  }, [records, searchTerm, filterType, filterStatus, filterSource]);

  // Quick Code Verification
  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickVerifyCode.trim()) return;
    const match = records.find(
      (r) => r.uniqueCode.toUpperCase() === quickVerifyCode.trim().toUpperCase()
    );
    if (match) {
      setVerifyResult(match);
    } else {
      setVerifyResult('not_found');
    }
  };

  const handleToggleCheckIn = async (record: RegistrationRecord) => {
    const nextStatus = record.status === 'checked-in' ? 'confirmed' : 'checked-in';
    await updateParticipantStatus(record.id, nextStatus);
  };

  const handleDeletePrompt = (id: string, name: string) => {
    setItemToDelete({ id, name });
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      await deleteParticipant(itemToDelete.id);
      setItemToDelete(null);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    if (records.length === 0) return;
    const headers = ['Unique Code', 'Name', 'Type', 'Email', 'Phone', 'Organization', 'Status', 'Source', 'Date'];
    const rows = records.map((r) => [
      r.uniqueCode,
      `"${r.name.replace(/"/g, '""')}"`,
      r.type,
      r.email,
      r.phone || '',
      `"${(r.organization || '').replace(/"/g, '""')}"`,
      r.status,
      r.source,
      new Date(r.createdAt).toLocaleString(),
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `cultrahus_registrations_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="admin-portal-view" className="space-y-6">
      {/* Top Header */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl border shadow-sm ${config.cardBg} ${config.cardBorder} ${config.textPrimary}`}>
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: config.dotColor }}>
            <Shield className="w-4 h-4" /> Firebase Connected Database
          </div>
          <h2 className="text-2xl font-bold">Admin Control Center</h2>
          <p className={`text-sm mt-0.5 ${config.textMuted}`}>
            Real-time feed of all registered delegates and ticket buyers from Vercel & AI Studio.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onRefresh && (
            <button
              id="refresh-data-btn"
              onClick={onRefresh}
              className={`px-3.5 py-2 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition cursor-pointer border ${config.secondaryButton}`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} /> Sync Now
            </button>
          )}
          <button
            id="export-csv-btn"
            onClick={handleExportCSV}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 transition shadow-sm cursor-pointer ${config.primaryButton}`}
          >
            <Download className="w-3.5 h-3.5" /> Export Data (CSV)
          </button>
        </div>
      </div>

      {/* Firebase Collections & Console Access Card */}
      <div className={`p-5 rounded-2xl border shadow-sm ${config.cardBg} ${config.cardBorder} ${config.textPrimary}`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-bold">Firestore Database & Storage Collections</h3>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Connected
              </span>
            </div>
            <p className={`text-xs ${config.textMuted}`}>
              Your data is stored under Firebase Project <span className="font-mono text-white font-semibold">gen-lang-client-0207271679</span> (Database: <span className="font-mono text-white font-semibold">ai-studio-1959e55b-78c9-4673-be88-b7d93b87ba81</span>).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              id="seed-collections-btn"
              onClick={handleSeedCollections}
              disabled={isSeeding}
              className={`px-3.5 py-2 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition cursor-pointer border ${config.secondaryButton} disabled:opacity-50`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSeeding ? 'animate-spin' : ''}`} />
              {isSeeding ? 'Creating Collections...' : 'Ensure Collections in Firebase'}
            </button>
            <a
              id="open-firebase-console-btn"
              href="https://console.firebase.google.com/project/gen-lang-client-0207271679/firestore/databases/ai-studio-1959e55b-78c9-4673-be88-b7d93b87ba81/data"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 transition shadow-sm cursor-pointer bg-amber-500 hover:bg-amber-400 text-stone-950"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Open Firebase Console
            </a>
          </div>
        </div>

        {seedingStatus && (
          <div className="mt-3 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{seedingStatus}</span>
          </div>
        )}

        {/* Collections Breakdown Badges */}
        <div className="mt-4 pt-3 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className={`p-3 rounded-xl border ${config.inputBg}`}>
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-xs text-amber-400">/registrations</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10">{records.length} docs</span>
            </div>
            <p className={`text-[11px] mt-1 ${config.textMuted}`}>
              Stores all delegate & ticket buyer registration records with unique codes.
            </p>
          </div>

          <div className={`p-3 rounded-xl border ${config.inputBg}`}>
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-xs text-cyan-400">/event_settings</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10">Active</span>
            </div>
            <p className={`text-[11px] mt-1 ${config.textMuted}`}>
              Stores Cultrahus Organization event configuration & organizer email.
            </p>
          </div>

          <div className={`p-3 rounded-xl border ${config.inputBg}`}>
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-xs text-emerald-400">/test</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10">Verified</span>
            </div>
            <p className={`text-[11px] mt-1 ${config.textMuted}`}>
              Live heartbeat probe confirming database connectivity from browser & Vercel.
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={`p-5 rounded-2xl border shadow-sm ${config.cardBg} ${config.cardBorder} ${config.textPrimary}`}>
          <div className={`flex items-center justify-between mb-2 ${config.textMuted}`}>
            <span className="text-xs font-medium uppercase tracking-wider">Total Registrations</span>
            <Users className="w-4 h-4" style={{ color: config.dotColor }} />
          </div>
          <div className="text-3xl font-extrabold">{stats.total}</div>
          <div className={`text-xs mt-1 ${config.textMuted}`}>All verified entries</div>
        </div>

        <div className={`p-5 rounded-2xl border shadow-sm ${config.cardBg} ${config.cardBorder} ${config.textPrimary}`}>
          <div className={`flex items-center justify-between mb-2 ${config.textMuted}`}>
            <span className="text-xs font-medium uppercase tracking-wider">Delegates</span>
            <UserCheck className="w-4 h-4" style={{ color: config.dotColor }} />
          </div>
          <div className="text-3xl font-extrabold" style={{ color: config.dotColor }}>{stats.delegates}</div>
          <div className={`text-xs mt-1 ${config.textMuted}`}>Official delegate passes</div>
        </div>

        <div className={`p-5 rounded-2xl border shadow-sm ${config.cardBg} ${config.cardBorder} ${config.textPrimary}`}>
          <div className={`flex items-center justify-between mb-2 ${config.textMuted}`}>
            <span className="text-xs font-medium uppercase tracking-wider">Tickets Sold</span>
            <Ticket className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-500">{stats.tickets}</div>
          <div className={`text-xs mt-1 ${config.textMuted}`}>${stats.totalRevenue} revenue</div>
        </div>

        <div className={`p-5 rounded-2xl border shadow-sm ${config.cardBg} ${config.cardBorder} ${config.textPrimary}`}>
          <div className={`flex items-center justify-between mb-2 ${config.textMuted}`}>
            <span className="text-xs font-medium uppercase tracking-wider">Gate Check-Ins</span>
            <CheckCircle2 className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="text-3xl font-extrabold text-cyan-500">{stats.checkedIn}</div>
          <div className={`text-xs mt-1 ${config.textMuted}`}>
            {stats.total > 0 ? `${Math.round((stats.checkedIn / stats.total) * 100)}% present` : '0%'}
          </div>
        </div>
      </div>

      {/* Code Scanner / Quick Verification Bar */}
      <div className={`p-5 rounded-2xl border shadow-sm ${theme === 'light' ? 'bg-stone-900 text-white' : 'bg-zinc-900/90 text-white'} ${config.cardBorder}`}>
        <form onSubmit={handleVerifyCode} className="flex flex-col md:flex-row items-center gap-3">
          <div className="flex items-center gap-2 text-sm font-semibold whitespace-nowrap" style={{ color: config.dotColor }}>
            <QrCode className="w-5 h-5" /> Quick Pass Verifier:
          </div>
          <div className="relative flex-1 w-full">
            <input
              id="input-verify-code"
              type="text"
              placeholder="Enter unique code (e.g. CLT-DEL-26-XXXX or CLT-TCK-...)"
              value={quickVerifyCode}
              onChange={(e) => setQuickVerifyCode(e.target.value)}
              className="w-full px-4 py-2 bg-zinc-950/60 border border-zinc-700/80 rounded-xl text-sm text-white placeholder-zinc-400 focus:outline-none focus:border-indigo-500 uppercase font-mono"
            />
          </div>
          <button
            type="submit"
            id="verify-code-btn"
            className={`w-full md:w-auto px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition cursor-pointer ${config.primaryButton}`}
          >
            Verify Badge
          </button>
        </form>

        {verifyResult && (
          <div className="mt-4 p-4 rounded-xl border transition-all duration-200 text-sm">
            {verifyResult === 'not_found' ? (
              <div className="text-red-400 font-medium">
                No registration found with code &quot;{quickVerifyCode}&quot;. Please check the code again.
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-stone-800/80 p-3 rounded-lg border border-amber-500/30">
                <div>
                  <span className="text-xs text-amber-400 uppercase font-bold tracking-wider block">
                    Valid {verifyResult.type} Pass
                  </span>
                  <div className="text-base font-bold text-white mt-0.5">
                    {verifyResult.name} ({verifyResult.email})
                  </div>
                  <div className="text-xs text-stone-400 font-mono mt-0.5">
                    Code: {verifyResult.uniqueCode} | Org: {verifyResult.organization || 'N/A'} | Source: {verifyResult.source}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                    verifyResult.status === 'checked-in' ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' : 'bg-amber-950 text-amber-300 border border-amber-700'
                  }`}>
                    {verifyResult.status.toUpperCase()}
                  </span>
                  <button
                    onClick={() => handleToggleCheckIn(verifyResult)}
                    className="px-3 py-1 bg-white text-stone-900 text-xs font-semibold rounded-lg hover:bg-stone-200 cursor-pointer"
                  >
                    {verifyResult.status === 'checked-in' ? 'Uncheck' : 'Check-In Attendee'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Filter and Table Container */}
      <div className={`rounded-2xl border shadow-sm overflow-hidden ${config.cardBg} ${config.cardBorder} ${config.textPrimary}`}>
        {/* Filters */}
        <div className={`p-4 md:p-5 border-b flex flex-col md:flex-row gap-3 items-center justify-between ${config.cardBorder}`}>
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
            <input
              id="admin-search-input"
              type="text"
              placeholder="Search by name, code, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-9 pr-4 py-2 text-xs rounded-xl outline-hidden border transition ${config.inputBg}`}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Type Filter */}
            <select
              id="filter-type-select"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className={`text-xs rounded-xl px-3 py-1.5 outline-hidden border cursor-pointer ${config.inputBg}`}
            >
              <option value="all" className="bg-zinc-900 text-white">All Types</option>
              <option value="delegate" className="bg-zinc-900 text-white">Delegates Only</option>
              <option value="ticket" className="bg-zinc-900 text-white">Tickets Only</option>
            </select>

            {/* Status Filter */}
            <select
              id="filter-status-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className={`text-xs rounded-xl px-3 py-1.5 outline-hidden border cursor-pointer ${config.inputBg}`}
            >
              <option value="all" className="bg-zinc-900 text-white">All Statuses</option>
              <option value="confirmed" className="bg-zinc-900 text-white">Confirmed</option>
              <option value="checked-in" className="bg-zinc-900 text-white">Checked In</option>
            </select>

            {/* Source Filter */}
            <select
              id="filter-source-select"
              value={filterSource}
              onChange={(e) => setFilterSource(e.target.value as any)}
              className={`text-xs rounded-xl px-3 py-1.5 outline-hidden border cursor-pointer ${config.inputBg}`}
            >
              <option value="all" className="bg-zinc-900 text-white">All Sources</option>
              <option value="vercel" className="bg-zinc-900 text-white">Vercel Web App</option>
              <option value="gemini_app" className="bg-zinc-900 text-white">Gemini / AI Studio</option>
              <option value="direct" className="bg-zinc-900 text-white">Direct</option>
            </select>
          </div>
        </div>

        {/* Records Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className={`uppercase tracking-wider font-semibold border-b ${config.cardBorder} ${
              theme === 'light' ? 'bg-stone-100/80 text-stone-600' : 'bg-zinc-900/80 text-zinc-400'
            }`}>
              <tr>
                <th className="py-3.5 px-4">Unique Code</th>
                <th className="py-3.5 px-4">Attendee</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Organization</th>
                <th className="py-3.5 px-4">Origin Source</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${config.cardBorder}`}>
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <Users className="w-8 h-8 mx-auto opacity-30 mb-2" />
                    <p className="text-sm font-medium">No registrations found</p>
                    <p className={`text-xs mt-0.5 ${config.textMuted}`}>
                      New entries submitted on the registration form or Vercel will appear here instantly.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredRecords.map((item) => (
                  <tr key={item.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold select-all">
                      <span className={`px-2 py-0.5 rounded border ${config.inputBg}`}>
                        {item.uniqueCode}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold">{item.name}</div>
                      <div className={`text-[11px] ${config.textMuted}`}>{item.email}</div>
                      {item.phone && <div className={`text-[10px] opacity-75 ${config.textMuted}`}>{item.phone}</div>}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 font-semibold capitalize px-2.5 py-0.5 rounded-full text-[11px] border ${
                        item.type === 'delegate' ? config.accentBadge : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      }`}>
                        {item.type === 'delegate' ? <UserCheck className="w-3 h-3" /> : <Ticket className="w-3 h-3" />}
                        {item.type} {item.ticketTier ? `• ${item.ticketTier}` : ''}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div>{item.organization || '—'}</div>
                      {item.designation && <div className={`text-[10px] ${config.textMuted}`}>{item.designation}</div>}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 font-mono text-[11px] px-2 py-0.5 rounded border border-white/10 uppercase">
                        <Globe className="w-2.5 h-2.5 opacity-60" />
                        {item.source}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleCheckIn(item)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition cursor-pointer border ${
                          item.status === 'checked-in'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                            : `${config.secondaryButton}`
                        }`}
                        title="Click to toggle check-in state"
                      >
                        {item.status === 'checked-in' ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Checked In
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3 opacity-60" /> Confirmed
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        id={`delete-btn-${item.id}`}
                        onClick={() => handleDeletePrompt(item.id, item.name)}
                        className="opacity-60 hover:opacity-100 hover:text-red-400 p-1.5 rounded-lg transition cursor-pointer"
                        title="Delete registration"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className={`p-3.5 border-t flex items-center justify-between text-xs ${config.cardBorder} ${config.textMuted}`}>
          <span>Showing {filteredRecords.length} of {records.length} records</span>
          <span className="font-mono text-[11px]">Database: Firestore ({records.length} docs synced)</span>
        </div>
      </div>

      {/* Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`rounded-2xl p-6 max-w-sm w-full shadow-2xl border space-y-4 animate-in fade-in zoom-in-95 duration-150 ${config.cardBg} ${config.cardBorder} ${config.textPrimary}`}>
            <h3 className="text-base font-bold">Remove Registration?</h3>
            <p className={`text-xs ${config.textMuted}`}>
              Are you sure you want to remove the registration record for <span className="font-semibold text-white">{itemToDelete.name}</span>? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                id="cancel-delete-btn"
                onClick={() => setItemToDelete(null)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-xl border transition cursor-pointer ${config.secondaryButton}`}
              >
                Cancel
              </button>
              <button
                id="confirm-delete-btn"
                onClick={confirmDelete}
                className="px-3.5 py-2 text-xs font-bold rounded-xl bg-red-600 hover:bg-red-700 text-white transition cursor-pointer shadow-xs"
              >
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
