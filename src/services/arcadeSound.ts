let context: AudioContext | null = null

function getContext(): AudioContext | null {
  const Ctor =
    window.AudioContext ||
    (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!Ctor) return null
  context ??= new Ctor()
  return context
}

export function playArcadeHit(): void {
  const audio = getContext()
  if (!audio) return

  void audio.resume()
  const now = audio.currentTime
  const osc = audio.createOscillator()
  const gain = audio.createGain()

  osc.type = 'square'
  osc.frequency.setValueAtTime(440, now)
  osc.frequency.setValueAtTime(660, now + 0.08)
  gain.gain.setValueAtTime(0.08, now)
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22)
  osc.connect(gain)
  gain.connect(audio.destination)
  osc.start(now)
  osc.stop(now + 0.24)
}
