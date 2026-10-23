import React, { useState } from 'react';
import {
  Brain,
  Mic,
  Smartphone,
  MessageSquare,
  Youtube,
  Database,
  Palette,
  PhoneCall,
  CheckCircle2,
  Clock,
  Shield,
  Search,
  Filter
} from 'lucide-react';
import { FeatureCategory } from '../types';

interface FeaturesExplorerProps {
  setCurrentTab: (tab: string) => void;
}

const FEATURE_CATEGORIES: FeatureCategory[] = [
  {
    id: 'ai_core',
    title: 'AI Intelligence & Cognition',
    kicker: 'Category 01',
    description: 'Neural intent understanding, multimodal query parsing, and contextual conversational continuity.',
    items: [
      {
        id: 'ai_1',
        title: 'Conversational Assistant Engine',
        description: 'Advanced dual-layer conversational model tuned specifically for natural spoken dialogues.',
        status: 'available',
        permissionsRequired: ['INTERNET', 'RECORD_AUDIO']
      },
      {
        id: 'ai_2',
        title: 'Hindi, Hinglish & English Dialect Parsing',
        description: 'Understands mixed conversational phrases (e.g. "JARVIS, Rohit ko WhatsApp message bhejo") without manual language switching.',
        status: 'available'
      },
      {
        id: 'ai_3',
        title: 'Web-Assisted Live Information Retrieval',
        description: 'Real-time lookups for weather, flight metrics, sports scores, and world time when network is present.',
        status: 'available',
        permissionsRequired: ['INTERNET']
      },
      {
        id: 'ai_4',
        title: 'Contextual Memory Retention',
        description: 'Maintains conversational thread across multi-turn exchanges within active dialogue sessions.',
        status: 'available'
      },
      {
        id: 'ai_5',
        title: 'Offline Resiliency & Graceful Degradation',
        description: 'Clear visual status indicator when network is disconnected, falling back to on-device command intents.',
        status: 'available'
      }
    ]
  },
  {
    id: 'voice_handsfree',
    title: 'Voice & Hands-Free Experience',
    kicker: 'Category 02',
    description: 'Hardware-optimized voice processing pipeline with customizable wake-words and voice synthesis.',
    items: [
      {
        id: 'v_1',
        title: 'Dual Wake-Word Detection',
        description: 'Listens for custom prompt wake-words with minimal battery draw and low CPU wake locks.',
        status: 'available',
        permissionsRequired: ['RECORD_AUDIO']
      },
      {
        id: 'v_2',
        title: 'Natural Neural Text-to-Speech (TTS)',
        description: 'Crisp, high-fidelity vocal responses with adjustable pitch, tempo, and accents.',
        status: 'available'
      },
      {
        id: 'v_3',
        title: 'Voice Enrollment & Biometric Profiling',
        description: 'On-device voice pattern enrollment to reduce spurious triggers from background television or bystanders.',
        status: 'available'
      },
      {
        id: 'v_4',
        title: 'Mute, Pause & Kill Controls',
        description: 'Immediate hardware-level microphone toggle ensuring total acoustic privacy at any instant.',
        status: 'available'
      }
    ]
  },
  {
    id: 'device_control',
    title: 'Android Device Control & Shortcuts',
    kicker: 'Category 03',
    description: 'System actions, app launching, hardware toggles, and device settings orchestration.',
    items: [
      {
        id: 'd_1',
        title: 'App Launching & Switching',
        description: 'Instantly opens any installed application using Android Package Manager intents.',
        status: 'available'
      },
      {
        id: 'd_2',
        title: 'System Settings Shortcuts',
        description: 'Controls Wi-Fi, Bluetooth, Torch, Screen Brightness, and Volume levels via user-granted system permissions.',
        status: 'available',
        permissionsRequired: ['WRITE_SETTINGS']
      },
      {
        id: 'd_3',
        title: 'Contact Resolution & Quick Dial',
        description: 'Finds contacts in your phonebook with phonetic tolerance to initiate phone calls upon user confirmation.',
        status: 'available',
        permissionsRequired: ['READ_CONTACTS', 'CALL_PHONE']
      },
      {
        id: 'd_4',
        title: 'Security Boundary Enforcement',
        description: 'Strict adherence to Android security; never attempts root exploits or unauthorized keystroke logging.',
        status: 'available'
      }
    ]
  },
  {
    id: 'whatsapp_assist',
    title: 'WhatsApp Voice Assistant',
    kicker: 'Category 04',
    description: 'Hands-free messaging co-pilot with strict confirmation safety gates.',
    items: [
      {
        id: 'w_1',
        title: 'Speech-to-Draft Messaging',
        description: 'Speak recipient and message body in one breath. JARVIS formats punctuation and prepares the text.',
        status: 'available',
        permissionsRequired: ['ACCESSIBILITY_SERVICE', 'READ_CONTACTS']
      },
      {
        id: 'w_2',
        title: 'Pre-Send User Approval Barrier',
        description: 'Displays a visible confirmation card with the resolved name and message before dispatching.',
        status: 'available'
      },
      {
        id: 'w_3',
        title: 'Read Out Incoming Messages',
        description: 'Optional notification listener that can announce incoming WhatsApp sender and preview text.',
        status: 'available',
        permissionsRequired: ['BIND_NOTIFICATION_LISTENER_SERVICE']
      }
    ]
  },
  {
    id: 'youtube_automation',
    title: 'YouTube Media Automation',
    kicker: 'Category 05',
    description: 'Voice search and automated playback queues on the official YouTube application.',
    items: [
      {
        id: 'yt_1',
        title: 'Voice-Triggered Video Search & Play',
        description: 'Speak artist, song, or channel name to automatically resolve and launch playback on YouTube.',
        status: 'available'
      },
      {
        id: 'yt_2',
        title: 'Playback Transport Shortcuts',
        description: 'Pause, resume, and skip videos using accessibility triggers without touching the display.',
        status: 'available',
        permissionsRequired: ['ACCESSIBILITY_SERVICE']
      }
    ]
  },
  {
    id: 'memory_vault',
    title: 'Encrypted Memory & Personalization',
    kicker: 'Category 06',
    description: 'On-device transparent memory repository preserving your personalized assistant experience.',
    items: [
      {
        id: 'm_1',
        title: 'On-Device Encrypted Database',
        description: 'All learned facts, nicknames, and preferences stored in SQLite with SQLCipher encryption.',
        status: 'available'
      },
      {
        id: 'm_2',
        title: 'Full Inspection & Selective Deletion',
        description: 'Review every single fact stored in memory and delete individual records with one tap.',
        status: 'available'
      },
      {
        id: 'm_3',
        title: 'Zero Opaque Cloud Telemetry',
        description: 'Your memory database never leaves your phone without explicit encrypted export authorization.',
        status: 'available'
      }
    ]
  },
  {
    id: 'persona_ui',
    title: 'Interface Themes & Persona HUD',
    kicker: 'Category 07',
    description: 'Luxury aesthetics tailored for power users: Dark Obsidian, Crimson Red, and Sunset Gold.',
    items: [
      {
        id: 'p_1',
        title: 'Triple Luxury Theme Engine',
        description: 'Switch between Deep Obsidian Black, Crimson Ruby Red, and Sunset Titanium Gold.',
        status: 'available'
      },
      {
        id: 'p_2',
        title: 'Floating HUD Overlay',
        description: 'Interactive overlay bubble accessible from any app screen with quick mic trigger.',
        status: 'available',
        permissionsRequired: ['SYSTEM_ALERT_WINDOW']
      },
      {
        id: 'p_3',
        title: 'Real-time Waveform Audio Visualizer',
        description: 'Procedural audio reactive waveforms reflecting your speech input and JARVIS vocal cadence.',
        status: 'available'
      }
    ]
  },
  {
    id: 'agent_tasks',
    title: 'Agent Tasks & Future Roadmap',
    kicker: 'Category 08',
    description: 'Advanced multi-action workflow automation and planned ecosystem integrations.',
    items: [
      {
        id: 'ag_1',
        title: 'Multi-Step Morning Automation Routine',
        description: 'Sequentially reads weather, gives calendar outline, and plays news podcast on one wake trigger.',
        status: 'available'
      },
      {
        id: 'ag_2',
        title: 'Google AI Studio & Gemini API Key Connection',
        description: 'Custom API key field allowing power users to hook their personal Gemini Flash / Pro models.',
        status: 'available'
      },
      {
        id: 'ag_3',
        title: 'Spotify Voice Queue Deep Integration',
        description: 'Direct playlist management and playlist creation via official Spotify Web API.',
        status: 'planned',
        notes: 'Planned for v3.2 release update'
      },
      {
        id: 'ag_4',
        title: 'JARVIS Desktop PC Connect Bridge',
        description: 'Sync clipboard, notifications, and execute cross-device actions between Android and Windows/Linux.',
        status: 'planned',
        notes: 'Under active research & development'
      }
    ]
  }
];

