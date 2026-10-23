import React, { useState } from 'react';
import {
  Mic,
  MessageSquare,
  Youtube,
  Database,
  ShieldCheck,
  Volume2,
  CheckCircle2,
  Send,
  Trash2,
  Lock,
  Smartphone,
  Cpu,
  Sparkles
} from 'lucide-react';

export const PhoneMockup: React.FC = () => {
  const [activeScreen, setActiveScreen] = useState<'voice' | 'whatsapp' | 'youtube' | 'memory' | 'permissions'>('voice');
  const [voiceInput, setVoiceInput] = useState('JARVIS, draft a WhatsApp message to Rohit saying I will reach the studio in 15 minutes.');
  const [isListening, setIsListening] = useState(false);
  const [whatsAppConfirmed, setWhatsAppConfirmed] = useState(false);
  const [whatsAppRecipient, setWhatsAppRecipient] = useState('Rohit Verma (+91 98201 44821)');
  const [whatsAppMessageText, setWhatsAppMessageText] = useState('Hey Rohit, I am heading out now and will reach the studio in 15 minutes.');
  const [memoryItems, setMemoryItems] = useState([
    { id: '1', key: 'Owner Voice Print', value: 'Enrolled & Calibrated (Confidence 99.4%)' },
    { id: '2', key: 'Preferred Navigation', value: 'Google Maps (Avoid Tolls)' },
    { id: '3', key: 'Audio Wake Sensitivity', value: 'Normal Threshold (Offline Engine)' }
  ]);
  const [themeMode, setThemeMode] = useState<'crimson' | 'obsidian' | 'sunset'>('crimson');

  const triggerListen = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
    }, 2500);
  };

  const deleteMemory = (id: string) => {
    setMemoryItems(items => items.filter(m => m.id !== id));
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-12">
      {/* Device Frame Wrapper */}
      <div className="relative mx-auto w-full max-w-[340px] sm:max-w-[380px] p-4 bg-gradient-to-b from-neutral-800 via-neutral-900 to-black rounded-[48px] shadow-[0_25px_70px_rgba(0,0,0,0.85)] border-4 border-neutral-700/60 ring-1 ring-white/20">
        {/* Dynamic Island / Speaker Notch */}
        <div className="absolute top-7 left-1/2 -translate-x-1/2 w-28 h-4 bg-neutral-950 rounded-full flex items-center justify-center gap-2 z-30">
          <div className="w-2.5 h-2.5 rounded-full bg-neutral-900 border border-neutral-800"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-rose-950/80"></div>
        </div>

        {/* Screen Display Area */}
        <div className={`relative h-[640px] rounded-[36px] overflow-hidden flex flex-col transition-colors duration-500 ${
          themeMode === 'crimson'
            ? 'bg-neutral-950 text-white'
            : themeMode === 'obsidian'
            ? 'bg-black text-slate-100'
            : 'bg-gradient-to-b from-zinc-950 to-amber-950/60 text-amber-50'
        }`}>
          {/* Top Status Bar */}
          <div className="pt-8 px-6 pb-2 flex items-center justify-between text-[11px] font-mono-code text-slate-400 z-20">
            <span>21:03</span>
            <div className="flex items-center gap-1.5 text-rose-500">
              <Cpu className="w-3.5 h-3.5" />
              <span>JARVIS 3.1</span>
            </div>
            <div className="flex items-center gap-1">
              <span>5G</span>
              <div className="w-4 h-2 border border-slate-400 rounded-sm p-0.5 flex items-center">
                <div className="w-full h-full bg-slate-300 rounded-[1px]"></div>
              </div>
            </div>
          </div>

          {/* Assistant Header inside Phone */}
          <div className="px-5 py-2.5 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-600 to-rose-900 flex items-center justify-center shadow-lg shadow-rose-600/30">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-xs font-bold tracking-wider font-display">JARVIS 3.1 PRO</div>
                <div className="text-[10px] text-slate-400">ENGINEERED BY ABHINAV ANAND</div>
              </div>
            </div>

            {/* Persona Switcher */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setThemeMode('crimson')}
                title="Crimson Theme"
                className={`w-3.5 h-3.5 rounded-full bg-rose-600 ${themeMode === 'crimson' ? 'ring-2 ring-white' : 'opacity-60'}`}
              />
              <button
                onClick={() => setThemeMode('obsidian')}
                title="Obsidian Theme"
                className={`w-3.5 h-3.5 rounded-full bg-neutral-800 ${themeMode === 'obsidian' ? 'ring-2 ring-white' : 'opacity-60'}`}
              />
              <button
                onClick={() => setThemeMode('sunset')}
                title="Sunset Gold Theme"
                className={`w-3.5 h-3.5 rounded-full bg-amber-600 ${themeMode === 'sunset' ? 'ring-2 ring-white' : 'opacity-60'}`}
              />
            </div>
          </div>

          {/* Screen Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {/* SCREEN 1: VOICE ASSISTANT */}
            {activeScreen === 'voice' && (
              <div className="space-y-4">
                <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                  <div className="text-[10px] font-mono-code text-slate-400 uppercase tracking-wider flex items-center justify-between">
                    <span>Voice Input Pipeline</span>
                    <span className="text-emerald-400">Online</span>
                  </div>
                  <div className="text-xs text-slate-200 font-medium">"{voiceInput}"</div>
                </div>

                {/* Waveform Visualizer Simulation */}
                <div className="py-6 flex flex-col items-center justify-center">
                  <div className="flex items-center justify-center gap-1.5 h-16 w-full px-4">
                    {[40, 65, 30, 85, 95, 60, 100, 75, 45, 90, 80, 50, 70, 40].map((h, i) => (
                      <div
                        key={i}
                        className={`w-1 rounded-full transition-all duration-300 ${
                          isListening ? 'bg-rose-500 animate-pulse' : 'bg-slate-700'
                        }`}
                        style={{ height: isListening ? `${h}%` : '20%' }}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-slate-400 mt-2 font-mono-code">
                    {isListening ? 'LISTENING & DECODING INTENT...' : 'TAP MICROPHONE TO TEST'}
                  </span>
                </div>

                {/* Assistant Response Card */}
                <div className="p-3.5 rounded-2xl bg-rose-950/30 border border-rose-500/30 space-y-2 shadow-inner">
                  <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold">
                    <Volume2 className="w-4 h-4" />
                    <span>JARVIS Response</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    "Understood. I have drafted the message to Rohit. For security, please confirm before dispatch."
                  </p>
                  <div className="pt-2 flex gap-2">
                    <button
                      onClick={() => setActiveScreen('whatsapp')}
                      className="w-full py-1.5 px-3 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Review WhatsApp Draft</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* SCREEN 2: WHATSAPP AUTOMATION */}
            {activeScreen === 'whatsapp' && (
              <div className="space-y-3">
                <div className="p-3 rounded-2xl bg-emerald-950/20 border border-emerald-500/20">
                  <div className="text-[10px] font-mono-code text-emerald-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Safety First: User Pre-Send Confirmation</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    JARVIS resolves contacts securely via Android APIs and always requires your explicit approval before sending.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-neutral-900 border border-white/10 space-y-3">
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase font-mono-code">Recipient Resolved:</label>
                    <div className="text-xs font-semibold text-white mt-0.5">{whatsAppRecipient}</div>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 uppercase font-mono-code">Message Content:</label>
                    <textarea
                      value={whatsAppMessageText}
                      onChange={e => setWhatsAppMessageText(e.target.value)}
                      rows={3}
                      className="w-full mt-1 p-2 bg-neutral-950 border border-white/10 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  {whatsAppConfirmed ? (
                    <div className="p-2.5 rounded-lg bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Message Dispatched via WhatsApp API!</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => setWhatsAppConfirmed(true)}
                      className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Authorize & Send Now</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* SCREEN 3: YOUTUBE AUTOMATION */}
            {activeScreen === 'youtube' && (
              <div className="space-y-3">
                <div className="p-3 rounded-2xl bg-red-950/20 border border-red-500/20">
                  <div className="text-[10px] font-mono-code text-red-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Youtube className="w-3.5 h-3.5" />
                    <span>Voice-Triggered Media Automation</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Direct video discovery and playback intents without navigating manual touch menus.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-neutral-900 border border-white/10 space-y-3">
                  <div className="text-[10px] text-slate-400 uppercase font-mono-code">Sample Voice Triggers:</div>
                  <div className="space-y-2">
                    {[
                      '“Play Hans Zimmer Interstellar soundtrack on YouTube”',
                      '“Search latest space launch video and open”',
                      '“Pause playback”'
                    ].map((cmd, i) => (
                      <div key={i} className="p-2 rounded-lg bg-white/[0.03] border border-white/5 text-xs text-slate-300">
                        {cmd}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SCREEN 4: ENCRYPTED MEMORY REPOSITORY */}
            {activeScreen === 'memory' && (
              <div className="space-y-3">
                <div className="p-3 rounded-2xl bg-blue-950/20 border border-blue-500/20">
                  <div className="text-[10px] font-mono-code text-blue-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5" />
                    <span>User-Controlled On-Device Memory</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    JARVIS stores preferences locally. You have full transparency and the right to delete any item instantly.
                  </p>
                </div>

                <div className="space-y-2">
                  {memoryItems.map(item => (
                    <div key={item.id} className="p-2.5 rounded-xl bg-neutral-900 border border-white/10 flex items-center justify-between">
                      <div>
                        <div className="text-[11px] font-semibold text-white">{item.key}</div>
                        <div className="text-[10px] text-slate-400">{item.value}</div>
                      </div>
                      <button
                        onClick={() => deleteMemory(item.id)}
                        title="Delete record"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  {memoryItems.length === 0 && (
                    <div className="p-4 text-center text-xs text-slate-500">
                      All memories wiped cleanly.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SCREEN 5: ANDROID PERMISSION AUDITOR */}
            {activeScreen === 'permissions' && (
              <div className="space-y-2.5">
                <div className="text-[10px] font-mono-code text-slate-400 uppercase">
                  Required Android Permissions:
                </div>
                {[
                  { name: 'Microphone', req: 'RECORD_AUDIO', desc: 'Continuous wake-word and speech recognition.', granted: true },
                  { name: 'Accessibility Service', req: 'ACCESSIBILITY', desc: 'Automating UI interactions and app actions.', granted: true },
                  { name: 'Notification Listener', req: 'NOTIFICATION_LISTENER', desc: 'Caller announcement and WhatsApp assistance.', granted: true },
                  { name: 'System Overlay', req: 'SYSTEM_ALERT_WINDOW', desc: 'Floating JARVIS HUD and HUD visualizer.', granted: true }
                ].map((perm, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-neutral-900 border border-white/5 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{perm.name}</span>
                      <span className="text-[10px] text-emerald-400 font-mono-code">GRANTED</span>
                    </div>
                    <div className="text-[10px] text-slate-400">{perm.desc}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Dock Navigation inside Phone */}
          <div className="p-2 bg-neutral-900/95 border-t border-white/5 flex items-center justify-around text-[10px]">
            <button
              onClick={() => setActiveScreen('voice')}
              className={`p-2 rounded-xl flex flex-col items-center gap-1 transition-colors ${
                activeScreen === 'voice' ? 'text-rose-400 font-semibold' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Mic className="w-4 h-4" />
              <span>Voice</span>
            </button>
            <button
              onClick={() => setActiveScreen('whatsapp')}
              className={`p-2 rounded-xl flex flex-col items-center gap-1 transition-colors ${
                activeScreen === 'whatsapp' ? 'text-emerald-400 font-semibold' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp</span>
            </button>
            <button
              onClick={() => setActiveScreen('youtube')}
              className={`p-2 rounded-xl flex flex-col items-center gap-1 transition-colors ${
                activeScreen === 'youtube' ? 'text-red-400 font-semibold' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Youtube className="w-4 h-4" />
              <span>YouTube</span>
            </button>
            <button
              onClick={() => setActiveScreen('memory')}
              className={`p-2 rounded-xl flex flex-col items-center gap-1 transition-colors ${
                activeScreen === 'memory' ? 'text-blue-400 font-semibold' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>Memory</span>
            </button>
            <button
              onClick={() => setActiveScreen('permissions')}
              className={`p-2 rounded-xl flex flex-col items-center gap-1 transition-colors ${
                activeScreen === 'permissions' ? 'text-amber-400 font-semibold' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Perms</span>
            </button>
          </div>

          {/* Floating Action Button for Voice Simulation */}
          {activeScreen === 'voice' && (
            <div className="absolute bottom-16 right-4 z-30">
              <button
                onClick={triggerListen}
                title="Tap to trigger voice listening test"
                className="w-12 h-12 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-600/50 transition-all hover:scale-105 active:scale-95"
              >
                <Mic className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Caption & Disclaimer */}
      <div className="text-center mt-4 space-y-1">
        <p className="text-xs font-mono-code text-slate-400">
          Interactive preview simulating real JARVIS OS 3.1 PRO execution on Android 14.
        </p>
        <p className="text-[11px] text-slate-500">
          Engineered by ABHINAV ANAND · Official Build 3.1.0-pro
        </p>
      </div>
    </div>
  );
};
