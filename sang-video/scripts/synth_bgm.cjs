#!/usr/bin/env node
// Synthesize a soft, melancholic ambient bed: filtered rain noise + warm drone chords.
// Output: public/audio/bgm.wav  (44.1kHz, stereo, 16-bit)
const fs = require("node:fs");
const path = require("node:path");

const SR = 44100;
const DURATION = 71; // seconds (slightly longer than video)
const N = Math.floor(SR * DURATION);

// --- deterministic RNG ---
let seed = 20260811;
const rnd = () => {
  seed = (seed * 1103515245 + 12345) & 0x7fffffff;
  return seed / 0x7fffffff;
};

// --- rain: lowpassed white noise, gentle LFO swells ---
const lp = new Float32Array(N); // one-pole lowpass state
const lpCoeff = 0.12;
const rain = new Float32Array(N);
let lpState = 0;
for (let i = 0; i < N; i++) {
  const t = i / SR;
  const swell = 0.7 + 0.3 * Math.sin(2 * Math.PI * 0.05 * t + Math.PI / 3);
  const n = rnd() * 2 - 1;
  lpState += lpCoeff * (n - lpState);
  rain[i] = lpState * 2.2 * swell;
}

// --- drone: slow minor chords (Am9 -> Fmaj7 -> Cmaj9 -> Gsus -> Am9), soft sines ---
// frequencies of a few partials per chord; extremely quiet
const chordSeq = [
  [110.0, 220.0, 261.63, 329.63, 392.0], // Am9 (A2 E3 C4 E4 G4)
  [87.31, 174.61, 220.0, 261.63, 349.23], // Fmaj7-ish (F2 F3 A3 C4 F4)
  [130.81, 196.0, 261.63, 329.63, 392.0], // Cmaj (C3 G3 C4 E4 G4)
  [98.0, 196.0, 246.94, 293.66, 369.99], // Gsus (G2 G3 B3 D4 F#4)
];
const chordLen = Math.floor(N / 4);
const phase = new Float32Array(8);

const drone = new Float32Array(N);
for (let c = 0; c < 4; c++) {
  const freqs = chordSeq[c];
  const start = c * chordLen;
  const end = Math.min(start + chordLen, N);
  // crossfade 4s at boundaries
  const fade = 4 * SR;
  for (let i = start; i < end; i++) {
    const t = i / SR;
    const pos = i - start;
    let fadeIn = 1;
    let fadeOut = 1;
    if (pos < fade) fadeIn = pos / fade;
    if (end - i < fade) fadeOut = (end - i) / fade;
    // chord glissando: detune slightly over time for warmth
    const drift = 1 + 0.0015 * Math.sin(2 * Math.PI * 0.03 * t + c);
    let s = 0;
    for (let k = 0; k < freqs.length; k++) {
      phase[k] += (2 * Math.PI * freqs[k] * drift) / SR;
      s += Math.sin(phase[k]) * (1 - k * 0.12);
    }
    drone[i] += s * 0.028 * fadeIn * fadeOut;
  }
}

// --- mix ---
const mix = new Float32Array(N);
for (let i = 0; i < N; i++) {
  mix[i] = rain[i] * 0.5 + drone[i] * 1.6;
}

// master: soft clip + global gain envelope (fade in/out)
const out = new Float32Array(N);
const fadeIn = 3 * SR;
const fadeOut = 5 * SR;
for (let i = 0; i < N; i++) {
  let g = 1;
  if (i < fadeIn) g = i / fadeIn;
  if (N - i < fadeOut) g = Math.min(g, (N - i) / fadeOut);
  let v = Math.tanh(mix[i] * 1.4) * 0.85 * g;
  out[i] = v;
}

// --- write WAV (stereo, duplicate with tiny delay for width) ---
const interleaved = Buffer.alloc(N * 4);
const delay = Math.floor(SR * 0.02);
for (let i = 0; i < N; i++) {
  const l = Math.max(-1, Math.min(1, out[i]));
  const r = Math.max(-1, Math.min(1, out[Math.max(0, i - delay)] * 0.96));
  interleaved.writeInt16LE(Math.round(l * 32767), i * 4);
  interleaved.writeInt16LE(Math.round(r * 32767), i * 4 + 2);
}

const header = Buffer.alloc(44);
header.write("RIFF", 0);
header.writeUInt32LE(36 + interleaved.length, 4);
header.write("WAVE", 8);
header.write("fmt ", 12);
header.writeUInt32LE(16, 16);
header.writeUInt16LE(1, 20); // PCM
header.writeUInt16LE(2, 22); // stereo
header.writeUInt32LE(SR, 24);
header.writeUInt32LE(SR * 4, 28); // byte rate
header.writeUInt16LE(4, 32); // block align
header.writeUInt16LE(16, 34); // bits
header.write("data", 36);
header.writeUInt32LE(interleaved.length, 40);

const dir = path.join(__dirname, "..", "public", "audio");
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, "bgm.wav"), Buffer.concat([header, interleaved]));
console.log(`bgm.wav written: ${DURATION}s, ${(interleaved.length / 1024 / 1024).toFixed(1)} MB`);
