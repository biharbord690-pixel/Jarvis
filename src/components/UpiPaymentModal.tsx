import React, { useState, useEffect } from 'react';
import {
  X,
  QrCode,
  Smartphone,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Download,
  Lock,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import QRCode from 'qrcode';
import { api } from '../lib/api';
import { auth, saveOrderToFirestore } from '../lib/firebase';

export const OFFICIAL_JARVIS_MEDIAFIRE_URL =
  'https://www.mediafire.com/file/ux69byxjzd6fgxx/JARVIS_1.8.7.apk/file?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAZXh0bgNhZW0CMTEAcGRvZgJzcnRjBmFwcF9pZA81NjcwNjczNDMzNTI0MjcAAaci5lVZHdiYtM90IZ7QyjUhzrrYlojsuvAnihxSIUCx03D80qyTQBgrgBGKSg_aem_7LcD37MUVZ70d-AOHHqp2w';

interface UpiPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess?: (order: {
    orderId: string;
    orderNumber: string;
    licenseKey: string;
    productName: string;
    productVersion: string;
    customerEmail: string;
    customerName: string;
    utrNumber?: string;
  }) => void;
}

export const UpiPaymentModal: React.FC<UpiPaymentModalProps> = ({
  isOpen,
  onClose,
  onPaymentSuccess
}) => {
  const [step, setStep] = useState<'qr' | 'confirm' | 'success'>('qr');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedMediafire, setCopiedMediafire] = useState(false);
  const [customerName, setCustomerName] = useState(auth.currentUser?.displayName || '');
  const [customerEmail, setCustomerEmail] = useState(auth.currentUser?.email || '');
  const [customerPhone, setCustomerPhone] = useState('');
  const [utrNumber, setUtrNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Dynamic QR Code data from server
  const [qrData, setQrData] = useState<{
    qrDataUrl: string;
    upiUri: string;
    phonepeUri: string;
    gpayUri: string;
    paytmUri: string;
    vpa: string;
    payeeName: string;
    accountHolder: string;
    amount: number;
  } | null>(null);

  const [completedOrder, setCompletedOrder] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      setErrorMessage(null);
      setStep('qr');

      const vpa = '9570569963@axl';
      const payeeName = 'JARVIS';
      const note = `JARVIS-49-${Date.now()}`;
      const upiUri = `upi://pay?pa=${vpa}&pn=${encodeURIComponent(payeeName)}&am=49&cu=INR&tn=${encodeURIComponent(note)}`;

      // Immediate client-side QR generation with JARVIS branding
      QRCode.toDataURL(upiUri, {
        width: 400,
        margin: 1,
        color: { dark: '#ffffff', light: '#0b0f19' }
      }).then(url => {
        setQrData({
          qrDataUrl: url,
          upiUri,
          phonepeUri: `phonepe://pay?pa=${vpa}&pn=${encodeURIComponent(payeeName)}&am=49&cu=INR&tn=${encodeURIComponent(note)}`,
          gpayUri: `gpay://upi/pay?pa=${vpa}&pn=${encodeURIComponent(payeeName)}&am=49&cu=INR&tn=${encodeURIComponent(note)}`,
          paytmUri: `paytmmp://pay?pa=${vpa}&pn=${encodeURIComponent(payeeName)}&am=49&cu=INR&tn=${encodeURIComponent(note)}`,
          vpa,
          payeeName: 'JARVIS',
          accountHolder: 'JARVIS',
          amount: 49
        });
      }).catch(e => console.warn('QR generation error:', e));

      // Also sync with server
      api.generateUpiQr(undefined, 49)
        .then(data => setQrData(data))
        .catch(err => console.warn('Could not sync dynamic QR:', err));

      if (auth.currentUser) {
        if (!customerName && auth.currentUser.displayName) setCustomerName(auth.currentUser.displayName);
        if (!customerEmail && auth.currentUser.email) setCustomerEmail(auth.currentUser.email);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const upiId = qrData?.vpa || '9570569963@axl';
  const payee = 'JARVIS';
  const amount = 49;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleUpiVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!utrNumber.trim()) {
      setErrorMessage('Please enter the 12-digit UPI UTR / Reference number from your payment app.');
      return;
    }
    if (!customerEmail.trim()) {
      setErrorMessage('Please provide your email address to attach your license key.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await api.verifyUpiPayment({
        customerName: customerName.trim() || 'JARVIS Customer',
        customerEmail: customerEmail.trim().toLowerCase(),
        customerPhone: customerPhone.trim(),
        utrNumber: utrNumber.trim()
      });

      // Also persist to Firebase Firestore
      await saveOrderToFirestore({
        id: res.orderId,
        orderNumber: res.orderNumber,
        customerName: res.customerName,
        customerEmail: res.customerEmail,
        customerPhone: customerPhone.trim(),
        productId: 'jarvis_os_3_1_pro',
        productName: res.productName,
        productVersion: res.productVersion,
        amount: 4900,
        currency: 'INR',
        status: 'paid',
        licenseKey: res.licenseKey,
        userId: auth.currentUser?.uid || '',
        createdAt: new Date().toISOString(),
        paidAt: new Date().toISOString()
      }).catch(err => console.warn('Firestore sync notice:', err));

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });

      setCompletedOrder(res);
      setStep('success');

      if (onPaymentSuccess) {
        onPaymentSuccess({
          orderId: res.orderId,
          orderNumber: res.orderNumber,
          licenseKey: res.licenseKey,
          productName: res.productName,
          productVersion: res.productVersion,
          customerEmail: res.customerEmail,
          customerName: res.customerName,
          utrNumber: res.utrNumber
        });
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Payment confirmation failed. Check your UTR number.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-950 border border-rose-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl shadow-rose-950/60 max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-900 border border-white/10 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* STEP 1: SCAN QR CODE OR TAP UPI APP */}
        {step === 'qr' && (
          <div className="space-y-5">
            {/* Header */}
            <div className="text-center space-y-1 pr-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-600/20 text-rose-400 border border-rose-500/30 text-[11px] font-mono-code uppercase font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Instant ₹49 UPI Direct Payment</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white font-display">
                Pay ₹49 & Unlock MediaFire APK
              </h2>
              <p className="text-xs text-slate-400">
                Scan with any UPI App or tap your favorite app below:
              </p>
            </div>

            {/* Direct Mobile Tap Buttons (Auto opens app with ₹49) */}
            <div className="space-y-2">
              <div className="text-[10px] font-mono-code text-slate-400 uppercase text-center">
                Tap to pay directly on Mobile (Auto ₹49 Pre-filled)
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <a
                  href={qrData?.phonepeUri || `phonepe://pay?pa=${upiId}&pn=JARVIS&am=49&cu=INR&tn=JARVIS-PRO-APK`}
                  className="py-2.5 px-3 rounded-xl bg-purple-950/60 hover:bg-purple-900/80 border border-purple-500/40 text-purple-200 text-xs font-bold text-center flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-md"
                >
                  <Smartphone className="w-3.5 h-3.5 text-purple-400" />
                  <span>PhonePe</span>
                </a>

                <a
                  href={qrData?.gpayUri || `gpay://upi/pay?pa=${upiId}&pn=JARVIS&am=49&cu=INR&tn=JARVIS-PRO-APK`}
                  className="py-2.5 px-3 rounded-xl bg-blue-950/60 hover:bg-blue-900/80 border border-blue-500/40 text-blue-200 text-xs font-bold text-center flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-md"
                >
                  <Smartphone className="w-3.5 h-3.5 text-blue-400" />
                  <span>Google Pay</span>
                </a>

                <a
                  href={qrData?.paytmUri || `paytmmp://pay?pa=${upiId}&pn=JARVIS&am=49&cu=INR&tn=JARVIS-PRO-APK`}
                  className="py-2.5 px-3 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-500/40 text-cyan-200 text-xs font-bold text-center flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-md col-span-2 sm:col-span-1"
                >
                  <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Paytm / Any UPI</span>
                </a>
              </div>
            </div>

            {/* QR Code Container */}
            <div className="relative mx-auto w-64 sm:w-72 p-4 rounded-3xl bg-black border border-rose-500/40 shadow-xl flex flex-col items-center justify-center text-center space-y-3">
              {/* Payee Banner */}
              <div className="w-full text-center pb-1 border-b border-white/10">
                <span className="text-[12px] font-mono-code text-rose-400 font-bold tracking-wider">
                  NAME: JARVIS
                </span>
                <div className="text-[10px] text-slate-400 font-mono-code">
                  Official Payee: JARVIS (Auto ₹49 Pre-filled)
                </div>
              </div>

              {/* Dynamic QR Image with JARVIS Branding */}
              <div className="relative p-2 bg-slate-950 rounded-2xl border border-white/10 shadow-inner">
                {qrData?.qrDataUrl ? (
                  <img
                    src={qrData.qrDataUrl}
                    alt="JARVIS UPI QR Code"
                    className="w-48 h-48 sm:w-52 sm:h-52 object-contain rounded-xl"
                  />
                ) : (
                  <div className="w-48 h-48 sm:w-52 sm:h-52 flex items-center justify-center">
                    <span className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>

              {/* Exact Amount Tag */}
              <div className="flex items-center justify-center gap-2 w-full pt-1">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-display font-extrabold text-sm tracking-wide">
                  Exact Amount: ₹49.00
                </span>
              </div>
            </div>

            {/* UPI ID Copy Field */}
            <div className="p-3 bg-slate-900/80 rounded-2xl border border-white/10 flex items-center justify-between text-xs font-mono-code">
              <div>
                <span className="text-slate-400 block text-[10px]">UPI ID (VPA):</span>
                <span className="text-white font-bold select-all">{upiId}</span>
              </div>
              <button
                type="button"
                onClick={handleCopyUpi}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs flex items-center gap-1.5 transition-colors"
              >
                {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedUpi ? 'Copied' : 'Copy UPI'}</span>
              </button>
            </div>

            {/* Action to proceed to verification */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setStep('confirm')}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs shadow-xl shadow-rose-950/80 transition-all flex items-center justify-center gap-2"
              >
                <span>Payment Kar Diya? Click Here to Enter 12-Digit UTR</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: CONFIRM PAYMENT WITH 12-DIGIT UTR NUMBER */}
        {step === 'confirm' && (
          <form onSubmit={handleUpiVerificationSubmit} className="space-y-4">
            <div className="text-center space-y-1">
              <span className="text-xs font-mono-code text-rose-400 uppercase font-semibold">
                Step 2 of 2 · Payment Confirmation
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white font-display">
                Enter Payment UTR Number
              </h2>
              <p className="text-xs text-slate-400">
                Payment ke baad aapke PhonePe / GPay / Paytm receipt me 12-digit UPI Ref/UTR No. likha hota hai.
              </p>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  12-Digit UPI Ref / UTR Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={utrNumber}
                  onChange={e => setUtrNumber(e.target.value.replace(/[^0-9a-zA-Z]/g, ''))}
                  placeholder="e.g. 429182374619 or UTR No."
                  className="w-full px-4 py-3 bg-slate-900 border border-white/10 rounded-xl text-white font-mono-code text-sm tracking-wider focus:outline-none focus:border-rose-500"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Check your UPI payment receipt under "UPI Transaction ID" or "UTR No."
                </span>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Your Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={e => setCustomerEmail(e.target.value)}
                  placeholder="your-email@gmail.com"
                  className="w-full px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-rose-500"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Your JARVIS APK license key and download record will be linked to this email.
                </span>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Your Full Name
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Mobile Number (Optional)
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={e => setCustomerPhone(e.target.value)}
                  placeholder="+91 9876543210"
                  className="w-full px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => setStep('qr')}
                className="py-3 px-4 rounded-xl bg-slate-900 border border-white/10 text-slate-300 text-xs font-semibold hover:bg-slate-800 transition-colors"
              >
                ← Back to QR
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 disabled:opacity-50 text-white font-bold text-xs shadow-xl shadow-emerald-950/60 transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Verifying UTR with Database...</span>
                  </span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm ₹49 Payment & Unlock MediaFire APK</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: SUCCESS & IMMEDIATE MEDIAFIRE DOWNLOAD */}
        {step === 'success' && completedOrder && (
          <div className="space-y-5 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-mono-code text-emerald-400 uppercase font-semibold">
                Payment ₹49 Verified · UTR {completedOrder.utrNumber}
              </span>
              <h2 className="text-2xl font-extrabold text-white font-display">
                MediaFire APK Download Unlocked!
              </h2>
              <p className="text-xs text-slate-300">
                Aapka payment confirm ho gaya hai. Aap niche diye button se direct MediaFire se APK download kar sakte hain:
              </p>
            </div>

            {/* Direct MediaFire Download Vault Card */}
            <div className="p-5 rounded-2xl bg-blue-950/40 border border-blue-500/30 space-y-4 text-left">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-300 font-mono-code uppercase flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-400" />
                  <span>Official MediaFire Link Unlocked</span>
                </span>
                <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300">
                  VERIFIED ₹49
                </span>
              </div>

              {/* Direct MediaFire URL Display */}
              <div className="p-3 bg-slate-950 rounded-xl border border-white/10 font-mono-code text-xs text-blue-300 break-all select-all">
                {completedOrder.mediafireUrl || OFFICIAL_JARVIS_MEDIAFIRE_URL}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2.5">
                <a
                  href={completedOrder.mediafireUrl || OFFICIAL_JARVIS_MEDIAFIRE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-4 px-6 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold text-sm shadow-xl shadow-blue-950/80 transition-all flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <ExternalLink className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>🚀 Download JARVIS APK from MediaFire</span>
                </a>

                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(completedOrder.mediafireUrl || OFFICIAL_JARVIS_MEDIAFIRE_URL);
                    setCopiedMediafire(true);
                    setTimeout(() => setCopiedMediafire(false), 2000);
                  }}
                  className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-300 text-xs font-mono-code flex items-center justify-center gap-1.5 transition-colors shrink-0"
                >
                  {copiedMediafire ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedMediafire ? 'Copied Link!' : 'Copy Link'}</span>
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-400 hover:text-white text-xs font-semibold"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
