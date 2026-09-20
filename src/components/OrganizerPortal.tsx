import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Download, 
  RefreshCw, 
  ExternalLink, 
  CheckCircle, 
  Clock, 
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
  Sparkles
} from 'lucide-react';
import { 
  subscribeToRegistrations, 
  updateParticipantStatus, 
  deleteParticipant, 
  calculateStats,
  ensureInitialCollectionsAndData,
  purgeAllMockData,
  getCollectionNameForType
} from '../services/registrationService';
import { RegistrationRecord, DigitalPassData } from '../types';

interface OrganizerPortalProps {
  onPassGenerated: (passData: DigitalPassData) => void;
}

export const OrganizerPortal: React.FC<OrganizerPortalProps> = ({ onPassGenerated }) => {
  const [records, setRecords] = useState<RegistrationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'error'>('syncing');
  const [dbNotice, setDbNotice] = useState<string | null>(null);

  useEffect(() => {
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
  }, []);

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
      (r.brandName && r.brandName.toLowerCase().includes(q))
    );
  });

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleToggleCheckIn = async (record: RegistrationRecord) => {
    const nextStatus = record.status === 'checked-in' ? 'confirmed' : 'checked-in';
    await updateParticipantStatus(record.id, nextStatus);
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove registration for "${name}"? This will delete it from the registry.`)) {
      await deleteParticipant(id);
    }
  };

  const handleExportCSV = () => {
    if (records.length === 0) return;
    const headers = ['Unique Code', 'Category', 'Name', 'Email', 'Phone', 'Organization / College', 'Tier / Subcategory', 'Amount Paid', 'Status', 'Registered At'];
    const rows = records.map(r => [
      `"${r.uniqueCode}"`,
      `"${r._category || r.type}"`,
      `"${(r.name || '').replace(/"/g, '""')}"`,
      `"${r.email || ''}"`,
      `"${r.phone || ''}"`,
      `"${(r.organization || r.troupeName || r.brandName || '').replace(/"/g, '""')}"`,
      `"${(r.ticketTier || r.participationCategory || r.department || r.sponsorTier || '').replace(/"/g, '""')}"`,
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
      title = `${record.tierName || 'Auditorium Pass'} (${record.quantity || 1} Pass)`;
      detail1Label = 'Ticket Quantity';
      detail1Value = `${record.quantity || 1} Pass(es)`;
      detail2Label = 'Evening Inclusions';
      detail2Value = 'Garba & DJ Night Included';
    } else if (cat === 'plays') {
      title = `Troupe: ${record.troupeName || record.organization}`;
      detail1Label = 'Play Title';
      detail1Value = record.playTitle || 'Stage Drama';
      detail2Label = 'Cast Size';
      detail2Value = `${record.castCrewCount || 10} Artists`;
    } else if (cat === 'secretariat') {
      title = `Secretariat Candidate: ${record.department || 'Outreach'}`;
      detail1Label = 'Department';
      detail1Value = record.department || 'Management';
      detail2Label = 'Commitment';
      detail2Value = record.timeCommitment || '10-15 hrs/wk';
    } else if (cat === 'sponsors') {
      title = `Sponsor: ${record.brandName || record.organization}`;
      detail1Label = 'Package';
      detail1Value = record.sponsorTier || 'Partner';
      detail2Label = 'Corporate Intent';
      detail2Value = 'Brand Activation';
    }

    onPassGenerated({
      type: record.type,
      code: record.uniqueCode,
      title,
      fullName: record.name,
      email: record.email,
      phone: record.phone,
      detail1Label,
      detail1Value,
      detail2Label,
      detail2Value,
      feePaid: record.amountPaid ? `₹${record.amountPaid.toLocaleString('en-IN')}` : 'Accredited / Waived',
      status: record.status || 'Confirmed',
      issuedIst: new Date(record.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    });
  };

  const handleVerifyCollections = async () => {
    setSyncStatus('syncing');
    const res = await ensureInitialCollectionsAndData();
    if (res.success) {
      setDbNotice(res.message);
      setSyncStatus('synced');
    } else {
      setDbNotice(`Sync notice: ${res.message}`);
      setSyncStatus('synced');
    }
  };

  const handlePurgeMock = async () => {
    if (window.confirm('Remove all pre-seeded dummy/mock records? This will clear any test entries so only genuine submissions remain.')) {
      setSyncStatus('syncing');
      const res = await purgeAllMockData();
      setDbNotice(res.message);
      setSyncStatus('synced');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner */}
      <div className="bg-[#242c18] text-[#f4efe4] rounded-3xl p-6 sm:p-8 shadow-xl border border-[#3e4a2b]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3b4928] text-[#e5d4aa] text-xs font-bold uppercase tracking-wider border border-[#52653a]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Restricted Organizer Registration Registry</span>
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#1b2212] text-[#c8d4bb] text-xs font-medium border border-[#3e4a2b]">
                <MapPin className="w-3 h-3 text-[#c4a159]" />
                <span>Event: Bhiwadi (Venue: TBA)</span>
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-4xl font-extrabold text-white">
              Cultrahus Attendee Database
            </h1>
            <p className="text-xs sm:text-sm text-[#b8c5a8] mt-2 max-w-2xl">
              Real-time Firestore database synchronization across distinct collections: 
              <span className="text-[#e5d4aa] font-mono"> delegates, tickets, troupes, secretariat, sponsors, inquiries</span>.
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
              <span>Remove Added Mock Data</span>
            </button>

            <button
              id="verify-db-btn"
              onClick={handleVerifyCollections}
              className="px-3.5 py-2 rounded-xl bg-[#3b4928] hover:bg-[#4a5e33] text-[#e5d4aa] text-xs font-bold border border-[#52653a] transition flex items-center gap-1.5 shadow"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Verify Collections</span>
            </button>

            <button
              id="export-csv-btn"
              onClick={handleExportCSV}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition flex items-center gap-1.5 border border-white/20"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            <a
              id="firebase-console-link"
              href="https://console.firebase.google.com/project/gen-lang-client-0428383827/firestore/databases/ai-studio-1959e55b-78c9-4673-be88-b7d93b87ba81/data"
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 rounded-xl bg-[#c4a159] hover:bg-[#b08e48] text-[#242c18] text-xs font-bold transition flex items-center gap-1.5 shadow"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Firebase Console</span>
            </a>
          </div>
        </div>

        {/* Database Status Alert */}
        <div className="mt-6 pt-4 border-t border-[#3e4a2b] flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#b8c5a8] gap-2">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                syncStatus === 'synced' ? 'bg-emerald-400 animate-pulse' : syncStatus === 'syncing' ? 'bg-amber-400' : 'bg-rose-400'
              }`}
            />
            <span className="font-mono text-[11px]">
              Database: <strong className="text-white">ai-studio-1959e55b-78c9-4673-be88-b7d93b87ba81</strong> (Live Sync Active)
            </span>
          </div>

          <div className="font-mono text-[11px] text-[#e5d4aa]">
            Admin Lead: cultrahusorganization@gmail.com
          </div>
        </div>
      </div>

      {/* Stats Counter Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <div className="bg-[#faf8f5] border border-[#cfc4ad] rounded-2xl p-4 text-center shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-[#556345] tracking-wider block mb-1">
            Total Registrations
          </span>
          <span className="font-serif font-extrabold text-2xl text-[#242c18]">
            {stats.total}
          </span>
        </div>

        <div className="bg-[#faf8f5] border border-[#cfc4ad] rounded-2xl p-4 text-center shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-[#556345] tracking-wider block mb-1">
            Delegates
          </span>
          <span className="font-serif font-extrabold text-2xl text-[#3b4928]">
            {stats.delegates}
          </span>
        </div>

        <div className="bg-[#faf8f5] border border-[#cfc4ad] rounded-2xl p-4 text-center shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-[#556345] tracking-wider block mb-1">
            Auditorium Passes
          </span>
          <span className="font-serif font-extrabold text-2xl text-[#3b4928]">
            {stats.tickets}
          </span>
        </div>

        <div className="bg-[#faf8f5] border border-[#cfc4ad] rounded-2xl p-4 text-center shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-[#556345] tracking-wider block mb-1">
            Plays &amp; Troupes
          </span>
          <span className="font-serif font-extrabold text-2xl text-[#3b4928]">
            {stats.plays}
          </span>
        </div>

        <div className="bg-[#faf8f5] border border-[#cfc4ad] rounded-2xl p-4 text-center shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-[#556345] tracking-wider block mb-1">
            Secretariat
          </span>
          <span className="font-serif font-extrabold text-2xl text-[#3b4928]">
            {stats.secretariat}
          </span>
        </div>

        <div className="bg-[#faf8f5] border border-[#cfc4ad] rounded-2xl p-4 text-center shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-[#556345] tracking-wider block mb-1">
            Sponsors
          </span>
          <span className="font-serif font-extrabold text-2xl text-[#3b4928]">
            {stats.sponsors}
          </span>
        </div>

        <div className="bg-[#faf8f5] border border-[#cfc4ad] rounded-2xl p-4 text-center shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-[#556345] tracking-wider block mb-1">
            Checked-In
          </span>
          <span className="font-serif font-extrabold text-2xl text-emerald-700">
            {stats.checkedIn}
          </span>
        </div>

        <div className="bg-[#faf8f5] border border-[#cfc4ad] rounded-2xl p-4 text-center shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-[#556345] tracking-wider block mb-1">
            Total Revenue
          </span>
          <span className="font-serif font-extrabold text-xl text-[#242c18]">
            ₹{stats.totalRevenue.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#ede4d2] border-2 border-[#cfc4ad] rounded-3xl p-4 sm:p-6 shadow-sm space-y-4">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'all', label: 'All Records', count: stats.total },
            { id: 'delegates', label: 'Delegates (₹650)', count: stats.delegates },
            { id: 'tickets', label: 'Passes', count: stats.tickets },
            { id: 'plays', label: 'Troupes & Plays', count: stats.plays },
            { id: 'secretariat', label: 'Secretariat', count: stats.secretariat },
            { id: 'sponsors', label: 'Sponsors', count: stats.sponsors },
            { id: 'inquiries', label: 'Inquiries', count: stats.inquiries },
          ].map((tab) => (
            <button
              key={tab.id}
              id={`filter-tab-${tab.id}`}
              onClick={() => setActiveCategory(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
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
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#556345] absolute left-3.5 top-3" />
            <input
              id="admin-search-input"
              type="text"
              placeholder="Search by Code (SNGM-...), Name, Email, Phone, or Institution..."
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

      {/* Registrations Table / Grid */}
      <div className="bg-[#faf8f5] border-2 border-[#cfc4ad] rounded-3xl shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-[#dfd7c3] flex items-center justify-between">
          <h2 className="font-serif font-bold text-lg text-[#242c18]">
            Registered Attendees &amp; Dossiers ({filteredRecords.length})
          </h2>
          <span className="text-xs text-[#556345]">
            Showing {filteredRecords.length} of {records.length} records
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-[#556345]">
            Loading real-time records from Firestore...
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
                  <th className="py-3 px-4">Tracking Code</th>
                  <th className="py-3 px-4">Participant Details</th>
                  <th className="py-3 px-4">Category / Tier</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Amount Paid</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#dfd7c3]">
                {filteredRecords.map((r) => {
                  const isCheckedIn = r.status === 'checked-in';
                  return (
                    <tr key={r.id} className="hover:bg-[#f4efe4]/60 transition-colors">
                      {/* Code */}
                      <td className="py-3.5 px-4 font-mono font-bold whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded bg-white border border-[#cfc4ad] text-[#242c18]">
                            {r.uniqueCode}
                          </span>
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
                        <div className="font-bold text-sm text-[#242c18]">
                          {r.name}
                        </div>
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
                        <div>{r.email}</div>
                        {r.phone && <div className="font-mono text-[11px] text-[#556345]">{r.phone}</div>}
                      </td>

                      {/* Amount Paid */}
                      <td className="py-3.5 px-4 font-bold">
                        {r.amountPaid ? `₹${r.amountPaid.toLocaleString('en-IN')}` : '₹0'}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleToggleCheckIn(r)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition ${
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
                          <button
                            onClick={() => openPassModal(r)}
                            title="View / Print Digital Credential"
                            className="p-1.5 rounded-lg bg-[#3b4928] text-[#e5d4aa] hover:bg-[#4a5e33] transition"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(r.id, r.name)}
                            title="Delete Record"
                            className="p-1.5 rounded-lg text-[#9b1c1c] hover:bg-rose-50 transition"
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
    </div>
  );
};
