import React, { useState } from 'react';
import {
  ShieldCheck,
  Send,
  HelpCircle,
  FileText,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Mail,
  User,
  Heart
} from 'lucide-react';
import { api } from '../lib/api';
import { AppConfig } from '../types';

interface AboutSupportPageProps {
  config: AppConfig | null;
}

export const AboutSupportPage: React.FC<AboutSupportPageProps> = ({ config }) => {
  const [activeTab, setActiveTab] = useState<'about' | 'support' | 'legal'>('about');

  // Support form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Installation Assistance');
  const [orderNumber, setOrderNumber] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [successResponse, setSuccessResponse] = useState<string | null>(null);
  const [errorResponse, setErrorResponse] = useState<string | null>(null);

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessResponse(null);
    setErrorResponse(null);

    try {
      const res = await api.submitSupportTicket({
        name,
        email,
        subject,
        message,
        orderNumber: orderNumber.trim() || undefined
      });
      setSuccessResponse(res.message);
      setName('');
      setEmail('');
      setMessage('');
      setOrderNumber('');
    } catch (err: any) {
      setErrorResponse(err.message || 'Could not submit support request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Top Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="text-xs font-mono-code text-rose-400 uppercase tracking-widest">
          Creator Origin & Engineering Desk
        </div>
        <h1 className="text-4xl font-extrabold text-white font-display">
          About, Support & Legal
        </h1>
        <p className="text-sm text-slate-300">
          Engineered by <strong className="text-white">ABHINAV ANAND</strong> · Direct Instagram @aibhav45
        </p>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex justify-center">
        <div className="inline-flex p-1 rounded-xl bg-slate-900 border border-white/10 text-xs">
          <button
            onClick={() => setActiveTab('about')}
            className={`px-5 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'about' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            About & Creator
          </button>
          <button
            onClick={() => setActiveTab('support')}
            className={`px-5 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'support' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Support Helpdesk
          </button>
          <button
            onClick={() => setActiveTab('legal')}
            className={`px-5 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'legal' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Legal & Compliance
          </button>
        </div>
      </div>

      {/* TAB 1: ABOUT & CREATOR */}
      {activeTab === 'about' && (
        <div className="space-y-10">
          <div className="p-8 sm:p-12 rounded-3xl bg-slate-950/80 border border-white/10 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
              <div>
                <span className="text-xs font-mono-code text-rose-500 uppercase">Lead Systems Architect</span>
                <h2 className="text-3xl font-extrabold text-white font-display mt-0.5">
                  ABHINAV ANAND
                </h2>
                <div className="text-xs text-slate-400 mt-1 font-mono-code">
                  CREATOR OF JARVIS INTELLIGENCE OS 3.1 PRO
                </div>
              </div>

              <a
                href={config?.creatorInstagram || 'https://www.instagram.com/aibhav45'}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-rose-950/50 transition-colors"
              >
                <span>Instagram: @aibhav45</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
              <p>
                JARVIS INTELLIGENCE OS 3.1 PRO began with a definitive objective: build an Android voice assistant that doesn't treat your phone like an advertising billboard or tether you to rigid, canned responses.
              </p>
              <p>
                Unlike generic commercial assistants that merely launch web search queries, JARVIS is engineered as an autonomous mobile operational layer. It listens for your personal wake-word, bridges directly into Android accessibility frameworks to execute actual tactile tasks (like composing and staging WhatsApp messages), retrieves YouTube media feeds, and stores preferences in an on-device encrypted SQLite repository.
              </p>
              <p>
                Every line of code, speech parsing logic, and architectural pipeline was designed with extreme reverence for user sovereignty, privacy, and responsiveness.
              </p>
            </div>

            <div className="pt-4 border-t border-white/5 flex flex-wrap items-center gap-6 text-xs text-slate-400 font-mono-code">
              <div>PLATFORM: <span className="text-white">ANDROID ARCHITECTURE</span></div>
              <span>·</span>
              <div>CORE VERSION: <span className="text-rose-400">3.1.0-PRO</span></div>
              <span>·</span>
              <div>OFFICIAL DISPATCH: <span className="text-emerald-400">ACTIVE</span></div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SUPPORT HELPDESK */}
      {activeTab === 'support' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Support Ticket Form */}
          <div className="md:col-span-7 p-6 sm:p-8 rounded-3xl bg-slate-950/80 border border-white/10 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white font-display">
                Submit an Engineering Ticket
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Have an installation, license recovery, or device compatibility query? Our engineering desk will respond promptly.
              </p>
            </div>

            {successResponse && (
              <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-200 text-xs flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{successResponse}</span>
              </div>
            )}

            {errorResponse && (
              <div className="p-4 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-200 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{errorResponse}</span>
              </div>
            )}

            <form onSubmit={handleSubmitTicket} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Abhishek"
                  className="w-full px-4 py-2 bg-slate-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="abhishek@domain.com"
                  className="w-full px-4 py-2 bg-slate-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Category</label>
                <select
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-rose-500"
                >
                  <option value="Installation Assistance">APK Installation & Permissions Assistance</option>
                  <option value="License Key Query">License Key Recovery / Activation</option>
                  <option value="Device Compatibility">Device Compatibility Question</option>
                  <option value="Feature Request">Feature Suggestion for Next Release</option>
                  <option value="Other">General Inquiries</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Order Number (If applicable)
                </label>
                <input
                  type="text"
                  value={orderNumber}
                  onChange={e => setOrderNumber(e.target.value)}
                  placeholder="JRV-2026-XXXXX"
                  className="w-full px-4 py-2 bg-slate-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Message Details</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Describe your device model, Android version, or issue..."
                  className="w-full px-4 py-2 bg-slate-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-6 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg transition-colors flex items-center justify-center gap-2"
              >
                {loading ? 'Submitting...' : 'Send Inquiry to Engineering Desk'}
              </button>
            </form>
          </div>

          {/* Direct Contact Channels */}
          <div className="md:col-span-5 space-y-6">
            <div className="p-6 rounded-3xl bg-slate-950/80 border border-white/10 space-y-4">
              <h3 className="text-base font-bold text-white font-display">
                Direct Contact Channels
              </h3>
              <p className="text-xs text-slate-400">
                For fastest response or direct verification with creator Abhinav Anand:
              </p>

              <div className="p-4 rounded-2xl bg-slate-900 border border-white/5 space-y-1">
                <div className="text-[10px] text-slate-500 font-mono-code uppercase">Official Instagram Profile</div>
                <a
                  href={config?.creatorInstagram || 'https://www.instagram.com/aibhav45'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-rose-400 hover:underline font-semibold flex items-center gap-1"
                >
                  <span>https://www.instagram.com/aibhav45</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-white/5 space-y-1">
                <div className="text-[10px] text-slate-500 font-mono-code uppercase">Engineering Desk Status</div>
                <div className="text-xs text-emerald-400 font-medium">Active (Avg Response &lt; 4 Hours)</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: LEGAL & COMPLIANCE */}
      {activeTab === 'legal' && (
        <div className="space-y-8 text-xs text-slate-300 leading-relaxed">
          {/* Privacy Policy */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-950/80 border border-white/10 space-y-3">
            <h2 className="text-lg font-bold text-white font-display">
              1. Privacy Policy & Data Sovereignty
            </h2>
            <p>
              JARVIS INTELLIGENCE OS 3.1 PRO enforces strict on-device privacy principles. Audio recorded for wake-word detection is processed in a continuous volatile ring-buffer and is not uploaded to third-party telemetry servers.
            </p>
            <p>
              When utilizing optional cloud AI query endpoints (such as Google Gemini), query prompts are submitted strictly across encrypted TLS channels. Your contacts, WhatsApp messages, and system settings remain localized on your device.
            </p>
          </div>

          {/* Software License Agreement */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-950/80 border border-white/10 space-y-3">
            <h2 className="text-lg font-bold text-white font-display">
              2. End User License Agreement (EULA)
            </h2>
            <p>
              Upon payment verification, the licensee receives a non-transferable, single-user perpetual license to install and execute JARVIS INTELLIGENCE OS 3.1 PRO on up to three (3) personal Android hardware devices.
            </p>
            <p>
              Decompilation, unauthorized public redistribution, hosting the APK file on third-party mirrors, or tampering with the cryptographic license check is strictly prohibited and constitutes a breach of copyright.
            </p>
          </div>

          {/* Refund Policy */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-950/80 border border-white/10 space-y-3">
            <h2 className="text-lg font-bold text-white font-display">
              3. Refund & Cancellation Policy
            </h2>
            <p>
              We stand behind our engineering. If you experience an unresolvable technical fault on a verified supported Android device (Android 9.0 to 15, unmodified stock ROM) that our engineering desk cannot resolve within 7 days of purchase, you will receive a 100% refund of the purchase price.
            </p>
            <p>
              To initiate a refund review, contact support with your order number and diagnostic log.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