export const FeaturesExplorerPage: React.FC<FeaturesExplorerProps> = ({ setCurrentTab }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'planned'>('all');

  const filteredCategories = FEATURE_CATEGORIES.map(category => {
    if (activeCategory !== 'all' && category.id !== activeCategory) {
      return null;
    }

    const filteredItems = category.items.filter(item => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    if (filteredItems.length === 0) return null;
    return { ...category, items: filteredItems };
  }).filter(Boolean) as FeatureCategory[];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="text-xs font-mono-code text-rose-400 uppercase tracking-widest">
          Comprehensive Feature Catalog
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white font-display">
          Capabilities of JARVIS OS 3.1 PRO
        </h1>
        <p className="text-sm text-slate-300 leading-relaxed">
          Engineered by <strong className="text-white">ABHINAV ANAND</strong>. Every feature below describes verified capabilities in build 3.1.0-pro or clearly labeled roadmap items.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search features (e.g. WhatsApp, offline, memory, wake-word)..."
              className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
            />
          </div>

          {/* Status Filter Tabs (Interactive segmented buttons allowed by frontend-design guidelines) */}
          <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-xl border border-white/10 text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                statusFilter === 'all' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              All Features
            </button>
            <button
              onClick={() => setStatusFilter('available')}
              className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                statusFilter === 'available' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Available in 3.1
            </button>
            <button
              onClick={() => setStatusFilter('planned')}
              className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                statusFilter === 'planned' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Planned / Roadmap
            </button>
          </div>
        </div>

        {/* Category Horizontal Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 rounded-lg shrink-0 font-medium transition-colors ${
              activeCategory === 'all' ? 'bg-white/15 text-white border border-white/20' : 'text-slate-400 hover:text-white bg-slate-900'
            }`}
          >
            All Categories
          </button>
          {FEATURE_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg shrink-0 font-medium transition-colors ${
                activeCategory === cat.id ? 'bg-white/15 text-white border border-white/20' : 'text-slate-400 hover:text-white bg-slate-900'
              }`}
            >
              {cat.title}
            </button>
          ))}
        </div>
      </div>

      {/* Feature Catalog Categories Grid */}
      <div className="space-y-12">
        {filteredCategories.map(category => (
          <div key={category.id} className="space-y-6">
            <div className="border-b border-white/10 pb-4">
              <div className="text-xs font-mono-code text-rose-500 uppercase tracking-widest">
                {category.kicker}
              </div>
              <h2 className="text-2xl font-bold text-white font-display mt-1">
                {category.title}
              </h2>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                {category.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {category.items.map(item => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-slate-950/70 border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Header with Title and Status */}
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-bold text-white font-display">
                        {item.title}
                      </h3>
                      {item.status === 'available' ? (
                        <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 shrink-0">
                          AVAILABLE
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-amber-950/60 border border-amber-500/30 text-amber-300 shrink-0">
                          PLANNED
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      {item.description}
                    </p>

                    {item.notes && (
                      <div className="text-[11px] text-amber-400/90 font-mono-code">
                        Notice: {item.notes}
                      </div>
                    )}
                  </div>

                  {/* Permissions footer if applicable */}
                  {item.permissionsRequired && item.permissionsRequired.length > 0 && (
                    <div className="pt-4 mt-3 border-t border-white/5 flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] text-slate-500 uppercase font-mono-code">Perms:</span>
                      {item.permissionsRequired.map(perm => (
                        <span
                          key={perm}
                          className="text-[9px] font-mono-code px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-white/5"
                        >
                          {perm}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {filteredCategories.length === 0 && (
          <div className="p-12 text-center rounded-2xl bg-slate-950 border border-white/10 space-y-3">
            <div className="text-slate-400 text-sm">No capabilities match your query "{searchQuery}".</div>
            <button
              onClick={() => { setSearchQuery(''); setStatusFilter('all'); setActiveCategory('all'); }}
              className="text-xs text-rose-400 hover:underline"
            >
              Reset all filters
            </button>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="p-8 rounded-3xl bg-slate-900/50 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-xl font-bold text-white font-display">
            Experience JARVIS 3.1 PRO on Your Device
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Engineered by ABHINAV ANAND. Instant verified download upon purchase.
          </p>
        </div>
        <button
          onClick={() => { setCurrentTab('pricing'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-colors shrink-0"
        >
          Proceed to Purchase
        </button>
      </div>
    </div>
  );
};
