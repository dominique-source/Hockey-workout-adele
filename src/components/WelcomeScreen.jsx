import React from 'react'
import { getSessions, formatDate, formatElapsed } from '../history.js'

export default function WelcomeScreen({ onStart, darkMode, onToggleTheme }) {
  const sessions = getSessions()

  return (
    <div style={{
      width: '100%', maxWidth: 480, margin: '0 auto',
      padding: '0 0 40px', minHeight: '100dvh',
      display: 'flex', flexDirection: 'column'
    }}>

      {/* Theme toggle */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px 20px 0' }}>
        <button
          onClick={onToggleTheme}
          title={darkMode ? 'Mode clair' : 'Mode sombre'}
          style={{
            width: 40, height: 40, borderRadius: 999,
            background: 'var(--surface2)', border: '1px solid var(--border2)',
            color: 'var(--text)', fontSize: 18,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>

      {/* Hero */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '20px 24px 0', textAlign: 'center'
      }}>
        {/* Hockey emoji */}
        <div style={{ fontSize: 64, marginBottom: 12, lineHeight: 1 }}>🏒</div>

        {/* ADÈLE */}
        <h1 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 'clamp(72px, 22vw, 110px)',
          letterSpacing: 6, lineHeight: 0.9,
          background: 'linear-gradient(135deg, #ff3cac 0%, #f9f002 60%, #00f5ff 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          marginBottom: 4
        }}>
          ADÈLE
        </h1>

        <p style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 18, letterSpacing: 5,
          color: 'var(--text3)', marginBottom: 6
        }}>
          HOCKEY WORKOUT
        </p>

        <p style={{ fontSize: 12, color: 'var(--text4)', letterSpacing: 2, marginBottom: 36 }}>
          30 MIN · 45 EXERCICES · SANS PATINS
        </p>

        {/* Stat chips */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 36, flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { val: '45', lbl: 'exercices' },
            { val: '30', lbl: 'minutes' },
            { val: '3', lbl: 'catégories' },
            { val: '20s', lbl: 'par exercice' },
          ].map(({ val, lbl }) => (
            <div key={lbl} style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 10, padding: '10px 16px', textAlign: 'center', minWidth: 72
            }}>
              <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 24, lineHeight: 1, color: '#ff3cac' }}>{val}</div>
              <div style={{ fontSize: 10, color: 'var(--text4)', marginTop: 2, letterSpacing: 1 }}>{lbl}</div>
            </div>
          ))}
        </div>

        {/* Start button */}
        <button
          onClick={onStart}
          style={{
            width: '100%', maxWidth: 340, height: 60,
            borderRadius: 999,
            background: 'linear-gradient(135deg, #ff3cac 0%, #b44aff 100%)',
            border: 'none', color: '#fff',
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 26, letterSpacing: 4,
            boxShadow: '0 0 24px rgba(255,60,172,0.4)',
          }}
        >
          ▶ COMMENCER
        </button>
      </div>

      {/* History */}
      {sessions.length > 0 && (
        <div style={{ padding: '32px 20px 0' }}>
          <p style={{
            fontSize: 11, letterSpacing: 2, color: 'var(--text4)',
            marginBottom: 10, textAlign: 'center'
          }}>
            DERNIÈRES SESSIONS
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {sessions.slice(0, 5).map((s) => (
              <div key={s.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 10, padding: '10px 14px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 18 }}>🏒</span>
                  <div>
                    <div style={{ fontSize: 13, color: 'var(--text)', fontWeight: 600 }}>
                      {s.exercises} exercices
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text4)' }}>{formatDate(s.date)}</div>
                  </div>
                </div>
                <div style={{
                  fontFamily: "'Bebas Neue',sans-serif",
                  fontSize: 18, color: '#39ff14', letterSpacing: 1
                }}>
                  {formatElapsed(s.elapsed)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}
