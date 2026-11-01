import React from 'react';
import { Brain, Code, ShieldCheck, Terminal, Cpu, Building2, User, Play, Radio, Key, Lock, ArrowUpRight } from 'lucide-react';
import { ActiveTab } from '../types';
import { APP_LOGO, CORPORATE_INFO } from '../constants';
import { cyberAudio } from '../utils/audio';

interface DashboardProps {
  onNavigate: (tab: ActiveTab) => void;
  onExecuteCommand: (cmd: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate, onExecuteCommand }) => {
  const handleNav = (tab: ActiveTab) => {
    cyberAudio.playClick();
    onNavigate(tab);
  };

  const handleHook = (cmd: string) => {
    cyberAudio.playClick();
    onExecuteCommand(cmd);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Welcome Hero Banner */}
      <div className="bg-gradient-to-r from-[#090e17] via-[#0d172a] to-[#090e17] border border-[#00d2ff]/30 p-5 sm:p-7 rounded-2xl relative overflow-hidden glow-cyan animate-pulse-glow shadow-2xl">
        {/* Background Watermark with User's App Logo */}
        <div className="absolute -right-8 -bottom-10 opacity-20 pointer-events-none w-56 h-56 sm:w-80 sm:h-80 select-none">
          <img
            src={APP_LOGO}
            alt="KALI Watermark"
            className="w-full h-full object-contain filter drop-shadow-[0_0_30px_rgba(0,210,255,0.8)]"
          />
        </div>

        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] sm:text-xs font-mono px-2.5 py-1 rounded bg-[#00d2ff]/20 text-[#00d2ff] border border-[#00d2ff]/40 uppercase tracking-widest font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#00d2ff] animate-ping inline-block" />
              {CORPORATE_INFO.company} • CYBER SECURITY PLATFORM
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold font-mono text-white tracking-wide">
            KALI <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d2ff] via-[#0597ff] to-[#00ffaa] text-glow-cyan">AI OS v5.0</span>
          </h2>

          <p className="text-gray-300 text-xs sm:text-sm mt-3 leading-relaxed font-mono">
            Developed under the direction of <strong className="text-[#00d2ff] font-bold">{CORPORATE_INFO.founder} ({CORPORATE_INFO.handle})</strong> at{' '}
            <strong className="text-[#0597ff] font-bold">{CORPORATE_INFO.company}</strong>. Fully equipped with multi-language synthesis (including first-class Lua support), penetration testing lab tools, and the advanced <strong className="text-[#00ffaa]">'kali'</strong> AI neural assistant.
          </p>

          <div className="mt-5 sm:mt-6 flex flex-wrap gap-3 font-mono">
            <button
              onClick={() => handleNav('ai')}
              className="px-4 py-2.5 bg-gradient-to-r from-[#00d2ff] to-[#0597ff] text-black font-extrabold rounded-xl text-xs hover:opacity-90 active:scale-95 transition flex items-center gap-2 glow-cyan shadow-lg cursor-pointer"
            >
              <Brain className="w-4 h-4 text-black" /> Consult 'kali' AI
            </button>
            <button
              onClick={() => handleNav('programming')}
              className="px-4 py-2.5 bg-black/70 border border-[#00d2ff] text-[#00d2ff] rounded-xl text-xs active:scale-95 hover:bg-[#00d2ff]/20 transition flex items-center gap-2 cursor-pointer"
            >
              <Code className="w-4 h-4" /> Lua & Multi-Language IDE
            </button>
            <button
              onClick={() => handleNav('pentest')}
              className="px-4 py-2.5 bg-black/70 border border-[#0597ff] text-[#0597ff] rounded-xl text-xs active:scale-95 hover:bg-[#0597ff]/20 transition flex items-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" /> Recon & Nmap Lab
            </button>
          </div>
        </div>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 font-mono">
        {/* Card 1 */}
        <div
          onClick={() => handleNav('ai')}
          className="bg-[#090e17] border border-[#00d2ff]/25 p-4 sm:p-5 rounded-2xl hover:border-[#00d2ff] transition cursor-pointer group active:scale-[0.98] shadow-lg relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#00d2ff]/10 border border-[#00d2ff]/40 flex items-center justify-center text-[#00d2ff] group-hover:scale-110 transition">
              <Brain className="w-5 h-5" />
            </div>
            <span className="text-[9px] font-mono text-[#00d2ff] bg-[#00d2ff]/10 px-2 py-0.5 rounded border border-[#00d2ff]/30 font-semibold">
              NEURAL ENGINE
            </span>
          </div>
          <h3 className="font-bold text-white text-sm sm:text-base flex items-center justify-between">
            <span>AI Assistant 'kali'</span>
            <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-[#00d2ff] transition" />
          </h3>
          <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
            Conversational AI agent trained on Lua scripting, cybersecurity auditing, network packets, and code generation.
          </p>
        </div>

        {/* Card 2 */}
        <div
          onClick={() => handleNav('programming')}
          className="bg-[#090e17] border border-[#00d2ff]/25 p-4 sm:p-5 rounded-2xl hover:border-[#0597ff] transition cursor-pointer group active:scale-[0.98] shadow-lg relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#0597ff]/10 border border-[#0597ff]/40 flex items-center justify-center text-[#0597ff] group-hover:scale-110 transition">
              <Code className="w-5 h-5" />
            </div>
            <span className="text-[9px] font-mono text-[#0597ff] bg-[#0597ff]/10 px-2 py-0.5 rounded border border-[#0597ff]/30 font-semibold">
              9+ LANGUAGES
            </span>
          </div>
          <h3 className="font-bold text-white text-sm sm:text-base flex items-center justify-between">
            <span>Lua & Code IDE</span>
            <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-[#0597ff] transition" />
          </h3>
          <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
            Execute real Lua code in client-side sandbox! Also supports Python, JS, C++, Rust, Go, Bash, PowerShell, and ASM.
          </p>
        </div>

        {/* Card 3 */}
        <div
          onClick={() => handleNav('pentest')}
          className="bg-[#090e17] border border-[#00d2ff]/25 p-4 sm:p-5 rounded-2xl hover:border-[#00ffaa] transition cursor-pointer group active:scale-[0.98] shadow-lg relative overflow-hidden sm:col-span-2 lg:col-span-1"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#00ffaa]/10 border border-[#00ffaa]/40 flex items-center justify-center text-[#00ffaa] group-hover:scale-110 transition">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-[9px] font-mono text-[#00ffaa] bg-[#00ffaa]/10 px-2 py-0.5 rounded border border-[#00ffaa]/30 font-semibold">
              RECON & LAB
            </span>
          </div>
          <h3 className="font-bold text-white text-sm sm:text-base flex items-center justify-between">
            <span>Pentest & Security Lab</span>
            <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-[#00ffaa] transition" />
          </h3>
          <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
            Nmap syntax generator, interactive network scan simulation, OWASP Top 10 vulnerabilities, and payload tools.
          </p>
        </div>
      </div>

      {/* Corporate Intelligence & Quick System Hooks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 font-mono">
        {/* Corporate Breakdown */}
        <div className="bg-[#090e17] border border-[#00d2ff]/25 p-4 sm:p-5 rounded-2xl shadow-lg">
          <h3 className="font-bold text-white text-xs sm:text-sm pb-3 border-b border-gray-800 mb-3 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#00d2ff]" /> TokemekiAI Corporate Intelligence
          </h3>
          <div className="space-y-2.5 text-xs">
            <div className="bg-black/60 p-3 rounded-xl border border-gray-800/80 flex justify-between items-center">
              <span className="text-gray-400">Company / Vendor:</span>
              <span className="text-[#00d2ff] font-bold">{CORPORATE_INFO.company}</span>
            </div>
            <div className="bg-black/60 p-3 rounded-xl border border-gray-800/80 flex justify-between items-center">
              <span className="text-gray-400">Founder & CEO:</span>
              <span className="text-[#0597ff] font-bold">{CORPORATE_INFO.founder}</span>
            </div>
            <div className="bg-black/60 p-3 rounded-xl border border-gray-800/80 flex justify-between items-center">
              <span className="text-gray-400">Developer Handle:</span>
              <span className="text-[#00ffaa] font-bold">{CORPORATE_INFO.handle}</span>
            </div>
            <div className="bg-black/60 p-3 rounded-xl border border-gray-800/80 flex justify-between items-center">
              <span className="text-gray-400">Architecture:</span>
              <span className="text-gray-200">Kali Linux 5.0 Core (Web & Android Touch Ready)</span>
            </div>
          </div>
        </div>

        {/* Quick Hooks */}
        <div className="bg-[#090e17] border border-[#00d2ff]/25 p-4 sm:p-5 rounded-2xl shadow-lg">
          <h3 className="font-bold text-white text-xs sm:text-sm pb-3 border-b border-gray-800 mb-3 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#00ffaa]" /> Quick System Hooks
          </h3>
          <div className="grid grid-cols-2 gap-2.5 text-xs">
            <button
              onClick={() => handleHook('whoami')}
              className="p-3 bg-black/60 active:scale-95 hover:bg-[#00d2ff]/10 border border-gray-800 hover:border-[#00d2ff]/50 rounded-xl text-left text-gray-300 hover:text-[#00d2ff] transition flex items-center justify-between cursor-pointer"
            >
              <span className="font-bold">whoami</span>
              <Play className="w-3 h-3 text-[#00d2ff]" />
            </button>
            <button
              onClick={() => handleHook('creator')}
              className="p-3 bg-black/60 active:scale-95 hover:bg-[#00d2ff]/10 border border-gray-800 hover:border-[#00d2ff]/50 rounded-xl text-left text-gray-300 hover:text-[#00d2ff] transition flex items-center justify-between cursor-pointer"
            >
              <span className="font-bold">check creator</span>
              <Play className="w-3 h-3 text-[#0597ff]" />
            </button>
            <button
              onClick={() => handleHook('scan 10.0.0.1')}
              className="p-3 bg-black/60 active:scale-95 hover:bg-[#00d2ff]/10 border border-gray-800 hover:border-[#00d2ff]/50 rounded-xl text-left text-gray-300 hover:text-[#00d2ff] transition flex items-center justify-between cursor-pointer"
            >
              <span className="font-bold">nmap scan</span>
              <Play className="w-3 h-3 text-[#00ffaa]" />
            </button>
            <button
              onClick={() => handleHook('lua')}
              className="p-3 bg-black/60 active:scale-95 hover:bg-[#00d2ff]/10 border border-gray-800 hover:border-[#00d2ff]/50 rounded-xl text-left text-gray-300 hover:text-[#00d2ff] transition flex items-center justify-between cursor-pointer"
            >
              <span className="font-bold">lua script</span>
              <Play className="w-3 h-3 text-amber-400" />
            </button>
            <button
              onClick={() => handleHook('cmatrix')}
              className="p-3 bg-black/60 active:scale-95 hover:bg-[#00d2ff]/10 border border-gray-800 hover:border-[#00d2ff]/50 rounded-xl text-left text-gray-300 hover:text-[#00d2ff] transition flex items-center justify-between cursor-pointer"
            >
              <span className="font-bold">matrix rain</span>
              <Play className="w-3 h-3 text-[#00ffaa]" />
            </button>
            <button
              onClick={() => handleHook('cat /etc/os-release')}
              className="p-3 bg-black/60 active:scale-95 hover:bg-[#00d2ff]/10 border border-gray-800 hover:border-[#00d2ff]/50 rounded-xl text-left text-gray-300 hover:text-[#00d2ff] transition flex items-center justify-between cursor-pointer"
            >
              <span className="font-bold">os-release</span>
              <Play className="w-3 h-3 text-purple-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
