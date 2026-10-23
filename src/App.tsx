/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { FeaturesExplorerPage } from './pages/FeaturesExplorerPage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { PricingPage } from './pages/PricingPage';
import { CheckoutSuccessPage } from './pages/CheckoutSuccessPage';
import { AccountPortalPage } from './pages/AccountPortalPage';
import { SecureDownloadPage } from './pages/SecureDownloadPage';
import { AboutSupportPage } from './pages/AboutSupportPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { api } from './lib/api';
import { AppConfig } from './types';
import { AlertTriangle } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [loadingConfig, setLoadingConfig] = useState(true);

  // Completed order state for checkout success screen
  const [completedOrder, setCompletedOrder] = useState<any>(null);

  // Active download entitlement state
  const [activeDownloadData, setActiveDownloadData] = useState<any>(null);

  const fetchConfig = async () => {
    try {
      const data = await api.getConfig();
      setConfig(data);
    } catch (err) {
      console.warn('Could not reach backend configuration, using built-in defaults:', err);
      // Fallback default config with Razorpay Key ID and Key Secret placeholders
      const clientEnvKeyId = (import.meta.env.VITE_RAZORPAY_KEY_ID as string) || 'rzp_test_YOUR_KEY_ID';
      const hasRealKeys = Boolean(clientEnvKeyId && !clientEnvKeyId.includes('YOUR_KEY_ID'));
      const isLiveMode = Boolean(hasRealKeys && clientEnvKeyId.startsWith('rzp_live'));

      setConfig({
        appName: 'JARVIS INTELLIGENCE OS 3.1 PRO',
        creatorName: 'ABHINAV ANAND',
        creatorInstagram: 'https://www.instagram.com/aibhav45',
        productPriceInr: 49,
        taxRatePercent: 0,
        maintenanceMode: false,
        maintenanceMessage: '',
        isKeylessMode: false,
        supportEmail: 'contact via Instagram @aibhav45',
        razorpayKeyId: clientEnvKeyId,
        paymentMode: isLiveMode ? 'live' : 'test',
        activeRelease: {
          id: 'rel_3_1_0_pro',
          version: '3.1.0-pro',
          buildNumber: '2026.10.1',
          releaseDate: 'October 2026',
          fileSizeMb: 48.6,
          fileName: 'JARVIS_OS_3.1_PRO_v3.1.0.apk',
          sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
          minAndroidVersion: 'Android 9.0 (API 28)',
          targetAndroidVersion: 'Android 14 / 15',
          architectures: ['arm64-v8a', 'armeabi-v7a'],
          changelog: ['Official 3.1 PRO Release engineered by ABHINAV ANAND'],
          isActive: true,
          isEmergencyDisabled: false,
          downloadCount: 142
        }
      });
    } finally {
      setLoadingConfig(false);
    }
  };

  useEffect(() => {
    fetchConfig();

    // Stealth access for Owner only: URL Hash #admin or ?admin=true
    const checkStealthAdmin = () => {
      const isHashAdmin = window.location.hash.toLowerCase() === '#admin';
      const isParamAdmin = new URLSearchParams(window.location.search).get('admin') === 'true';
      if (isHashAdmin || isParamAdmin) {
        setCurrentTab('admin');
      }
    };

    checkStealthAdmin();
    window.addEventListener('hashchange', checkStealthAdmin);

    // Secret Owner shortcut: Ctrl + Shift + A (or Cmd + Shift + A)
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setCurrentTab(prev => (prev === 'admin' ? 'home' : 'admin'));
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('hashchange', checkStealthAdmin);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handlePaymentSuccess = (order: any) => {
    setCompletedOrder(order);
    setCurrentTab('success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenDownload = (downloadData: any) => {
    setActiveDownloadData(downloadData);
    setCurrentTab('download');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isHome = currentTab === 'home';

  return (
    <div className={isHome ? "h-screen w-screen overflow-hidden bg-black text-slate-100" : "min-h-screen flex flex-col bg-black text-slate-100 selection:bg-rose-600 selection:text-white"}>
      {/* Maintenance Mode Alert if enabled by administrator */}
      {config?.maintenanceMode && currentTab !== 'admin' && !isHome && (
        <div className="bg-amber-600 text-black px-4 py-2.5 text-xs font-bold text-center flex items-center justify-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          <span>{config.maintenanceMessage || 'System maintenance in progress. Orders temporarily paused.'}</span>
        </div>
      )}

      {/* Main Sticky Navbar (Hidden on home page for true fullscreen no-scroll video) */}
      {!isHome && (
        <Navbar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          creatorInstagram={config?.creatorInstagram}
        />
      )}

      {/* Dynamic Main Body Content */}
      <main className={isHome ? "h-full w-full overflow-hidden" : "flex-1"}>
        {currentTab === 'home' && (
          <HomePage
            config={config}
            setCurrentTab={setCurrentTab}
            onPaymentSuccess={handlePaymentSuccess}
            onOpenDownload={handleOpenDownload}
          />
        )}

        {currentTab === 'features' && (
          <FeaturesExplorerPage
            setCurrentTab={setCurrentTab}
          />
        )}

        {currentTab === 'product' && (
          <ProductDetailsPage
            config={config}
            setCurrentTab={setCurrentTab}
          />
        )}

        {currentTab === 'pricing' && (
          <PricingPage
            config={config}
            onPaymentSuccess={handlePaymentSuccess}
            setCurrentTab={setCurrentTab}
            refetchConfig={fetchConfig}
          />
        )}

        {currentTab === 'success' && completedOrder && (
          <CheckoutSuccessPage
            order={completedOrder}
            setCurrentTab={setCurrentTab}
            onOpenDownload={handleOpenDownload}
          />
        )}

        {currentTab === 'account' && (
          <AccountPortalPage
            setCurrentTab={setCurrentTab}
            onOpenDownload={handleOpenDownload}
          />
        )}

        {currentTab === 'download' && (
          <SecureDownloadPage
            downloadData={activeDownloadData}
            setCurrentTab={setCurrentTab}
          />
        )}

        {currentTab === 'support' && (
          <AboutSupportPage
            config={config}
          />
        )}

        {currentTab === 'admin' && (
          <AdminDashboardPage
            setCurrentTab={setCurrentTab}
          />
        )}
      </main>

      {/* Official Footer (Hidden on home page for true fullscreen no-scroll video) */}
      {!isHome && (
        <Footer
          setCurrentTab={setCurrentTab}
          creatorInstagram={config?.creatorInstagram}
        />
      )}
    </div>
  );
}
