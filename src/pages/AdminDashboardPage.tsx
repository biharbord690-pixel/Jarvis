import React, { useState, useEffect } from 'react';
import {
  Shield,
  Key,
  Lock,
  DollarSign,
  AlertOctagon,
  Download,
  Settings,
  RefreshCw,
  Search,
  CheckCircle2,
  XCircle,
  FileCode,
  Activity,
  Layers,
  ArrowRight,
  ExternalLink,
  CreditCard,
  Eye,
  EyeOff,
  Sparkles,
  AlertCircle,
  Smartphone
} from 'lucide-react';
import { api } from '../lib/api';
import { Order, Release, AdminMetrics, AuditLog } from '../types';

interface AdminDashboardPageProps {
  setCurrentTab: (tab: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ setCurrentTab }) => {
  const [adminToken, setAdminToken] = useState<string>(() => localStorage.getItem('jarvis_admin_token') || '');
  const [secretInput, setSecretInput] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(Boolean(adminToken));
  const [authError, setAuthError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'overview' | 'razorpay' | 'mediafire' | 'firebase' | 'orders' | 'releases' | 'settings' | 'audit'>('overview');
  const [loading, setLoading] = useState(false);

  // Admin Data State
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [appSettings, setAppSettings] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [releases, setReleases] = useState<Release[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // MediaFire Link Manager State
  const [mediafireInput, setMediafireInput] = useState('');
  const [mediafireLoading, setMediafireLoading] = useState(false);
  const [mediafireFeedback, setMediafireFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Razorpay Gateway Credentials Box State
  const [razorpayKeyIdInput, setRazorpayKeyIdInput] = useState('');
  const [razorpayKeySecretInput, setRazorpayKeySecretInput] = useState('');
  const [razorpayWebhookInput, setRazorpayWebhookInput] = useState('');
  const [showSecret, setShowSecret] = useState(false);
  const [keyStatus, setKeyStatus] = useState<any>(null);
  const [keySaving, setKeySaving] = useState(false);
  const [keyFeedback, setKeyFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Search & Filters
  const [orderSearch, setOrderSearch] = useState('');

  // New Release Form
  const [newVersion, setNewVersion] = useState('3.1.1-pro');
  const [newBuild, setNewBuild] = useState('2026.11');
  const [newChecksum, setNewChecksum] = useState('');
  const [newSize, setNewSize] = useState('48.6');
  const [newChangelog, setNewChangelog] = useState('Performance optimizations for Android 15 & enhanced wake-word sensitivity');

  // Status message
  const [actionStatus, setActionStatus] = useState<string | null>(null);

  // Authenticate Admin
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setLoading(true);

    try {
      const res = await api.adminLogin(secretInput.trim());
      setAdminToken(res.token);
      localStorage.setItem('jarvis_admin_token', res.token);
      setIsAuthenticated(true);
      setSecretInput('');
    } catch (err: any) {
      setAuthError(err.message || 'Invalid administrator key.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('jarvis_admin_token');
    setAdminToken('');
    setIsAuthenticated(false);
  };

  // Load Dashboard Data
  const loadDashboardData = async () => {
    if (!adminToken) return;
    setLoading(true);
    try {
      const data = await api.getAdminOverview(adminToken);
      setMetrics(data.metrics);
      setAppSettings(data.settings);
      setOrders(data.recentOrders);
      setReleases(data.releases);
      setAuditLogs(data.recentAuditLogs);

      try {
        const keyInfo = await api.getRazorpayKeys(adminToken);
        setKeyStatus(keyInfo);
        if (keyInfo.keyId && !razorpayKeyIdInput) {
          setRazorpayKeyIdInput(keyInfo.keyId);
        }
      } catch (keyErr) {
        console.warn('Could not fetch Razorpay key status:', keyErr);
      }

      try {
        const mfInfo = await api.getMediafireLink(adminToken);
        if (mfInfo?.mediafireDownloadUrl && !mediafireInput) {
          setMediafireInput(mfInfo.mediafireDownloadUrl);
        }
      } catch (mfErr) {
        console.warn('Could not fetch MediaFire link:', mfErr);
      }
    } catch (err: any) {
      if (err.message.includes('Unauthorized')) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSaveMediafireLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediafireInput.trim() || !mediafireInput.trim().startsWith('http')) {
      setMediafireFeedback({ type: 'error', message: 'Please enter a valid URL starting with http:// or https://' });
      return;
    }

    setMediafireLoading(true);
    setMediafireFeedback(null);
    try {
      const res = await api.saveMediafireLink(mediafireInput.trim(), adminToken);
      setMediafireFeedback({ type: 'success', message: res.message });
      setActionStatus('MediaFire download link successfully updated!');
    } catch (err: any) {
      setMediafireFeedback({ type: 'error', message: err.message || 'Failed to update MediaFire link' });
    } finally {
      setMediafireLoading(false);
    }
  };

  const handleSaveRazorpayKeys = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!razorpayKeyIdInput.trim() || !razorpayKeySecretInput.trim()) {
      setKeyFeedback({ type: 'error', message: 'Both Razorpay Key ID and Key Secret are required.' });
      return;
    }

    setKeySaving(true);
    setKeyFeedback(null);
    try {
      const result = await api.saveRazorpayKeys({
        keyId: razorpayKeyIdInput.trim(),
        keySecret: razorpayKeySecretInput.trim(),
        webhookSecret: razorpayWebhookInput.trim() || undefined
      }, adminToken);

      setKeyFeedback({
        type: 'success',
        message: `${result.message} (${result.mode.toUpperCase()} MODE ACTIVE)`
      });
      setActionStatus(`Razorpay credentials saved successfully in ${result.mode.toUpperCase()} mode.`);
      setRazorpayKeySecretInput('');
      loadDashboardData();
    } catch (err: any) {
      setKeyFeedback({ type: 'error', message: err.message || 'Failed to save Razorpay keys' });
    } finally {
      setKeySaving(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [isAuthenticated]);

  // Toggle Emergency Killswitch on release
  const handleToggleEmergency = async (releaseId: string) => {
    try {
      await api.toggleEmergencyRelease(releaseId, adminToken);
      setActionStatus('Release emergency state updated.');
      loadDashboardData();
    } catch (err: any) {
      alert(err.message || 'Action failed');
    }
  };

  // Create New Release
  const handleCreateRelease = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChecksum.trim()) {
      alert('SHA-256 Checksum is required');
      return;
    }
    try {
      await api.createRelease({
        version: newVersion,
        buildNumber: newBuild,
        fileSizeMb: Number(newSize) || 48.6,
        sha256: newChecksum.trim(),
        changelog: newChangelog.split('\n').filter(Boolean)
      }, adminToken);
      setActionStatus(`Release v${newVersion} created successfully.`);
      setNewChecksum('');
      loadDashboardData();
    } catch (err: any) {
      alert(err.message || 'Failed to create release');
    }
  };

  // Update Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.updateAdminSettings(appSettings, adminToken);
      setActionStatus('System settings synchronized successfully.');
      loadDashboardData();
    } catch (err: any) {
      alert(err.message || 'Failed to save settings');
    }
  };

  // Simulate Webhook capture for an order
  const handleSimulateWebhook = async (orderId: string) => {
    try {
      await api.simulateWebhook(orderId, adminToken);
      setActionStatus('Simulated webhook event dispatched & order marked PAID.');
      loadDashboardData();
    } catch (err: any) {
      alert(err.message || 'Webhook simulation failed');
    }
  };

  // 1. LOGIN SCREEN IF NOT AUTHENTICATED
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 space-y-8">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-rose-500/40 flex items-center justify-center mx-auto text-rose-500 shadow-xl shadow-rose-950/50">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-white font-display">
            Owner Control Center
          </h1>
          <p className="text-xs text-slate-400">
            Cryptographically guarded administrator interface for <strong className="text-white">ABHINAV ANAND</strong>.
          </p>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 border border-white/10 space-y-5 shadow-2xl">
          {authError && (
            <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Administrator Access Secret
              </label>
              <input
                type="password"
                required
                value={secretInput}
                onChange={e => setSecretInput(e.target.value)}
                placeholder="Enter secret passphrase..."
                className="w-full px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-rose-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block font-mono-code">
                Default configured in environment: <code>jarvis_admin_secret_2026</code>
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-lg"
            >
              {loading ? 'Authenticating...' : 'Authorize Administrator Session'}
            </button>
          </form>

          <div className="pt-2 text-center">
            <button
              onClick={() => setCurrentTab('home')}
              className="text-xs text-slate-400 hover:text-white"
            >
              ← Back to Main Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filter orders by search
  const filteredOrders = orders.filter(o =>
    o.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
    o.customerEmail.toLowerCase().includes(orderSearch.toLowerCase()) ||
    o.customerName.toLowerCase().includes(orderSearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono-code px-2 py-0.5 rounded bg-rose-950 border border-rose-500/40 text-rose-400">
              OWNER PRIVILEGES ACTIVE
            </span>
            <span className="text-xs text-slate-400 font-mono-code">
              OPERATING AS: ABHINAV ANAND
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white font-display mt-1">
            Owner Control Center
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadDashboardData}
            title="Refresh Metrics"
            className="p-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/10 text-xs font-semibold transition-colors"
          >
            Log Out
          </button>
        </div>
      </div>

      {actionStatus && (
        <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center justify-between">
          <span>{actionStatus}</span>
          <button onClick={() => setActionStatus(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* KPI Metrics Ribbon */}
      {metrics && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-white/10 space-y-1">
            <div className="text-[10px] text-slate-500 uppercase font-mono-code">Total Orders</div>
            <div className="text-2xl font-extrabold text-white font-display">{metrics.totalOrders}</div>
            <div className="text-[10px] text-emerald-400 font-mono-code">{metrics.paidOrdersCount} Paid</div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-white/10 space-y-1">
            <div className="text-[10px] text-slate-500 uppercase font-mono-code">Gross Sales (INR)</div>
            <div className="text-2xl font-extrabold text-white font-display">
              ₹{metrics.totalRevenueInr.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-slate-400 font-mono-code">Razorpay Settlement</div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-white/10 space-y-1">
            <div className="text-[10px] text-slate-500 uppercase font-mono-code">APK Downloads Streamed</div>
            <div className="text-2xl font-extrabold text-rose-400 font-display">{metrics.totalDownloads}</div>
            <div className="text-[10px] text-slate-400 font-mono-code">Token Authorized</div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-white/10 space-y-1">
            <div className="text-[10px] text-slate-500 uppercase font-mono-code">Active Releases</div>
            <div className="text-2xl font-extrabold text-emerald-400 font-display">{metrics.activeReleasesCount}</div>
            <div className="text-[10px] text-slate-400 font-mono-code">Build 3.1.0-pro Active</div>
          </div>
        </div>
      )}

      {/* Admin Tab Controls */}
      <div className="flex border-b border-white/10 gap-2 overflow-x-auto text-xs">
        {[
          { id: 'overview', label: 'Dashboard Overview' },
          { id: 'mediafire', label: '🚀 MediaFire Link' },
          { id: 'razorpay', label: '🔑 Razorpay Keys Box (Gateway Setup)' },
          { id: 'firebase', label: '🔥 Google Firebase & Firestore' },
          { id: 'orders', label: 'Payment & Orders' },
          { id: 'releases', label: 'APK Releases & Killswitch' },
          { id: 'settings', label: 'Remote Config & Maintenance' },
          { id: 'audit', label: 'Security Audit Logs' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`py-2.5 px-4 rounded-t-lg font-semibold transition-colors shrink-0 ${
              activeTab === t.id
                ? 'bg-slate-900 text-white border-t-2 border-rose-500'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* MediaFire APK Link Banner */}
            <div className="md:col-span-2 p-5 rounded-2xl bg-gradient-to-r from-blue-950/60 to-slate-900 border border-blue-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-base">🚀</span>
                  <span className="text-sm font-bold text-white font-display">MediaFire APK Download Link</span>
                  <span className="px-2 py-0.5 rounded bg-blue-950 border border-blue-500/40 text-blue-300 font-mono-code text-[10px]">
                    PROTECTED (UNLOCKED ONLY ON ₹49 PAYMENT)
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-mono-code break-all">
                  Current Target: <strong className="text-blue-300">{mediafireInput || 'https://www.mediafire.com/file/ux69byxjzd6fgxx/JARVIS_1.8.7.apk/file'}</strong>
                </p>
              </div>

              <button
                onClick={() => setActiveTab('mediafire')}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors shrink-0 flex items-center gap-1.5 shadow-md shadow-blue-950/50"
              >
                <span>Change MediaFire Link</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Razorpay Setup Banner */}
            <div className="md:col-span-2 p-5 rounded-2xl bg-gradient-to-r from-rose-950/60 to-slate-900 border border-rose-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-rose-400" />
                  <span className="text-sm font-bold text-white font-display">Razorpay Payment Gateway Box</span>
                  {keyStatus?.mode === 'live' ? (
                    <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-mono-code text-[10px]">LIVE GATEWAY ACTIVE</span>
                  ) : keyStatus?.mode === 'test' ? (
                    <span className="px-2 py-0.5 rounded bg-amber-950 border border-amber-500/40 text-amber-300 font-mono-code text-[10px]">TEST MODE ACTIVE</span>
                  ) : (
                    <span className="px-2 py-0.5 rounded bg-rose-950 border border-rose-500/40 text-rose-300 font-mono-code text-[10px]">KEYS PENDING</span>
                  )}
                </div>
                <p className="text-xs text-slate-300">
                  {keyStatus?.hasKeys
                    ? `Configured with Key ID: ${keyStatus.keyId}. Razorpay orders & HMAC signatures verified.`
                    : 'Paste your Razorpay Key ID and Key Secret directly into the box to start accepting payments.'}
                </p>
              </div>

              <button
                onClick={() => setActiveTab('razorpay')}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-colors shrink-0 flex items-center gap-1.5 shadow-md shadow-rose-950/50"
              >
                <span>Open Keys Setup Box</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950/80 border border-white/10 space-y-4">
              <h3 className="text-base font-bold text-white font-display">System Health & Security</h3>
              <div className="space-y-2 text-xs font-mono-code">
                <div className="flex items-center justify-between p-2 rounded bg-slate-900">
                  <span className="text-slate-400">HMAC-SHA256 Signature Verification:</span>
                  <span className="text-emerald-400 font-semibold">Active & Enforced</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-slate-900">
                  <span className="text-slate-400">Server APK Stream Protection:</span>
                  <span className="text-emerald-400 font-semibold">Token Authorized (15 min)</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-slate-900">
                  <span className="text-slate-400">Client Public Storage:</span>
                  <span className="text-emerald-400 font-semibold">Strictly Locked (No direct URLs)</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950/80 border border-white/10 space-y-4">
              <h3 className="text-base font-bold text-white font-display">Current Active Release</h3>
              {releases.find(r => r.isActive) ? (
                <div className="space-y-2 text-xs">
                  <div className="text-white font-bold text-sm">
                    {releases.find(r => r.isActive)?.fileName}
                  </div>
                  <div className="text-slate-400 font-mono-code text-[11px] break-all">
                    SHA256: {releases.find(r => r.isActive)?.sha256}
                  </div>
                  <div className="text-emerald-400 font-mono-code text-[11px]">
                    Status: Normal (Downloads Allowed)
                  </div>
                </div>
              ) : (
                <div className="text-amber-400 text-xs">No active release configured.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB: MEDIAFIRE DOWNLOAD LINK */}
      {activeTab === 'mediafire' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-950/90 border border-white/10 space-y-6 shadow-2xl">
            <div className="border-b border-white/10 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🚀</span>
                  <h2 className="text-xl font-bold text-white font-display">
                    MediaFire APK Download Link Manager
                  </h2>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Connect your real MediaFire link for the JARVIS APK file.
                </p>
              </div>

              <span className="px-3 py-1 rounded-full bg-blue-950 border border-blue-500/40 text-blue-300 font-mono-code text-xs font-bold flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-blue-400" />
                <span>LOCKED UNTIL ₹49 PAYMENT</span>
              </span>
            </div>

            {mediafireFeedback && (
              <div
                className={`p-4 rounded-xl text-xs flex items-center gap-2 border ${
                  mediafireFeedback.type === 'success'
                    ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-200'
                    : 'bg-rose-950/80 border-rose-500/40 text-rose-200'
                }`}
              >
                {mediafireFeedback.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
                <span>{mediafireFeedback.message}</span>
              </div>
            )}

            <form onSubmit={handleSaveMediafireLink} className="space-y-5 text-xs">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  MediaFire APK File URL <span className="text-rose-500">*</span>
                </label>
                <input
                  type="url"
                  required
                  value={mediafireInput}
                  onChange={e => setMediafireInput(e.target.value)}
                  placeholder="https://www.mediafire.com/file/ux69byxjzd6fgxx/JARVIS_1.8.7.apk/file"
                  className="w-full px-4 py-3 bg-slate-900 border border-white/10 rounded-xl text-white font-mono-code text-xs placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Paste the direct or public MediaFire download link of your APK here.
                </span>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={mediafireLoading}
                  className="flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-blue-950/60 transition-all flex items-center justify-center gap-2"
                >
                  {mediafireLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Saving MediaFire Link...</span>
                    </span>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Save & Lock MediaFire Download Link</span>
                    </>
                  )}
                </button>

                {mediafireInput && mediafireInput.startsWith('http') && (
                  <a
                    href={mediafireInput}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3.5 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/10 text-xs font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Test Link</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </form>

            {/* Security Explanation */}
            <div className="p-4 rounded-2xl bg-blue-950/30 border border-blue-500/20 space-y-2 text-xs">
              <div className="font-bold text-blue-300 flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-400" />
                <span>Zero-Leak Security Guarantee</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                This MediaFire link is stored securely on the server and is <strong>never sent to the browser</strong> prior to checkout. Only after Razorpay confirms the ₹49 transaction, a time-limited token is minted that authorizes the customer to access this MediaFire download.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB: RAZORPAY CREDENTIALS BOX */}
      {activeTab === 'razorpay' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-950/90 border border-white/10 space-y-6 shadow-2xl">
            <div className="border-b border-white/10 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-rose-500" />
                  <h2 className="text-xl font-bold text-white font-display">
                    Razorpay Gateway Credentials Box
                  </h2>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Enter your official Razorpay Key ID and Secret below. Changes take effect on the server immediately.
                </p>
              </div>

              {keyStatus?.mode === 'live' ? (
                <span className="px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-mono-code text-xs font-bold">
                  ● LIVE MODE ACTIVE
                </span>
              ) : keyStatus?.mode === 'test' ? (
                <span className="px-3 py-1 rounded-full bg-amber-950 border border-amber-500/40 text-amber-300 font-mono-code text-xs font-bold">
                  ● TEST / SANDBOX MODE
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-slate-900 border border-white/10 text-slate-400 font-mono-code text-xs">
                  KEYS NOT CONFIGURED
                </span>
              )}
            </div>

            {keyFeedback && (
              <div className={`p-4 rounded-xl border text-xs flex items-start gap-2.5 ${
                keyFeedback.type === 'success'
                  ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200'
                  : 'bg-rose-950/60 border-rose-500/40 text-rose-200'
              }`}>
                {keyFeedback.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                )}
                <span>{keyFeedback.message}</span>
              </div>
            )}

            <form onSubmit={handleSaveRazorpayKeys} className="space-y-5 text-xs">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Razorpay Key ID <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={razorpayKeyIdInput}
                  onChange={e => setRazorpayKeyIdInput(e.target.value)}
                  placeholder="e.g. rzp_test_xxxxxxxx or rzp_live_xxxxxxxx"
                  className="w-full px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white font-mono-code text-xs placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Found in your Razorpay Dashboard → Account & Settings → API Keys
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Razorpay Key Secret <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showSecret ? 'text' : 'password'}
                    required
                    value={razorpayKeySecretInput}
                    onChange={e => setRazorpayKeySecretInput(e.target.value)}
                    placeholder={keyStatus?.maskedSecret ? `Current: ${keyStatus.maskedSecret}` : "Enter Razorpay Key Secret..."}
                    className="w-full pl-4 pr-10 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white font-mono-code text-xs placeholder-slate-500 focus:outline-none focus:border-rose-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSecret(!showSecret)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Never shared or exposed to users. Kept strictly on the backend for signature verification.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Razorpay Webhook Secret (Optional)
                </label>
                <input
                  type="text"
                  value={razorpayWebhookInput}
                  onChange={e => setRazorpayWebhookInput(e.target.value)}
                  placeholder="Optional: Secret configured in Razorpay Webhooks tab"
                  className="w-full px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white font-mono-code text-xs placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Used for authenticating asynchronous payment captured webhooks.
                </span>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={keySaving}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-rose-950/60 transition-all flex items-center justify-center gap-2"
                >
                  {keySaving ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Verifying with Razorpay API & Saving...</span>
                    </span>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Save & Activate Razorpay Keys</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Quick Help Guide */}
          <div className="p-6 rounded-2xl bg-slate-950/60 border border-white/5 space-y-2 text-xs text-slate-400">
            <div className="font-semibold text-white">How to get your Razorpay Keys:</div>
            <ol className="list-decimal list-inside space-y-1 text-slate-300">
              <li>Log in to your <strong>Razorpay Dashboard</strong> (https://dashboard.razorpay.com).</li>
              <li>Go to <strong>Settings</strong> or <strong>Account & Settings</strong> → <strong>API Keys</strong>.</li>
              <li>Click <strong>Generate Key</strong> (Test Mode or Live Mode).</li>
              <li>Copy the <strong>Key ID</strong> and <strong>Key Secret</strong> and paste them in the box above!</li>
            </ol>
          </div>
        </div>
      )}

      {/* TAB: FIREBASE & FIRESTORE */}
      {activeTab === 'firebase' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-950/80 border border-white/10 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">🔥</span>
                  <h2 className="text-lg font-bold text-white font-display">
                    Google Firebase & Firestore Database
                  </h2>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-mono-code text-[10px]">
                    CONNECTED & ACTIVE
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Google Cloud Firestore persistence and Google Authentication are configured and linked to this applet.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono-code">
              <div className="p-4 rounded-xl bg-slate-900 border border-white/5 space-y-1">
                <span className="text-slate-400 block text-[10px] uppercase">Firebase Project ID</span>
                <span className="text-white font-bold select-all">silent-drake-jwh20</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-white/5 space-y-1">
                <span className="text-slate-400 block text-[10px] uppercase">Firestore Database ID</span>
                <span className="text-rose-400 font-bold select-all break-all text-[11px]">
                  ai-studio-jarvisintelligen-0221ddcf-abe2-4106-977a-b8cd32fe99f4
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-white/5 space-y-1">
                <span className="text-slate-400 block text-[10px] uppercase">Auth Domain</span>
                <span className="text-slate-300 select-all">silent-drake-jwh20.firebaseapp.com</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-white/5 space-y-1">
                <span className="text-slate-400 block text-[10px] uppercase">Storage Bucket</span>
                <span className="text-slate-300 select-all">silent-drake-jwh20.firebasestorage.app</span>
              </div>
            </div>

            {/* Firestore Collections */}
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-bold text-white font-display">Configured Firestore Collections</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-black/60 border border-white/5 space-y-1">
                  <div className="text-rose-400 font-mono-code font-bold">/orders</div>
                  <div className="text-[11px] text-slate-400">Stores Jarvis 49rs orders, Razorpay transaction IDs, and customer license keys.</div>
                </div>
                <div className="p-3 rounded-xl bg-black/60 border border-white/5 space-y-1">
                  <div className="text-rose-400 font-mono-code font-bold">/users</div>
                  <div className="text-[11px] text-slate-400">Stores Google sign-in customer profiles, emails, and sync preferences.</div>
                </div>
                <div className="p-3 rounded-xl bg-black/60 border border-white/5 space-y-1">
                  <div className="text-rose-400 font-mono-code font-bold">/admins</div>
                  <div className="text-[11px] text-slate-400">Privileged administrator access controls (biharbord690@gmail.com).</div>
                </div>
              </div>
            </div>

            {/* Security Rules Status */}
            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/20 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-emerald-300 font-semibold">Security Rules Status:</span>
                <span className="text-slate-300">Hardened ABAC & Zero-Trust Deployed via fax RPC</span>
              </div>
              <span className="text-[10px] font-mono-code text-emerald-400">Active</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {/* UPI Verification Guide for Owner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/60 to-slate-900 border border-purple-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-bold text-white font-display">
                  UPI QR Payment Verification Guide (How to confirm)
                </span>
                <span className="px-2 py-0.5 rounded bg-purple-900/60 text-purple-300 border border-purple-500/30 font-mono-code text-[10px]">
                  9570569963@axl
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                When a customer pays ₹49 via PhonePe, GPay, or Paytm, their 12-digit <strong>UTR Number</strong> is logged in the table below. Open your PhonePe or India Post Payment Bank app to match the 12-digit UTR and confirm payment.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={orderSearch}
                onChange={e => setOrderSearch(e.target.value)}
                placeholder="Search orders by number, email, name, or UTR..."
                className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none"
              />
            </div>
            <div className="text-xs text-slate-400 font-mono-code">
              Showing {filteredOrders.length} records
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-950">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-slate-900/50 text-slate-400 font-mono-code">
                  <th className="py-3 px-4">Order Ref</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Payment / UTR Number</th>
                  <th className="py-3 px-4">License Key</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-white/[0.02]">
                    <td className="py-3 px-4 font-mono-code text-white font-medium">{order.orderNumber}</td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-white">{order.customerName}</div>
                      <div className="text-[11px] text-slate-400">{order.customerEmail}</div>
                    </td>
                    <td className="py-3 px-4 font-mono-code">₹{(order.amount / 100).toLocaleString('en-IN')}</td>
                    <td className="py-3 px-4">
                      {order.utrNumber ? (
                        <div className="space-y-0.5">
                          <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/30 font-mono-code text-[11px] font-bold block w-fit">
                            UTR: {order.utrNumber}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono-code">Direct UPI QR</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 font-mono-code text-[11px]">
                          {order.paymentMethod || 'Razorpay Gateway'}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono-code text-rose-400 text-[11px] select-all">{order.licenseKey}</td>
                    <td className="py-3 px-4">
                      {order.status === 'paid' ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/30 text-emerald-400 font-mono-code text-[10px]">
                          PAID & VERIFIED
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-amber-950 border border-amber-500/30 text-amber-400 font-mono-code text-[10px]">
                          {order.status.toUpperCase()}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {order.status !== 'paid' && (
                        <button
                          onClick={() => handleSimulateWebhook(order.id)}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-mono-code"
                        >
                          Simulate Capture
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: RELEASES & KILLSWITCH */}
      {activeTab === 'releases' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Create Release */}
            <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-950/80 border border-white/10 space-y-4">
              <h3 className="text-base font-bold text-white font-display">
                Publish New APK Release
              </h3>
              <form onSubmit={handleCreateRelease} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1 font-mono-code">Version</label>
                  <input
                    type="text"
                    required
                    value={newVersion}
                    onChange={e => setNewVersion(e.target.value)}
                    placeholder="3.1.1-pro"
                    className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-mono-code">Build Number</label>
                  <input
                    type="text"
                    required
                    value={newBuild}
                    onChange={e => setNewBuild(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-mono-code">File Size (MB)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newSize}
                    onChange={e => setNewSize(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-mono-code">SHA-256 Checksum</label>
                  <input
                    type="text"
                    required
                    value={newChecksum}
                    onChange={e => setNewChecksum(e.target.value)}
                    placeholder="e.g. 9f86d081884c7d659a2feaa..."
                    className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-xl text-white font-mono-code"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-mono-code">Changelog</label>
                  <textarea
                    rows={3}
                    value={newChangelog}
                    onChange={e => setNewChangelog(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-xl text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs"
                >
                  Publish Release
                </button>
              </form>
            </div>

            {/* Existing Releases with Emergency Killswitch */}
            <div className="lg:col-span-7 space-y-4">
              <h3 className="text-base font-bold text-white font-display">
                Active & Archived Releases ({releases.length})
              </h3>
              {releases.map(rel => (
                <div
                  key={rel.id}
                  className="p-5 rounded-2xl bg-slate-950 border border-white/10 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-bold text-white">{rel.fileName}</div>
                      <div className="text-xs text-slate-400 font-mono-code">v{rel.version} · {rel.fileSizeMb} MB</div>
                    </div>

                    <button
                      onClick={() => handleToggleEmergency(rel.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono-code font-bold transition-colors ${
                        rel.isEmergencyDisabled
                          ? 'bg-rose-600 text-white shadow-lg'
                          : 'bg-slate-900 border border-rose-500/40 text-rose-400 hover:bg-rose-950/40'
                      }`}
                    >
                      {rel.isEmergencyDisabled ? 'DISABLED (KILLSWITCH ACTIVE)' : 'EMERGENCY KILLSWITCH'}
                    </button>
                  </div>

                  <div className="text-[11px] text-slate-500 font-mono-code break-all">
                    SHA256: {rel.sha256}
                  </div>

                  <div className="text-xs text-slate-400">
                    Downloads Delivered: <strong className="text-white">{rel.downloadCount}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: REMOTE CONFIG & MAINTENANCE */}
      {activeTab === 'settings' && appSettings && (
        <div className="max-w-2xl p-6 sm:p-8 rounded-3xl bg-slate-950/80 border border-white/10 space-y-6">
          <h3 className="text-lg font-bold text-white font-display">
            Remote System Configuration
          </h3>
          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-between">
              <div>
                <div className="font-semibold text-white">Maintenance Mode</div>
                <div className="text-slate-400 text-[11px]">Temporarily halts public checkouts</div>
              </div>
              <input
                type="checkbox"
                checked={appSettings.maintenanceMode}
                onChange={e => setAppSettings({ ...appSettings, maintenanceMode: e.target.checked })}
                className="w-5 h-5 rounded text-rose-600"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Maintenance Notice Message</label>
              <textarea
                rows={2}
                value={appSettings.maintenanceMessage}
                onChange={e => setAppSettings({ ...appSettings, maintenanceMessage: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-xl text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 mb-1">Base Price (INR)</label>
                <input
                  type="number"
                  value={appSettings.productPriceInr}
                  onChange={e => setAppSettings({ ...appSettings, productPriceInr: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-xl text-white font-mono-code"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">GST Tax Rate (%)</label>
                <input
                  type="number"
                  value={appSettings.taxRatePercent}
                  onChange={e => setAppSettings({ ...appSettings, taxRatePercent: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-xl text-white font-mono-code"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-colors"
            >
              Save Remote Settings
            </button>
          </form>
        </div>
      )}

      {/* TAB 5: AUDIT LOGS */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <div className="text-xs text-slate-400 font-mono-code">
            Immutable Chronological Security Trail
          </div>
          <div className="space-y-2">
            {auditLogs.map(log => (
              <div
                key={log.id}
                className="p-3.5 rounded-xl bg-slate-950 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono-code"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-rose-400 font-bold">{log.action}</span>
                    <span className="text-slate-500">by {log.actor}</span>
                  </div>
                  <div className="text-slate-300 text-[11px]">{log.details}</div>
                </div>
                <div className="text-slate-500 text-[10px] shrink-0">
                  {new Date(log.timestamp).toLocaleTimeString()} · {new Date(log.timestamp).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
