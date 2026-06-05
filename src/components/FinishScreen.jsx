import React, { useState, useEffect } from 'react'
import { fetchSessions, getSessions, formatDate, formatElapsed } from '../history.js'

export default function FinishScreen({ onRestart, onHome, exercisesDone, elapsed }) {
  const [sessions, setSessions] = useState(getSessions)

  useEffect(() => {
    fetchSessions().then(setSessions)
  }, [])

  return (
    <div style={{
      width: '100%', maxWidth: 480, padding: '0 16px 40px',
      margin: '0 auto', display: 'flex', flexDirection: 'column',
      alignItems: 'center'
    }}>

      {/* Hero */}
      <div style={{
        minHeight: '40vh',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '40px 0 24px'
      }}>
        <div style={{ fontSize: 80, marginBottom: 16 }}>🏒</div>
        <h1 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 52, letterSpacing: 3, lineHeight: 1,
          background: 'linear-gradient(135deg, #ff3cac 0%, #f9f002 50%, #39ff14 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text', marginBottom: 8
        }}>
          WORKOUT TERMINÉ !
        </h1>
        <p style={{ color: 'var(--text2)', fontSize: 15 }}>
          Excellent travail, Adèle ! 💪
        </p>
      </div>

      {/* Session stats */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 28 }}>
        {[
          { val: exercisesDone ?? 45, lbl: 'exercices' },
          { val: elapsed != null ? formatElapsed(elapsed) : '30:00', lbl: 'temps' },
          { val: '💪', lbl: 'champion' },
        ].map(({ val, lbl }) => (
          <div key={lbl} style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 12, padding: '16px 24px', textAlign: 'center', minWidth: 90
          }}>
            <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 36, color: '#f9f002', lineHeight: 1 }}>{val}</div>
            <div style={{ fontSize: 12, color: 'var(--text4)', marginTop: 4 }}>{lbl}</div>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: 10, width: '100%', marginBottom: 32 }}>
        <button
          onClick={onHome}
          style={{
            flex: 1, height: 52, borderRadius: 999,
            background: 'var(--surface2)', border: '1px solid var(--border2)',
            color: 'var(--text)', fontFamily: "'Bebas Neue',sans-serif",
            fontSize: 18, letterSpacing: 2
          }}
        >
          ← ACCUEIL
        </button>
        <button
          onClick={onRestart}
          style={{
            flex: 2, height: 52, borderRadius: 999,
            background: 'linear-gradient(135deg, #ff3cac 0%, #b44aff 100%)',
            border: 'none', color: '#fff',
            fontFamily: "'Bebas Neue',sans-serif",
            fontSize: 20, letterSpacing: 3,
            boxShadow: '0 0 20px rgba(255,60,172,0.35)'
          }}
        >
          ↺ RECOMMENCER
        </button>
      </div>

      {/* History */}
      {sessions.length > 0 && (
        <div style={{ width: '100%' }}>
          <p style={{
            fontSize: 11, letterSpacing: 2, color: 'var(--text4)',
            marginBottom: 10, textAlign: 'center'
          }}>
            HISTORIQUE DES SESSIONS
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {sessions.slice(0, 8).map((s, i) => (
              <div key={s.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: i === 0 ? 'rgba(57,255,20,0.06)' : 'var(--surface)',
                border: `1px solid ${i === 0 ? 'rgba(57,255,20,0.2)' : 'var(--border)'}`,
                borderRadius: 10, padding: '10px 14px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {i === 0 && <span style={{ fontSize: 14 }}>🆕</span>}
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
