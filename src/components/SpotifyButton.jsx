import React, { useState } from 'react'

const GREEN = '#1DB954'
const KEY = 'hockeySpotifyUrl'

// Converts open.spotify.com URL → spotify: deep link
function toDeepLink(url) {
  if (!url) return null
  if (url.startsWith('spotify:')) return url
  const m = url.match(/open\.spotify\.com\/(playlist|track|album|artist)\/([a-zA-Z0-9]+)/)
  if (m) return `spotify:${m[1]}:${m[2]}`
  return url
}

// Converts spotify: deep link → https fallback
function toWebLink(deepLink) {
  if (!deepLink) return null
  if (deepLink.startsWith('spotify:')) {
    const [, type, id] = deepLink.split(':')
    if (type && id) return `https://open.spotify.com/${type}/${id}`
  }
  return deepLink
}

export default function SpotifyButton({ size = 'normal' }) {
  const [saved, setSaved] = useState(() => localStorage.getItem(KEY) || '')
  const [editing, setEditing] = useState(false)
  const [input, setInput] = useState(saved)

  const compact = size === 'compact'

  const handleOpen = () => {
    const deep = toDeepLink(saved)
    if (!deep) return
    // Tente d'ouvrir l'app Spotify ; fallback web si l'app ne répond pas
    window.location.href = deep
    const web = toWebLink(deep)
    if (web) {
      const t = setTimeout(() => window.open(web, '_blank'), 1200)
      window.addEventListener('blur', () => clearTimeout(t), { once: true })
    }
  }

  const handleSave = () => {
    const v = input.trim()
    if (v) {
      localStorage.setItem(KEY, v)
      setSaved(v)
    }
    setEditing(false)
  }

  const handleClear = (e) => {
    e.stopPropagation()
    localStorage.removeItem(KEY)
    setSaved('')
    setInput('')
    setEditing(false)
  }

  const SpotifyIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
      <circle cx="12" cy="12" r="12" fill={GREEN} />
      <path
        d="M17.9 10.9C14.7 9 9.35 8.8 6.3 9.75c-.5.15-1-.15-1.15-.6-.15-.5.15-1 .6-1.15C9.65 7 15.5 7.3 19.1 9.4c.45.25.6.85.35 1.3-.25.35-.85.5-1.55.2zm-.1 2.8c-.25.4-.75.5-1.15.25-2.7-1.65-6.8-2.15-9.95-1.15-.4.1-.85-.1-.95-.5-.1-.4.1-.85.5-.95 3.65-1.1 8.15-.55 11.25 1.35.3.15.45.65.3 1zm-1.3 2.7c-.2.35-.6.45-.95.25-2.35-1.45-5.3-1.75-8.8-.95-.35.1-.65-.15-.75-.45-.1-.35.15-.65.45-.75 3.8-.85 7.1-.5 9.7 1.1.35.15.4.55.35.8z"
        fill="white"
      />
    </svg>
  )

  // ── Mode édition ────────────────────────────────────────────────────
  if (editing) return (
    <div style={{
      background: 'var(--surface2)', border: `1px solid ${GREEN}44`,
      borderRadius: 14, padding: '12px 14px',
      display: 'flex', flexDirection: 'column', gap: 10
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <SpotifyIcon />
        <span style={{ fontSize: 12, color: 'var(--text2)', letterSpacing: 1 }}>
          Colle ton lien Spotify
        </span>
      </div>
      <input
        autoFocus
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') setEditing(false) }}
        placeholder="https://open.spotify.com/playlist/..."
        style={{
          background: 'var(--surface)', border: `1px solid ${GREEN}66`,
          borderRadius: 8, padding: '9px 12px',
          color: 'var(--text)', fontSize: 13,
          outline: 'none', width: '100%'
        }}
      />
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={handleSave}
          style={{
            flex: 1, height: 38, borderRadius: 8,
            background: GREEN, border: 'none', color: '#000',
            fontFamily: "'Bebas Neue',sans-serif", fontSize: 16, letterSpacing: 2
          }}
        >
          SAUVEGARDER
        </button>
        <button
          onClick={() => setEditing(false)}
          style={{
            width: 38, height: 38, borderRadius: 8,
            background: 'var(--surface)', border: '1px solid var(--border2)',
            color: 'var(--text3)', fontSize: 18
          }}
        >
          ×
        </button>
      </div>
    </div>
  )

  // ── Pas encore configuré ────────────────────────────────────────────
  if (!saved) return (
    <button
      onClick={() => { setInput(''); setEditing(true) }}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        background: 'var(--surface2)', border: `1px solid ${GREEN}33`,
        borderRadius: 14, padding: compact ? '8px 14px' : '12px 18px',
        color: 'var(--text2)', width: '100%',
        fontFamily: "'Bebas Neue',sans-serif",
        fontSize: compact ? 14 : 16, letterSpacing: 2
      }}
    >
      <SpotifyIcon />
      LIER MA PLAYLIST SPOTIFY
    </button>
  )

  // ── Playlist configurée ─────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', gap: 8, width: '100%' }}>
      <button
        onClick={handleOpen}
        style={{
          flex: 1, display: 'flex', alignItems: 'center', gap: 10,
          background: `${GREEN}18`, border: `1px solid ${GREEN}55`,
          borderRadius: 14, padding: compact ? '8px 14px' : '12px 18px',
          color: GREEN,
          fontFamily: "'Bebas Neue',sans-serif",
          fontSize: compact ? 14 : 16, letterSpacing: 2,
          boxShadow: `0 0 12px ${GREEN}22`
        }}
      >
        <SpotifyIcon />
        {compact ? 'SPOTIFY' : '▶ OUVRIR SPOTIFY'}
      </button>
      <button
        onClick={() => { setInput(saved); setEditing(true) }}
        title="Changer de playlist"
        style={{
          width: compact ? 36 : 44, height: compact ? 36 : 44,
          borderRadius: 10, alignSelf: 'center',
          background: 'var(--surface2)', border: '1px solid var(--border2)',
          color: 'var(--text3)', fontSize: 14
        }}
      >
        ✎
      </button>
      <button
        onClick={handleClear}
        title="Supprimer"
        style={{
          width: compact ? 36 : 44, height: compact ? 36 : 44,
          borderRadius: 10, alignSelf: 'center',
          background: 'var(--surface2)', border: '1px solid var(--border2)',
          color: 'var(--text3)', fontSize: 16
        }}
      >
        ×
      </button>
    </div>
  )
}
