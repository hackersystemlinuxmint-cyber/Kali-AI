import React, { useState } from 'react';
import { Play, Copy, Check, Terminal, RefreshCw, FileCode, CheckCircle2, AlertCircle } from 'lucide-react';
import { SupportedLanguage } from '../types';
import { CORPORATE_INFO } from '../constants';
import { cyberAudio } from '../utils/audio';
import { runCode, RunResult } from '../utils/codeRunner';

interface CodeIdeProps {
  onShowToast: (msg: string) => void;
}

const DEFAULT_SNIPPETS: Record<SupportedLanguage, string> = {
  lua: `-- TokemekiAI Lua Engine Module
-- CEO: Etlijah Atienza (xlex175)
local security = {}

function security.init(author)
    print("[+] KALI Lua Engine active")
    print("[+] Developed by: " .. author)
end

security.init("${CORPORATE_INFO.company} (CEO ${CORPORATE_INFO.founder} / ${CORPORATE_INFO.handle})")

local telemetry = {
    os = "KALI OS v5.0",
    arch = "x86_64",
    defense_level = 99
}

print("[*] Kernel Telemetry loaded:")
for k, v in pairs(telemetry) do
    print("  -> " .. k .. " = " .. tostring(v))
end

for i = 1, 3 do
    print("[*] Lua verification loop pass #" .. i .. " [STATUS: OK]")
end
`,

  python: `# Python Security Scanner Simulation
# TokemekiAI Cyber Core
import socket

def scan_target(host, ports):
    print(f"[+] Initializing scanner on {host}...")
    for p in ports:
        status = "OPEN" if p in [80, 443, 22] else "CLOSED"
        print(f"[*] Port {p}/tcp: {status}")

print("[+] TokemekiAI Python Recon Engine Loaded.")
scan_target("127.0.0.1", [21, 22, 80, 443, 8080])
`,

  javascript: `// JS Cyber Security Guard
// TokemekiAI Runtime
console.log("[+] TokemekiAI Node Guard Loaded.");
const hashes = ["e3b0c44", "88d4c66", "5eb63bb"];
hashes.forEach((hash, idx) => {
    console.log(\`[*] Verifying hash block #\${idx + 1}: \${hash} -> VERIFIED\`);
});
console.log("[✓] Memory defense active.");
`,

  cpp: `// C++ Low-Level Memory Inspector
#include <iostream>
#include <vector>

int main() {
    std::cout << "[+] TokemekiAI C++ Kernel Module Loaded\\n";
    std::cout << "[*] Verifying memory boundaries (DEP / ASLR: ENFORCED)\\n";
    std::cout << "[✓] 0 memory leaks detected. Execution finished.\\n";
    return 0;
}
`,

  rust: `// Rust Safe Systems Module
fn main() {
    println!("[+] TokemekiAI Rust Memory-Safe Subsystem Initialized.");
    println!("[*] Borrow checker guarantees 0 data races.");
    println!("[✓] Safe binary compiled with zero-cost abstractions.");
}
`,

  go: `package main
import "fmt"

func main() {
    fmt.Println("[+] Go Routine & Channel Concurrency Active.")
    fmt.Println("[*] TokemekiAI High-Throughput Packet Inspector online.")
}
`,

  bash: `#!/usr/bin/env bash
echo "[+] TokemekiAI Bash Security Guard Active"
echo "[*] Kernel: $(uname -r 2>/dev/null || echo '5.15.0-kali-amd64')"
echo "[*] Scanning active network interfaces..."
echo "[✓] Firewall status: ACTIVE (iptables drop all untracked)"
`,

  powershell: `Write-Host "[+] TokemekiAI PowerShell Cyber Guard Active" -ForegroundColor Cyan
Write-Host "[*] Auditing execution policy: RemoteSigned"
Write-Host "[✓] Windows Defender AMSI bypass detection: HARDENED"
`,

  assembly: `; x86_64 Assembly Syscall Snippet
; TokemekiAI Low-Level Architecture
section .data
    msg db '[+] TokemekiAI ASM Syscall Initialized', 0xa
    len equ $ - msg

section .text
    global _start

_start:
    mov rax, 1          ; sys_write
    mov rdi, 1          ; stdout
    mov rsi, msg        ; buffer
    mov rdx, len        ; count
    syscall

    mov rax, 60         ; sys_exit
    xor rdi, rdi        ; code 0
    syscall
`,
};

