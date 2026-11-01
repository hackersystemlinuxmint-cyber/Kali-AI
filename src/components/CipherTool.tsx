import React, { useState } from 'react';
import { KeyRound, Copy, Check, ArrowRightLeft, ShieldCheck, Hash } from 'lucide-react';
import { cyberAudio } from '../utils/audio';

interface CipherToolProps {
  onShowToast: (msg: string) => void;
}

export const CipherTool: React.FC<CipherToolProps> = ({ onShowToast }) => {
  const [inputVal, setInputVal] = useState('TokemekiAI Cyber Security v5.0 - CEO Etlijah Atienza');
  const [outputVal, setOutputVal] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeMethod, setActiveMethod] = useState('');

  const computeSha256 = async (str: string): Promise<string> => {
    const enc = new TextEncoder();
    const buf = await crypto.subtle.digest('SHA-256', enc.encode(str));
    return Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  };

  const transform = async (method: string) => {
    cyberAudio.playClick();
    setActiveMethod(method);
    if (!inputVal) {
      setOutputVal('[Error]: Input payload is empty.');
      return;
    }

    try {
      if (method === 'base64enc') {
        setOutputVal(btoa(unescape(encodeURIComponent(inputVal))));
      } else if (method === 'base64dec') {
        setOutputVal(decodeURIComponent(escape(atob(inputVal.trim()))));
      } else if (method === 'hexenc') {
        const hex = Array.from(new TextEncoder().encode(inputVal))
          .map((b) => b.toString(16).padStart(2, '0'))
          .join(' ');
        setOutputVal(hex);
      } else if (method === 'hexdec') {
        const clean = inputVal.replace(/\s+/g, '');
        const bytes = [];
        for (let i = 0; i < clean.length; i += 2) {
          bytes.push(parseInt(clean.substr(i, 2), 16));
        }
        setOutputVal(new TextDecoder().decode(new Uint8Array(bytes)));
      } else if (method === 'rot13') {
        const r13 = inputVal.replace(/[a-zA-Z]/g, (char) => {
          const code = char.charCodeAt(0);
          const limit = char <= 'Z' ? 90 : 122;
          const shifted = code + 13;
          return String.fromCharCode(shifted <= limit ? shifted : shifted - 26);
        });
        setOutputVal(r13);
      } else if (method === 'sha256') {
        const hash = await computeSha256(inputVal);
        setOutputVal(hash);
      } else if (method === 'binary') {
        const bin = Array.from(new TextEncoder().encode(inputVal))
          .map((b) => b.toString(2).padStart(8, '0'))
          .join(' ');
        setOutputVal(bin);
      } else if (method === 'urlenc') {
        setOutputVal(encodeURIComponent(inputVal));
      } else if (method === 'urldec') {
        setOutputVal(decodeURIComponent(inputVal));
      }
      cyberAudio.playSuccess();
    } catch (err: any) {
      cyberAudio.playError();
      setOutputVal(`[Decoding/Encoding Error]: ${err.message}`);
    }
  };

  const handleCopy = () => {
    if (!outputVal) return;
    cyberAudio.playClick();
    navigator.clipboard.writeText(outputVal);
    setCopied(true);
    onShowToast('Transformed output copied to clipboard.');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4 font-mono animate-in fade-in duration-300">
      <div className="bg-[#090e17] border border-[#00d2ff]/25 p-4 rounded-2xl shadow-lg">
        <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
          <KeyRound className="w-5 h-5 text-amber-400" /> Cryptographic Encoder & Hash Suite
        </h2>
        <p className="text-xs text-gray-400 mt-1">
          Perform Base64, Hexadecimal, ROT13, Binary, URL transforms and native SHA-256 hashing.
        </p>
      </div>

      <div className="bg-[#090e17] border border-[#00d2ff]/25 p-4 sm:p-6 rounded-2xl space-y-4 max-w-4xl shadow-xl">
        {/* Input Textarea */}
        <div>
          <label className="text-xs text-gray-400 block mb-1.5 flex items-center justify-between">
            <span>INPUT TEXT / PAYLOAD:</span>
            <span className="text-[10px] text-[#00d2ff]">{inputVal.length} chars</span>
          </label>
          <textarea
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={() => cyberAudio.playKey()}
            rows={4}
            className="w-full bg-black border border-gray-800 rounded-xl p-3.5 text-xs sm:text-sm text-[#00d2ff] outline-none focus:border-[#00d2ff] transition resize-none selection:bg-[#00d2ff]/30"
            placeholder="Type payload or cipher text here..."
          />
        </div>

        {/* Action Buttons Grid */}
        <div>
          <label className="text-[11px] text-gray-500 uppercase block mb-2 font-semibold">
            TRANSFORMATION ALGORITHMS:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <button
              onClick={() => transform('base64enc')}
              className={`p-2.5 rounded-xl border transition active:scale-95 cursor-pointer ${
                activeMethod === 'base64enc'
                  ? 'bg-[#00d2ff] text-black font-bold'
                  : 'bg-black/60 border-gray-800 text-gray-300 hover:border-[#00d2ff] hover:text-[#00d2ff]'
              }`}
            >
              Base64 Encode
            </button>
            <button
              onClick={() => transform('base64dec')}
              className={`p-2.5 rounded-xl border transition active:scale-95 cursor-pointer ${
                activeMethod === 'base64dec'
                  ? 'bg-[#00d2ff] text-black font-bold'
                  : 'bg-black/60 border-gray-800 text-gray-300 hover:border-[#00d2ff] hover:text-[#00d2ff]'
              }`}
            >
              Base64 Decode
            </button>
            <button
              onClick={() => transform('hexenc')}
              className={`p-2.5 rounded-xl border transition active:scale-95 cursor-pointer ${
                activeMethod === 'hexenc'
                  ? 'bg-[#00d2ff] text-black font-bold'
                  : 'bg-black/60 border-gray-800 text-gray-300 hover:border-[#00d2ff] hover:text-[#00d2ff]'
              }`}
            >
              Hex Encode
            </button>
            <button
              onClick={() => transform('hexdec')}
              className={`p-2.5 rounded-xl border transition active:scale-95 cursor-pointer ${
                activeMethod === 'hexdec'
                  ? 'bg-[#00d2ff] text-black font-bold'
                  : 'bg-black/60 border-gray-800 text-gray-300 hover:border-[#00d2ff] hover:text-[#00d2ff]'
              }`}
            >
              Hex Decode
            </button>
            <button
              onClick={() => transform('rot13')}
              className={`p-2.5 rounded-xl border transition active:scale-95 cursor-pointer ${
                activeMethod === 'rot13'
                  ? 'bg-[#00d2ff] text-black font-bold'
                  : 'bg-black/60 border-gray-800 text-gray-300 hover:border-[#00d2ff] hover:text-[#00d2ff]'
              }`}
            >
              ROT13 Cipher
            </button>
            <button
              onClick={() => transform('sha256')}
              className={`p-2.5 rounded-xl border transition active:scale-95 cursor-pointer ${
                activeMethod === 'sha256'
                  ? 'bg-[#00d2ff] text-black font-bold'
                  : 'bg-black/60 border-gray-800 text-gray-300 hover:border-[#00d2ff] hover:text-[#00d2ff]'
              }`}
            >
              SHA-256 Hash
            </button>
            <button
              onClick={() => transform('binary')}
              className={`p-2.5 rounded-xl border transition active:scale-95 cursor-pointer ${
                activeMethod === 'binary'
                  ? 'bg-[#00d2ff] text-black font-bold'
                  : 'bg-black/60 border-gray-800 text-gray-300 hover:border-[#00d2ff] hover:text-[#00d2ff]'
              }`}
            >
              Binary (ASCII)
            </button>
            <button
              onClick={() => transform('urlenc')}
              className={`p-2.5 rounded-xl border transition active:scale-95 cursor-pointer ${
                activeMethod === 'urlenc'
                  ? 'bg-[#00d2ff] text-black font-bold'
                  : 'bg-black/60 border-gray-800 text-gray-300 hover:border-[#00d2ff] hover:text-[#00d2ff]'
              }`}
            >
              URL Encode
            </button>
          </div>
        </div>

        {/* Output Area */}
        <div>
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00ffaa]" /> OUTPUT RESULT:
            </span>
            {outputVal && (
              <button
                onClick={handleCopy}
                className="text-[11px] text-[#00d2ff] hover:text-white flex items-center gap-1 bg-[#00d2ff]/10 px-2.5 py-1 rounded-lg border border-[#00d2ff]/30 active:scale-95 transition cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3 text-[#00ffaa]" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy Output'}</span>
              </button>
            )}
          </div>
          <textarea
            readOnly
            value={outputVal}
            rows={4}
            className="w-full bg-black/80 border border-gray-800 rounded-xl p-3.5 text-xs sm:text-sm text-[#00ffaa] outline-none font-mono selection:bg-[#00ffaa]/30 resize-none"
            placeholder="Transformed cryptographic payload will appear here..."
          />
        </div>
      </div>
    </div>
  );
};
