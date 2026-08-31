import { LanguageCode } from '../types/marine';
import { SUPPORTED_LANGUAGES, TRANSLATIONS, PHONETIC_SCRIPTS } from './languageService';

/**
 * Robust Voice Synthesis Service
 * Uses browser SpeechSynthesis with proper native Indian language voice matching.
 * 
 * Key improvements:
 * - Waits for voices to load before speaking (fixes silent playback)
 * - Matches native language voices (hi-IN, mr-IN, ta-IN, etc.) with smart fallback
 * - Slower rate + slightly higher pitch for clarity on boat decks
 * - Chunks long text into sentences so speech doesn't cut off mid-way
 * - Notification chime before/after speech
 */
export class VoiceSynthesisService {
  private static synth: SpeechSynthesis | null = typeof window !== 'undefined' ? window.speechSynthesis : null;
  private static audioCtx: AudioContext | null = null;
  private static currentUtterance: SpeechSynthesisUtterance | null = null;
  private static isSpeakingNow = false;
  private static abortRequested = false;
  private static cachedVoices: SpeechSynthesisVoice[] = [];

  // ─── AudioContext chime ───────────────────────────────────────────────

  private static initAudioContext() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
  }

  public static playChime(freq = 587.33, duration = 0.18): Promise<void> {
    return new Promise((resolve) => {
      try {
        this.initAudioContext();
        if (!this.audioCtx) { resolve(); return; }

        if (this.audioCtx.state === 'suspended') {
          this.audioCtx.resume();
        }

        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.4, this.audioCtx.currentTime + duration);

        gain.gain.setValueAtTime(0.18, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start();
        osc.stop(this.audioCtx.currentTime + duration);

        setTimeout(resolve, duration * 1000);
      } catch (e) {
        console.warn('AudioContext error:', e);
        resolve();
      }
    });
  }

  // ─── Voice loading ────────────────────────────────────────────────────

  /**
   * Loads available voices. On many browsers (Chrome, Edge) voices load
   * asynchronously, so we wait up to 3 seconds for them.
   */
  private static loadVoices(): Promise<SpeechSynthesisVoice[]> {
    return new Promise((resolve) => {
      if (!this.synth) { resolve([]); return; }

      const voices = this.synth.getVoices();
      if (voices.length > 0) {
        this.cachedVoices = voices;
        resolve(voices);
        return;
      }

      // Voices haven't loaded yet — wait for the event
      let resolved = false;
      const onVoicesChanged = () => {
        if (resolved) return;
        resolved = true;
        const v = this.synth!.getVoices();
        this.cachedVoices = v;
        resolve(v);
      };

      this.synth.addEventListener('voiceschanged', onVoicesChanged);

      // Safety timeout — if event never fires, use whatever we have
      setTimeout(() => {
        if (!resolved) {
          resolved = true;
          this.synth!.removeEventListener('voiceschanged', onVoicesChanged);
          const v = this.synth!.getVoices();
          this.cachedVoices = v;
          resolve(v);
        }
      }, 3000);
    });
  }

  /**
   * Find the best matching voice for a given language code.
   * Priority order:
   * 1. Exact native voice match (e.g. hi-IN for Hindi)
   * 2. Language-prefix match (e.g. voice.lang starts with 'hi')
   * 3. Indian English voice (en-IN)
   * 4. Any English voice
   * 5. First available voice
   */
  private static findBestVoice(
    voices: SpeechSynthesisVoice[],
    targetLangCode: string
  ): SpeechSynthesisVoice | null {
    if (voices.length === 0) return null;

    // 1. Exact match (e.g. "hi-IN")
    const exact = voices.find(
      (v) => v.lang.toLowerCase() === targetLangCode.toLowerCase()
    );
    if (exact) return exact;

    // 2. Language prefix match (e.g. voice.lang starts with "hi")
    const prefix = targetLangCode.split('-')[0].toLowerCase();
    const prefixMatch = voices.find(
      (v) => v.lang.toLowerCase().startsWith(prefix)
    );
    if (prefixMatch) return prefixMatch;

    // 3. Indian English
    const indianEn = voices.find(
      (v) => v.lang.toLowerCase() === 'en-in'
    );
    if (indianEn) return indianEn;

    // 4. Any English
    const anyEn = voices.find(
      (v) => v.lang.toLowerCase().startsWith('en')
    );
    if (anyEn) return anyEn;

    // 5. Fallback
    return voices[0];
  }

  // ─── Text chunking ────────────────────────────────────────────────────

  /**
   * Split text into sentence-level chunks.
   * SpeechSynthesis can silently fail on long text (>200 chars).
   * We split on sentence boundaries (. ! ? ;) and speak each chunk.
   */
  private static chunkText(text: string): string[] {
    // Clean emoji/special chars that can confuse TTS
    const clean = text.replace(/[•★⏱️⚠️🚨✅🐟🛡️🌡️🌊🚫📡]/g, '').trim();

    // Split on sentence-ending punctuation
    const sentences = clean.split(/(?<=[.!?;।])\s+/).filter((s) => s.trim().length > 0);

    // If no punctuation found, split by commas or just return as-is
    if (sentences.length <= 1 && clean.length > 150) {
      return clean.split(/(?<=,)\s+/).filter((s) => s.trim().length > 0);
    }

    return sentences.length > 0 ? sentences : [clean];
  }

  // ─── Public API ───────────────────────────────────────────────────────

  public static isSupported(): boolean {
    return typeof window !== 'undefined' && !!window.speechSynthesis;
  }

  /**
   * Main entry point — speaks the recommendation in the selected language.
   * Uses native script text with matched native voice when available,
   * falls back to phonetic romanized text with English/Hindi voice.
   */
  public static async speakRecommendation(
    lang: LanguageCode,
    status: 'SAFE_TO_GO' | 'MODERATE_CAUTION' | 'DANGER_DO_NOT_GO',
    onStart?: () => void,
    onEnd?: () => void
  ): Promise<void> {
    this.stop();
    this.abortRequested = false;

    if (!this.synth) {
      if (onStart) onStart();
      setTimeout(() => { if (onEnd) onEnd(); }, 2000);
      return;
    }

    // Play intro chime
    await this.playChime(523.25, 0.14);

    const langMeta = SUPPORTED_LANGUAGES.find((l) => l.code === lang) || SUPPORTED_LANGUAGES[0];
    const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;
    const phoneticDict = PHONETIC_SCRIPTS[lang] || PHONETIC_SCRIPTS.en;

    // Pick text based on status
    let nativeText = dict.voice_script_suitable;
    let phoneticText = phoneticDict.voice_script_suitable;

    if (status === 'DANGER_DO_NOT_GO') {
      nativeText = dict.voice_script_unsafe;
      phoneticText = phoneticDict.voice_script_unsafe;
    } else if (status === 'MODERATE_CAUTION') {
      nativeText = dict.voice_script_moderate;
      phoneticText = phoneticDict.voice_script_moderate;
    }

    // Load voices
    const voices = await this.loadVoices();

    // Try to find a native voice for the target language
    const nativeVoice = this.findBestVoice(voices, langMeta.speechVoiceCode);

    // Decide: use native script if we have a native voice, else use phonetic romanized
    let textToSpeak: string;
    let voiceToUse: SpeechSynthesisVoice | null;

    if (nativeVoice && nativeVoice.lang.toLowerCase().startsWith(lang === 'or' ? 'hi' : lang)) {
      // We have a matching native voice — use native script text
      textToSpeak = nativeText;
      voiceToUse = nativeVoice;
    } else {
      // No native voice — use phonetic romanization with English/Indian voice
      textToSpeak = phoneticText;
      voiceToUse = this.findBestVoice(voices, 'en-IN');
    }

    // Chunk the text for reliable playback
    const chunks = this.chunkText(textToSpeak);

    if (onStart) onStart();
    this.isSpeakingNow = true;

    try {
      // Speak each chunk sequentially
      for (let i = 0; i < chunks.length; i++) {
        if (this.abortRequested) break;
        await this.speakChunk(chunks[i], voiceToUse, lang);
        // Tiny pause between sentences for natural cadence
        if (i < chunks.length - 1 && !this.abortRequested) {
          await this.wait(250);
        }
      }
    } catch (e) {
      console.warn('Speech error:', e);
    }

    this.isSpeakingNow = false;

    // End chime
    if (!this.abortRequested) {
      await this.playChime(659.25, 0.1);
    }

    if (onEnd) onEnd();
  }

  /**
   * Speak a single chunk of text using SpeechSynthesis
   */
  private static speakChunk(
    text: string,
    voice: SpeechSynthesisVoice | null,
    lang: LanguageCode
  ): Promise<void> {
    return new Promise((resolve) => {
      if (!this.synth || this.abortRequested) { resolve(); return; }

      // Chrome bug: cancel any pending utterances first
      this.synth.cancel();

      const utterance = new SpeechSynthesisUtterance(text);

      // Slower rate for clarity — especially important on noisy boat decks
      utterance.rate = 0.85;
      utterance.pitch = 1.05;
      utterance.volume = 1.0;

      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang;
      } else {
        // Fallback lang tag
        const langMeta = SUPPORTED_LANGUAGES.find((l) => l.code === lang);
        utterance.lang = langMeta?.speechVoiceCode || 'en-IN';
      }

      let finished = false;

      utterance.onend = () => {
        if (!finished) { finished = true; resolve(); }
      };

      utterance.onerror = (event) => {
        console.warn('SpeechSynthesis chunk error:', event.error, text.substring(0, 30));
        if (!finished) { finished = true; resolve(); }
      };

      // Safety timeout — if utterance hangs for over 30s, force resolve
      const safetyTimer = setTimeout(() => {
        if (!finished) {
          finished = true;
          console.warn('Speech chunk timed out, advancing...');
          this.synth?.cancel();
          resolve();
        }
      }, 30000);

      utterance.onend = () => {
        if (!finished) {
          finished = true;
          clearTimeout(safetyTimer);
          resolve();
        }
      };

      this.currentUtterance = utterance;

      // Chrome bug workaround: resume if paused
      if (this.synth.paused) {
        this.synth.resume();
      }

      this.synth.speak(utterance);

      // Chrome bug: long utterances can pause mid-way. Keep resuming.
      const keepAlive = setInterval(() => {
        if (finished || this.abortRequested) {
          clearInterval(keepAlive);
          return;
        }
        if (this.synth && this.synth.speaking && !this.synth.paused) {
          // Still speaking — good
        } else if (this.synth && this.synth.paused) {
          this.synth.resume();
        }
      }, 5000);
    });
  }

  private static wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // ─── Stop / Status ────────────────────────────────────────────────────

  public static stop(): void {
    this.abortRequested = true;
    if (this.synth) {
      this.synth.cancel();
      this.currentUtterance = null;
    }
    this.isSpeakingNow = false;
  }

  public static isSpeaking(): boolean {
    return this.isSpeakingNow || !!(this.synth && this.synth.speaking);
  }
}
