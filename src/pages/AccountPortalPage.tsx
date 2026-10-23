import React, { useState, useEffect } from 'react';
import {
  User,
  Search,
  Download,
  Key,
  Calendar,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  Sparkles,
  Trash2,
  LogIn,
  LogOut,
  Database,
  ExternalLink
} from 'lucide-react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { api } from '../lib/api';
import { auth, signInWithGoogle, logoutUser, fetchUserOrders } from '../lib/firebase';
import { Order } from '../types';

interface AccountPortalPageProps {
  setCurrentTab: (tab: string) => void;
  onOpenDownload: (downloadData: any) => void;
}

export const AccountPortalPage: React.FC<AccountPortalPageProps> = ({
  setCurrentTab,
  onOpenDownload
}) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [searchEmail, setSearchEmail] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const [downloadLoadingId, setDownloadLoadingId] = useState<string | null>(null);
  const [deletionRequested, setDeletionRequested] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
      if (user?.email) {
        setSearchEmail(user.email);
        loadOrdersForEmail(user.email, user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  const loadOrdersForEmail = async (email: string, userId?: string) => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch from server API
      const serverOrders = await api.getCustomerOrders(email.trim().toLowerCase()).catch(() => []);
      
      // 2. Fetch from Firebase Firestore
      const firestoreOrders = await fetchUserOrders(email.trim().toLowerCase(), userId).catch(() => []);

      // Merge and deduplicate by id
      const orderMap = new Map<string, any>();
      [...serverOrders, ...firestoreOrders].forEach(ord => {
        if (ord && ord.id) {
          orderMap.set(ord.id, ord);
        }
      });

      const combined = Array.from(orderMap.values());
      setOrders(combined);
      setSearched(true);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch customer account records');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchEmail.trim()) return;
    await loadOrdersForEmail(searchEmail.trim());
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    try {
      const user = await signInWithGoogle();
      if (user?.email) {
        setSearchEmail(user.email);
      }
    } catch (err: any) {
      setError(err.message || 'Google sign in failed');
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setOrders([]);
      setSearched(false);
      setSearchEmail('');
    } catch (err: any) {
      console.error('Logout error:', err);
    }
  };

  const handleGenerateDownload = async (order: Order) => {
    setDownloadLoadingId(order.id);
    try {
      const data = await api.requestDownloadToken(order.id, order.customerEmail);
      onOpenDownload({
        ...data,
        orderNumber: order.orderNumber,
        licenseKey: order.licenseKey
      });
      setCurrentTab('download');
    } catch (err: any) {
      alert(err.message || 'Could not authorize download');
    } finally {
      setDownloadLoadingId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono-code mb-2">
          <Database className="w-3.5 h-3.5" />
          <span>Google Firebase & Firestore Connected</span>
        </div>
        <h1 className="text-4xl font-extrabold text-white font-display">
          Customer Account & Licenses
        </h1>
        <p className="text-sm text-slate-300">
          Access your verified order records, generate cryptographic APK download links, and retrieve your personal JARVIS 3.1 PRO license key.
        </p>
      </div>

      {/* Google Authentication Box */}
      <div className="max-w-xl mx-auto p-6 rounded-3xl bg-slate-950/80 border border-white/10 space-y-4 shadow-xl">
        {currentUser ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName || 'User'}
                  className="w-10 h-10 rounded-full border border-white/20"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-rose-600/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
                  <User className="w-5 h-5" />
                </div>
              )}
              <div>
                <div className="text-sm font-semibold text-white">
                  {currentUser.displayName || 'Google User'}
                </div>
                <div className="text-xs text-slate-400 font-mono-code">
                  {currentUser.email}
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        ) : (
          <div className="text-center space-y-3">
            <p className="text-xs text-slate-400">
              Sign in with your Google Account to view your synced purchases automatically.
            </p>
            <button
              onClick={handleGoogleSignIn}
              disabled={authLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-md"
            >
              <LogIn className="w-4 h-4 text-rose-600" />
              <span>Continue with Google (Firebase)</span>
            </button>
          </div>
        )}

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-white/10"></div>
          <span className="flex-shrink mx-4 text-slate-500 text-[11px] font-mono-code">or search by email</span>
          <div className="flex-grow border-t border-white/10"></div>
        </div>

        {/* Email Search Box */}
        <form onSubmit={handleSearch} className="space-y-3">
          <div className="flex gap-2">
            <input
              type="email"
              required
              value={searchEmail}
              onChange={e => setSearchEmail(e.target.value)}
              placeholder="Enter purchase email address"
              className="flex-1 px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-rose-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-semibold text-xs transition-colors flex items-center gap-1.5"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              <span>Find</span>
            </button>
          </div>
        </form>
      </div>

      {error && (
        <div className="max-w-xl mx-auto p-4 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-200 text-xs">
          {error}
        </div>
      )}

      {/* Orders List */}
      {searched && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="text-lg font-bold text-white font-display">
              Purchased Entitlements ({orders.length})
            </h2>
            <span className="text-xs text-slate-400 font-mono-code">
              Account: {searchEmail}
            </span>
          </div>

          {orders.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-slate-950 border border-white/10 space-y-3">
              <div className="text-slate-400 text-sm">
                No verified purchase orders found for this email address.
              </div>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                If you made a payment via Razorpay, please check that you entered the same email address used during payment checkout.
              </p>
              <button
                onClick={() => setCurrentTab('home')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-semibold hover:bg-rose-500 transition-colors"
              >
                Buy Now (₹49)
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map(order => (
                <div
                  key={order.id}
                  className="p-6 rounded-2xl bg-slate-950 border border-white/10 hover:border-rose-500/30 transition-all space-y-5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white font-mono-code">
                          {order.orderNumber}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono-code uppercase font-semibold ${
                            order.status === 'paid'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                              : 'bg-amber-950 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        {order.productName} ({order.productVersion})
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-bold text-white font-mono-code">
                        ₹{(order.amount / 100).toFixed(0)}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 justify-end">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Direct MediaFire Link Box */}
                  <div className="p-3.5 rounded-xl bg-blue-950/40 border border-blue-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Download className="w-4 h-4 text-blue-400 flex-shrink-0" />
                      <span className="text-xs text-blue-300 font-semibold">Official APK Link:</span>
                      <span className="text-xs font-mono-code text-white">MediaFire Verified Mirror</span>
                    </div>
                    <a
                      href="https://www.mediafire.com/file/ux69byxjzd6fgxx/JARVIS_1.8.7.apk/file"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>Open MediaFire Link</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  {/* Action row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                    <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Verified Google & Razorpay Transaction</span>
                    </div>

                    <button
                      onClick={() => handleGenerateDownload(order)}
                      disabled={downloadLoadingId === order.id}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-semibold text-xs shadow-lg shadow-rose-950/40 transition-all flex items-center justify-center gap-2"
                    >
                      {downloadLoadingId === order.id ? (
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Download className="w-4 h-4" />
                      )}
                      <span>Download APK Now</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
