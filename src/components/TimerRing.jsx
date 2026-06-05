import React from 'react'

export default function TimerRing({ timeLeft, maxTime, isWork, color, size = 160 }) {
  const R = Math.round(size * 0.4375)
  const circ = 2 * Math.PI * R
  const offset = circ * (1 - timeLeft / maxTime)
  const cx = size / 2
  const countdownColor = timeLeft <= 3 ? '#ff3cac' : timeLeft <= 5 ? '#f9f002' : color

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg
        width={size} height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: 'rotate(-90deg)', position: 'absolute', top: 0, left: 0 }}
      >
        <circle cx={cx} cy={cx} r={R} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="7" />
        <circle
          cx={cx} cy={cx} r={R}
          fill="none" stroke={countdownColor}
          strokeWidth="7" strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.12s linear, stroke 0.2s' }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 1
      }}>
        <span style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: timeLeft <= 5 ? Math.round(size * 0.35) : Math.round(size * 0.31),
          lineHeight: 1, color: countdownColor,
          transition: 'color 0.2s, font-size 0.1s'
        }}>
          {timeLeft}
        </span>
        <span style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: Math.round(size * 0.09),
          letterSpacing: 2, textTransform: 'uppercase',
          color: isWork ? countdownColor : '#39ff14',
          transition: 'color 0.3s'
        }}>
          {isWork ? 'TRAVAIL' : 'REPOS'}
        </span>
      </div>
    </div>
  )
}
