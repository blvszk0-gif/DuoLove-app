/**
 * TTS Helper - Web Speech API tuned to sound like Leon S. Kennedy (RE4).
 * Leon's voice is performed by Paul Mercier: very deep baritone, slow/deliberate,
 * confident and measured. We achieve this via:
 *  - pitch: 0.55  (very deep bass, much lower than default 1.0)
 *  - rate:  0.78  (slow, deliberate - like Leon surveying a situation)
 * Priority: prefer deep male US-English voices (Daniel, David, Google US, Aaron, etc.)
 */

let voices: SpeechSynthesisVoice[] = [];

const loadVoices = (): Promise<SpeechSynthesisVoice[]> => {
  return new Promise((resolve) => {
    if (!window.speechSynthesis) { resolve([]); return; }
    const loaded = window.speechSynthesis.getVoices();
    if (loaded.length > 0) {
      voices = loaded;
      resolve(loaded);
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        voices = window.speechSynthesis.getVoices();
        resolve(voices);
      };
    }
  });
};

// Pre-load voices as soon as the module is imported
loadVoices();

/**
 * Ordered priority list of voice name substrings to search for (case-insensitive).
 * We prefer deep male voices that work well across Chrome/Edge/Safari.
 */
const MALE_VOICE_PRIORITY = [
  'daniel',      // Apple's Daniel (UK deep male) - great on macOS/iOS
  'david',       // Microsoft David - deep US male
  'aaron',       // Apple Aaron (US male)
  'fred',        // macOS Fred - very robotic deep voice
  'alex',        // macOS Alex - decent male
  'google us english', // Chrome Google US English
  'google uk english male',
  'microsoft guy',
  'guy',
  'male',
];

function pickBestVoice(lang: 'en' | 'es'): SpeechSynthesisVoice | null {
  const langPrefix = lang === 'en' ? 'en' : 'es';

  // Filter voices for the right language
  const langVoices = voices.filter(v => v.lang.toLowerCase().startsWith(langPrefix));
  if (langVoices.length === 0) return null;

  // Try each priority pattern in order
  for (const pattern of MALE_VOICE_PRIORITY) {
    const match = langVoices.find(v => v.name.toLowerCase().includes(pattern));
    if (match) return match;
  }

  // Fallback: just use the first voice for that language
  return langVoices[0];
}

export async function speakLeon(text: string, lang: 'en' | 'es') {
  if (!('speechSynthesis' in window)) {
    console.warn('Web Speech API not supported.');
    return;
  }

  window.speechSynthesis.cancel();

  if (voices.length === 0) {
    await loadVoices();
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang === 'en' ? 'en-US' : 'es-ES';

  const bestVoice = pickBestVoice(lang);
  if (bestVoice) {
    utterance.voice = bestVoice;
  }

  // Leon S. Kennedy voice profile:
  // Very deep (low pitch), slow and deliberate like a seasoned government agent
  utterance.pitch = 0.55;   // 0.0 = lowest possible, 1.0 = default. 0.55 gives real bass
  utterance.rate  = 0.78;   // 0.1 = slowest, 1.0 = default. 0.78 = calm confident pace
  utterance.volume = 1.0;

  window.speechSynthesis.speak(utterance);
}
