import React, { useState } from 'react'
import { computeBadges } from '../badges.js'
import { getSessions } from '../history.js'

export default function BadgeGrid() {
  const badges = computeBadges(getSessions())
  const unlocked = badges.filter(b => b.unlocked).length
  const [tooltip, setTooltip] = useState(null)

  return (
    <div style={{ padding: '0 20px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <p style={{ fontSize: 11, letterSpacing: 2, color: 'var(--text4)' }}>
          BADGES
        </p>
        <p style={{ fontSize: 11, color: 'var(--text4)' }}>
          {unlocked} / {badges.length}
        </p>
      </div>

      {/* Grid 5×2 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
        {badges.map((b) => {
          const pct = Math.round((b.prog.val / b.prog.max) * 100)

          return (
            <button
              key={b.id}
              onClick={() => setTooltip(tooltip === b.id ? null : b.id)}
              style={{
                position: 'relative',
                background: b.unlocked
                  ? b.supreme
                    ? 'linear-gradient(135deg, #ff3cac22, #f9f00222, #39ff1422)'
                    : `${b.color}18`
                  : 'var(--surface)',
                border: b.unlocked
                  ? `1.5px solid ${b.color}${b.supreme ? 'cc' : '66'}`
                  : '1.5px solid var(--border)',
                borderRadius: 12,
                padding: '10px 4px 8px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                filter: b.unlocked ? 'none' : 'grayscale(1) opacity(0.45)',
                boxShadow: b.unlocked && b.supreme
                  ? '0 0 16px rgba(255,60,172,0.3)'
                  : b.unlocked
                    ? `0 0 8px ${b.color}33`
                    : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {/* Icon */}
              <span style={{ fontSize: b.supreme ? 22 : 18, lineHeight: 1 }}>{b.icon}</span>

              {/* Name */}
              <span style={{
                fontSize: 8, textAlign: 'center', lineHeight: 1.2,
                color: b.unlocked ? b.color : 'var(--text4)',
                fontWeight: 700, letterSpacing: 0.3
              }}>
                {b.name}
              </span>

              {/* Progress bar (locked only) */}
              {!b.unlocked && (
                <div style={{
                  width: '80%', height: 2,
                  background: 'var(--border)', borderRadius: 1, overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%', width: `${pct}%`,
                    background: b.color, borderRadius: 1,
                    transition: 'width 0.4s'
                  }} />
                </div>
              )}

              {/* Tooltip */}
              {tooltip === b.id && (
                <div style={{
                  position: 'absolute', bottom: '110%', left: '50%',
                  transform: 'translateX(-50%)',
                  background: '#1a1a35', border: `1px solid ${b.color}55`,
                  borderRadius: 8, padding: '6px 10px',
                  fontSize: 10, color: 'var(--text2)',
                  whiteSpace: 'nowrap', zIndex: 10,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.4)'
                }}>
                  {b.desc}
                  {!b.unlocked && (
                    <span style={{ color: b.color, marginLeft: 4 }}>
                      {b.prog.val}/{b.prog.max}
                    </span>
                  )}
                  {b.unlocked && (
                    <span style={{ color: b.color, marginLeft: 4 }}>✓</span>
                  )}
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
