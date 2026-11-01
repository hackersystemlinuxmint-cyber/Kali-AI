import React, { useEffect, useState } from 'react';
import { APP_LOGO, CORPORATE_INFO } from '../constants';
import { cyberAudio } from '../utils/audio';

interface BootSplashProps {
  onComplete: () => void;
}

export const BootSplash: React.FC<BootSplashProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [logIndex, setLogIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  const logs = [
    "[0.2s] Initializing TokemekiAI neural kernel drivers...",
    "[1.1s] Mounting encrypted cyber security modules...",
    "[2.3s] Authorizing CEO: Etlijah Atienza (xlex175)...",
    "[3.5s] Spawning Lua multi-threaded runtime & IDE...",
    "[4.4s] Establishing secure AI link to 'kali' core...",
    "[5.0s] System ready. Welcome to KALI OS v5.0."
  ];

  useEffect(() => {
    cyberAudio.playBootSequence();

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          finishBoot();
          return 100;
        }
        const next = prev + 5;
        const currentLog = Math.min(Math.floor((next / 100) * logs.length), logs.length - 1);
        setLogIndex(currentLog);
        return next;
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  const finishBoot = () => {
    setIsFading(true);
    setTimeout(() => {
      onComplete();
    }, 600);
  };

  const handleSkip = () => {
    cyberAudio.playClick();
    finishBoot();
  };

  return (
    <div
      className={`fixed inset-0 bg-[#020408] z-50 flex flex-col items-center justify-center p-6 font-mono transition-opacity duration-700 select-none ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background Cyber Glow */}
      <div className="absolute w-96 h-96 bg-[#00d2ff]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Glowing Pulsing Circle with App Logo */}
      <div className="relative mb-6">
        <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full border-2 border-[#00d2ff]/50 flex items-center justify-center glow-blue animate-pulse-glow relative overflow-hidden bg-black/60 shadow-[0_0_35px_rgba(0,210,255,0.4)]">
          {/* Cyber Scanning Ray */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00d2ff]/30 to-transparent w-full h-1/3 cyber-scanner pointer-events-none" />

          {/* Logo */}
          <img
            src={APP_LOGO}
            alt="KALI Dragon Logo"
            className="w-28 h-28 sm:w-36 sm:h-36 object-contain animate-float drop-shadow-[0_0_20px_rgba(0,210,255,0.95)]"
          />
        </div>
      </div>

      {/* Typography */}
      <h1 className="text-2xl sm:text-4xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#00d2ff] via-[#0597ff] to-[#00ffaa] text-glow-cyan mb-1.5 text-center">
        {CORPORATE_INFO.appName} {CORPORATE_INFO.version}
      </h1>

      <p className="text-[11px] sm:text-xs text-[#0597ff] font-semibold mb-6 tracking-wider text-center uppercase">
        {CORPORATE_INFO.company} • CEO {CORPORATE_INFO.founder} ({CORPORATE_INFO.handle})
      </p>

      {/* Progress Bar */}
      <div className="w-72 sm:w-96 bg-gray-950 h-3 rounded-full overflow-hidden border border-[#00d2ff]/40 mb-3 shadow-[0_0_15px_rgba(0,210,255,0.35)] p-0.5">
        <div
          className="h-full bg-gradient-to-r from-[#00d2ff] via-[#0597ff] to-[#00ffaa] rounded-full transition-all duration-200"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Dynamic Kernel Loading Logs */}
      <div className="text-xs text-gray-400 h-6 overflow-hidden text-center px-4 mb-6">
        <span className="text-[#00d2ff]">{logs[logIndex]}</span>
      </div>

      {/* Skip Button */}
      <button
        onClick={handleSkip}
        className="text-[11px] font-mono text-gray-400 hover:text-[#00d2ff] bg-black/60 border border-gray-800 hover:border-[#00d2ff]/50 px-4 py-1.5 rounded-lg transition active:scale-95 flex items-center gap-2"
      >
        <span>ENTER DESKTOP</span>
        <span className="text-[#00ffaa]">[{progress}%]</span>
      </button>
    </div>
  );
};
