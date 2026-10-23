import React from 'react';
import {
  Smartphone,
  Shield,
  FileCode,
  HardDrive,
  Cpu,
  Layers,
  CheckCircle,
  HelpCircle,
  Download,
  Key,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { AppConfig } from '../types';

interface ProductDetailsPageProps {
  config: AppConfig | null;
  setCurrentTab: (tab: string) => void;
}

export const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({ config, setCurrentTab }) => {
  const priceInr = config?.productPriceInr ?? 49;
  const taxRate = config?.taxRatePercent ?? 0;
  const totalInr = Math.round(priceInr * (1 + taxRate / 100));
  const activeRelease = config?.activeRelease;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Product Hero Header */}
      <div className="border-b border-white/10 pb-10 space-y-4">
        <div className="inline-flex items-center gap-2 text-xs font-mono-code text-rose-400 bg-rose-950/30 border border-rose-500/20 px-3 py-1 rounded-full">
          <span>FLAGSHIP ANDROID SYSTEM ARCHITECTURE</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-white font-display">
          JARVIS INTELLIGENCE OS 3.1 PRO
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs font-mono-code text-slate-400">
          <div>CREATOR: <span className="text-white font-bold">ABHINAV ANAND</span></div>
          <span className="text-slate-600">·</span>
          <div>RELEASE VERSION: <span className="text-rose-400 font-bold">{activeRelease?.version || '3.1.0-pro'}</span></div>
          <span className="text-slate-600">·</span>
          <div>PACKAGE SIZE: <span className="text-white">{activeRelease?.fileSizeMb || 48.6} MB</span></div>
          <span className="text-slate-600">·</span>
          <div>MINIMUM OS: <span className="text-white">ANDROID 9.0 (API 28+)</span></div>
        </div>

        <p className="text-slate-300 text-sm leading-relaxed max-w-3xl pt-2">
          JARVIS INTELLIGENCE OS 3.1 PRO represents a major generational milestone in Android automation. Operating natively without requiring root access, it bridges voice command recognition with physical device workflows, WhatsApp dispatch co-pilots, YouTube intent control, and encrypted on-device memory.
        </p>

        <div className="pt-4 flex flex-wrap items-center gap-4">
          <button
            onClick={() => { setCurrentTab('pricing'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-colors shadow-lg shadow-rose-950/50"
          >
            Buy License — ₹{totalInr.toLocaleString('en-IN')} (Instant Download)
          </button>
          <a
            href={config?.creatorInstagram || 'https://www.instagram.com/aibhav45'}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/10 text-xs font-mono-code flex items-center gap-1.5 transition-colors"
          >
            <span>Instagram: @aibhav45</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Technical Specifications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Box 1: Verified Android Compatibility */}
        <div className="p-6 rounded-2xl bg-slate-950/80 border border-white/10 space-y-4">
          <div className="flex items-center gap-2.5 text-white font-bold font-display text-base">
            <Smartphone className="w-5 h-5 text-rose-500" />
            <span>Verified Device Compatibility</span>
          </div>
          <p className="text-xs text-slate-400">
            Tested rigorously across standard OEM variations to guarantee wake-word accuracy, background persistence, and accessibility reliability:
          </p>
          <ul className="space-y-2 text-xs text-slate-300">
            {[
              'Samsung Galaxy S20 / S21 / S22 / S23 / S24 & Z Fold series (One UI 5/6)',
              'Google Pixel 6 / 7 / 8 / 9 & Pixel Pro series (Stock Android 13/14/15)',
              'OnePlus 9 / 10 / 11 / 12 & Open (OxygenOS 13/14)',
              'Xiaomi, Redmi & POCO (MIUI 14 & HyperOS 1.0+ with autostart enabled)',
              'Nothing Phone (1) & (2) (Nothing OS 2.0+)',
              'Motorola Edge & G Series (Android 11+)'
            ].map((dev, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-rose-500 font-mono-code">›</span>
                <span>{dev}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Box 2: Binary Integrity & Architecture */}
        <div className="p-6 rounded-2xl bg-slate-950/80 border border-white/10 space-y-4">
          <div className="flex items-center gap-2.5 text-white font-bold font-display text-base">
            <FileCode className="w-5 h-5 text-rose-500" />
            <span>Binary Specifications & Checksum</span>
          </div>
          <div className="space-y-3 text-xs">
            <div>
              <div className="text-slate-500 uppercase font-mono-code text-[10px]">Package Identifier</div>
              <div className="text-slate-200 font-mono-code font-medium">com.jarvis.intelligence.os.pro</div>
            </div>
            <div>
              <div className="text-slate-500 uppercase font-mono-code text-[10px]">Active Build Checksum (SHA-256)</div>
              <div className="text-rose-400 font-mono-code text-[11px] break-all bg-black/60 p-2 rounded border border-white/5">
                {activeRelease?.sha256 || '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08'}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1 font-mono-code text-[11px]">
              <div>
                <span className="text-slate-500">Architectures:</span>
                <div className="text-slate-300">arm64-v8a, armeabi-v7a</div>
              </div>
              <div>
                <span className="text-slate-500">Min SDK:</span>
                <div className="text-slate-300">API 28 (Android 9.0)</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Permissions Breakdown & Architectural Rationale */}
      <div className="p-8 rounded-3xl bg-slate-950/80 border border-white/10 space-y-6">
        <div>
          <div className="text-xs font-mono-code text-rose-400 uppercase tracking-widest">
            Permission Transparency
          </div>
          <h2 className="text-2xl font-bold text-white font-display mt-1">
            Required Android Permissions & Security Rationale
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl">
            JARVIS requests only the minimal system permissions required to provide automated assistant functionality. We never harvest your data or sell marketing metrics.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {[
            {
              title: 'RECORD_AUDIO (Microphone)',
              desc: 'Allows the speech recognition engine to listen for the active wake-word and parse spoken commands. Hardware mute switch provided.',
              critical: true
            },
            {
              title: 'ACCESSIBILITY SERVICE',
              desc: 'Enables JARVIS to interact with the screen on your behalf for WhatsApp message drafting, YouTube playback controls, and system actions.',
              critical: true
            },
            {
              title: 'NOTIFICATION LISTENER',
              desc: 'Allows JARVIS to announce incoming caller names and read WhatsApp notification messages aloud when you are driving or hands-free.',
              critical: false
            },
            {
              title: 'SYSTEM_ALERT_WINDOW (Overlay)',
              desc: 'Displays the floating JARVIS HUD orb above active apps for immediate one-tap voice input.',
              critical: false
            },
            {
              title: 'READ_CONTACTS',
              desc: 'Resolves spoken names (e.g. "Draft message to Rohit") against your phonebook to find the matching mobile number.',
              critical: false
            },
            {
              title: 'INTERNET & NETWORK_STATE',
              desc: 'Enables optional cloud AI model queries, live web lookups, weather forecasts, and license token validation.',
              critical: false
            }
          ].map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-900 border border-white/5 space-y-2">
              <div className="font-bold text-white font-mono-code text-[11px] flex items-center justify-between">
                <span>{item.title}</span>
                {item.critical && (
                  <span className="text-[9px] text-rose-400 uppercase font-mono-code">Core</span>
                )}
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* What's Included & License Terms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-6 rounded-2xl bg-slate-950/80 border border-white/10 space-y-4">
          <div className="text-white font-bold font-display text-base flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <span>What's Included in Your Purchase</span>
          </div>
          <ul className="space-y-3 text-xs text-slate-300">
            {[
              'Direct download entitlement for the official JARVIS INTELLIGENCE OS 3.1 PRO APK.',
              'Permanent, personal single-seat license activation key.',
              'SHA-256 package verification checksum for authentic sideload validation.',
              'Full access to all minor version 3.1.x feature patches and bug fixes.',
              'Customer Portal access for re-generating download tokens and viewing invoices.',
              'Direct support from creator Abhinav Anand.'
            ].map((inc, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>{inc}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-6 rounded-2xl bg-slate-950/80 border border-white/10 space-y-4">
          <div className="text-white font-bold font-display text-base flex items-center gap-2">
            <Shield className="w-5 h-5 text-rose-400" />
            <span>License Terms & Refund Policy</span>
          </div>
          <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
            <p>
              <strong>Single-Seat Personal License:</strong> You may install JARVIS 3.1 PRO on up to 3 personal Android devices owned by the license holder. Redistribution, decompilation, or reselling the APK is strictly prohibited.
            </p>
            <p>
              <strong>Update Policy:</strong> Minor version updates (v3.1.1, v3.1.2) are provided free of charge through the Customer Portal. Major generational upgrades (e.g., v4.0) will offer preferential upgrade discounts.
            </p>
            <p>
              <strong>7-Day Compatibility Guarantee:</strong> If JARVIS cannot execute properly on a verified compatible Android device running an unmodified operating system, our engineering desk will attempt troubleshooting. If unresolved within 7 days, a full refund will be granted.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
