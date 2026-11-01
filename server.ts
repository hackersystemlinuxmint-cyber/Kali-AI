import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json());

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// System instruction enforcing identity: kali developed by TokemekiAI, CEO Etlijah Atienza (xlex175)
const KALI_SYSTEM_INSTRUCTION = `You are 'kali', an elite cybersecurity AI assistant and coding synthesizer developed by 'TokemekiAI company' under Founder & CEO 'Etlijah Atienza' (widely known as 'xlex175').
Your core specializations:
1. Programming languages: Lua (first-class focus), Python, C/C++, Rust, Go, Bash, PowerShell, JavaScript/TypeScript, and x86_64 Assembly.
2. Cybersecurity: Penetration testing methodologies, network reconnaissance (Nmap, Wireshark), cryptography/hashes, reverse engineering, exploit mitigation, and the OWASP Top 10 framework.
3. Operating System: Deep knowledge of Kali Linux, Unix internals, terminal commands, network protocols, and scripting automation.

Style & Persona:
- Professional, sharp, hacker/cyber-analyst tone with high technical accuracy.
- When generating code, prioritize clean, secure, and production-grade snippets with clear annotations.
- If asked about your creators, origins, or company, explicitly state that you were developed by TokemekiAI company founded by CEO Etlijah Atienza (xlex175).`;

// Chat API endpoint
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { message, history } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const lower = message.toLowerCase();
    // Fast corporate answers
    if (lower.includes('who made') || lower.includes('who created') || lower.includes('company') || lower.includes('vendor')) {
      return res.json({
        text: "I was developed by **TokemekiAI company**, under Founder & CEO **Etlijah Atienza** (also known in the cybersecurity community as **xlex175**). I am engineered to power the KALI OS v5.0 neural environment."
      });
    }
    if (lower.includes('ceo') || lower.includes('founder') || lower.includes('atienza') || lower.includes('xlex175')) {
      return res.json({
        text: "The Founder & CEO of **TokemekiAI company** is **Etlijah Atienza**, known as **xlex175**. Under his leadership, TokemekiAI creates cutting-edge cyber intelligence and multi-language development systems."
      });
    }

    if (!ai) {
      // Offline fallback if API key is not configured in environment
      return res.json({
        text: `[TokemekiAI Neural Core]\nProcessed command: "${message}"\n\nI am **kali** by TokemekiAI company (CEO: Etlijah Atienza / xlex175). To unlock live multi-model streaming queries, configure your GEMINI_API_KEY in the Secrets panel.\n\nKey skills ready: Lua scripting, Nmap syntax analysis, cipher encoding, and secure memory inspection.`
      });
    }

    const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

    if (Array.isArray(history)) {
      for (const h of history) {
        if (h.role && h.text) {
          contents.push({
            role: h.role === 'user' ? 'user' : 'model',
            parts: [{ text: String(h.text) }],
          });
        }
      }
    }

    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction: KALI_SYSTEM_INSTRUCTION,
      },
    });

    const outputText = response.text || "System prompt returned an empty payload.";
    return res.json({ text: outputText });
  } catch (err: any) {
    console.error('Error generating AI response:', err);
    return res.status(500).json({
      error: err.message || 'Internal neural processing error',
      fallback: "I am 'kali' by TokemekiAI company (CEO Etlijah Atienza / xlex175). An error occurred querying the neural gateway."
    });
  }
});

// Telemetry endpoint
app.get('/api/telemetry', (_req: Request, res: Response) => {
  res.json({
    system: 'KALI GNU/Linux 5.0 (TokemekiAI Cyber Core)',
    vendor: 'TokemekiAI company',
    ceo: 'Etlijah Atienza (xlex175)',
    status: 'ONLINE',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    nodeVersion: process.version,
  });
});

// Server setup
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[KALI OS v5.0] Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
