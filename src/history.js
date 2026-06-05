import { supabase, getDeviceId } from './supabase.js'

const LOCAL_KEY = 'hockeyWorkoutHistory'

// ── Helpers ───────────────────────────────────────────────────────────

export function formatDate(iso) {
  const d = new Date(iso)
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function formatElapsed(sec) {
  const m = Math.floor(sec / 60), s = sec % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

// ── LocalStorage (cache offline) ──────────────────────────────────────

function getLocalSessions() {
  try { return JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]') } catch { return [] }
}

function setLocalSessions(sessions) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(sessions.slice(0, 100)))
}

// ── Supabase ──────────────────────────────────────────────────────────

// Sauvegarde une session (localStorage immédiat + Supabase en arrière-plan)
export async function saveSession({ exercises, elapsed }) {
  const session = {
    id: Date.now(),
    date: new Date().toISOString(),
    exercises,
    elapsed,
  }

  // 1. LocalStorage immédiat
  const local = getLocalSessions()
  local.unshift(session)
  setLocalSessions(local)

  // 2. Supabase en arrière-plan
  if (supabase) {
    try {
      await supabase.from('workout_sessions').insert({
        device_id: getDeviceId(),
        exercises,
        elapsed,
        created_at: session.date,
      })
    } catch (e) {
      console.warn('Supabase sync error:', e)
    }
  }

  return session
}

// Récupère les sessions (Supabase en priorité, localStorage en fallback)
export async function fetchSessions() {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('workout_sessions')
        .select('*')
        .eq('device_id', getDeviceId())
        .order('created_at', { ascending: false })
        .limit(100)

      if (!error && data?.length) {
        // Normalise le format Supabase → format local
        const sessions = data.map(r => ({
          id: r.id,
          date: r.created_at,
          exercises: r.exercises,
          elapsed: r.elapsed,
        }))
        setLocalSessions(sessions) // Met à jour le cache local
        return sessions
      }
    } catch (e) {
      console.warn('Supabase fetch error:', e)
    }
  }

  // Fallback localStorage
  return getLocalSessions()
}

// Lecture synchrone (cache local) — pour les composants qui ne peuvent pas await
export function getSessions() {
  return getLocalSessions()
}
