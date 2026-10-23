import React, { useState, useEffect } from 'react';
import {
  Download,
  ShieldCheck,
  FileCode,
  Clock,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Terminal,
  HelpCircle,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';
import { api } from '../lib/api';

interface SecureDownloadPageProps {
  downloadData: {
    downloadUrl: string;
    mediafireUrl?: string;
    expiresAt: number;
    validMinutes: number;
    version: string;
    fileName: string;
    fileSizeMb: number;
    sha256: string;
    orderNumber?: string;
    licenseKey?: string;
  } | null;
  setCurrentTab: (tab: string) => void;
}

export const SecureDownloadPage: React.FC<SecureDownloadPageProps> = ({ downloadData, setCurrentTab }) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(() => {
    if (!downloadData?.expiresAt) return 900;
    return Math.max(0, Math.floor((downloadData.expiresAt - Date.now()) / 1000));
  });
  const [hasStartedDownload, setHasStartedDownload] = useState(false);

  useEffect(() => {
    if (!downloadData?.expiresAt) return;
    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.floor((downloadData.expiresAt - Date.now()) / 1000));
      setTimeLeftSeconds(remaining);
      if (remaining <= 0) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, [downloadData]);

  const isExpired = timeLeftSeconds <= 0;

  const minutes = Math.floor(timeLeftSeconds / 60);
  const seconds = timeLeftSeconds % 60;
  const timeFormatted = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  const handleDownloadClick = () => {
    if (!downloadData?.downloadUrl || isExpired) return;
    setHasStartedDownload(true);
    window.location.href = downloadData.downloadUrl;
  };

  if (!downloadData) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center mx-auto text-slate-400">
          <Download className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white font-display">
          No Active Download Session
        </h2>
        <p className="text-xs text-slate-400">
          To download your verified APK release, please open your Customer Account Portal or complete a purchase order.
        </p>
        <button
          onClick={() => setCurrentTab('account')}
          className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-colors"
        >
          Open Customer Account Portal
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Title */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-mono-code text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1 rounded-full">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>SERVER-AUTHORIZED DOWNLOAD VAULT</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-display">
          Secure Download Center
        </h1>
        <p className="text-xs text-slate-400 font-mono-code">
          JARVIS INTELLIGENCE OS 3.1 PRO · ENGINEERED BY ABHINAV ANAND
        </p>
      </div>

      {/* Main Release Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-950/90 border border-white/10 space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <div className="text-xs text-slate-400 font-mono-code uppercase">Target Package</div>
            <div className="text-xl font-bold text-white font-display mt-0.5">{downloadData.fileName}</div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono-code px-3 py-1 rounded-lg bg-rose-950/50 border border-rose-500/40 text-rose-300">
              v{downloadData.version}
            </span>
          </div>
        </div>

        {/* Security Parameters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono-code">
          <div className="p-3.5 rounded-xl bg-slate-900 border border-white/5 space-y-1">
            <span className="text-slate-500 uppercase text-[10px]">Package Size</span>
            <div className="text-white font-bold">{downloadData.fileSizeMb} MB</div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900 border border-white/5 space-y-1">
            <span className="text-slate-500 uppercase text-[10px]">Verification Protocol</span>
            <div className="text-emerald-400 font-bold">HMAC-SHA256 Token</div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900 border border-white/5 space-y-1">
            <span className="text-slate-500 uppercase text-[10px]">Link Expiration</span>
            <div className={`font-bold flex items-center gap-1.5 ${isExpired ? 'text-rose-400' : 'text-amber-300'}`}>
              <Clock className="w-3.5 h-3.5" />
              <span>{isExpired ? 'Link Expired' : `${timeFormatted} remaining`}</span>
            </div>
          </div>
        </div>

        {/* SHA-256 Checksum Display */}
        <div className="p-4 rounded-2xl bg-neutral-900 border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono-code text-slate-400">
            <span className="flex items-center gap-1.5">
              <FileCode className="w-4 h-4 text-rose-500" />
              <span>Official SHA-256 Checksum (Integrity Verification)</span>
            </span>
          </div>
          <div className="p-3 bg-black rounded-xl font-mono-code text-xs text-rose-400 break-all select-all border border-white/5">
            {downloadData.sha256}
          </div>
          <p className="text-[10px] text-slate-500">
            Compare this hash against your downloaded APK to verify authentic cryptographic origin from creator Abhinav Anand.
          </p>
        </div>

        {/* Direct MediaFire Download Card (Only for verified paid customer) */}
        {downloadData.mediafireUrl && (
          <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-base">🚀</span>
                <span className="text-xs font-bold text-white font-display">
                  Official MediaFire APK Vault
                </span>
              </div>
              <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-blue-900/60 text-blue-200 border border-blue-500/30">
                VERIFIED PAYMENT UNLOCKED
              </span>
            </div>
            
            <p className="text-[11px] text-slate-300">
              Your ₹49 purchase has unlocked the official MediaFire mirror. You can open it directly or download below:
            </p>

            <div className="flex flex-col sm:flex-row gap-2">
              <a
                href={downloadData.mediafireUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs text-center flex items-center justify-center gap-2 shadow-lg shadow-blue-950/60 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Open Direct MediaFire Download</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(downloadData.mediafireUrl!);
                  setCopiedLink(true);
                  setTimeout(() => setCopiedLink(false), 2000);
                }}
                className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-300 text-xs font-mono-code flex items-center justify-center gap-1.5 transition-colors"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copied Link' : 'Copy MediaFire Link'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Download Action */}
        <div className="pt-2 space-y-3">
          {isExpired ? (
            <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-center space-y-3">
              <div className="text-xs text-rose-200">
                This secure download link has expired for your protection.
              </div>
              <button
                onClick={() => setCurrentTab('account')}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-colors"
              >
                Generate New Link in Customer Portal
              </button>
            </div>
          ) : (
            <button
              onClick={handleDownloadClick}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-sm shadow-xl shadow-rose-950/80 transition-all flex items-center justify-center gap-2 group"
            >
              <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
              <span>Download Signed APK ({downloadData.fileSizeMb} MB)</span>
            </button>
          )}

          {hasStartedDownload && !isExpired && (
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs text-center flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Download stream initiated! Check your Android notification panel.</span>
            </div>
          )}
        </div>
      </div>

      {/* Terminal Checksum Verification Snippet */}
      <div className="p-6 rounded-2xl bg-slate-950/60 border border-white/10 space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono-code text-slate-300">
          <Terminal className="w-4 h-4 text-slate-400" />
          <span>Manual Checksum Verification (Optional for Power Users)</span>
        </div>
        <div className="p-3 bg-black rounded-xl font-mono-code text-xs text-slate-300 border border-white/5 space-y-1">
          <div className="text-slate-500"># Verify on Linux / macOS / Android Termux:</div>
          <div>sha256sum {downloadData.fileName}</div>
        </div>
      </div>
    </div>
  );
};
