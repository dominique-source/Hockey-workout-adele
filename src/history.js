const KEY = 'hockeyWorkoutHistory'

export function saveSession({ exercises, elapsed }) {
  const sessions = getSessions()
  sessions.unshift({
    id: Date.now(),
    date: new Date().toISOString(),
    exercises,
    elapsed,
  })
  localStorage.setItem(KEY, JSON.stringify(sessions.slice(0, 15)))
}

export function getSessions() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]')
  } catch {
    return []
  }
}

export function formatDate(iso) {
  const d = new Date(iso)
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function formatElapsed(sec) {
  const m = Math.floor(sec / 60), s = sec % 60
  return `${m}:${String(s).padStart(2, '0')}`
}
