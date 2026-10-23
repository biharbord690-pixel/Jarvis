import React, { useState } from 'react';
import {
  CheckCircle2,
  Download,
  Copy,
  Check,
  ShieldCheck,
  FileText,
  Smartphone,
  ExternalLink,
  ArrowRight
} from 'lucide-react';
import { api } from '../lib/api';

interface CheckoutSuccessProps {
  order: {
    orderId: string;
    orderNumber: string;
    licenseKey: string;
    productName: string;
    productVersion: string;
    customerEmail: string;
    customerName: string;
    paidAt?: string;
  };
  setCurrentTab: (tab: string) => void;
  onOpenDownload: (downloadData: any) => void;
}

export const CheckoutSuccessPage: React.FC<CheckoutSuccessProps> = ({
  order,
  setCurrentTab,
  onOpenDownload
}) => {
  const [copiedKey, setCopiedKey] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const copyLicense = () => {
    navigator.clipboard.writeText(order.licenseKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleFetchDownload = async () => {
    setDownloadLoading(true);
    setDownloadError(null);
    try {
      const data = await api.requestDownloadToken(order.orderId, order.customerEmail);
      onOpenDownload({
        ...data,
        orderNumber: order.orderNumber,
        licenseKey: order.licenseKey
      });
      setCurrentTab('download');
    } catch (err: any) {
      setDownloadError(err.message || 'Could not generate download link.');
    } finally {
      setDownloadLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Success Badge Banner */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mb-2">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="text-xs font-mono-code text-emerald-400 uppercase tracking-widest">
          Payment Server-Verified · Entitlement Activated
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-display">
          Welcome to JARVIS OS 3.1 PRO
        </h1>
        <p className="text-sm text-slate-300 max-w-xl mx-auto">
          Thank you, <strong className="text-white">{order.customerName}</strong>. Your payment was verified by the server and your exclusive license has been minted.
        </p>
      </div>

      {/* Verified Order Receipt Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-950/90 border border-white/10 space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <div className="text-xs text-slate-400 font-mono-code uppercase">Order Reference</div>
            <div className="text-lg font-bold text-white font-mono-code">{order.orderNumber}</div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono-code px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300">
              PAYMENT VERIFIED
            </span>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-slate-500 uppercase font-mono-code text-[10px]">Product</span>
            <div className="text-white font-semibold text-sm">{order.productName}</div>
          </div>
          <div>
            <span className="text-slate-500 uppercase font-mono-code text-[10px]">Version</span>
            <div className="text-slate-300 font-mono-code">{order.productVersion}</div>
          </div>
          <div>
            <span className="text-slate-500 uppercase font-mono-code text-[10px]">Licensed Customer</span>
            <div className="text-slate-300">{order.customerName} ({order.customerEmail})</div>
          </div>
          <div>
            <span className="text-slate-500 uppercase font-mono-code text-[10px]">Official Creator</span>
            <div className="text-rose-400 font-semibold">Engineered by ABHINAV ANAND</div>
          </div>
        </div>

        {/* Direct MediaFire APK Download Card */}
        <div className="p-5 rounded-2xl bg-blue-950/40 border border-blue-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-300 font-mono-code uppercase flex items-center gap-1.5">
              <span>🚀 Official MediaFire APK Download Link</span>
            </span>
            <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300">
              PAYMENT VERIFIED
            </span>
          </div>
          <div className="p-3 bg-black rounded-xl border border-white/10 font-mono-code text-xs text-blue-300 break-all select-all">
            https://www.mediafire.com/file/ux69byxjzd6fgxx/JARVIS_1.8.7.apk/file
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <a
              href="https://www.mediafire.com/file/ux69byxjzd6fgxx/JARVIS_1.8.7.apk/file"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold text-xs shadow-lg shadow-blue-950/80 transition-all flex items-center justify-center gap-2"
            >
              <span>🚀 Direct MediaFire Download APK</span>
            </a>
            <button
              onClick={() => {
                navigator.clipboard.writeText('https://www.mediafire.com/file/ux69byxjzd6fgxx/JARVIS_1.8.7.apk/file');
                setCopiedKey(true);
                setTimeout(() => setCopiedKey(false), 2000);
              }}
              className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-300 text-xs font-mono-code flex items-center justify-center gap-1.5 transition-colors shrink-0"
            >
              {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey ? 'Link Copied!' : 'Copy MediaFire Link'}</span>
            </button>
          </div>
        </div>

        {downloadError && (
          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-200 text-xs">
            {downloadError}
          </div>
        )}

        {/* Main CTA */}
        <div className="pt-2 flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleFetchDownload}
            disabled={downloadLoading}
            className="flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-sm shadow-xl shadow-rose-950/80 transition-all flex items-center justify-center gap-2"
          >
            {downloadLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Authorizing Token...</span>
              </span>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Unlock & Download JARVIS APK (MediaFire)</span>
              </>
            )}
          </button>

          <button
            onClick={() => { setCurrentTab('account'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="py-4 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/10 text-xs font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <span>Go to Customer Portal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Sideload & Installation Walkthrough */}
      <div className="p-6 rounded-2xl bg-slate-950/60 border border-white/10 space-y-4">
        <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-rose-500" />
          <span>Android Installation & Activation Guide</span>
        </h3>
        <ol className="space-y-2 text-xs text-slate-300 list-decimal list-inside leading-relaxed">
          <li>Tap the <strong>Authorize & Download APK</strong> button above to download the verified binary package.</li>
          <li>When prompt "File might be harmful" appears in your mobile browser, tap <strong>Download anyway</strong> (standard Android security notice for direct developer releases).</li>
          <li>Open your Downloads folder, tap on <strong>JARVIS_1.8.7.apk</strong>, and tap <strong>Install</strong>. If prompted, toggle "Allow from this source".</li>
          <li>Launch JARVIS and grant Microphone, Accessibility & notification permissions when requested.</li>
        </ol>
      </div>
    </div>
  );
};
