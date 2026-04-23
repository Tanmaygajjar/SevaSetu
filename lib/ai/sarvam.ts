/**
 * 🇮🇳 Sarvam AI Utility for SevaSetu
 * Handles Speech-to-Text, Text-to-Speech, and Translation
 */

const SARVAM_API_KEY = process.env.SARVAM_API_KEY || "";
const BASE_URL = "https://api.sarvam.ai";

export interface SarvamTTSOptions {
  target_language_code: string;
  speaker?: string;
  pitch?: number;
  pace?: number;
  loudness?: number;
}

/**
 * 🔊 Text-to-Speech (Bulbul)
 */
export async function textToSpeech(text: string, options: SarvamTTSOptions) {
  try {
    const response = await fetch(`${BASE_URL}/text-to-speech`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-subscription-key": SARVAM_API_KEY,
      },
      body: JSON.stringify({
        inputs: [text],
        target_language_code: options.target_language_code,
        speaker: options.speaker || "meera",
        pitch: options.pitch || 0,
        pace: options.pace || 1,
        loudness: options.loudness || 1,
        model: "bulbul:v1",
      }),
    });

    const data = await response.json();
    return data.audios[0]; // Returns base64 encoded audio
  } catch (error) {
    console.error("Sarvam TTS Error:", error);
    return null;
  }
}

/**
 * 🎤 Speech-to-Text (Saaras v3)
 */
export async function speechToText(audioFile: Blob, languageCode: string = "hi-IN") {
  try {
    const formData = new FormData();
    formData.append("file", audioFile);
    formData.append("language_code", languageCode);
    formData.append("model", "saaras:v1");

    const response = await fetch(`${BASE_URL}/speech-to-text`, {
      method: "POST",
      headers: {
        "api-subscription-key": SARVAM_API_KEY,
      },
      body: formData,
    });

    const data = await response.json();
    return data.transcript;
  } catch (error) {
    console.error("Sarvam STT Error:", error);
    return null;
  }
}

/**
 * 🌍 Text Translation
 */
export async function translateText(text: string, source: string, target: string) {
  try {
    const response = await fetch(`${BASE_URL}/translate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-subscription-key": SARVAM_API_KEY,
      },
      body: JSON.stringify({
        input: text,
        source_language_code: source,
        target_language_code: target,
        model: "mayura:v1",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Sarvam API Error Response:", response.status, errorData);
      return null;
    }

    const data = await response.json();
    return data.translated_text;
  } catch (error) {
    console.error("Sarvam Translation Fetch Error:", error);
    return null;
  }
}

/**
 * 🌍 Bulk Text Translation (Joins multiple strings with a delimiter to save API calls)
 */
export async function translateBulk(texts: string[], source: string, target: string) {
  if (!texts.length) return [];
  
  // Use a very distinctive delimiter that won't be confused with punctuation
  const DELIMITER = " __TR__ ";
  const joinedText = texts.join(DELIMITER);
  
  try {
    const translatedJoined = await translateText(joinedText, source, target);
    if (!translatedJoined) return texts; 
    
    // Split by the delimiter, cleaning up any spaces the AI might have added around it
    let translatedParts = translatedJoined.split(/__TR__/i).map((t: string) => t.trim());
    
    // If the split count doesn't match, try common variations (sometimes AI adds spaces or punctuation)
    if (translatedParts.length !== texts.length) {
      console.warn(`[Sarvam] Split mismatch. Expected: ${texts.length}, Got: ${translatedParts.length}. Attempting rescue...`);
      // Just return what we have or pad/clip
      if (translatedParts.length > texts.length) {
        translatedParts = translatedParts.slice(0, texts.length);
      } else {
        while (translatedParts.length < texts.length) translatedParts.push(texts[translatedParts.length]);
      }
    }
    
    return translatedParts;
  } catch (err) {
    console.error("[Sarvam] Bulk translation failed:", err);
    return texts;
  }
}
