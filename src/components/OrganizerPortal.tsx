import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Download, 
  RefreshCw, 
  CheckCircle, 
  Trash2, 
  Printer, 
  Copy, 
  Database,
  Users,
  Ticket,
  Briefcase,
  Handshake,
  Mail,
  Award,
  Filter,
  MapPin,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  LogOut,
  FileText,
  X,
  Building2,
  Phone,
  Calendar,
  DollarSign,
  UserCheck,
  Share2,
  Activity,
  Globe
} from 'lucide-react';
import { 
  subscribeToRegistrations, 
  updateParticipantStatus, 
  deleteParticipant, 
  calculateStats,
  ensureInitialCollectionsAndData,
  purgeAllMockData,
  getCollectionNameForType,
  testDirectFirestoreWrite
} from '../services/registrationService';
import { RegistrationRecord, DigitalPassData } from '../types';

interface OrganizerPortalProps {
  onPassGenerated: (passData: DigitalPassData) => void;
}

export const OrganizerPortal: React.FC<OrganizerPortalProps> = ({ onPassGenerated }) => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('cultrahus_admin_auth') === 'true';
    } catch {
      return false;
    }
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Portal records and state
  const [records, setRecords] = useState<RegistrationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'error'>('syncing');
  const [dbNotice, setDbNotice] = useState<string | null>(null);
  const [isProbing, setIsProbing] = useState<boolean>(false);
  const [probeResult, setProbeResult] = useState<string | null>(null);
  
  // Full detail dossier modal
  const [selectedDossier, setSelectedDossier] = useState<RegistrationRecord | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (passwordInput.trim() === 'adminisvansh') {
      try {
        sessionStorage.setItem('cultrahus_admin_auth', 'true');
      } catch {
        // ignore storage error
      }
      setIsAuthenticated(true);
      setPasswordInput('');
    } else {
      setAuthError('Access Denied: Incorrect administrative password.');
      setPasswordInput('');
    }
  };

  const handleSignOut = () => {
    try {
      sessionStorage.removeItem('cultrahus_admin_auth');
    } catch {
      // ignore
    }
    setIsAuthenticated(false);
    setPasswordInput('');
    setSelectedDossier(null);
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    setLoading(true);
    setSyncStatus('syncing');

    const unsubscribe = subscribeToRegistrations(
      (data) => {
        setRecords(data);
        setLoading(false);
        setSyncStatus('synced');
      },
      (err) => {
        console.warn('Real-time sync alert:', err);
        setSyncStatus('error');
        setLoading(false);
      }
    );

    // Initial check
    ensureInitialCollectionsAndData().then(res => {
      if (res.success) {
        setDbNotice('Connected to Firestore database (ai-studio-1959e55b-78c9-4673-be88-b7d93b87ba81)');
      }
    });

    return () => unsubscribe();
  }, [isAuthenticated]);

  const stats = calculateStats(records);

  const filteredRecords = records.filter(r => {
    // Category match
    const recCat = r._category || (r.type === 'ticket' ? 'tickets' : r.type === 'troupe' ? 'plays' : r.type === 'secretariat' ? 'secretariat' : r.type === 'sponsor' ? 'sponsors' : r.type === 'inquiry' ? 'inquiries' : 'delegates');
    if (activeCategory !== 'all' && recCat !== activeCategory) return false;

    // Status match
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;

    // Search query match
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      (r.name && r.name.toLowerCase().includes(q)) ||
      (r.uniqueCode && r.uniqueCode.toLowerCase().includes(q)) ||
      (r.email && r.email.toLowerCase().includes(q)) ||
      (r.phone && r.phone.includes(q)) ||
      (r.organization && r.organization.toLowerCase().includes(q)) ||
      (r.troupeName && r.troupeName.toLowerCase().includes(q)) ||
      (r.playTitle && r.playTitle.toLowerCase().includes(q)) ||
      (r.brandName && r.brandName.toLowerCase().includes(q)) ||
      (r.cityState && r.cityState.toLowerCase().includes(q))
    );
  });

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleToggleCheckIn = async (record: RegistrationRecord) => {
    const nextStatus = record.status === 'checked-in' ? 'confirmed' : 'checked-in';
    await updateParticipantStatus(record.id, nextStatus, record.type);
    if (selectedDossier && selectedDossier.id === record.id) {
      setSelectedDossier({ ...selectedDossier, status: nextStatus });
    }
  };

  const handleStatusChange = async (record: RegistrationRecord, newStatus: RegistrationRecord['status']) => {
    await updateParticipantStatus(record.id, newStatus, record.type);
    if (selectedDossier && selectedDossier.id === record.id) {
      setSelectedDossier({ ...selectedDossier, status: newStatus });
    }
  };

  const handleDelete = async (id: string, name: string, type?: RegistrationRecord['type']) => {
    if (window.confirm(`Are you sure you want to permanently delete registration for "${name}" from Firestore?`)) {
      await deleteParticipant(id, type);
      if (selectedDossier && selectedDossier.id === id) {
        setSelectedDossier(null);
      }
    }
  };

  const handleExportCSV = () => {
    if (records.length === 0) return;
    const headers = [
      'Unique Code',
      'Firestore Collection',
      'Category Group',
      'Name',
      'Email',
      'Phone',
      'Organization / College / Troupe',
      'Designation',
      'City / State',
      'Category / Tier / Track',
      'Play Title / Troupe Name',
      'Amount Paid (INR)',
      'Status',
      'Registered At'
    ];
    const rows = records.map(r => [
      `"${r.uniqueCode || ''}"`,
      `"${getCollectionNameForType(r.type)}"`,
      `"${r._category || r.type}"`,
      `"${(r.name || '').replace(/"/g, '""')}"`,
      `"${r.email || ''}"`,
      `"${r.phone || ''}"`,
      `"${(r.organization || r.troupeName || r.brandName || '').replace(/"/g, '""')}"`,
      `"${(r.designation || '').replace(/"/g, '""')}"`,
      `"${(r.cityState || '').replace(/"/g, '""')}"`,
      `"${(r.ticketTier || r.participationCategory || r.department || r.sponsorTier || '').replace(/"/g, '""')}"`,
      `"${(r.playTitle || '').replace(/"/g, '""')}"`,
      `"${r.amountPaid || 0}"`,
      `"${r.status || 'confirmed'}"`,
      `"${r.createdAt || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `cultrahus_sangam_registrations_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openPassModal = (record: RegistrationRecord) => {
    const cat = record._category || (record.type === 'ticket' ? 'tickets' : record.type === 'troupe' ? 'plays' : record.type === 'secretariat' ? 'secretariat' : record.type === 'sponsor' ? 'sponsors' : 'delegates');
    
    let title = 'Accredited Festival Credential';
    let detail1Label = 'Category';
    let detail1Value: string = record.participationCategory || 'Performing Arts';
    let detail2Label = 'Status';
    let detail2Value: string = record.status || 'Confirmed';

    if (cat === 'tickets') {
      title = `${record.ticketTier?.toUpperCase() || 'CONCLAVE'} AUDITORIUM PASS`;
      detail1Label = 'Tier & Seats';
      detail1Value = `${record.ticketTier || 'Standard'} (${record.quantity || 1} seat${(record.quantity || 1) > 1 ? 's' : ''})`;
      detail2Label = 'Food Hospitality';
      detail2Value = record.foodAddon || 'General Food Court Access';
    } else if (cat === 'plays') {
      title = 'OFFICIAL DRAMA TROUPE ENTRY';
      detail1Label = 'Play & Troupe';
      detail1Value = `"${record.playTitle || 'Stage Play'}" • ${record.organization || record.troupeName || 'Society'}`;
      detail2Label = 'Director / Cast';
      detail2Value = `${record.name} (${record.castCrewCount || 10} members)`;
    } else if (cat === 'secretariat') {
      title = 'EXECUTIVE YOUTH SECRETARIAT';
      detail1Label = 'Council Wing';
      detail1Value = record.department ? `${record.department} Division` : 'General Council';
      detail2Label = 'Designation';
      detail2Value = record.designation || 'Secretariat Officer';
    } else if (cat === 'sponsors') {
      title = 'HONORARY CORPORATE PATRON';
      detail1Label = 'Patronage Tier';
      detail1Value = record.sponsorTier || 'Official Sponsor';
      detail2Label = 'Brand';
      detail2Value = record.organization || record.brandName || 'Partner Brand';
    }

    onPassGenerated({
      type: cat,
      code: record.uniqueCode,
      title,
      fullName: record.name,
      email: record.email,
      phone: record.phone,
      detail1Label,
      detail1Value,
      detail2Label,
      detail2Value,
      seats: record.seats,
      feePaid: record.amountPaid ? `₹${record.amountPaid.toLocaleString('en-IN')}` : 'Accredited Free',
      status: record.status.toUpperCase(),
      issuedIst: record.createdAt ? new Date(record.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : undefined,
    });
  };

  const handlePurgeMock = async () => {
    if (window.confirm('Remove all pre-seeded dummy/mock records? This will clear any test entries so only genuine submissions remain.')) {
      setSyncStatus('syncing');
      const res = await purgeAllMockData();
      setDbNotice(res.message);
      setSyncStatus('synced');
    }
  };

  const handleVerifyCollections = async () => {
    setSyncStatus('syncing');
    const res = await ensureInitialCollectionsAndData();
    setDbNotice(res.message);
    setSyncStatus('synced');
  };

  const handleRunDiagnosticProbe = async () => {
    setIsProbing(true);
    setProbeResult(null);
    try {
      const result = await testDirectFirestoreWrite();
      if (result.success) {
        setProbeResult(`Live Ping: ${result.latencyMs}ms | DB: ${result.databaseId} | Client: ${result.source.toUpperCase()} | Status: Write & Read Verified!`);
      } else {
        setProbeResult(`Probe Warning: ${result.error || 'Connection check completed'}`);
      }
    } catch (e: any) {
      setProbeResult(`Probe Failure: ${e?.message || 'Error executing probe'}`);
    } finally {
      setIsProbing(false);
    }
  };

  // If NOT authenticated, show the Password Security Lock Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md bg-[#242c18] border-2 border-[#52653a] rounded-3xl p-8 sm:p-10 shadow-2xl text-white relative overflow-hidden">
          {/* Subtle watermark background glow */}
          <div className="absolute -right-16 -top-16 w-44 h-44 rounded-full bg-[#5b6e41]/20 blur-3xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 w-44 h-44 rounded-full bg-[#c4a159]/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 text-center">
            <div className="inline-flex p-4 rounded-2xl bg-[#344222] border border-[#5b6e41] text-[#e5d4aa] mb-5 shadow-inner">
              <Lock className="w-8 h-8 text-[#c4a159]" />
            </div>

            <span className="inline-block px-3 py-1 rounded-full bg-[#3b4928] text-[#e5d4aa] text-[11px] font-bold uppercase tracking-widest border border-[#52653a] mb-2">
              Cultrahus Administrative Secretariat
            </span>

            <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-white">
              Restricted Admin Portal
            </h1>
            <p className="text-xs sm:text-sm text-[#b8c5a8] mt-2 mb-6">
              Enter your administrative password to access the real-time Firebase attendee console and attendee dossiers.
            </p>

            {authError && (
              <div className="mb-6 p-3.5 rounded-xl bg-rose-950/80 border border-rose-700/80 text-rose-200 text-xs font-semibold flex items-center gap-2 text-left">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-[#e5d4aa] uppercase tracking-wider mb-2">
                  Admin Access Password
                </label>
                <div className="relative">
                  <input
                    id="admin-password-input"
                    type={showPassword ? 'text' : 'password'}
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Enter admin password..."
                    autoFocus
                    required
                    className="w-full pl-4 pr-12 py-3 rounded-xl bg-[#181f10] border border-[#52653a] text-white placeholder-[#7d8e6a] text-sm focus:outline-none focus:border-[#c4a159] transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-[#a8b896] hover:text-white transition"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                id="admin-login-btn"
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl bg-[#c4a159] hover:bg-[#d6b46c] text-[#1c2414] font-bold text-sm tracking-wide transition shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Unlock Registry Console</span>
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-[#3b4928] text-[11px] text-[#8e9e7c]">
              Protected by Cultrahus Organization Security Protocols. Unauthorized access attempts are monitored and recorded.
            </div>
          </div>
        </div>
      </div>
    );
  }

  // When Authenticated, render the complete Admin Portal
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner */}
      <div className="bg-[#242c18] border-2 border-[#52653a] rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3b4928] text-[#e5d4aa] text-xs font-bold uppercase tracking-wider border border-[#52653a]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Authenticated Secretariat Portal</span>
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#1b2212] text-[#c8d4bb] text-xs font-medium border border-[#3e4a2b]">
                <MapPin className="w-3 h-3 text-[#c4a159]" />
                <span>Event: Vedanta Farms, Bhiwadi</span>
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-4xl font-extrabold text-white">
              Cultrahus Attendee Database
            </h1>
            <p className="text-xs sm:text-sm text-[#b8c5a8] mt-2 max-w-2xl">
              Live Firestore synchronization across distinct collections: 
              <span className="text-[#e5d4aa] font-mono"> delegates, tickets, troupes, secretariat, sponsors, inquiries, registrations</span>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              id="purge-mock-btn"
              onClick={handlePurgeMock}
              title="Remove all already added dummy or mock entries"
              className="px-3.5 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 text-rose-200 text-xs font-bold border border-rose-800/60 transition flex items-center gap-1.5 shadow"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clean Test Data</span>
            </button>

            <button
              id="verify-db-btn"
              onClick={handleVerifyCollections}
              className="px-3.5 py-2 rounded-xl bg-[#3b4928] hover:bg-[#4a5e33] text-[#e5d4aa] text-xs font-bold border border-[#52653a] transition flex items-center gap-1.5 shadow"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Sync Firestore</span>
            </button>

            <button
              id="probe-db-btn"
              onClick={handleRunDiagnosticProbe}
              disabled={isProbing}
              title="Run live read/write latency test against Firestore"
              className="px-3.5 py-2 rounded-xl bg-[#232c17] hover:bg-[#323f21] text-emerald-300 text-xs font-bold border border-[#485b30] transition flex items-center gap-1.5 shadow disabled:opacity-50 cursor-pointer"
            >
              <Activity className={`w-3.5 h-3.5 ${isProbing ? 'animate-spin' : 'text-emerald-400'}`} />
              <span>{isProbing ? 'Testing DB...' : 'Test Live DB'}</span>
            </button>

            <button
              id="export-csv-btn"
              onClick={handleExportCSV}
              className="px-3.5 py-2 rounded-xl bg-[#c4a159] hover:bg-[#d6b46c] text-[#1c2414] text-xs font-bold transition flex items-center gap-1.5 shadow"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            <button
              id="admin-logout-btn"
              onClick={handleSignOut}
              title="Lock Admin Portal and Sign Out"
              className="px-3.5 py-2 rounded-xl bg-[#1b2212] hover:bg-[#2d381c] text-[#e5d4aa] text-xs font-bold border border-[#4a5a32] transition flex items-center gap-1.5 shadow cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-300" />
              <span>Lock Portal</span>
            </button>
          </div>
        </div>

        {dbNotice && (
          <div className="mt-4 p-3 rounded-xl bg-[#344222] border border-[#5b6e41] text-[#e5d4aa] text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-3.5 h-3.5 shrink-0 text-[#c4a159]" />
              <span>{dbNotice}</span>
            </div>
            <button onClick={() => setDbNotice(null)} className="text-[#a8b896] hover:text-white text-xs">Dismiss</button>
          </div>
        )}

        {probeResult && (
          <div className="mt-3 p-3 rounded-xl bg-[#1b2513] border border-emerald-700/60 text-emerald-200 text-xs flex items-center justify-between shadow">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 shrink-0 text-emerald-400" />
              <span className="font-mono">{probeResult}</span>
            </div>
            <button onClick={() => setProbeResult(null)} className="text-[#a8b896] hover:text-white text-xs">Dismiss</button>
          </div>
        )}
      </div>

      {/* Real-time Metric Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="p-4 rounded-2xl bg-[#ede4d2] border border-[#cfc4ad] text-center">
          <div className="text-[11px] uppercase tracking-wider text-[#556345] font-bold">Total Enrolled</div>
          <div className="text-xl sm:text-2xl font-serif font-extrabold text-[#242c18] mt-1">{stats.total}</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#ede4d2] border border-[#cfc4ad] text-center">
          <div className="text-[11px] uppercase tracking-wider text-[#556345] font-bold">Delegates</div>
          <div className="text-xl sm:text-2xl font-serif font-extrabold text-[#242c18] mt-1">{stats.delegates}</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#ede4d2] border border-[#cfc4ad] text-center">
          <div className="text-[11px] uppercase tracking-wider text-[#556345] font-bold">Passes</div>
          <div className="text-xl sm:text-2xl font-serif font-extrabold text-[#242c18] mt-1">{stats.tickets}</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#ede4d2] border border-[#cfc4ad] text-center">
          <div className="text-[11px] uppercase tracking-wider text-[#556345] font-bold">Troupes</div>
          <div className="text-xl sm:text-2xl font-serif font-extrabold text-[#242c18] mt-1">{stats.plays}</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#ede4d2] border border-[#cfc4ad] text-center">
          <div className="text-[11px] uppercase tracking-wider text-[#556345] font-bold">Secretariat</div>
          <div className="text-xl sm:text-2xl font-serif font-extrabold text-[#242c18] mt-1">{stats.secretariat}</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#ede4d2] border border-[#cfc4ad] text-center">
          <div className="text-[11px] uppercase tracking-wider text-[#556345] font-bold">Checked-In</div>
          <div className="text-xl sm:text-2xl font-serif font-extrabold text-emerald-800 mt-1">{stats.checkedIn}</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#ede4d2] border border-[#cfc4ad] text-center col-span-2 sm:col-span-1">
          <div className="text-[11px] uppercase tracking-wider text-[#556345] font-bold">Revenue</div>
          <div className="text-lg sm:text-xl font-serif font-extrabold text-[#242c18] mt-1">₹{stats.totalRevenue.toLocaleString('en-IN')}</div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'all', label: 'All Records', count: stats.total },
            { id: 'delegates', label: 'Delegates', count: stats.delegates },
            { id: 'tickets', label: 'Passes', count: stats.tickets },
            { id: 'plays', label: 'Troupes', count: stats.plays },
            { id: 'secretariat', label: 'Secretariat', count: stats.secretariat },
            { id: 'sponsors', label: 'Sponsors', count: stats.sponsors },
            { id: 'inquiries', label: 'Inquiries', count: stats.inquiries },
          ].map((tab) => (
            <button
              key={tab.id}
              id={`filter-tab-${tab.id}`}
              onClick={() => setActiveCategory(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeCategory === tab.id
                  ? 'bg-[#3b4928] text-[#f7f4ec] shadow-xs'
                  : 'bg-white/80 text-[#242c18] hover:bg-white border border-[#cfc4ad]'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                activeCategory === tab.id ? 'bg-[#e5d4aa] text-[#242c18]' : 'bg-[#ede4d2] text-[#556345]'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search & Status Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 text-[#556345] absolute left-3.5 top-3" />
            <input
              id="admin-search-input"
              type="text"
              placeholder="Search Code, Name, Email, Phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-[#cfc4ad] text-xs text-[#242c18] focus:outline-none focus:border-[#3b4928]"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#556345]" />
            <select
              id="admin-status-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white border border-[#cfc4ad] text-xs text-[#242c18] focus:outline-none focus:border-[#3b4928]"
            >
              <option value="all">All Statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="checked-in">Checked In</option>
              <option value="pending">Pending</option>
              <option value="under-review">Under Review</option>
            </select>
          </div>
        </div>
      </div>

      {/* Registrations Table */}
      <div className="bg-[#faf8f5] border-2 border-[#cfc4ad] rounded-3xl shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-[#dfd7c3] flex items-center justify-between">
          <h2 className="font-serif font-bold text-lg text-[#242c18]">
            Attendee Registry &amp; Dossiers ({filteredRecords.length})
          </h2>
          <span className="text-xs text-[#556345]">
            Showing {filteredRecords.length} of {records.length} records in Firestore
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-[#556345] space-y-2">
            <RefreshCw className="w-5 h-5 animate-spin mx-auto text-[#5b6e41]" />
            <div>Loading live records from Firestore collections...</div>
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#556345]">
            No records match the current filter or search criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#242c18]">
              <thead className="bg-[#ede4d2] text-[#43522f] uppercase tracking-wider font-bold border-b border-[#dfd7c3]">
                <tr>
                  <th className="py-3.5 px-4">Tracking Code</th>
                  <th className="py-3.5 px-4">Participant Details</th>
                  <th className="py-3.5 px-4">Category / Collection</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Platform Origin</th>
                  <th className="py-3.5 px-4">Amount Paid</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Dossier Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#dfd7c3]">
                {filteredRecords.map((r) => {
                  const isCheckedIn = r.status === 'checked-in';
                  const isVercel = r.source === 'vercel' || (r.sourceUrl && r.sourceUrl.includes('vercel'));
                  return (
                    <tr key={r.id} className="hover:bg-[#f4efe4]/60 transition-colors">
                      {/* Code */}
                      <td className="py-3.5 px-4 font-mono font-bold whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setSelectedDossier(r)}
                            className="px-2 py-0.5 rounded bg-white hover:bg-[#f2ede2] border border-[#cfc4ad] text-[#242c18] transition text-left cursor-pointer"
                            title="Click to view complete dossier"
                          >
                            {r.uniqueCode}
                          </button>
                          <button
                            onClick={() => handleCopy(r.uniqueCode)}
                            title="Copy Code"
                            className="p-1 text-[#556345] hover:text-[#242c18] rounded hover:bg-[#ede4d2]"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                          {copiedCode === r.uniqueCode && (
                            <span className="text-[10px] text-emerald-700 font-bold">Copied!</span>
                          )}
                        </div>
                      </td>

                      {/* Participant */}
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => setSelectedDossier(r)}
                          className="font-bold text-sm text-[#242c18] hover:text-[#5b6e41] text-left block cursor-pointer transition"
                        >
                          {r.name}
                        </button>
                        <div className="text-[11px] text-[#556345]">
                          {r.organization || r.troupeName || r.brandName || 'Independent Participant'}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 flex-wrap mb-1">
                          <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#ebf0e2] text-[#344222] border border-[#c3d3b4]">
                            {r._category || r.type}
                          </span>
                          <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold bg-[#dfd7c3] text-[#242c18] border border-[#c5ba9f]">
                            col/{getCollectionNameForType(r.type)}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#556345]">
                          {r.ticketTier || r.participationCategory || r.department || r.sponsorTier || r.inquiryCategory || 'Standard'}
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="py-3.5 px-4">
                        <div>
                          <a href={`mailto:${r.email}`} className="hover:underline text-[#242c18]">
                            {r.email}
                          </a>
                        </div>
                        {r.phone && (
                          <div className="font-mono text-[11px] text-[#556345] flex items-center gap-1 mt-0.5">
                            <Phone className="w-2.5 h-2.5" />
                            <a href={`https://wa.me/91${r.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="hover:text-emerald-700">
                              {r.phone}
                            </a>
                          </div>
                        )}
                      </td>

                      {/* Platform Origin */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {isVercel ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#181f10] text-white text-[10px] font-mono font-bold tracking-tight border border-[#3e4a2b] shadow-2xs">
                            <span className="text-white text-[8px]">▲</span> Vercel
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#ede4d2] text-[#4a5a32] text-[10px] font-mono font-semibold border border-[#cfc4ad]">
                            <Globe className="w-2.5 h-2.5 text-[#556345]" /> Direct
                          </span>
                        )}
                        {r.sourceUrl && (
                          <div className="text-[9px] text-[#738363] truncate max-w-[110px] font-mono mt-0.5" title={r.sourceUrl}>
                            {r.sourceUrl.replace(/^https?:\/\//, '')}
                          </div>
                        )}
                      </td>

                      {/* Amount Paid */}
                      <td className="py-3.5 px-4 font-bold">
                        {r.amountPaid ? `₹${r.amountPaid.toLocaleString('en-IN')}` : '₹0'}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleToggleCheckIn(r)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition cursor-pointer ${
                            isCheckedIn
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-[#ede4d2] text-[#384626] border border-[#cfc4ad] hover:bg-[#e1d5bd]'
                          }`}
                        >
                          <CheckCircle className={`w-3 h-3 ${isCheckedIn ? 'text-emerald-700' : 'text-[#556345]'}`} />
                          <span>{isCheckedIn ? 'Checked-In' : r.status || 'Confirmed'}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Full Dossier Button */}
                          <button
                            onClick={() => setSelectedDossier(r)}
                            title="View Complete Attendee Dossier"
                            className="px-2.5 py-1 rounded-lg bg-[#ede4d2] hover:bg-[#dfd7c3] text-[#242c18] font-bold text-[11px] border border-[#cfc4ad] flex items-center gap-1 transition cursor-pointer"
                          >
                            <FileText className="w-3 h-3 text-[#5b6e41]" />
                            <span className="hidden sm:inline">Dossier</span>
                          </button>

                          {/* Print Pass */}
                          <button
                            onClick={() => openPassModal(r)}
                            title="View / Print Digital Pass"
                            className="p-1.5 rounded-lg bg-[#3b4928] text-[#e5d4aa] hover:bg-[#4a5e33] transition cursor-pointer"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => handleDelete(r.id, r.name, r.type)}
                            title="Delete Record"
                            className="p-1.5 rounded-lg text-[#9b1c1c] hover:bg-rose-50 transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* FULL ATTENDEE DOSSIER MODAL */}
      {selectedDossier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-[#fcfbf9] border-2 border-[#52653a] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6 text-[#242c18] relative animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[#dfd7c3] pb-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#3b4928] text-[#e5d4aa]">
                    {selectedDossier._category || selectedDossier.type}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#dfd7c3] text-[#242c18] font-bold">
                    Collection: {getCollectionNameForType(selectedDossier.type)}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-100 text-emerald-800 font-bold">
                    Status: {selectedDossier.status.toUpperCase()}
                  </span>
                </div>
                <h2 className="font-serif text-2xl font-extrabold text-[#242c18]">
                  {selectedDossier.name}
                </h2>
                <div className="text-xs text-[#556345] mt-0.5">
                  {selectedDossier.organization || selectedDossier.troupeName || selectedDossier.brandName || 'Independent Participant'} • {selectedDossier.cityState || 'Bhiwadi'}
                </div>
              </div>

              <button
                onClick={() => setSelectedDossier(null)}
                className="p-2 rounded-xl bg-[#ede4d2] hover:bg-[#dfd7c3] text-[#242c18] transition cursor-pointer"
                title="Close Dossier"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tracking Code Banner */}
            <div className="p-4 rounded-2xl bg-[#ede4d2] border border-[#cfc4ad] flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <div className="text-[10px] uppercase font-bold text-[#556345] tracking-wider">Accreditation Tracking Code</div>
                <div className="font-mono text-lg font-extrabold text-[#242c18]">{selectedDossier.uniqueCode}</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(selectedDossier.uniqueCode)}
                  className="px-3 py-1.5 rounded-xl bg-white border border-[#cfc4ad] text-xs font-bold text-[#242c18] hover:bg-[#f7f4ec] transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedCode === selectedDossier.uniqueCode ? 'Copied!' : 'Copy Code'}</span>
                </button>
                <button
                  onClick={() => openPassModal(selectedDossier)}
                  className="px-3 py-1.5 rounded-xl bg-[#3b4928] text-[#e5d4aa] text-xs font-bold hover:bg-[#4a5e33] transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Pass</span>
                </button>
              </div>
            </div>

            {/* Complete Field Details Grid */}
            <div className="space-y-4">
              <h3 className="font-serif font-bold text-base text-[#242c18] border-b border-[#dfd7c3] pb-1">
                Full Registration Dossier Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-white border border-[#dfd7c3] space-y-1">
                  <span className="font-bold text-[#556345] block text-[10px] uppercase">Contact Information</span>
                  <div className="font-medium text-[#242c18]">{selectedDossier.email}</div>
                  <div className="font-mono text-[#556345]">{selectedDossier.phone || 'No phone provided'}</div>
                  <div className="pt-2 flex items-center gap-2">
                    <a
                      href={`mailto:${selectedDossier.email}`}
                      className="px-2 py-1 rounded bg-[#ebf0e2] text-[#3b4928] font-bold text-[10px] hover:bg-[#dbe6cf]"
                    >
                      Email Attendee
                    </a>
                    {selectedDossier.phone && (
                      <a
                        href={`https://wa.me/91${selectedDossier.phone.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2 py-1 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px] hover:bg-emerald-200"
                      >
                        WhatsApp Chat
                      </a>
                    )}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white border border-[#dfd7c3] space-y-1">
                  <span className="font-bold text-[#556345] block text-[10px] uppercase">Institution &amp; Region</span>
                  <div className="font-medium text-[#242c18]">{selectedDossier.organization || 'Independent'}</div>
                  <div className="text-[#556345]">{selectedDossier.cityState || 'Bhiwadi, Rajasthan (NCR)'}</div>
                  {selectedDossier.designation && (
                    <div className="text-[11px] text-[#242c18] italic mt-1">Designation: {selectedDossier.designation}</div>
                  )}
                </div>

                <div className="p-3 rounded-xl bg-white border border-[#dfd7c3] space-y-1">
                  <span className="font-bold text-[#556345] block text-[10px] uppercase">Category &amp; Event Track</span>
                  <div className="font-semibold text-[#242c18]">
                    {selectedDossier.ticketTier || selectedDossier.participationCategory || selectedDossier.department || selectedDossier.sponsorTier || 'General'}
                  </div>
                  {selectedDossier.parliamentTrack && (
                    <div className="text-[#556345]">Track: {selectedDossier.parliamentTrack}</div>
                  )}
                  {selectedDossier.foodAddon && (
                    <div className="text-[#556345]">Hospitality: {selectedDossier.foodAddon}</div>
                  )}
                  {selectedDossier.seats && selectedDossier.seats.length > 0 && (
                    <div className="font-mono text-[#556345]">Seats: {selectedDossier.seats.join(', ')}</div>
                  )}
                </div>

                <div className="p-3 rounded-xl bg-white border border-[#dfd7c3] space-y-1">
                  <span className="font-bold text-[#556345] block text-[10px] uppercase">Financials &amp; Timestamp</span>
                  <div className="font-bold text-[#242c18] text-sm">
                    {selectedDossier.amountPaid ? `₹${selectedDossier.amountPaid.toLocaleString('en-IN')}` : 'Accredited Free / ₹0'}
                  </div>
                  <div className="text-[#556345]">
                    Enrolled: {selectedDossier.createdAt ? new Date(selectedDossier.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : 'Recent'}
                  </div>
                  <div className="text-[10px] font-mono text-[#7a8a68]">
                    Doc ID: {selectedDossier.id}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white border border-[#dfd7c3] space-y-1 sm:col-span-2">
                  <span className="font-bold text-[#556345] block text-[10px] uppercase">Deployment Source &amp; Firestore Connection</span>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {selectedDossier.source === 'vercel' || (selectedDossier.sourceUrl && selectedDossier.sourceUrl.includes('vercel')) ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#181f10] text-white text-[11px] font-mono font-bold">
                          <span className="text-white text-[9px]">▲</span> Vercel Production
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#ebf0e2] text-[#344222] text-[11px] font-bold">
                          <Globe className="w-3 h-3 text-[#556345]" /> Direct Web
                        </span>
                      )}
                      <span className="text-[11px] font-mono text-[#556345] bg-[#f4efe4] px-2 py-0.5 rounded border border-[#dfd7c3]">
                        {selectedDossier.sourceUrl || 'https://cultrahus-organization.vercel.app'}
                      </span>
                    </div>
                    <div className="text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      ✓ Synchronized to DB ai-studio-1959e55b-78c9-4673-be88-b7d93b87ba81
                    </div>
                  </div>
                </div>
              </div>

              {/* Extended fields for Troupe submissions */}
              {(selectedDossier.playTitle || selectedDossier.synopsis || selectedDossier.technicalRider) && (
                <div className="p-4 rounded-2xl bg-white border border-[#dfd7c3] space-y-2 text-xs">
                  <span className="font-bold text-[#556345] block text-[10px] uppercase tracking-wider">
                    Theatre Troupe &amp; Play Details
                  </span>
                  <div className="font-bold text-sm text-[#242c18]">
                    Play Title: "{selectedDossier.playTitle}"
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-[#556345]">
                    <div>Director: <span className="text-[#242c18] font-medium">{selectedDossier.director || selectedDossier.name}</span></div>
                    <div>Playwright: <span className="text-[#242c18] font-medium">{selectedDossier.playwright || 'Original'}</span></div>
                    <div>Cast &amp; Crew: <span className="text-[#242c18] font-medium">{selectedDossier.castCrewCount || 1} members</span></div>
                    <div>Duration: <span className="text-[#242c18] font-medium">{selectedDossier.durationMinutes || 45} mins</span></div>
                  </div>
                  {selectedDossier.synopsis && (
                    <div className="pt-2 border-t border-[#ede4d2]">
                      <span className="font-bold text-[#242c18] block text-[11px]">Play Synopsis:</span>
                      <p className="text-[#556345] leading-relaxed mt-0.5">{selectedDossier.synopsis}</p>
                    </div>
                  )}
                  {selectedDossier.technicalRider && (
                    <div className="pt-2 border-t border-[#ede4d2]">
                      <span className="font-bold text-[#242c18] block text-[11px]">Technical Rider / Stage Lights:</span>
                      <p className="text-[#556345] leading-relaxed mt-0.5">{selectedDossier.technicalRider}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Extended fields for Secretariat applications */}
              {(selectedDossier.whyJoin || selectedDossier.timeCommitment || selectedDossier.priorExperience) && (
                <div className="p-4 rounded-2xl bg-white border border-[#dfd7c3] space-y-2 text-xs">
                  <span className="font-bold text-[#556345] block text-[10px] uppercase tracking-wider">
                    Secretariat Candidate Dossier
                  </span>
                  {selectedDossier.department && (
                    <div>Department: <span className="font-bold text-[#242c18]">{selectedDossier.department}</span></div>
                  )}
                  {selectedDossier.whyJoin && (
                    <div>
                      <span className="font-bold text-[#242c18] block">Why Join Statement:</span>
                      <p className="text-[#556345] mt-0.5 leading-relaxed">{selectedDossier.whyJoin}</p>
                    </div>
                  )}
                  {selectedDossier.priorExperience && (
                    <div>
                      <span className="font-bold text-[#242c18] block">Prior Background:</span>
                      <p className="text-[#556345] mt-0.5 leading-relaxed">{selectedDossier.priorExperience}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Extended fields for Sponsor & Inquiry */}
              {(selectedDossier.proposalNotes || selectedDossier.message) && (
                <div className="p-4 rounded-2xl bg-white border border-[#dfd7c3] space-y-2 text-xs">
                  <span className="font-bold text-[#556345] block text-[10px] uppercase tracking-wider">
                    Proposal / Inquiry Submission
                  </span>
                  {selectedDossier.subject && (
                    <div className="font-bold text-[#242c18]">Subject: {selectedDossier.subject}</div>
                  )}
                  <p className="text-[#556345] leading-relaxed">
                    {selectedDossier.proposalNotes || selectedDossier.message}
                  </p>
                </div>
              )}
            </div>

            {/* Status Manager and Action Bar */}
            <div className="pt-4 border-t border-[#dfd7c3] flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#556345]">Update Status:</span>
                <select
                  value={selectedDossier.status}
                  onChange={(e) => handleStatusChange(selectedDossier, e.target.value as RegistrationRecord['status'])}
                  className="px-3 py-1.5 rounded-xl bg-white border border-[#cfc4ad] text-xs font-bold text-[#242c18] focus:outline-none focus:border-[#3b4928]"
                >
                  <option value="confirmed">Confirmed</option>
                  <option value="checked-in">Checked In</option>
                  <option value="pending">Pending</option>
                  <option value="under-review">Under Review</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDelete(selectedDossier.id, selectedDossier.name, selectedDossier.type)}
                  className="px-3.5 py-1.5 rounded-xl bg-rose-50 text-rose-800 hover:bg-rose-100 text-xs font-bold border border-rose-200 transition flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Dossier</span>
                </button>
                <button
                  onClick={() => setSelectedDossier(null)}
                  className="px-4 py-1.5 rounded-xl bg-[#ede4d2] hover:bg-[#dfd7c3] text-[#242c18] text-xs font-bold transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
