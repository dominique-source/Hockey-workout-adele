import React, { useState } from 'react'
import { computeBadges } from '../badges.js'
import { getSessions } from '../history.js'

function BadgeModal({ badge, onClose }) {
  const pct = Math.round((badge.prog.val / badge.prog.max) * 100)
  const remaining = badge.prog.max - badge.prog.val

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(6px)',
          zIndex: 100,
          animation: 'fadeIn 0.15s ease'
        }}
      />

      {/* Card */}
      <div style={{
        position: 'fixed', left: '50%', top: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'min(340px, 90vw)',
        background: badge.supreme
          ? 'linear-gradient(145deg, #12122a, #1a0a2e)'
          : 'var(--bg2, #12122a)',
        border: `2px solid ${badge.color}${badge.unlocked ? 'bb' : '44'}`,
        borderRadius: 20,
        padding: '28px 24px 24px',
        zIndex: 101,
        boxShadow: badge.unlocked
          ? `0 0 40px ${badge.color}44, 0 20px 60px rgba(0,0,0,0.6)`
          : '0 20px 60px rgba(0,0,0,0.6)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
        textAlign: 'center',
        animation: 'popIn 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
      }}>

        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 12, right: 14,
            background: 'none', border: 'none',
            color: 'rgba(255,255,255,0.35)', fontSize: 20, lineHeight: 1,
            cursor: 'pointer'
          }}
        >×</button>

        {/* Icon */}
        <div style={{
          fontSize: 64, lineHeight: 1,
          filter: badge.unlocked ? 'none' : 'grayscale(1) opacity(0.4)',
          animation: badge.unlocked ? 'pulse 2s ease infinite' : 'none'
        }}>
          {badge.icon}
        </div>

        {/* Status chip */}
        <span style={{
          fontSize: 10, letterSpacing: 2, fontWeight: 700,
          padding: '3px 12px', borderRadius: 999,
          background: badge.unlocked ? `${badge.color}22` : 'rgba(255,255,255,0.05)',
          color: badge.unlocked ? badge.color : 'rgba(255,255,255,0.35)',
          border: `1px solid ${badge.unlocked ? badge.color + '66' : 'rgba(255,255,255,0.1)'}`,
          fontFamily: "'Bebas Neue', sans-serif"
        }}>
          {badge.unlocked ? '✓ DÉBLOQUÉ' : 'VERROUILLÉ'}
        </span>

        {/* Name */}
        <h2 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: badge.supreme ? 32 : 26,
          letterSpacing: 3, lineHeight: 1,
          color: badge.unlocked ? badge.color : 'rgba(255,255,255,0.6)',
          margin: 0,
          textShadow: badge.unlocked ? `0 0 20px ${badge.color}88` : 'none'
        }}>
          {badge.name}
        </h2>

        {/* Description */}
        <p style={{
          fontSize: 14, color: 'rgba(255,255,255,0.6)',
          lineHeight: 1.5, margin: 0
        }}>
          {badge.desc}
        </p>

        {/* Progress section */}
        {!badge.unlocked ? (
          <div style={{ width: '100%', marginTop: 4 }}>
            {/* Progress numbers */}
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 8
            }}>
              <span>{badge.prog.val} / {badge.prog.max}</span>
              <span style={{ color: badge.color }}>{pct}%</span>
            </div>

            {/* Progress bar */}
            <div style={{
              height: 8, background: 'rgba(255,255,255,0.07)',
              borderRadius: 4, overflow: 'hidden'
            }}>
              <div style={{
                height: '100%', width: `${pct}%`,
                background: `linear-gradient(90deg, ${badge.color}, ${badge.color}99)`,
                borderRadius: 4, transition: 'width 0.6s ease',
                boxShadow: `0 0 8px ${badge.color}66`
              }} />
            </div>

            {/* What's missing */}
            <p style={{
              marginTop: 10, fontSize: 13,
              color: 'rgba(255,255,255,0.5)', lineHeight: 1.4
            }}>
              {remaining === badge.prog.max
                ? `Complète ton premier workout pour débuter !`
                : `Il te manque encore `}
              {remaining < badge.prog.max && (
                <span style={{ color: badge.color, fontWeight: 700 }}>
                  {remaining} {badge.id.startsWith('streak')
                    ? `jour${remaining > 1 ? 's' : ''} consécutif${remaining > 1 ? 's' : ''}`
                    : `workout${remaining > 1 ? 's' : ''}`}
                </span>
              )}
            </p>
          </div>
        ) : (
          <div style={{
            marginTop: 4, padding: '10px 20px', borderRadius: 10,
            background: `${badge.color}11`,
            border: `1px solid ${badge.color}33`,
            fontSize: 13, color: badge.color
          }}>
            🎉 Badge obtenu — Félicitations Adèle !
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes popIn {
          from { transform: translate(-50%, -50%) scale(0.85); opacity: 0 }
          to   { transform: translate(-50%, -50%) scale(1);    opacity: 1 }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1) }
          50%       { transform: scale(1.08) }
        }
      `}</style>
    </>
  )
}

export default function BadgeGrid({ sessions }) {
  const badges = computeBadges(sessions ?? getSessions())
  const unlocked = badges.filter(b => b.unlocked).length
  const [selected, setSelected] = useState(null)
  const selectedBadge = badges.find(b => b.id === selected)

  return (
    <div style={{ padding: '0 20px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <p style={{ fontSize: 11, letterSpacing: 2, color: 'var(--text4)' }}>BADGES</p>
        <p style={{ fontSize: 11, color: 'var(--text4)' }}>{unlocked} / {badges.length}</p>
      </div>

      {/* Grid 5×2 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
        {badges.map((b) => {
          const pct = Math.round((b.prog.val / b.prog.max) * 100)
          return (
            <button
              key={b.id}
              onClick={() => setSelected(b.id)}
              style={{
                background: b.unlocked
                  ? b.supreme ? 'linear-gradient(135deg,#ff3cac22,#f9f00222,#39ff1422)' : `${b.color}18`
                  : 'var(--surface)',
                border: b.unlocked
                  ? `1.5px solid ${b.color}${b.supreme ? 'cc' : '66'}`
                  : '1.5px solid var(--border)',
                borderRadius: 12, padding: '10px 4px 8px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                filter: b.unlocked ? 'none' : 'grayscale(1) opacity(0.45)',
                boxShadow: b.unlocked && b.supreme
                  ? '0 0 16px rgba(255,60,172,0.3)'
                  : b.unlocked ? `0 0 8px ${b.color}33` : 'none',
                cursor: 'pointer', transition: 'all 0.2s'
              }}
            >
              <span style={{ fontSize: b.supreme ? 22 : 18, lineHeight: 1 }}>{b.icon}</span>
              <span style={{
                fontSize: 8, textAlign: 'center', lineHeight: 1.2,
                color: b.unlocked ? b.color : 'var(--text4)',
                fontWeight: 700, letterSpacing: 0.3
              }}>{b.name}</span>
              {!b.unlocked && (
                <div style={{ width: '80%', height: 2, background: 'var(--border)', borderRadius: 1, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: b.color, borderRadius: 1 }} />
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Modal */}
      {selectedBadge && (
        <BadgeModal badge={selectedBadge} onClose={() => setSelected(null)} />
      )}
    </div>
  )
}
