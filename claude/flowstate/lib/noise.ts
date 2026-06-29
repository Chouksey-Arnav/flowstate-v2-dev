"use client";

let audioCtx: AudioContext | null = null;
let noiseNode: AudioBufferSourceNode | null = null;
let gainNode: GainNode | null = null;

function getContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  return audioCtx;
}

function makeNoiseBuffer(ctx: AudioContext, type: "white" | "brown"): AudioBuffer {
  const bufferSize = ctx.sampleRate * 2;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  if (type === "white") {
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
  } else {
    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5; // gain compensation, brown noise is quiet
    }
  }
  return buffer;
}

export function startAmbientNoise(type: "white" | "brown", volume = 0.25) {
  stopAmbientNoise();
  const ctx = getContext();
  const buffer = makeNoiseBuffer(ctx, type);

  noiseNode = ctx.createBufferSource();
  noiseNode.buffer = buffer;
  noiseNode.loop = true;

  gainNode = ctx.createGain();
  gainNode.gain.value = volume;

  noiseNode.connect(gainNode);
  gainNode.connect(ctx.destination);
  noiseNode.start(0);
}

export function stopAmbientNoise() {
  if (noiseNode) {
    try {
      noiseNode.stop();
    } catch {
      // already stopped
    }
    noiseNode.disconnect();
    noiseNode = null;
  }
  if (gainNode) {
    gainNode.disconnect();
    gainNode = null;
  }
}

/** Simple bell/digital beep for timer completion, no audio files needed. */
export function playTimerSound(kind: "bell" | "digital") {
  const ctx = getContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);

  if (kind === "bell") {
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
    osc.start();
    osc.stop(ctx.currentTime + 1.2);
  } else {
    osc.type = "square";
    osc.frequency.setValueAtTime(660, ctx.currentTime);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
    osc.start();
    osc.stop(ctx.currentTime + 0.25);
  }
}
