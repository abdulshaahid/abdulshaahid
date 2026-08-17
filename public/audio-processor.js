// AudioWorkletProcessor for microphone capture
// Converts browser microphone input (Float32) to 16-bit linear PCM little-endian buffer data

class AudioProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    // Buffer size of 2048 samples (~128ms at 16kHz)
    this.bufferSize = 2048;
    this.buffer = new Float32Array(this.bufferSize);
    this.bufferIndex = 0;
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    if (!input || !input[0]) return true;

    const inputChannel = input[0];
    const len = inputChannel.length;

    for (let i = 0; i < len; i++) {
      this.buffer[this.bufferIndex++] = inputChannel[i];

      if (this.bufferIndex >= this.bufferSize) {
        this.flush();
      }
    }

    return true;
  }

  flush() {
    if (this.bufferIndex === 0) return;

    // Convert Float32 [-1.0, 1.0] to 16-bit signed Integer PCM (little-endian)
    const pcm16 = new Int16Array(this.bufferIndex);
    for (let i = 0; i < this.bufferIndex; i++) {
      const s = Math.max(-1, Math.min(1, this.buffer[i]));
      pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }

    // Post-message raw PCM buffer to the main thread
    this.port.postMessage(pcm16.buffer, [pcm16.buffer]);

    // Reset buffer
    this.buffer = new Float32Array(this.bufferSize);
    this.bufferIndex = 0;
  }
}

registerProcessor("audio-processor", AudioProcessor);
