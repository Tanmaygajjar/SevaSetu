/**
 * 🇮🇳 Sarvam AI Utility for Sahaayak
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
    formData.append("file", audioFile, "audio.webm");
    formData.append("language_code", languageCode || "unknown");
    formData.append("model", "saaras:v3");
    formData.append("mode", "transcribe");

    const response = await fetch(`${BASE_URL}/speech-to-text`, {
      method: "POST",
      headers: {
        "api-subscription-key": SARVAM_API_KEY,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Sarvam STT Error Response:", response.status, errorText);
      return null;
    }

    const data = await response.json();
    console.log("Sarvam STT Success:", data);
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

    const data = await response.json();
    return data.translated_text;
  } catch (error) {
    console.error("Sarvam Translation Error:", error);
    return null;
  }
}
