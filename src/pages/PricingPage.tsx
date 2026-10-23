import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  CreditCard,
  Lock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Smartphone,
  Info,
  Key,
  Shield
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../lib/api';
import { auth, saveOrderToFirestore } from '../lib/firebase';
import { AppConfig, Order } from '../types';
import { RazorpaySetupModal } from '../components/RazorpaySetupModal';
import { UpiPaymentModal } from '../components/UpiPaymentModal';

interface PricingPageProps {
  config: AppConfig | null;
  onPaymentSuccess: (order: {
    orderId: string;
    orderNumber: string;
    licenseKey: string;
    productName: string;
    productVersion: string;
    customerEmail: string;
    customerName: string;
    paidAt?: string;
  }) => void;
  setCurrentTab: (tab: string) => void;
  refetchConfig?: () => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({
  config,
  onPaymentSuccess,
  setCurrentTab,
  refetchConfig
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [agreedTerms, setAgreedTerms] = useState(true);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [paymentStep, setPaymentStep] = useState<'form' | 'processing' | 'verifying' | 'failed'>('form');

  // UPI QR Modal state
  const [upiModalOpen, setUpiModalOpen] = useState(false);

  // Owner Setup Box state
  const [setupModalOpen, setSetupModalOpen] = useState(false);

  const basePrice = config?.productPriceInr ?? 49;
  const taxRate = config?.taxRatePercent ?? 0;
  const taxAmount = Math.round((basePrice * taxRate) / 100);
  const totalAmount = basePrice + taxAmount;
  const hasRealKeys = Boolean(config?.hasRealKeys);

  // Keyboard shortcut Ctrl+Shift+R or URL hash #gateway opens setup box for owner
  useEffect(() => {
    const handleCheckHash = () => {
      if (window.location.hash.toLowerCase() === '#gateway') {
        setSetupModalOpen(true);
      }
    };
    handleCheckHash();
    window.addEventListener('hashchange', handleCheckHash);

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'R' || e.key === 'r')) {
        e.preventDefault();
        setSetupModalOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('hashchange', handleCheckHash);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleInitiatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!customerName.trim() || !customerEmail.trim()) {
      setErrorMessage('Please provide your full name and valid email address.');
      return;
    }

    if (!agreedTerms) {
      setErrorMessage('Please agree to the license terms and refund policy to continue.');
      return;
    }

    if (!hasRealKeys) {
      // Default directly to seamless direct UPI payment
      setUpiModalOpen(true);
      return;
    }

    setLoading(true);
    setPaymentStep('processing');

    try {
      // 1. Ensure Razorpay script is loaded
      const ensureRazorpayLoaded = (): Promise<boolean> => {
        return new Promise(resolve => {
          if (typeof window !== 'undefined' && typeof window.Razorpay === 'function') {
            return resolve(true);
          }
          const existingScript = document.querySelector('script[src*="checkout.razorpay.com"]');
          if (existingScript) {
            existingScript.addEventListener('load', () => resolve(true));
            existingScript.addEventListener('error', () => resolve(false));
            return;
          }
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.async = true;
          script.onload = () => resolve(true);
          script.onerror = () => resolve(false);
          document.body.appendChild(script);
        });
      };

      const isScriptReady = await ensureRazorpayLoaded();

      if (!isScriptReady || typeof window.Razorpay !== 'function') {
        throw new Error('Razorpay Payment Gateway script could not be loaded. Please check your internet connection.');
      }

      // 2. Create server-authoritative order (₹49 = 4900 paise)
      const orderData = await api.createOrder({
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim().toLowerCase(),
        customerPhone: customerPhone.trim()
      });

      // 3. Open Official Razorpay Gateway Modal
      const options: any = {
        key: orderData.keyId,
        amount: orderData.amount, // 4900 paise = ₹49
        currency: 'INR',
        name: 'JARVIS INTELLIGENCE OS 3.1 PRO',
        description: 'Instant APK Download & License (Engineered by ABHINAV ANAND)',
        order_id: orderData.razorpayOrderId,
        prefill: {
          name: customerName.trim(),
          email: customerEmail.trim(),
          contact: customerPhone.trim()
        },
        theme: {
          color: '#e11d48'
        },
        handler: async function (response: any) {
          // This callback triggers ONLY when payment is successfully completed in Razorpay
          setPaymentStep('verifying');
          try {
            const verifyRes = await api.verifyPayment({
              orderId: orderData.orderId,
              razorpay_order_id: response.razorpay_order_id || orderData.razorpayOrderId,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            // Sync order to Firestore
            saveOrderToFirestore({
              id: orderData.orderId,
              orderNumber: verifyRes.orderNumber,
              customerName: customerName.trim(),
              customerEmail: customerEmail.trim().toLowerCase(),
              customerPhone: customerPhone.trim(),
              productId: 'jarvis-apk-pro',
              productName: verifyRes.productName,
              productVersion: verifyRes.productVersion,
              amount: 4900,
              currency: 'INR',
              status: 'paid',
              razorpayOrderId: response.razorpay_order_id || orderData.razorpayOrderId,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              licenseKey: verifyRes.licenseKey,
              userId: auth.currentUser?.uid || '',
              createdAt: new Date().toISOString(),
              paidAt: new Date().toISOString()
            }).catch(e => console.warn('Firestore order sync warning:', e));

            confetti({
              particleCount: 120,
              spread: 80,
              origin: { y: 0.6 }
            });

            onPaymentSuccess({
              orderId: orderData.orderId,
              orderNumber: verifyRes.orderNumber,
              licenseKey: verifyRes.licenseKey,
              productName: verifyRes.productName,
              productVersion: verifyRes.productVersion,
              customerEmail: customerEmail.trim().toLowerCase(),
              customerName: customerName.trim()
            });
          } catch (verErr: any) {
            setErrorMessage(verErr.message || 'Payment signature verification failed.');
            setPaymentStep('failed');
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            setPaymentStep('form');
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (resp: any) {
        setErrorMessage(resp.error?.description || 'Payment failed or was cancelled in Razorpay.');
        setPaymentStep('failed');
        setLoading(false);
      });

      rzp.open();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to open Razorpay payment gateway.');
      setPaymentStep('failed');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="text-xs font-mono-code text-rose-400 uppercase tracking-widest">
          Official Payment Gateway · Flat ₹49
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white font-display">
          Acquire JARVIS OS 3.1 PRO
        </h1>
        <p className="text-sm text-slate-300">
          Engineered by <strong className="text-white">ABHINAV ANAND</strong>. Instant APK download link upon payment verification, verified SHA-256 binary, and permanent personal license.
        </p>
      </div>

      {/* Owner Setup Prompt (Visible only if keys are not yet configured on server) */}
      {!hasRealKeys && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Key className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="text-sm font-bold text-white font-display">
                Owner Setup: Razorpay Gateway Keys Required
              </div>
              <p className="text-xs text-amber-300/90 leading-relaxed">
                Enter your 2 Razorpay keys (Key ID & Key Secret) into the secure backend box to accept real payments for ₹49. Keys are stored only in the backend and hidden from public visitors.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSetupModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shrink-0 transition-colors shadow-lg shadow-amber-950/50 flex items-center gap-1.5"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Open Keys Box</span>
          </button>
        </div>
      )}

      {/* Main Checkout Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Customer Form & Payment Trigger */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-slate-950/80 border border-white/10 space-y-6">
          <div className="border-b border-white/10 pb-4">
            <h2 className="text-xl font-bold text-white font-display">
              1. Customer & Licensee Details
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Your license key and download link will be bound to this email.
            </p>
          </div>

          {errorMessage && (
            <div className="p-4 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-200 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleInitiatePayment} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                placeholder="e.g. Vikramaditya Rathore"
                className="w-full px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Email Address (For Instant Download Delivery) <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                required
                value={customerEmail}
                onChange={e => setCustomerEmail(e.target.value)}
                placeholder="vikram@example.com"
                className="w-full px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Never shared. Used to deliver your JARVIS 3.1 PRO license and verified APK download token.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Mobile Number (For WhatsApp / UPI confirmation)
              </label>
              <input
                type="tel"
                value={customerPhone}
                onChange={e => setCustomerPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
              />
            </div>

            {/* Checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-300 select-none">
                <input
                  type="checkbox"
                  checked={agreedTerms}
                  onChange={e => setAgreedTerms(e.target.checked)}
                  className="mt-0.5 rounded bg-slate-900 border-white/20 text-rose-600 focus:ring-rose-500"
                />
                <span>
                  I understand that JARVIS INTELLIGENCE OS 3.1 PRO is designed for Android 9.0+ devices, and I agree to the{' '}
                  <button
                    type="button"
                    onClick={() => setCurrentTab('support')}
                    className="text-rose-400 underline hover:text-rose-300"
                  >
                    License Agreement & Refund Terms
                  </button>.
                </span>
              </label>
            </div>

            {/* Submit button */}
            <div className="pt-4 space-y-3">
              <button
                type="button"
                onClick={() => setUpiModalOpen(true)}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-purple-950/80 transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <Smartphone className="w-4 h-4 text-amber-300 animate-pulse" />
                <span>⚡ Pay ₹49 with UPI QR / PhonePe / GPay</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-white/10 disabled:opacity-50 text-slate-300 hover:text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 group"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>
                      {paymentStep === 'verifying' ? 'Verifying HMAC Signature & Issuing APK...' : 'Opening Razorpay Gateway...'}
                    </span>
                  </span>
                ) : (
                  <>
                    <span>Pay ₹{totalAmount.toLocaleString('en-IN')} via Razorpay & Get APK</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-400 font-mono-code">
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>256-Bit SSL Encrypted</span>
              </span>
              <span>·</span>
              <span className="text-slate-300">Razorpay Real Gateway</span>
              <span>·</span>
              <span>UPI / QR / GPay / PhonePe / Cards</span>
            </div>
          </form>
        </div>

        {/* Right Column: Order Summary & Inclusions */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-950/80 border border-white/10 space-y-6">
            <h2 className="text-xl font-bold text-white font-display border-b border-white/10 pb-4">
              Order Summary
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span>JARVIS INTELLIGENCE OS 3.1 PRO (Single Seat)</span>
                <span className="text-white font-medium font-mono-code">₹{basePrice.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex items-center justify-between text-slate-400">
                <span>Integrated Taxes</span>
                <span className="font-mono-code text-emerald-400">Inclusive</span>
              </div>

              <div className="border-t border-white/10 pt-3 flex items-center justify-between text-sm font-bold text-white">
                <span>Total Due</span>
                <span className="text-rose-400 font-mono-code text-xl">₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Inclusions List */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <div className="text-xs font-bold text-white uppercase tracking-wider font-mono-code">
                Included with Purchase:
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                {[
                  'Official signed APK binary (Build 3.1.0-pro)',
                  'Direct Download Link immediately after payment',
                  'Unique Cryptographic License Activation Key',
                  'Verified SHA-256 Checksum for secure sideloading',
                  'Perpetual single-user personal license',
                  'Free minor patch updates for version 3.1.x',
                  'Dedicated creator support desk via Instagram'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-white/5 space-y-1 text-xs">
              <div className="font-bold text-slate-200">Official Creator Credit</div>
              <div className="text-rose-400 font-semibold">Engineered by ABHINAV ANAND</div>
              <div className="text-[11px] text-slate-400">
                Connect directly on Instagram:{' '}
                <a
                  href={config?.creatorInstagram || 'https://www.instagram.com/aibhav45'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-200 underline hover:text-white"
                >
                  @aibhav45
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Razorpay Gateway Setup Modal for Owner */}
      <RazorpaySetupModal
        isOpen={setupModalOpen}
        onClose={() => setSetupModalOpen(false)}
        onConfigSaved={() => {
          if (refetchConfig) refetchConfig();
        }}
      />

      {/* Direct UPI QR Payment Modal */}
      <UpiPaymentModal
        isOpen={upiModalOpen}
        onClose={() => setUpiModalOpen(false)}
        onPaymentSuccess={onPaymentSuccess}
      />
    </div>
  );
};
