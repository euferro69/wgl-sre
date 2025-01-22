export function playAudio(
  audioUrl: string,
  loop: boolean = false,
  volume: number = 1
): Promise<void> {
  return new Promise((resolve, reject) => {
    // Create an audio element
    const audio = new Audio(audioUrl);

    // Configure the audio settings
    audio.loop = loop;
    audio.volume = Math.min(Math.max(volume, 0), 1); // Ensure volume is between 0 and 1

    // Event listeners for playback
    audio.oncanplaythrough = () => {
      audio.play().then(resolve).catch(reject);
    };

    audio.onerror = () => {
      reject(new Error(`Failed to load or play audio: ${audioUrl}`));
    };

    // Optionally clean up after audio ends (if not looping)
    if (!loop) {
      audio.onended = () => {
        audio.remove();
      };
    }
  });
}
