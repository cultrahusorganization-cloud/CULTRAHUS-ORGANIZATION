import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { 
  X, 
  Printer, 
  Download, 
  ShieldCheck, 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  Sparkles 
} from 'lucide-react';
import { CultrahusLogo } from './CultrahusLogo';
import { DigitalPassData } from '../types';

interface DigitalPassModalProps {
  passData: DigitalPassData | null;
  onClose: () => void;
}

export const DigitalPassModal: React.FC<DigitalPassModalProps> = ({ passData, onClose }) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  useEffect(() => {
    if (!passData) return;
    const payload = JSON.stringify({
      code: passData.code,
      name: passData.fullName,
      type: passData.type,
      event: 'Cultrahus Sangam 2026',
      date: '18 October 2026',
      venue: 'Vedanta Farms, Bhiwadi',
      status: passData.status || 'Verified',
      issuedAt: passData.issuedIst || new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    });

    QRCode.toDataURL(payload, {
      width: 220,
      margin: 1,
      color: {
        dark: '#242c18',
        light: '#ffffff'
      }
    })
      .then(url => setQrDataUrl(url))
      .catch(err => console.error('Failed to render QR Code:', err));
  }, [passData]);

  if (!passData) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#faf7f0] text-[#242c18] rounded-3xl shadow-2xl border border-[#cfc5b0] overflow-hidden my-8 animate-in zoom-in-95 duration-200">
        {/* Modal Controls Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#242c18] text-[#f4efe4] print:hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#d7c494]" />
            <span className="font-serif font-bold text-base tracking-wide">
              Official Festival Credential
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              id="print-pass-btn"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#364325] hover:bg-[#475731] text-[#d7c494] text-xs font-bold rounded-xl transition-colors border border-[#5b6e41]/60 shadow"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Credential</span>
            </button>
            <button
              id="close-pass-modal-btn"
              onClick={onClose}
              className="p-1.5 text-[#c9d6ba] hover:text-white rounded-xl hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Pass Canvas */}
        <div id="printable-pass" className="p-6 sm:p-8 bg-[#faf7f0]">
          <div className="border-4 border-double border-[#364325]/40 rounded-2xl p-5 sm:p-6 relative bg-gradient-to-b from-[#fffefc] to-[#f4efe4] shadow-sm">
            {/* Top Pass Brand Banner */}
            <div className="flex items-start justify-between border-b-2 border-[#cfc5b0] pb-4 mb-5">
              <div className="flex items-center gap-3">
                <CultrahusLogo size="md" />
                <div>
                  <span className="text-[10px] tracking-widest uppercase font-bold text-[#5b6e41]">
                    Republic of Arts • National Directorate
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#242c18] leading-tight">
                    Cultrahus Sangam 2026
                  </h2>
                  <p className="text-xs text-[#556345] font-semibold">
                    National Theatre Conclave, Cultural Parliament &amp; Performing Arts Festival
                  </p>
                </div>
              </div>

              <div className="text-right">
                <div className="inline-block px-3 py-1 bg-[#ebf0e2] border border-[#c4d2b5] rounded-lg text-[#334122] font-mono font-bold text-xs">
                  {passData.code}
                </div>
                <div className="text-[10px] font-semibold text-[#364325] flex items-center justify-end gap-1 mt-1">
                  <CheckCircle2 className="w-3 h-3 text-[#5b6e41]" />
                  <span>Authenticated</span>
                </div>
              </div>
            </div>

            {/* Credential Title Banner */}
            <div className="bg-[#3b4928] text-[#f7f4ec] px-4 py-2 rounded-xl mb-5 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#e5d4aa]" />
                <span className="font-serif font-bold text-sm tracking-wide">
                  {passData.title}
                </span>
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest bg-[#ede4d2] text-[#242c18] px-2 py-0.5 rounded font-bold">
                {passData.type.toUpperCase()}
              </span>
            </div>

            {/* Holder & Pass Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-center">
              {/* Left Details */}
              <div className="md:col-span-2 space-y-3 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#738260] block">
                    Accredited Full Name
                  </span>
                  <p className="font-serif font-bold text-lg text-[#242c18]">
                    {passData.fullName}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#738260] block">
                      Official Contact
                    </span>
                    <p className="font-medium text-[#242c18] truncate">{passData.email}</p>
                    {passData.phone && (
                      <p className="text-[#556345] font-mono">{passData.phone}</p>
                    )}
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#738260] block">
                      Fee / Status
                    </span>
                    <p className="font-bold text-[#3b4928]">{passData.feePaid || 'Confirmed'}</p>
                    <p className="text-[10px] text-[#556345]">{passData.status || 'Verified'}</p>
                  </div>
                </div>

                {(passData.detail1Label || passData.detail2Label) && (
                  <div className="grid grid-cols-2 gap-3 pt-1 border-t border-[#dfd7c3]">
                    {passData.detail1Label && (
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[#738260] block">
                          {passData.detail1Label}
                        </span>
                        <p className="font-medium text-[#242c18]">{passData.detail1Value}</p>
                      </div>
                    )}

                    {passData.detail2Label && (
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[#738260] block">
                          {passData.detail2Label}
                        </span>
                        <p className="font-medium text-[#242c18]">{passData.detail2Value}</p>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-4 text-[11px] text-[#556345] pt-2">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#5b6e41]" />
                    <span>Sunday, 18 Oct 2026</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#5b6e41]" />
                    <span>Vedanta Farms, Bhiwadi</span>
                  </div>
                </div>
              </div>

              {/* Right QR Code Block */}
              <div className="flex flex-col items-center justify-center p-3 bg-white rounded-xl border border-[#cfc5b0] shadow-sm">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt={`QR Verification for ${passData.code}`}
                    className="w-36 h-36 object-contain"
                  />
                ) : (
                  <div className="w-36 h-36 bg-[#f4efe4] flex items-center justify-center text-xs text-[#8e9f73]">
                    Generating QR...
                  </div>
                )}
                <span className="text-[9px] font-mono text-[#556345] tracking-wider mt-1 text-center font-bold">
                  SCAN TO VERIFY AUDIT ENTRY
                </span>
                <span className="text-[8px] text-[#8e9f73] mt-0.5">
                  Ref: {passData.code}
                </span>
              </div>
            </div>

            {/* Bottom Pass Footer Notice */}
            <div className="mt-5 pt-3 border-t border-[#dfd7c3] flex flex-col sm:flex-row items-center justify-between text-[10px] text-[#71825e]">
              <div>
                Issued by Cultrahus Sangam Directorate • Valid for all authorized zones &amp; sessions.
              </div>
              <div className="font-mono">
                {passData.issuedIst || new Date().toLocaleDateString('en-IN')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
