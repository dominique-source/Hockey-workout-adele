import React from 'react'

export default function TimerRing({ timeLeft, maxTime, isWork, color }) {
  const R = 70
  const circ = 2 * Math.PI * R
  const pct = timeLeft / maxTime
  const offset = circ * (1 - pct)
  const countdownColor = timeLeft <= 3 ? '#ff3cac' : timeLeft <= 5 ? '#f9f002' : color

  return (
    <div style={{ position: 'relative', width: 160, height: 160, margin: '0 auto', flexShrink: 0 }}>
      <svg width="160" height="160" viewBox="0 0 160 160" style={{ transform: 'rotate(-90deg)', position: 'absolute', top: 0, left: 0 }}>
        <circle cx="80" cy="80" r={R} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="8" />
        <circle
          cx="80" cy="80" r={R}
          fill="none"
          stroke={countdownColor}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.12s linear, stroke 0.2s' }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: 2
      }}>
        <span style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: timeLeft <= 5 ? 54 : 48,
          lineHeight: 1,
          color: countdownColor,
          transition: 'color 0.2s, font-size 0.1s'
        }}>
          {timeLeft}
        </span>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', letterSpacing: 1.5, textTransform: 'uppercase' }}>
          {isWork ? 'secondes' : 'repos'}
        </span>
      </div>
    </div>
  )
}
