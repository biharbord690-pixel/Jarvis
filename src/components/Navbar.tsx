import React, { useState } from 'react';
import { Shield, Sparkles, User, Settings, Menu, X, ArrowUpRight } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  creatorInstagram?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  creatorInstagram = 'https://www.instagram.com/aibhav45'
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Overview' },
    { id: 'features', label: 'Features' },
    { id: 'product', label: 'Specifications' },
    { id: 'pricing', label: 'Pricing & Buy' },
    { id: 'account', label: 'Customer Portal' },
    { id: 'support', label: 'Support & Legal' }
  ];

  const handleNavClick = (id: string) => {
    setCurrentTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-slate-950/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo & Creator Subtitle */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-neutral-900 to-black border border-rose-500/40 flex items-center justify-center shadow-lg shadow-rose-950/50 group-hover:border-rose-500 transition-colors">
              <div className="absolute inset-0 rounded-xl bg-rose-600/10 blur-sm"></div>
              <Sparkles className="w-5 h-5 text-rose-500 group-hover:rotate-12 transition-transform" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-extrabold text-base sm:text-lg tracking-wider text-white">
                  JARVIS
                </span>
                <span className="text-[10px] font-mono-code px-1.5 py-0.5 rounded bg-rose-600/20 text-rose-400 border border-rose-500/30">
                  OS 3.1 PRO
                </span>
              </div>
              <div className="text-[11px] text-slate-400 font-medium tracking-tight">
                Engineered by <span className="text-slate-200 font-semibold">ABHINAV ANAND</span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links (Clean text links adhering to frontend-design constitution) */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`transition-colors py-1 relative ${
                  currentTab === link.id
                    ? 'text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {link.label}
                {currentTab === link.id && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-rose-500 rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Right Action Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href={creatorInstagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1 font-mono-code transition-colors"
            >
              <span>@aibhav45</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={() => handleNavClick('pricing')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white text-xs font-semibold shadow-lg shadow-rose-900/40 transition-all hover:scale-105 active:scale-95"
            >
              Get JARVIS 3.1
            </button>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => handleNavClick('pricing')}
              className="px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-semibold"
            >
              Buy
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg border border-white/10 text-slate-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-slate-950 px-4 pt-3 pb-6 space-y-2">
          {navLinks.map(link => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`w-full text-left py-2.5 px-3 rounded-lg text-sm font-medium transition-colors ${
                currentTab === link.id
                  ? 'bg-rose-950/40 text-rose-300 border border-rose-500/30'
                  : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              {link.label}
            </button>
          ))}

          <div className="pt-2 border-t border-white/5 flex items-center justify-end">
            <a
              href={creatorInstagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1 py-2 px-3 font-mono-code"
            >
              <span>Instagram @aibhav45</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};
