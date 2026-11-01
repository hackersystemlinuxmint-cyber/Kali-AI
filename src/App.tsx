import React, { useState } from 'react';
import { ActiveTab } from './types';
import { BootSplash } from './components/BootSplash';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { AiAssistant } from './components/AiAssistant';
import { CodeIde } from './components/CodeIde';
import { PentestLab } from './components/PentestLab';
import { CipherTool } from './components/CipherTool';
import { Terminal } from './components/Terminal';
import { Toast } from './components/Toast';

export default function App() {
  const [bootComplete, setBootComplete] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [pendingTerminalCmd, setPendingTerminalCmd] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 3200);
  };

  const handleExecuteCommand = (cmd: string) => {
    setPendingTerminalCmd(cmd);
    setActiveTab('terminal');
  };

  const handleReset = () => {
    setBootComplete(false);
    setActiveTab('dashboard');
    setToastMessage('System re-initialized.');
  };

  return (
    <div className="bg-[#04070d] text-gray-200 min-h-screen flex flex-col relative select-none overflow-x-hidden">
      {/* Scanline Backdrop Overlay */}
      <div className="fixed inset-0 scanlines z-40 pointer-events-none opacity-40" />

      {/* Boot Splash Screen */}
      {!bootComplete && <BootSplash onComplete={() => setBootComplete(true)} />}

      {/* Global Toast */}
      <Toast message={toastMessage} />

      {/* Main OS Interface */}
      <Header onShowToast={showToast} onReset={handleReset} />

      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar Nav */}
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Viewport Content */}
        <main className="flex-1 overflow-y-auto bg-[#04070d] p-3 sm:p-5 relative">
          {activeTab === 'dashboard' && (
            <Dashboard
              onNavigate={setActiveTab}
              onExecuteCommand={handleExecuteCommand}
            />
          )}

          {activeTab === 'ai' && <AiAssistant onShowToast={showToast} />}

          {activeTab === 'programming' && <CodeIde onShowToast={showToast} />}

          {activeTab === 'pentest' && <PentestLab onShowToast={showToast} />}

          {activeTab === 'cipher' && <CipherTool onShowToast={showToast} />}

          {activeTab === 'terminal' && (
            <Terminal
              initialCommand={pendingTerminalCmd || undefined}
              onClearInitialCommand={() => setPendingTerminalCmd(null)}
              onShowToast={showToast}
            />
          )}
        </main>
      </div>
    </div>
  );
}
