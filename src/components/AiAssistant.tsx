import React, { useState, useRef, useEffect } from 'react';
import { Send, Trash2, Copy, Check, Sparkles, Bot, Terminal as TerminalIcon } from 'lucide-react';
import { ChatMessage } from '../types';
import { APP_LOGO, CORPORATE_INFO } from '../constants';
import { cyberAudio } from '../utils/audio';

interface AiAssistantProps {
  onShowToast: (msg: string) => void;
}

export const AiAssistant: React.FC<AiAssistantProps> = ({ onShowToast }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      sender: 'ai',
      text: `Greetings. I am **kali**, an advanced AI assistant created by **${CORPORATE_INFO.company}** under CEO **${CORPORATE_INFO.founder} (${CORPORATE_INFO.handle})**.\n\nI specialize in **Lua**, Python, C/C++, Rust, Go, PowerShell, Bash, network reconnaissance, and defensive cyber security auditing. How can I assist your workflow today?`,
      timestamp: '00:00:01',
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const quickPrompts = [
    'Explain Lua coroutines and tables',
    `Who is the CEO of ${CORPORATE_INFO.company}?`,
    'Write a port scanner script in Lua',
    'How do I detect SQL injection in modern APIs?',
    'Explain Nmap SYN stealth scan (-sS)',
  ];

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputVal).trim();
    if (!text || loading) return;

    cyberAudio.playSend();

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setLoading(true);

    try {
      const history = messages.slice(-6).map((m) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        text: m.text,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history }),
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const data = await res.json();
      cyberAudio.playReceive();

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: data.text || data.fallback || 'Response completed with no text.',
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      cyberAudio.playError();
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: `[Neural Link Alert]: Unable to reach cloud model. Fallback mode: I am **kali** developed by **${CORPORATE_INFO.company}** (CEO: **${CORPORATE_INFO.founder} / ${CORPORATE_INFO.handle}**). Ready for offline Lua analysis and security commands.`,
        timestamp: new Date().toLocaleTimeString(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    cyberAudio.playClick();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    onShowToast('Response copied to clipboard.');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClear = () => {
    cyberAudio.playClick();
    setMessages([
      {
        id: Date.now().toString(),
        sender: 'ai',
        text: `Chat session reset. I am **kali** by **${CORPORATE_INFO.company}**. How can I help you?`,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
    onShowToast('Chat cleared.');
  };

  return (
    <div className="h-[calc(100vh-80px)] sm:h-[calc(100vh-95px)] flex flex-col space-y-3 font-mono animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="bg-[#090e17] border border-[#00d2ff]/30 p-3.5 rounded-2xl flex items-center justify-between shrink-0 shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-black/80 border border-[#00d2ff]/60 p-1 glow-cyan shrink-0 overflow-hidden">
            <img
              src={APP_LOGO}
              alt="kali Avatar"
              className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(0,210,255,0.8)]"
            />
          </div>
          <div>
            <h3 className="font-bold text-white text-xs sm:text-sm flex items-center gap-2">
              <span>AI Assistant 'kali'</span>
              <span className="text-[9px] px-1.5 py-0.5 bg-[#00d2ff]/20 text-[#00d2ff] border border-[#00d2ff]/40 rounded font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00d2ff] animate-ping" />
                ONLINE (GEMINI 3.8 FLASH)
              </span>
            </h3>
            <p className="text-[10px] sm:text-[11px] text-gray-400">
              {CORPORATE_INFO.company} Neural Core • Specialist in Lua & Cyber Auditing
            </p>
          </div>
        </div>

        <button
          onClick={handleClear}
          className="text-xs text-gray-400 hover:text-[#00d2ff] active:scale-95 transition flex items-center gap-1.5 bg-black/50 px-3 py-1.5 rounded-xl border border-gray-800 hover:border-[#00d2ff]/40 cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Clear</span>
        </button>
      </div>

      {/* Quick Prompts Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 shrink-0 scrollbar-none">
        <span className="text-[10px] text-gray-500 flex items-center gap-1 shrink-0 px-1 uppercase font-semibold">
          <Sparkles className="w-3 h-3 text-[#00d2ff]" /> Suggestions:
        </span>
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p)}
            className="text-[11px] bg-black/60 border border-gray-800 hover:border-[#00d2ff]/60 text-gray-300 hover:text-[#00d2ff] px-3 py-1 rounded-full whitespace-nowrap active:scale-95 transition cursor-pointer"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div
        ref={scrollRef}
        className="flex-1 bg-black/95 border border-[#00d2ff]/25 rounded-2xl p-3 sm:p-5 text-xs sm:text-sm overflow-y-auto space-y-4 shadow-inner"
      >
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <div
              key={m.id}
              className={`flex items-start space-x-2.5 sm:space-x-3 ${isUser ? 'justify-end' : ''}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-[#090e17] border border-[#00d2ff]/60 flex items-center justify-center p-1 shrink-0 shadow-md">
                  <img
                    src={APP_LOGO}
                    alt="kali"
                    className="w-full h-full object-contain filter drop-shadow-[0_0_5px_rgba(0,210,255,0.7)]"
                  />
                </div>
              )}

              <div
                className={`p-3.5 sm:p-4 rounded-2xl max-w-[85%] sm:max-w-2xl leading-relaxed whitespace-pre-wrap relative group shadow-lg ${
                  isUser
                    ? 'bg-gradient-to-r from-[#0d172a] to-[#142340] border border-[#0597ff]/40 text-gray-100'
                    : m.isError
                    ? 'bg-red-950/40 border border-red-500/50 text-red-200'
                    : 'bg-[#090e17] border border-[#00d2ff]/25 text-gray-200'
                }`}
              >
                {/* Header info */}
                <div className="flex items-center justify-between text-[10px] text-gray-400 mb-1.5 border-b border-gray-800/80 pb-1">
                  <span className={isUser ? 'text-[#0597ff] font-bold' : 'text-[#00d2ff] font-bold'}>
                    {isUser ? 'Operator (You)' : "kali AI Core"}
                  </span>
                  <span>{m.timestamp}</span>
                </div>

                <div className="text-xs sm:text-sm leading-relaxed">{m.text}</div>

                {!isUser && (
                  <button
                    onClick={() => handleCopy(m.id, m.text)}
                    className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 p-1.5 bg-black/70 hover:bg-[#00d2ff]/20 text-gray-400 hover:text-[#00d2ff] rounded-lg transition border border-gray-800"
                    title="Copy message"
                  >
                    {copiedId === m.id ? (
                      <Check className="w-3.5 h-3.5 text-[#00ffaa]" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                )}
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-xl bg-[#0597ff]/20 border border-[#0597ff] flex items-center justify-center text-[#0597ff] text-xs font-bold shrink-0">
                  U
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-xl bg-[#090e17] border border-[#00d2ff]/60 flex items-center justify-center p-1 shrink-0">
              <img src={APP_LOGO} alt="kali" className="w-full h-full object-contain animate-pulse" />
            </div>
            <div className="bg-[#090e17] border border-[#00d2ff]/30 p-3.5 rounded-2xl text-[#00d2ff] text-xs font-mono animate-pulse flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00d2ff] animate-ping" />
              'kali' neural core is reasoning & synthesizing response...
            </div>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center space-x-2 bg-[#090e17] border border-[#00d2ff]/30 rounded-2xl p-2 shrink-0 shadow-lg"
      >
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={() => cyberAudio.playKey()}
          placeholder="Ask 'kali' about Lua scripting, pentesting, exploits, network protocols..."
          className="flex-1 bg-black border border-gray-800 rounded-xl px-4 py-2.5 text-gray-100 font-mono text-xs sm:text-sm outline-none focus:border-[#00d2ff] transition"
        />
        <button
          type="submit"
          disabled={loading || !inputVal.trim()}
          className="px-5 py-2.5 bg-gradient-to-r from-[#00d2ff] to-[#0597ff] text-black font-extrabold rounded-xl font-mono text-xs active:scale-95 hover:opacity-95 transition flex items-center gap-2 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <span>SEND</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
