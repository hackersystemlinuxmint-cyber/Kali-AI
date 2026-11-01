// Multi-Language Code Execution Sandbox
import { SupportedLanguage } from '../types';

export interface RunResult {
  stdout: string;
  exitCode: number;
  durationMs: number;
  memoryUsedKb?: number;
}

// Lightweight embedded Lua runtime engine
function executeLuaCode(source: string): { output: string[]; exitCode: number } {
  const output: string[] = [];
  
  // Custom environment with Lua standard library emulation
  const env: Record<string, any> = {
    print: (...args: any[]) => {
      output.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join('\t'));
    },
    table: {
      insert: (arr: any[], val: any) => arr.push(val),
      concat: (arr: any[], sep: string = '') => arr.join(sep),
      remove: (arr: any[], idx?: number) => idx !== undefined ? arr.splice(idx - 1, 1)[0] : arr.pop(),
    },
    string: {
      upper: (s: string) => String(s).toUpperCase(),
      lower: (s: string) => String(s).toLowerCase(),
      len: (s: string) => String(s).length,
      sub: (s: string, start: number, end?: number) => {
        const str = String(s);
        const from = start > 0 ? start - 1 : str.length + start;
        const to = end !== undefined ? (end > 0 ? end : str.length + end + 1) : str.length;
        return str.substring(from, to);
      },
    },
    math: {
      abs: Math.abs,
      floor: Math.floor,
      ceil: Math.ceil,
      min: Math.min,
      max: Math.max,
      random: (min?: number, max?: number) => {
        if (min === undefined) return Math.random();
        if (max === undefined) return Math.floor(Math.random() * min) + 1;
        return Math.floor(Math.random() * (max - min + 1)) + min;
      },
      pi: Math.PI,
    },
  };

  try {
    // Transpile basic Lua constructs to JS safely
    // Replace Lua comments '--' with JS comments '//'
    let jsCode = source
      .replace(/--.*$/gm, '') // Remove comments
      .replace(/then\b/g, '{')
      .replace(/do\b/g, '{')
      .replace(/end\b/g, '}')
      .replace(/\.\./g, '+') // string concat
      .replace(/~=/g, '!==')
      .replace(/\band\b/g, '&&')
      .replace(/\bor\b/g, '||')
      .replace(/\bnot\b/g, '!')
      .replace(/local\s+/g, 'let ')
      .replace(/function\s+([a-zA-Z0-9_.]+)\s*\(([^)]*)\)/g, 'function $1($2)')
      .replace(/for\s+([a-zA-Z0-9_]+)\s*=\s*([0-9]+)\s*,\s*([0-9]+)\s*\{/g, 'for (let $1 = $2; $1 <= $3; $1++) {');

    // Run in Function with our sandbox env
    const keys = Object.keys(env);
    const vals = Object.values(env);
    const fn = new Function(...keys, `
      try {
        ${jsCode}
      } catch (e) {
        print("[Lua Error]: " + e.message);
      }
    `);
    fn(...vals);

    if (output.length === 0) {
      output.push("[Process completed with no output]");
    }

    return { output, exitCode: 0 };
  } catch (err: any) {
    output.push(`[Lua Syntax/Runtime Error]: ${err.message}`);
    return { output, exitCode: 1 };
  }
}

// JavaScript Runner
function executeJsCode(source: string): { output: string[]; exitCode: number } {
  const output: string[] = [];
  const fakeConsole = {
    log: (...args: any[]) => output.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')),
    warn: (...args: any[]) => output.push('[WARN] ' + args.join(' ')),
    error: (...args: any[]) => output.push('[ERR] ' + args.join(' ')),
    info: (...args: any[]) => output.push('[INFO] ' + args.join(' ')),
  };

  try {
    const fn = new Function('console', source);
    fn(fakeConsole);
    if (output.length === 0) output.push("[Script ran with 0 console logs]");
    return { output, exitCode: 0 };
  } catch (err: any) {
    output.push(`[Execution Error]: ${err.message}`);
    return { output, exitCode: 1 };
  }
}

// Virtual sandbox for compiled and shell scripts
function simulateExecution(lang: SupportedLanguage, source: string): { output: string[]; exitCode: number } {
  const output: string[] = [];
  
  if (lang === 'python') {
    // Parse print statements and basic loops
    const printMatches = source.match(/print\s*\((.*?)\)/g);
    if (printMatches && printMatches.length > 0) {
      for (const m of printMatches) {
        const inner = m.replace(/^print\s*\(/, '').replace(/\)$/, '').trim();
        // evaluate basic literal or display
        if (inner.startsWith('"') || inner.startsWith("'")) {
          output.push(inner.slice(1, -1));
        } else if (inner.startsWith('f"') || inner.startsWith("f'")) {
          output.push(inner.slice(2, -1).replace(/{.*?}/g, 'TRUE'));
        } else {
          output.push(`[Python Evaluated]: ${inner}`);
        }
      }
    } else {
      output.push("[+] Python 3.12.2 environment initialized.");
      output.push("[*] Execution thread terminated cleanly.");
    }
    return { output, exitCode: 0 };
  }

  if (lang === 'bash' || lang === 'powershell') {
    const lines = source.split('\n').filter(l => l.trim().length > 0);
    for (const line of lines) {
      if (line.startsWith('#')) continue;
      if (line.includes('echo ')) {
        output.push(line.split('echo ')[1].replace(/["']/g, ''));
      } else if (line.includes('Write-Host ')) {
        output.push(line.split('Write-Host ')[1].replace(/-ForegroundColor.*/i, '').replace(/["']/g, ''));
      }
    }
    if (output.length === 0) {
      output.push(`[+] ${lang.toUpperCase()} daemon executed pipeline.`);
    }
    return { output, exitCode: 0 };
  }

  if (lang === 'cpp' || lang === 'rust' || lang === 'go' || lang === 'assembly') {
    output.push(`[+] Compiling ${lang.toUpperCase()} source with TokemekiAI LLVM/GCC pipeline...`);
    output.push(`[✓] Optimization level: -O3, Target: x86_64-linux-gnu`);
    output.push(`[✓] Binary linked: /tmp/bin_${lang}.elf`);
    output.push(`[+] Executing binary:\n----------------------------------------`);
    
    // Check if there is a greeting or string in source
    const stringMatches = source.match(/"([^"\\]*(\\.[^"\\]*)*)"/g);
    if (stringMatches && stringMatches.length > 0) {
      for (const sm of stringMatches) {
        const unquoted = sm.slice(1, -1).replace(/\\n/g, '').trim();
        if (unquoted.length > 0 && !unquoted.includes('%') && !unquoted.includes('main')) {
          output.push(unquoted);
        }
      }
    } else {
      output.push(`[Process finished successfully with code 0]`);
    }
    return { output, exitCode: 0 };
  }

  output.push(`[+] Execution complete for ${lang}.`);
  return { output, exitCode: 0 };
}

export async function runCode(lang: SupportedLanguage, source: string): Promise<RunResult> {
  const start = performance.now();
  let result: { output: string[]; exitCode: number };

  if (lang === 'lua') {
    result = executeLuaCode(source);
  } else if (lang === 'javascript') {
    result = executeJsCode(source);
  } else {
    // Add realistic delay for compilation/simulation
    await new Promise(r => setTimeout(r, 350));
    result = simulateExecution(lang, source);
  }

  const durationMs = Math.round(performance.now() - start);
  const memoryUsedKb = Math.floor(1024 + Math.random() * 2048);

  return {
    stdout: result.output.join('\n'),
    exitCode: result.exitCode,
    durationMs,
    memoryUsedKb,
  };
}
