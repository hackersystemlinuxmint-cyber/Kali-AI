import React from 'react';
import { Gauge, Brain, Code, ShieldAlert, KeyRound, Terminal, Building2, User } from 'lucide-react';
import { ActiveTab } from '../types';
import { CORPORATE_INFO } from '../constants';
import { cyberAudio } from '../utils/audio';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <Gauge className="w-4 h-4 md:w-5 md:h-5 text-center shrink-0" /> },
    { id: 'ai', label: "AI 'kali' Assistant", icon: <Brain className="w-4 h-4 md:w-5 md:h-5 text-center shrink-0 text-[#0597ff]" />, badge: 'GEMINI' },
    { id: 'programming', label: 'Code IDE & Lua', icon: <Code className="w-4 h-4 md:w-5 md:h-5 text-center shrink-0 text-[#00d2ff]" />, badge: '9+ LANG' },
    { id: 'pentest', label: 'Pentest & Recon', icon: <ShieldAlert className="w-4 h-4 md:w-5 md:h-5 text-center shrink-0 text-[#00ffaa]" /> },
    { id: 'cipher', label: 'Cipher Utility', icon: <KeyRound className="w-4 h-4 md:w-5 md:h-5 text-center shrink-0 text-amber-400" /> },
    { id: 'terminal', label: 'Kali Terminal', icon: <Terminal className="w-4 h-4 md:w-5 md:h-5 text-center shrink-0 text-gray-300" /> },
  ];

  const handleSelect = (tab: ActiveTab) => {
    cyberAudio.playClick();
    onTabChange(tab);
  };

  return (
    <aside className="w-14 sm:w-16 md:w-64 bg-[#090e17]/95 border-r border-[#00d2ff]/20 flex flex-col justify-between z-20 shrink-0 select-none">
      <div className="py-3 space-y-1">
        <div className="px-4 pb-2 hidden md:block text-[10px] font-mono tracking-widest text-gray-500 uppercase font-semibold">
          SYSTEM MODULES
        </div>

        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleSelect(tab.id)}
              className={`w-full flex items-center justify-center md:justify-between px-2 md:px-4 py-3 transition font-mono text-xs sm:text-sm border-l-4 ${
                isActive
                  ? 'text-[#00d2ff] bg-[#00d2ff]/10 border-[#00d2ff] font-bold shadow-[inset_10px_0_15px_-10px_rgba(0,210,255,0.4)]'
                  : 'text-gray-400 hover:text-[#00d2ff] hover:bg-black/40 border-transparent'
              }`}
              title={tab.label}
            >
              <div className="flex items-center space-x-0 md:space-x-3">
                {tab.icon}
                <span className="hidden md:inline truncate">{tab.label}</span>
              </div>
              {tab.badge && (
                <span className="hidden md:inline text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/60 text-[#00d2ff] border border-[#00d2ff]/30">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Corporate Credits Sidebar Footer */}
      <div className="p-3 border-t border-[#00d2ff]/20 hidden md:block">
        <div className="bg-black/60 p-3 rounded-xl border border-gray-800/80 font-mono text-xs space-y-1.5 shadow-inner">
          <div className="flex items-center justify-between text-gray-400">
            <span className="flex items-center gap-1.5 text-gray-500">
              <Building2 className="w-3 h-3 text-[#00d2ff]" /> Vendor:
            </span>
            <span className="text-[#00d2ff] font-bold">{CORPORATE_INFO.company}</span>
          </div>
          <div className="flex items-center justify-between text-gray-400">
            <span className="flex items-center gap-1.5 text-gray-500">
              <User className="w-3 h-3 text-[#0597ff]" /> CEO:
            </span>
            <span className="text-[#0597ff] font-bold" title={CORPORATE_INFO.founder}>
              E. Atienza
            </span>
          </div>
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-gray-500">Handle:</span>
            <span className="text-[#00ffaa] font-bold">{CORPORATE_INFO.handle}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
