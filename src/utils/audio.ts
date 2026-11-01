// Web Audio API Synthesizer for KALI OS
class CyberAudioSynthesizer {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;

  constructor() {
    // AudioContext will be lazily initialized on first user interaction
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public setEnabled(val: boolean) {
    this.enabled = val;
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public playTone(freq: number, type: OscillatorType, duration: number, gainVal: number = 0.04) {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(gainVal, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio might be constrained by browser policy
    }
  }

  public playClick() {
    this.playTone(850, 'sine', 0.04, 0.03);
  }

  public playKey() {
    const jitter = Math.random() * 200;
    this.playTone(450 + jitter, 'triangle', 0.025, 0.015);
  }

  public playSend() {
    this.playTone(600, 'sine', 0.08, 0.04);
    setTimeout(() => this.playTone(1200, 'sine', 0.12, 0.04), 60);
  }

  public playReceive() {
    this.playTone(1200, 'sine', 0.08, 0.04);
    setTimeout(() => this.playTone(800, 'sine', 0.12, 0.04), 60);
  }

  public playError() {
    this.playTone(140, 'sawtooth', 0.25, 0.08);
  }

  public playSuccess() {
    this.playTone(523.25, 'sine', 0.1, 0.04);
    setTimeout(() => this.playTone(659.25, 'sine', 0.1, 0.04), 100);
    setTimeout(() => this.playTone(783.99, 'sine', 0.2, 0.05), 200);
  }

  public playBootSequence() {
    if (!this.enabled) return;
    this.playTone(220, 'sine', 0.4, 0.05);
    setTimeout(() => this.playTone(440, 'sine', 0.5, 0.05), 1100);
    setTimeout(() => this.playTone(880, 'sine', 0.6, 0.06), 2600);
    setTimeout(() => this.playTone(1100, 'sine', 0.8, 0.07), 4000);
  }
}

export const cyberAudio = new CyberAudioSynthesizer();
