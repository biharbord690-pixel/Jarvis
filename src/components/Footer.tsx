import React from 'react';
import { ArrowUpRight, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  setCurrentTab: (tab: string) => void;
  creatorInstagram?: string;
}

export const Footer: React.FC<FooterProps> = ({
  setCurrentTab,
  creatorInstagram = 'https://www.instagram.com/aibhav45'
}) => {
  return (
    <footer className="border-t border-white/10 bg-black text-slate-400 text-xs py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Official Brand Identity */}
          <div className="space-y-3 md:col-span-1">
            <div className="text-base font-extrabold font-display tracking-wider text-white">
              JARVIS INTELLIGENCE OS 3.1 PRO
            </div>
            <p className="text-rose-400 font-semibold text-xs tracking-tight">
              Engineered by ABHINAV ANAND
            </p>
            <p className="text-slate-400 text-xs leading-relaxed">
              "YOUR PHONE. YOUR COMMAND. YOUR INTELLIGENCE."
            </p>
            <div className="text-[11px] text-slate-500 font-mono-code">
              VOICE · INTELLIGENCE · AUTOMATION
            </div>
            <div className="pt-2">
              <a
                href={creatorInstagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-rose-400 transition-colors border border-white/10 rounded-lg px-3 py-1.5 bg-white/[0.02]"
              >
                <span>Instagram: @aibhav45</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Column 2: Navigation & Product */}
          <div className="space-y-2">
            <div className="text-white font-semibold uppercase tracking-wider text-[11px] font-mono-code mb-3">
              Product Navigation
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => { setCurrentTab('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-white transition-colors"
                >
                  System Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setCurrentTab('features'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-white transition-colors"
                >
                  Capabilities & Features Explorer
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setCurrentTab('product'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-white transition-colors"
                >
                  Android System Specifications
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setCurrentTab('pricing'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-white transition-colors"
                >
                  Pricing & License Purchase
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care & Downloads */}
          <div className="space-y-2">
            <div className="text-white font-semibold uppercase tracking-wider text-[11px] font-mono-code mb-3">
              Customer & Entitlements
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => { setCurrentTab('account'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-white transition-colors"
                >
                  Customer Account & Orders
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setCurrentTab('account'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-white transition-colors"
                >
                  Secure Download Center
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setCurrentTab('support'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-white transition-colors"
                >
                  Engineering Helpdesk & FAQ
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Compliance & Legal */}
          <div className="space-y-2">
            <div className="text-white font-semibold uppercase tracking-wider text-[11px] font-mono-code mb-3">
              Legal & Integrity
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => { setCurrentTab('support'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy & Data Sovereignty
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setCurrentTab('support'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-white transition-colors"
                >
                  Terms of Service & EULA
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setCurrentTab('support'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-white transition-colors"
                >
                  Refund & Cancellation Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setCurrentTab('product'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-white transition-colors"
                >
                  Android Permission Guidelines
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Realistic Technical Disclaimers */}
        <div className="pt-8 border-t border-white/5 space-y-2 text-[11px] text-slate-500 leading-relaxed">
          <p>
            <strong className="text-slate-400">Technical Disclaimers:</strong> JARVIS INTELLIGENCE OS 3.1 PRO operates strictly within Android's official sandbox and accessibility frameworks. JARVIS does not bypass OEM security boundaries, silently escalate root privileges, or transmit private memory databases off-device without explicit user consent. WhatsApp and YouTube automations rely on user-granted Accessibility and Notification Listener permissions.
          </p>
          <p>
            WhatsApp is a registered trademark of Meta Platforms, Inc. YouTube is a registered trademark of Google LLC. JARVIS INTELLIGENCE OS is an independent automation platform and is not affiliated with or endorsed by Meta or Google.
          </p>
        </div>

        {/* Bottom Bar with Immutable Creator Credit */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="text-slate-400">
            © {new Date().getFullYear()} JARVIS INTELLIGENCE OS 3.1 PRO. All rights reserved.
          </div>
          <div
            onClick={() => {
              const count = ((window as any).__ownerTapCount = ((window as any).__ownerTapCount || 0) + 1);
              if (count >= 5) {
                setCurrentTab('admin');
                (window as any).__ownerTapCount = 0;
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className="flex items-center gap-1.5 text-slate-300 font-medium select-none"
          >
            <span>Official Creator Credit:</span>
            <span className="text-rose-400 font-bold uppercase tracking-wider">
              Engineered by ABHINAV ANAND
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
