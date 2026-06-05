import { useEffect, useRef, useCallback } from 'react'

export function useVoice() {
  const voiceRef = useRef(null)
  const synthRef = useRef(null)

  useEffect(() => {
    if (!window.speechSynthesis) return
    synthRef.current = window.speechSynthesis

    const loadVoice = () => {
      const voices = synthRef.current.getVoices()
      voiceRef.current = voices.find(v => v.lang.startsWith('fr')) || voices[0] || null
    }
    synthRef.current.onvoiceschanged = loadVoice
    loadVoice()
  }, [])

  const beep = useCallback((freq = 880, dur = 120, vol = 0.4) => {
    try {
      const ac = new (window.AudioContext || window.webkitAudioContext)()
      const o = ac.createOscillator()
      const g = ac.createGain()
      o.connect(g); g.connect(ac.destination)
      o.frequency.value = freq
      g.gain.value = vol
      o.start(); o.stop(ac.currentTime + dur / 1000)
      setTimeout(() => ac.close(), dur + 100)
    } catch (_) {}
  }, [])

  const speak = useCallback((text, rate = 1.0, pitch = 1.0) => {
    if (!synthRef.current) return
    synthRef.current.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'fr-FR'
    if (voiceRef.current) u.voice = voiceRef.current
    u.rate = rate; u.pitch = pitch
    synthRef.current.speak(u)
  }, [])

  const sayGo = useCallback(() => {
    beep(1046, 80, 0.5)
    setTimeout(() => speak('Partez !', 1.1, 1.1), 120)
  }, [beep, speak])

  const sayStop = useCallback(() => {
    beep(440, 200, 0.4)
    setTimeout(() => speak('Stop !', 1.0, 0.9), 120)
  }, [beep, speak])

  const sayRest = useCallback((nextName) => {
    setTimeout(() => speak(`Repos. Prochain exercice : ${nextName}`, 0.92, 1.0), 500)
  }, [speak])

  const sayCountdown = useCallback((n) => {
    speak(String(n), 1.1, 1.05)
    if (n <= 3) beep(n === 1 ? 1100 : 880, 60, 0.3)
  }, [speak, beep])

  const sayDone = useCallback(() => {
    beep(1046, 150, 0.5)
    setTimeout(() => beep(1318, 150, 0.5), 200)
    setTimeout(() => beep(1568, 300, 0.5), 400)
    setTimeout(() => speak('Workout terminé ! Excellent travail Adèle !', 0.9, 1.0), 700)
  }, [beep, speak])

  return { sayGo, sayStop, sayRest, sayCountdown, sayDone, speak }
}
