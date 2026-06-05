// ── Badge definitions ─────────────────────────────────────────────────
export const BADGES = [
  {
    id: 'first',
    icon: '🏒',
    name: 'Premier coup',
    desc: '1er workout complété',
    color: '#39ff14',
    check: ({ total }) => total >= 1,
    progress: ({ total }) => ({ val: Math.min(total, 1), max: 1 }),
  },
  {
    id: 'triple',
    icon: '💪',
    name: 'En forme',
    desc: '3 workouts complétés',
    color: '#00f5ff',
    check: ({ total }) => total >= 3,
    progress: ({ total }) => ({ val: Math.min(total, 3), max: 3 }),
  },
  {
    id: 'streak3',
    icon: '🔥',
    name: '3 jours de suite',
    desc: 'Entraîne-toi 3 jours consécutifs',
    color: '#ff6b00',
    check: ({ streak }) => streak >= 3,
    progress: ({ streak }) => ({ val: Math.min(streak, 3), max: 3 }),
  },
  {
    id: 'ten',
    icon: '⚡',
    name: 'Dix de maître',
    desc: '10 workouts complétés',
    color: '#f9f002',
    check: ({ total }) => total >= 10,
    progress: ({ total }) => ({ val: Math.min(total, 10), max: 10 }),
  },
  {
    id: 'streak7',
    icon: '📅',
    name: 'Semaine de feu',
    desc: '7 jours consécutifs',
    color: '#ff3cac',
    check: ({ streak }) => streak >= 7,
    progress: ({ streak }) => ({ val: Math.min(streak, 7), max: 7 }),
  },
  {
    id: 'twenty',
    icon: '🌟',
    name: 'Vingt fort',
    desc: '20 workouts complétés',
    color: '#b44aff',
    check: ({ total }) => total >= 20,
    progress: ({ total }) => ({ val: Math.min(total, 20), max: 20 }),
  },
  {
    id: 'thirty',
    icon: '🏆',
    name: 'Trente élite',
    desc: '30 workouts complétés',
    color: '#ff6b00',
    check: ({ total }) => total >= 30,
    progress: ({ total }) => ({ val: Math.min(total, 30), max: 30 }),
  },
  {
    id: 'fifty',
    icon: '💎',
    name: 'Cinquante diamants',
    desc: '50 workouts complétés',
    color: '#00f5ff',
    check: ({ total }) => total >= 50,
    progress: ({ total }) => ({ val: Math.min(total, 50), max: 50 }),
  },
  {
    id: 'hundred',
    icon: '🥇',
    name: 'Centenaire',
    desc: '100 workouts complétés',
    color: '#f9f002',
    check: ({ total }) => total >= 100,
    progress: ({ total }) => ({ val: Math.min(total, 100), max: 100 }),
  },
  {
    id: 'supreme',
    icon: '👑',
    name: 'SUPRÊME',
    desc: 'Tous les badges obtenus',
    color: '#ff3cac',
    supreme: true,
    check: ({ unlockedCount }) => unlockedCount >= 9, // tous sauf supreme lui-même
    progress: ({ unlockedCount }) => ({ val: Math.min(unlockedCount, 9), max: 9 }),
  },
]

// ── Compute best streak (ever) from session history ───────────────────
export function getBestStreak(sessions) {
  if (!sessions.length) return 0
  const days = [...new Set(sessions.map(s => s.date.slice(0, 10)))].sort()
  let max = 1, cur = 1
  for (let i = 1; i < days.length; i++) {
    const diff = (new Date(days[i]) - new Date(days[i - 1])) / 86400000
    if (diff === 1) { cur++; if (cur > max) max = cur }
    else cur = 1
  }
  return max
}

// ── Compute current streak (from today backwards) ─────────────────────
export function getCurrentStreak(sessions) {
  if (!sessions.length) return 0
  const days = [...new Set(sessions.map(s => s.date.slice(0, 10)))].sort().reverse()
  const today = new Date().toISOString().slice(0, 10)
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
  if (days[0] !== today && days[0] !== yesterday) return 0
  let streak = 1
  for (let i = 1; i < days.length; i++) {
    const diff = (new Date(days[i - 1]) - new Date(days[i])) / 86400000
    if (diff === 1) streak++
    else break
  }
  return streak
}

// ── Returns array of badge objects with .unlocked and .prog ───────────
export function computeBadges(sessions) {
  const total = sessions.length
  const streak = Math.max(getBestStreak(sessions), getCurrentStreak(sessions))
  const stats = { total, streak, unlockedCount: 0 }

  // First pass: count unlocked (excluding supreme)
  stats.unlockedCount = BADGES.slice(0, 9).filter(b => b.check(stats)).length

  return BADGES.map(b => ({
    ...b,
    unlocked: b.check(stats),
    prog: b.progress(stats),
  }))
}
