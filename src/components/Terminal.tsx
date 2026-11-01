import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Eraser, Play, Sparkles } from 'lucide-react';
import { CORPORATE_INFO } from '../constants';
import { cyberAudio } from '../utils/audio';

interface TerminalProps {
  initialCommand?: string;
  onClearInitialCommand?: () => void;
  onShowToast: (msg: string) => void;
}

interface TerminalLine {
  id: string;
  type: 'input' | 'output' | 'system' | 'matrix';
  content: string | React.ReactNode;
}

export const Terminal: React.FC<TerminalProps> = ({ initialCommand, onClearInitialCommand, onShowToast }) => {
  const [lines, setLines] = useState<TerminalLine[]>([
    {
      id: 'welcome',
      type: 'system',
      content: (
        <div>
          <span className="text-[#00d2ff] font-bold">KALI GNU/Linux 5.0 (TokemekiAI Cyber Shell)</span>
          <br />
          Type <span className="text-white font-bold">help</span>, <span className="text-[#0597ff] font-bold">creator</span>, <span className="text-[#00ffaa] font-bold">lua</span>, or <span className="text-amber-400 font-bold">cmatrix</span> to begin.
        </div>
      ),
    },
  ]);

  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState<number>(-1);
  const [isMatrixRunning, setIsMatrixRunning] = useState(false);

  const screenRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (screenRef.current) {
      screenRef.current.scrollTop = screenRef.current.scrollHeight;
    }
  }, [lines, isMatrixRunning]);

  useEffect(() => {
    if (initialCommand) {
      executeCommand(initialCommand);
      if (onClearInitialCommand) onClearInitialCommand();
    }
  }, [initialCommand]);

  const executeCommand = (cmdStr: string) => {
    const raw = cmdStr.trim();
    if (!raw) return;

    cyberAudio.playSend();
    setHistory((prev) => [...prev, raw]);
    setHistoryIdx(-1);

    const newLines: TerminalLine[] = [
      ...lines,
      {
        id: Date.now().toString(),
        type: 'input',
        content: raw,
      },
    ];

    const args = raw.split(/\s+/);
    const cmd = args[0].toLowerCase();

    if (cmd === 'clear') {
      cyberAudio.playClick();
      setLines([]);
      setIsMatrixRunning(false);
      return;
    }

    if (cmd === 'cmatrix') {
      setIsMatrixRunning(true);
      newLines.push({
        id: (Date.now() + 1).toString(),
        type: 'output',
        content: (
          <div className="text-[#00ffaa] font-mono text-xs animate-pulse leading-relaxed">
            [+] Initiating TokemekiAI Matrix rain...<br />
            01001011 01000001 01001100 01001001 00100000 01001111 01010011<br />
            01010100 01001111 01001011 01000101 01001101 01000101 01001011 01001001<br />
            01011000 01001100 01000101 01011000 00110001 00110111 00110101<br />
            [✓] Matrix stream active. Enter any command to return to bash.
          </div>
        ),
      });
      setLines(newLines);
      return;
    }

    let outputNode: React.ReactNode = null;

    if (cmd === 'help') {
      outputNode = (
        <div className="text-gray-300 space-y-1 my-1">
          <div><span className="text-[#00d2ff] font-bold">creator</span> - TokemekiAI corporate details & CEO</div>
          <div><span className="text-[#00d2ff] font-bold">lua [file]</span> - Execute Lua interpreter script</div>
          <div><span className="text-[#00d2ff] font-bold">whoami</span> - Display current shell privileges</div>
          <div><span className="text-[#00d2ff] font-bold">uname -a</span> - Kernel build & platform architecture</div>
          <div><span className="text-[#00d2ff] font-bold">cat /etc/os-release</span> - Display Linux OS distribution metadata</div>
          <div><span className="text-[#00d2ff] font-bold">scan &lt;ip&gt; / nmap &lt;ip&gt;</span> - Run network reconnaissance probe</div>
          <div><span className="text-[#00d2ff] font-bold">ls / dir</span> - List files in root directory</div>
          <div><span className="text-[#00d2ff] font-bold">top</span> - Active processes snapshot</div>
          <div><span className="text-[#00d2ff] font-bold">cmatrix</span> - Render cyber digital stream</div>
          <div><span className="text-[#00d2ff] font-bold">clear</span> - Clear terminal buffer</div>
        </div>
      );
    } else if (cmd === 'creator' || cmd === 'company' || cmd === 'ceo') {
      outputNode = (
        <div className="text-gray-200 bg-black/60 p-2.5 rounded-lg border border-[#00d2ff]/30 my-1">
          <div className="text-[#00d2ff] font-bold">Company / Vendor: {CORPORATE_INFO.company}</div>
          <div className="text-[#0597ff] font-bold">Founder & CEO: {CORPORATE_INFO.founder}</div>
          <div className="text-[#00ffaa] font-bold">Handle: {CORPORATE_INFO.handle}</div>
          <div className="text-gray-400 text-xs">Architecture: {CORPORATE_INFO.appName} {CORPORATE_INFO.version}</div>
        </div>
      );
    } else if (cmd === 'lua') {
      outputNode = (
        <div className="text-[#00ffaa] my-1">
          [Lua 5.4.6 VM]<br />
          &gt; print("Hello from TokemekiAI Lua Runtime!")<br />
          Hello from TokemekiAI Lua Runtime!<br />
          [Status]: Execution finished with exit code 0
        </div>
      );
    } else if (cmd === 'whoami') {
      outputNode = <div className="text-[#00ffaa] font-bold">root (UID 0) - FULL SYSTEM ACCESS [TokemekiAI Cyber Core]</div>;
    } else if (cmd === 'uname' || raw === 'uname -a') {
      outputNode = (
        <div className="text-gray-300">
          Linux kali-tokemeki 5.15.0-kali-amd64 #1 SMP PREEMPT_DYNAMIC TokemekiAI (xlex175) x86_64 GNU/Linux
        </div>
      );
    } else if (raw.includes('/etc/os-release')) {
      outputNode = (
        <div className="text-gray-300">
          NAME="Kali GNU/Linux"<br />
          VERSION="5.0 (TokemekiAI Edition)"<br />
          ID=kali<br />
          VERSION_ID="2026.4"<br />
          HOME_URL="https://tokemekiai.cyber"<br />
          SUPPORT_URL="TokemekiAI Cyber Security Lab"
        </div>
      );
    } else if (cmd === 'scan' || cmd === 'nmap') {
      const target = args[1] || '127.0.0.1';
      outputNode = (
        <div className="text-gray-300 my-1">
          Starting Nmap scan on {target}...<br />
          Host is up (0.0019s latency).<br />
          PORT     STATE SERVICE<br />
          22/tcp   open  ssh<br />
          80/tcp   open  http<br />
          443/tcp  open  https<br />
          [✓] Nmap done: 1 IP address scanned.
        </div>
      );
    } else if (cmd === 'ls' || cmd === 'dir') {
      outputNode = (
        <div className="text-[#00d2ff] flex flex-wrap gap-4 my-1">
          <span>module.lua</span>
          <span>scanner.py</span>
          <span>tokemeki_core.elf</span>
          <span className="text-[#00ffaa]">payloads/</span>
          <span className="text-[#0597ff]">crypto_keys/</span>
        </div>
      );
    } else if (cmd === 'top') {
      outputNode = (
        <div className="text-gray-300 text-xs">
          Tasks: 148 total, 1 running, 147 sleeping<br />
          %Cpu(s): 8.4 us, 2.1 sy, 0.0 ni, 89.5 id<br />
          PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     COMMAND<br />
          104 root      20   0  712400  48200  12400 S   5.2   0.3     tokemeki-ai<br />
          218 root      20   0  182300  24100   8900 S   1.8   0.2     lua-sandbox
        </div>
      );
    } else if (cmd === 'date') {
      outputNode = <div className="text-gray-300">{new Date().toUTCString()}</div>;
    } else {
      cyberAudio.playError();
      outputNode = (
        <div className="text-red-400">
          bash: {cmd}: command not found. Type <span className="text-white font-bold underline">help</span> for available commands.
        </div>
      );
    }

    newLines.push({
      id: (Date.now() + 1).toString(),
      type: 'output',
      content: outputNode,
    });

    setLines(newLines);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    cyberAudio.playKey();
    if (e.key === 'Enter') {
      executeCommand(inputVal);
      setInputVal('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const nextIdx = historyIdx === -1 ? history.length - 1 : Math.max(0, historyIdx - 1);
        setHistoryIdx(nextIdx);
        setInputVal(history[nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (history.length > 0 && historyIdx !== -1) {
        const nextIdx = historyIdx + 1;
        if (nextIdx >= history.length) {
          setHistoryIdx(-1);
          setInputVal('');
        } else {
          setHistoryIdx(nextIdx);
          setInputVal(history[nextIdx]);
        }
      }
    }
  };

  const handleClear = () => {
    cyberAudio.playClick();
    setLines([]);
    onShowToast('Terminal cleared.');
  };

  const quickCommands = ['help', 'creator', 'whoami', 'lua', 'scan 10.0.0.1', 'cmatrix', 'cat /etc/os-release'];

  return (
    <div className="h-[calc(100vh-80px)] sm:h-[calc(100vh-95px)] flex flex-col space-y-3 font-mono animate-in fade-in duration-300">
      {/* Terminal Title Bar */}
      <div className="bg-[#090e17] border border-[#00d2ff]/30 px-4 py-2.5 rounded-2xl flex items-center justify-between shrink-0 shadow-lg">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#00ffaa] inline-block" />
          <span className="text-xs text-gray-300 ml-2 font-bold flex items-center gap-1.5">
            <TerminalIcon className="w-3.5 h-3.5 text-[#00d2ff]" />
            <span>root@kali:~# bash (TokemekiAI Core)</span>
          </span>
        </div>

        <button
          onClick={handleClear}
          className="text-xs text-gray-400 hover:text-[#00d2ff] transition flex items-center gap-1.5 bg-black/50 px-2.5 py-1 rounded-lg border border-gray-800 cursor-pointer"
        >
          <Eraser className="w-3 h-3" />
          <span>Clear</span>
        </button>
      </div>

      {/* Screen Buffer */}
      <div
        ref={screenRef}
        onClick={() => inputRef.current?.focus()}
        className="flex-1 bg-black border border-[#00d2ff]/25 rounded-2xl p-4 text-xs sm:text-sm overflow-y-auto space-y-2 shadow-inner cursor-text"
      >
        {lines.map((l) => (
          <div key={l.id} className="leading-relaxed">
            {l.type === 'input' ? (
              <div className="flex items-center space-x-2 text-gray-100">
                <span className="text-[#00d2ff] font-bold select-none">kali@root:~$</span>
                <span>{l.content}</span>
              </div>
            ) : (
              <div>{l.content}</div>
            )}
          </div>
        ))}
      </div>

      {/* Quick Command Pills for Touch / Mobile */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 shrink-0 scrollbar-none">
        <span className="text-[10px] text-gray-500 flex items-center gap-1 shrink-0 px-1 font-semibold uppercase">
          <Sparkles className="w-3 h-3 text-[#00d2ff]" /> Quick:
        </span>
        {quickCommands.map((q) => (
          <button
            key={q}
            onClick={() => {
              executeCommand(q);
              inputRef.current?.focus();
            }}
            className="text-[11px] bg-black/60 border border-gray-800 hover:border-[#00d2ff]/50 text-gray-300 hover:text-[#00d2ff] px-2.5 py-1 rounded-lg whitespace-nowrap active:scale-95 transition cursor-pointer"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Prompt Form */}
      <div className="flex items-center bg-[#090e17] border border-[#00d2ff]/30 rounded-2xl px-3 py-2 shrink-0 shadow-lg">
        <span className="text-[#00d2ff] text-xs sm:text-sm font-bold mr-2 select-none">kali@root:~$</span>
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          spellCheck={false}
          autoComplete="off"
          className="flex-1 bg-transparent text-gray-100 text-xs sm:text-sm outline-none border-none focus:ring-0 font-mono"
          placeholder="Type command ('help', 'creator', 'lua')..."
        />
        <button
          onClick={() => {
            executeCommand(inputVal);
            setInputVal('');
          }}
          className="px-3 py-1 bg-[#00d2ff]/20 text-[#00d2ff] border border-[#00d2ff]/40 rounded-lg text-xs active:scale-95 hover:bg-[#00d2ff] hover:text-black transition cursor-pointer font-bold"
        >
          RUN
        </button>
      </div>
    </div>
  );
};
