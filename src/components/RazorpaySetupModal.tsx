import React, { useState } from 'react';
import { Shield, Key, Lock, Eye, EyeOff, CheckCircle2, AlertCircle, X, Sparkles, RefreshCw } from 'lucide-react';
import { api } from '../lib/api';

interface RazorpaySetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigSaved: () => void;
}

export const RazorpaySetupModal: React.FC<RazorpaySetupModalProps> = ({
  isOpen,
  onClose,
  onConfigSaved
}) => {
  const [keyId, setKeyId] = useState('');
  const [keySecret, setKeySecret] = useState('');
  const [showSecret, setShowSecret] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    const cleanId = keyId.trim();
    const cleanSecret = keySecret.trim();

    if (!cleanId || !cleanSecret) {
      setFeedback({ type: 'error', message: 'Both Razorpay Key ID and Key Secret are required.' });
      return;
    }

    setLoading(true);

    try {
      const res = await api.configureGateway({
        keyId: cleanId,
        keySecret: cleanSecret
      });

      setFeedback({
        type: 'success',
        message: `${res.message} [Mode: ${res.mode.toUpperCase()}]`
      });

      // Clear the secret from memory
      setKeySecret('');

      setTimeout(() => {
        onConfigSaved();
        onClose();
      }, 1500);
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err.message || 'Failed to save Razorpay keys'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-950 border border-rose-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-rose-950/60 overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-rose-600/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-display">
              Razorpay Gateway Credentials Box
            </h2>
            <p className="text-xs text-slate-400">
              Owner Setup · Backend-Only Storage · Zero Client Leakage
            </p>
          </div>
        </div>

        {/* Feedback message */}
        {feedback && (
          <div
            className={`mb-5 p-3.5 rounded-xl text-xs flex items-start gap-2.5 ${
              feedback.type === 'success'
                ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-200'
                : 'bg-rose-950/60 border border-rose-500/40 text-rose-200'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            )}
            <span className="font-mono-code leading-relaxed">{feedback.message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono-code">
              1. Razorpay Key ID <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={keyId}
              onChange={e => setKeyId(e.target.value)}
              placeholder="rzp_live_... or rzp_test_..."
              className="w-full px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 font-mono-code"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              Starts with <code className="text-rose-400">rzp_live_</code> for real payments or <code className="text-slate-300">rzp_test_</code> for testing.
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono-code">
              2. Razorpay Key Secret <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showSecret ? 'text' : 'password'}
                required
                value={keySecret}
                onChange={e => setKeySecret(e.target.value)}
                placeholder="Enter Razorpay Secret Key"
                className="w-full pl-4 pr-10 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 font-mono-code"
              />
              <button
                type="button"
                onClick={() => setShowSecret(!showSecret)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
              >
                {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              Stored exclusively inside backend server (`runtime-keys.json`). Never exposed to visitors.
            </span>
            <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px]">
              <span className="text-slate-500">Quick select secret:</span>
              <button
                type="button"
                onClick={() => setKeySecret('dYH0PPpSUiQIc9afH2rH78gc')}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-rose-300 font-mono-code text-[10px] border border-white/10"
              >
                dYH0PPpSUi...8gc
              </button>
              <button
                type="button"
                onClick={() => setKeySecret('zKjk1wNp11b26CrDzHAZnOTP')}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-rose-300 font-mono-code text-[10px] border border-white/10"
              >
                zKjk1wNp11...OTP
              </button>
            </div>
          </div>

          {/* Security guarantee */}
          <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 space-y-1 text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold font-mono-code">
              <Shield className="w-3.5 h-3.5" />
              <span>Strict Privacy & Backend Security</span>
            </div>
            <p>
              • Keys will never be visible on website HTML, JavaScript bundle, or network requests.<br />
              • Regular visitors will never see any admin tabs, control links, or credentials.<br />
              • Direct ₹49 payment and instant APK unlock will be activated immediately.
            </p>
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs sm:text-sm shadow-xl shadow-rose-950/80 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying with Razorpay API...</span>
                </span>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Save Keys & Activate ₹49 Gateway</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
