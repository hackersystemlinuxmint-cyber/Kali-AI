import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, RotateCcw, Cpu, HardDrive, Wifi, ShieldCheck } from 'lucide-react';
import { APP_LOGO, CORPORATE_INFO } from '../constants';
import { cyberAudio } from '../utils/audio';

interface HeaderProps {
  onShowToast: (msg: string) => void;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onShowToast, onReset }) => {
  const [audioActive, setAudioActive] = useState(true);
  const [cpuVal, setCpuVal] = useState('11.8%');
  const [ramVal, setRamVal] = useState('3.8GB');

  useEffect(() => {
    const interval = setInterval(() => {
      const cpu = (8 + Math.random() * 9).toFixed(1);
      const ram = (3.7 + Math.random() * 0.4).toFixed(1);
      setCpuVal(`${cpu}%`);
      setRamVal(`${ram}GB`);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const handleAudioToggle = () => {
    const newState = !audioActive;
    setAudioActive(newState);
    cyberAudio.setEnabled(newState);
    if (newState) {
      cyberAudio.playClick();
      onShowToast('Audio synthesis enabled.');
    } else {
      onShowToast('Audio synthesis muted.');
    }
  };

  const handleEmergencyReset = () => {
    cyberAudio.playError();
    onShowToast('Reloading KALI OS system kernel...');
    setTimeout(() => {
      onReset();
    }, 400);
  };

  return (
    <header className="bg-[#090e17]/95 backdrop-blur border-b border-[#00d2ff]/25 px-3 sm:px-5 py-2.5 flex items-center justify-between z-30 sticky top-0">
      {/* Brand & Logo */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-black/80 border border-[#00d2ff]/60 flex items-center justify-center p-1 glow-cyan shadow-[0_0_15px_rgba(0,210,255,0.4)] shrink-0 overflow-hidden">
          <img
            src={APP_LOGO}
            alt="KALI AI Logo"
            className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(0,210,255,0.8)] hover:scale-110 transition-transform duration-300"
          />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono font-extrabold tracking-wider text-white text-sm sm:text-base text-glow-cyan">
              KALI
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#00d2ff]/15 text-[#00d2ff] border border-[#00d2ff]/40 font-semibold">
              AI v5.0
            </span>
            <span className="hidden md:inline-flex items-center gap-1 text-[9px] font-mono text-[#00ffaa] bg-[#00ffaa]/10 px-1.5 py-0.5 rounded border border-[#00ffaa]/30">
              <ShieldCheck className="w-2.5 h-2.5" /> SECURE
            </span>
          </div>
          <p className="text-[10px] sm:text-[11px] text-gray-400 font-mono flex items-center gap-1.5">
            <span className="text-gray-300 truncate max-w-[110px] sm:max-w-none">{CORPORATE_INFO.company}</span>
            <span className="text-gray-600">•</span>
            <span className="text-[#0597ff] truncate max-w-[120px] sm:max-w-none" title={`CEO: ${CORPORATE_INFO.founder} (${CORPORATE_INFO.handle})`}>
              CEO: {CORPORATE_INFO.founder}
            </span>
          </p>
        </div>
      </div>

      {/* Real-time Telemetry (Desktop/Tablet) */}
      <div className="hidden lg:flex items-center space-x-4 text-xs font-mono text-gray-400">
        <div className="flex items-center space-x-2 bg-black/50 px-3 py-1.5 rounded-lg border border-gray-800">
          <Cpu className="w-3.5 h-3.5 text-[#00d2ff]" />
          <span>CPU: <span className="text-[#00d2ff] font-bold">{cpuVal}</span></span>
        </div>
        <div className="flex items-center space-x-2 bg-black/50 px-3 py-1.5 rounded-lg border border-gray-800">
          <HardDrive className="w-3.5 h-3.5 text-[#0597ff]" />
          <span>RAM: <span className="text-[#0597ff] font-bold">{ramVal} / 16GB</span></span>
        </div>
        <div className="flex items-center space-x-2 bg-black/50 px-3 py-1.5 rounded-lg border border-gray-800">
          <Wifi className="w-3.5 h-3.5 text-[#00ffaa]" />
          <span>LINK: <span className="text-[#00ffaa] font-bold">AES-256 GCM</span></span>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center space-x-2">
        <button
          onClick={handleAudioToggle}
          className={`px-2.5 sm:px-3 py-1.5 border rounded-lg font-mono text-xs transition flex items-center gap-1.5 active:scale-95 ${
            audioActive
              ? 'bg-black/60 border-[#00d2ff]/40 text-[#00d2ff] hover:bg-[#00d2ff]/20'
              : 'bg-black/40 border-gray-800 text-gray-500 hover:border-gray-700'
          }`}
          title="Toggle audio synthesizer effects"
        >
          {audioActive ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline font-bold">{audioActive ? 'AUDIO: ON' : 'AUDIO: OFF'}</span>
        </button>

        <button
          onClick={handleEmergencyReset}
          className="px-2.5 sm:px-3 py-1.5 bg-red-950/40 border border-red-500/40 text-red-400 active:scale-95 hover:bg-red-900/50 rounded-lg font-mono text-xs transition flex items-center gap-1.5"
          title="Reboot environment"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden md:inline">RELOAD</span>
        </button>
      </div>
    </header>
  );
};
