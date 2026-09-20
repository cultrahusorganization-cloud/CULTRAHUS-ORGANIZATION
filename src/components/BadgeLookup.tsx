import React, { useState } from 'react';
import { RegistrationRecord } from '../types';
import { findByCode } from '../services/registrationService';
import { useTheme } from '../context/ThemeContext';
import { Search, CheckCircle, XCircle, UserCheck, Ticket, QrCode } from 'lucide-react';

export const BadgeLookup: React.FC = () => {
  const { theme, config } = useTheme();
  const [code, setCode] = useState('');
  const [searched, setSearched] = useState(false);
  const [result, setResult] = useState<RegistrationRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [printNotice, setPrintNotice] = useState<string | null>(null);

  const handlePrint = () => {
    try {
      window.print();
    } catch {
      setPrintNotice('Print preview is restricted in this sandboxed frame. Please copy your unique pass code above.');
      setTimeout(() => setPrintNotice(null), 5000);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    setLoading(true);
    setSearched(true);
    const found = await findByCode(code.trim());
    setResult(found);
    setLoading(false);
  };

  return (
    <div id="badge-lookup-card" className={`max-w-xl mx-auto rounded-2xl shadow-xl border p-6 md:p-8 transition-colors duration-200 ${config.cardBg} ${config.cardBorder} ${config.textPrimary}`}>
      <div className="text-center mb-6">
        <div 
          className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-xs"
          style={{ backgroundColor: `${config.dotColor}25`, color: config.dotColor }}
        >
          <QrCode className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold">Delegate & Ticket Verification</h2>
        <p className={`text-xs mt-1 ${config.textMuted}`}>
          Enter your unique code to view and print your active pass.
        </p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 opacity-50" />
          <input
            id="lookup-code-input"
            type="text"
            placeholder="e.g. CLT-DEL-26-8942"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm uppercase font-mono outline-hidden border transition ${config.inputBg}`}
          />
        </div>
        <button
          type="submit"
          id="lookup-submit-btn"
          disabled={loading}
          className={`px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition cursor-pointer disabled:opacity-50 ${config.primaryButton}`}
        >
          {loading ? 'Searching...' : 'Lookup'}
        </button>
      </form>

      {searched && (
        <div>
          {result ? (
            <div className={`p-5 rounded-2xl border space-y-4 ${config.inputBg}`}>
              <div className={`flex items-center justify-between border-b pb-3 ${config.cardBorder}`}>
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                  <CheckCircle className="w-4 h-4" /> Valid Registration Found
                </div>
                <span className="font-mono text-xs px-2.5 py-0.5 rounded-lg font-bold border border-white/10">
                  {result.uniqueCode}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className={`block ${config.textMuted}`}>Name</span>
                  <span className="font-bold text-sm">{result.name}</span>
                </div>
                <div>
                  <span className={`block ${config.textMuted}`}>Category</span>
                  <span className="font-bold capitalize flex items-center gap-1 mt-0.5">
                    {result.type === 'delegate' ? <UserCheck className="w-3.5 h-3.5" style={{ color: config.dotColor }} /> : <Ticket className="w-3.5 h-3.5" style={{ color: config.dotColor }} />}
                    {result.type}
                  </span>
                </div>
                <div>
                  <span className={`block ${config.textMuted}`}>Organization</span>
                  <span>{result.organization || 'Independent'}</span>
                </div>
                <div>
                  <span className={`block ${config.textMuted}`}>Status</span>
                  <span className="text-emerald-400 font-semibold uppercase">{result.status}</span>
                </div>
              </div>

              {printNotice && (
                <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-lg text-xs">
                  {printNotice}
                </div>
              )}

              <div className="pt-2 text-center">
                <button
                  onClick={handlePrint}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer border ${config.secondaryButton}`}
                >
                  Print Badge
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-red-950/40 rounded-xl border border-red-800 text-red-400 text-center text-xs">
              <XCircle className="w-5 h-5 mx-auto mb-1 text-red-400" />
              No badge found with code &quot;{code}&quot;. Please verify the characters.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
