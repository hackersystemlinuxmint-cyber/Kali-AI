export type ActiveTab = 'dashboard' | 'ai' | 'programming' | 'pentest' | 'cipher' | 'terminal';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai' | 'system';
  text: string;
  timestamp: string;
  isError?: boolean;
}

export type SupportedLanguage = 
  | 'lua'
  | 'python'
  | 'javascript'
  | 'cpp'
  | 'rust'
  | 'go'
  | 'bash'
  | 'powershell'
  | 'assembly';

export interface ScanResult {
  port: number;
  protocol: 'tcp' | 'udp';
  state: 'open' | 'filtered' | 'closed';
  service: string;
  version?: string;
}

export interface TelemetryData {
  cpu: number;
  ramUsed: number;
  ramTotal: number;
  networkStatus: string;
  kernelVersion: string;
}