export const CodeIde: React.FC<CodeIdeProps> = ({ onShowToast }) => {
  const [selectedLang, setSelectedLang] = useState<SupportedLanguage>('lua');
  const [code, setCode] = useState<string>(DEFAULT_SNIPPETS['lua']);
  const [output, setOutput] = useState<string>('Click "Execute" to run snippet in sandbox...');
  const [isRunning, setIsRunning] = useState(false);
  const [lastResult, setLastResult] = useState<RunResult | null>(null);
  const [copied, setCopied] = useState(false);

  const languages: { id: SupportedLanguage; label: string; ext: string }[] = [
    { id: 'lua', label: 'Lua', ext: 'lua' },
    { id: 'python', label: 'Python', ext: 'py' },
    { id: 'javascript', label: 'JavaScript', ext: 'js' },
    { id: 'cpp', label: 'C++', ext: 'cpp' },
    { id: 'rust', label: 'Rust', ext: 'rs' },
    { id: 'go', label: 'Go', ext: 'go' },
    { id: 'bash', label: 'Bash', ext: 'sh' },
    { id: 'powershell', label: 'PS', ext: 'ps1' },
    { id: 'assembly', label: 'ASM', ext: 'asm' },
  ];

  const handleSelectLang = (lang: SupportedLanguage) => {
    cyberAudio.playClick();
    setSelectedLang(lang);
    setCode(DEFAULT_SNIPPETS[lang]);
    setOutput(`Language switched to ${lang.toUpperCase()}. Click "Execute" to run.`);
    setLastResult(null);
  };

  const handleRun = async () => {
    cyberAudio.playSend();
    setIsRunning(true);
    setOutput('Compiling & running in TokemekiAI sandbox...');

    try {
      const res = await runCode(selectedLang, code);
      setIsRunning(false);
      setLastResult(res);
      setOutput(res.stdout);
      if (res.exitCode === 0) {
        cyberAudio.playSuccess();
      } else {
        cyberAudio.playError();
      }
    } catch (err: any) {
      setIsRunning(false);
      cyberAudio.playError();
      setOutput(`[Sandbox Error]: ${err.message}`);
    }
  };

  const handleCopy = () => {
    cyberAudio.playClick();
    navigator.clipboard.writeText(code);
    setCopied(true);
    onShowToast('Source code copied to clipboard.');
    setTimeout(() => setCopied(false), 2000);
  };

  const loadTemplate = (name: string, templateCode: string) => {
    cyberAudio.playClick();
    setCode(templateCode);
    onShowToast(`Loaded ${name} template.`);
  };

  return (
    <div className="space-y-4 font-mono animate-in fade-in duration-300">
      {/* Top Banner & Language Selector */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 bg-[#090e17] border border-[#00d2ff]/25 p-4 rounded-2xl shadow-lg">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <FileCode className="w-5 h-5 text-[#00d2ff]" /> Multi-Language Code IDE & Synthesizer
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Full support for <strong className="text-[#00d2ff]">Lua</strong>, Python, JS, C++, Rust, Go, Bash, PowerShell, and ASM in a client sandbox.
          </p>
        </div>

        {/* Language Tabs */}
        <div className="flex flex-wrap gap-1.5 w-full lg:w-auto">
          {languages.map((l) => {
            const isSelected = selectedLang === l.id;
            return (
              <button
                key={l.id}
                onClick={() => handleSelectLang(l.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition active:scale-95 cursor-pointer ${
                  isSelected
                    ? 'bg-[#00d2ff] text-black shadow-[0_0_12px_rgba(0,210,255,0.6)]'
                    : 'bg-black/60 text-gray-300 border border-gray-800 hover:border-[#00d2ff]/40 hover:text-[#00d2ff]'
                }`}
              >
                {l.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Editor Area */}
        <div className="lg:col-span-2 bg-[#090e17] border border-[#00d2ff]/25 rounded-2xl flex flex-col overflow-hidden shadow-xl">
          {/* Editor Header Bar */}
          <div className="bg-black/80 px-4 py-2.5 border-b border-[#00d2ff]/20 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#00ffaa] inline-block" />
              <span className="text-xs text-[#00d2ff] font-bold ml-2">
                module_{selectedLang}.{languages.find((l) => l.id === selectedLang)?.ext}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopy}
                className="px-3 py-1 bg-[#00d2ff]/10 border border-[#00d2ff]/40 text-[#00d2ff] rounded-lg text-xs active:scale-95 hover:bg-[#00d2ff] hover:text-black transition flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                onClick={handleRun}
                disabled={isRunning}
                className="px-4 py-1 bg-gradient-to-r from-[#00d2ff] to-[#0597ff] text-black font-extrabold rounded-lg text-xs active:scale-95 hover:opacity-95 transition flex items-center gap-1.5 glow-cyan cursor-pointer disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isRunning ? 'Running...' : 'Execute'}</span>
              </button>
            </div>
          </div>

          {/* Text Editor */}
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={() => cyberAudio.playKey()}
            spellCheck={false}
            className="w-full h-80 sm:h-96 bg-black p-4 font-mono text-xs sm:text-sm text-[#00d2ff] outline-none border-none resize-none leading-relaxed selection:bg-[#00d2ff]/30"
          />

          {/* Console Output */}
          <div className="border-t border-gray-800 bg-[#060a12] p-3.5">
            <div className="text-gray-400 text-xs mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-bold text-gray-300">
                <Terminal className="w-3.5 h-3.5 text-[#00d2ff]" /> CONSOLE OUTPUT:
              </span>
              <div className="flex items-center space-x-3 text-[11px]">
                {lastResult && (
                  <>
                    <span className="text-gray-500">{lastResult.durationMs}ms</span>
                    <span className="text-gray-500">~{lastResult.memoryUsedKb}KB</span>
                    <span
                      className={`flex items-center gap-1 font-bold ${
                        lastResult.exitCode === 0 ? 'text-[#00ffaa]' : 'text-red-400'
                      }`}
                    >
                      {lastResult.exitCode === 0 ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <AlertCircle className="w-3 h-3" />
                      )}
                      Exit {lastResult.exitCode}
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="text-gray-200 bg-black/90 p-3 rounded-xl border border-gray-900 min-h-[85px] max-h-48 overflow-y-auto whitespace-pre-wrap text-[11px] sm:text-xs">
              {output}
            </div>
          </div>
        </div>

        {/* Templates & Information Side Panel */}
        <div className="space-y-4">
          <div className="bg-[#090e17] border border-[#00d2ff]/25 p-4 rounded-2xl space-y-3 shadow-lg">
            <h3 className="font-bold text-white text-xs sm:text-sm pb-2 border-b border-gray-800 flex items-center gap-2">
              <FileCode className="w-4 h-4 text-[#0597ff]" /> Code Snippets & Templates
            </h3>
            <div className="space-y-2 text-xs">
              <button
                onClick={() =>
                  loadTemplate(
                    'Lua Coroutines & Metatables',
                    `-- Lua Metatables & Object Orientation
local CyberShield = {}
CyberShield.__index = CyberShield

function CyberShield.new(port, protocol)
    local self = setmetatable({}, CyberShield)
    self.port = port
    self.protocol = protocol
    self.active = true
    return self
end

function CyberShield:inspect()
    print("[+] Inspecting packet on port " .. self.port .. "/" .. self.protocol)
    print("    Firewall status: " .. (self.active and "PROTECTED" or "BYPASSED"))
end

local guard = CyberShield.new(443, "tcp")
guard:inspect()
`
                  )
                }
                className="w-full text-left bg-black/50 active:scale-95 hover:bg-[#00d2ff]/10 border border-gray-800 hover:border-[#00d2ff]/50 p-2.5 rounded-xl text-gray-300 hover:text-[#00d2ff] transition cursor-pointer"
              >
                + Lua Metatables & OO
              </button>

              <button
                onClick={() =>
                  loadTemplate(
                    'Socket Recon Probe',
                    `# Network Probe Simulation
import socket

def ping_service(host, port):
    print(f"[*] Testing handshake on {host}:{port}")
    print("[+] TCP SYN transmitted -> ACK received (RTT: 4.2ms)")
    print("[✓] Service banner: OpenSSH 9.2p1 Debian")

ping_service("192.168.1.100", 22)
`
                  )
                }
                className="w-full text-left bg-black/50 active:scale-95 hover:bg-[#00d2ff]/10 border border-gray-800 hover:border-[#00d2ff]/50 p-2.5 rounded-xl text-gray-300 hover:text-[#00d2ff] transition cursor-pointer"
              >
                + Python Socket Recon
              </button>

              <button
                onClick={() =>
                  loadTemplate(
                    'SHA-256 Crypto Verification',
                    `// Cryptographic Hash Loop
const inputs = ["tokemeki_ai", "kali_v5", "atienza_xlex175"];
inputs.forEach(item => {
    let hash = 0;
    for (let i = 0; i < item.length; i++) {
        hash = (hash << 5) - hash + item.charCodeAt(i);
        hash |= 0;
    }
    console.log("[HASH] " + item + " => 0x" + Math.abs(hash).toString(16));
});
`
                  )
                }
                className="w-full text-left bg-black/50 active:scale-95 hover:bg-[#00d2ff]/10 border border-gray-800 hover:border-[#00d2ff]/50 p-2.5 rounded-xl text-gray-300 hover:text-[#00d2ff] transition cursor-pointer"
              >
                + Crypto Loop Benchmark
              </button>
            </div>
          </div>

          <div className="bg-[#090e17] border border-[#00d2ff]/25 p-4 rounded-2xl space-y-2 shadow-lg text-xs">
            <span className="text-[#00d2ff] font-bold block">Android & Touch Optimized:</span>
            <p className="text-gray-400 leading-relaxed text-[11px]">
              Every code editor is tuned for mobile virtual keyboards with touch-friendly controls. All snippets execute safely in a sandboxed runtime.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
