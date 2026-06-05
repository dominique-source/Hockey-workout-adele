import React, { useState, useEffect, useRef, useCallback } from 'react'
import { EXERCISES, CAT_LABEL, CAT_COLOR } from './exercises.js'
import { useVoice } from './useVoice.js'
import { saveSession } from './history.js'
import StickFigure from './components/StickFigure.jsx'
import TimerRing from './components/TimerRing.jsx'
import FinishScreen from './components/FinishScreen.jsx'
import WelcomeScreen from './components/WelcomeScreen.jsx'
import SpotifyButton from './components/SpotifyButton.jsx'

const WORK = 20
const REST = 20
const TOTAL_DURATION = 30 * 60

export default function App() {
  const [screen, setScreen] = useState('welcome') // 'welcome' | 'workout' | 'finish'
  const [darkMode, setDarkMode] = useState(true)

  const [curEx, setCurEx] = useState(0)
  const [isWork, setIsWork] = useState(true)
  const [timeLeft, setTimeLeft] = useState(WORK)
  const [playing, setPlaying] = useState(false)
  const [totalElapsed, setTotalElapsed] = useState(0)
  // track session result for FinishScreen
  const [finishData, setFinishData] = useState(null)

  const lastCountdown = useRef(-1)
  const intervalRef = useRef(null)
  const stateRef = useRef({ curEx: 0, isWork: true, timeLeft: WORK, totalElapsed: 0 })
  const wakeLockRef = useRef(null)

  // ── Wake Lock : garde l'écran allumé pendant le workout ─────────────
  const requestWakeLock = useCallback(async () => {
    if (!('wakeLock' in navigator)) return
    try {
      wakeLockRef.current = await navigator.wakeLock.request('screen')
    } catch {}
  }, [])

  const releaseWakeLock = useCallback(() => {
    wakeLockRef.current?.release()
    wakeLockRef.current = null
  }, [])

  // Re-demande le wake lock si l'app revient au premier plan
  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === 'visible' && playing) {
        requestWakeLock()
      }
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [playing, requestWakeLock])

  const { sayGo, sayStop, sayRest, sayCountdown, sayDone, speak } = useVoice()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  const ex = EXERCISES[curEx]
  const nextEx = EXERCISES[curEx + 1]
  const totalPct = Math.round((curEx / EXERCISES.length) * 100)
  const remaining = Math.max(0, TOTAL_DURATION - totalElapsed)
  const remMin = Math.floor(remaining / 60)
  const remSec = remaining % 60

  const tick = useCallback(() => {
    const st = stateRef.current
    st.totalElapsed++
    st.timeLeft--

    setTotalElapsed(st.totalElapsed)
    setTimeLeft(st.timeLeft)

    if (st.timeLeft <= 5 && st.timeLeft > 0 && lastCountdown.current !== st.timeLeft) {
      sayCountdown(st.timeLeft)
      lastCountdown.current = st.timeLeft
    }

    if (st.timeLeft <= 0) {
      if (st.isWork) {
        sayStop()
        st.isWork = false
        st.timeLeft = REST
        setIsWork(false)
        setTimeLeft(REST)
        lastCountdown.current = -1
        const nextName = st.curEx + 1 < EXERCISES.length ? EXERCISES[st.curEx + 1].name : 'Terminé !'
        sayRest(nextName)
      } else {
        st.curEx++
        if (st.curEx >= EXERCISES.length) {
          clearInterval(intervalRef.current)
          const data = { exercises: EXERCISES.length, elapsed: st.totalElapsed }
          saveSession(data)
          setFinishData(data)
          setScreen('finish')
          releaseWakeLock()
          sayDone()
          return
        }
        st.isWork = true
        st.timeLeft = WORK
        setIsWork(true)
        setTimeLeft(WORK)
        setCurEx(st.curEx)
        lastCountdown.current = -1
        sayGo()
      }
    }
  }, [sayGo, sayStop, sayRest, sayCountdown, sayDone])

  const togglePlay = () => {
    if (screen !== 'workout') return
    if (playing) {
      clearInterval(intervalRef.current)
      setPlaying(false)
      releaseWakeLock()
    } else {
      setPlaying(true)
      intervalRef.current = setInterval(tick, 1000)
      requestWakeLock()
      if (isWork) sayGo()
      else speak('Repos')
    }
  }

  const skipNext = () => {
    clearInterval(intervalRef.current)
    setPlaying(false)
    const next = Math.min(curEx + 1, EXERCISES.length - 1)
    stateRef.current = { curEx: next, isWork: true, timeLeft: WORK, totalElapsed: stateRef.current.totalElapsed }
    setCurEx(next); setIsWork(true); setTimeLeft(WORK)
    lastCountdown.current = -1
  }

  const skipPrev = () => {
    clearInterval(intervalRef.current)
    setPlaying(false)
    const prev = Math.max(curEx - 1, 0)
    stateRef.current = { curEx: prev, isWork: true, timeLeft: WORK, totalElapsed: stateRef.current.totalElapsed }
    setCurEx(prev); setIsWork(true); setTimeLeft(WORK)
    lastCountdown.current = -1
  }

  const restartWorkout = () => {
    clearInterval(intervalRef.current)
    stateRef.current = { curEx: 0, isWork: true, timeLeft: WORK, totalElapsed: 0 }
    setCurEx(0); setIsWork(true); setTimeLeft(WORK); setPlaying(false)
    setTotalElapsed(0); setFinishData(null); lastCountdown.current = -1
    setScreen('workout')
  }

  const goHome = () => {
    clearInterval(intervalRef.current)
    stateRef.current = { curEx: 0, isWork: true, timeLeft: WORK, totalElapsed: 0 }
    setCurEx(0); setIsWork(true); setTimeLeft(WORK); setPlaying(false)
    setTotalElapsed(0); setFinishData(null); lastCountdown.current = -1
    setScreen('welcome')
  }

  useEffect(() => () => clearInterval(intervalRef.current), [])

  // ── Swipe left → exercice suivant ───────────────────────────────────
  const touchStartX = useRef(null)

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
  }

  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return
    const dx = touchStartX.current - e.changedTouches[0].clientX
    touchStartX.current = null
    if (dx > 60) skipNext() // swipe gauche → suivant
  }

  const displayEx = (!isWork && nextEx) ? nextEx : ex
  const accentColor = displayEx?.color || '#ff3cac'
  const catColor = CAT_COLOR[displayEx?.cat] || '#fff'

  const toggleTheme = () => setDarkMode(d => !d)

  // ── Screens ─────────────────────────────────────────────────────────

  if (screen === 'welcome') return (
    <WelcomeScreen
      onStart={() => setScreen('workout')}
      darkMode={darkMode}
      onToggleTheme={toggleTheme}
    />
  )

  if (screen === 'finish') return (
    <div style={{ width: '100%', maxWidth: 480, padding: '0 16px', margin: '0 auto' }}>
      <FinishScreen
        onRestart={restartWorkout}
        onHome={goHome}
        exercisesDone={finishData?.exercises}
        elapsed={finishData?.elapsed}
      />
    </div>
  )

  // ── Workout ──────────────────────────────────────────────────────────

  return (
    <div
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      style={{
        width: '100%', maxWidth: 480, margin: '0 auto',
        height: '100svh', display: 'flex', flexDirection: 'column',
        overflow: 'hidden', padding: '0 0 env(safe-area-inset-bottom, 0px)'
      }}
    >

      {/* ── Header ───────────────────────────────────────────────── */}
      <div style={{
        padding: '6px 10px',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0
      }}>
        <button onClick={goHome} style={{
          background: 'none', border: 'none', color: 'var(--text3)',
          fontSize: 18, padding: '4px 6px', borderRadius: 8
        }}>←</button>

        <h1 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 20, letterSpacing: 4, lineHeight: 1,
          background: `linear-gradient(90deg, ${accentColor} 0%, #f9f002 100%)`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
        }}>
          HOCKEY WORKOUT — ADÈLE
        </h1>

        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <SpotifyButton size="compact" />
          <button onClick={toggleTheme} style={{
            width: 32, height: 32, borderRadius: 999, flexShrink: 0,
            background: 'var(--surface2)', border: '1px solid var(--border2)',
            color: 'var(--text)', fontSize: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </div>

      {/* ── Progress bar ─────────────────────────────────────────── */}
      <div style={{ padding: '5px 12px 0', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text4)', marginBottom: 3 }}>
          <span>Ex. {curEx + 1} / {EXERCISES.length}</span>
          <span>{totalPct}%</span>
        </div>
        <div style={{ height: 3, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 2,
            background: `linear-gradient(90deg, ${accentColor}, #f9f002)`,
            width: `${totalPct}%`, transition: 'width 0.5s'
          }} />
        </div>
      </div>

      {/* ── Timer + Stats ─────────────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '6px 12px', flexShrink: 0
      }}>
        <TimerRing
          size={110}
          timeLeft={timeLeft}
          maxTime={isWork ? WORK : REST}
          isWork={isWork}
          color={accentColor}
        />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
          {[
            { val: curEx, lbl: 'complétés' },
            { val: EXERCISES.length - curEx, lbl: 'restants' },
            { val: `${remMin}:${String(remSec).padStart(2,'0')}`, lbl: 'temps restant' },
          ].map(({ val, lbl }) => (
            <div key={lbl} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 8, padding: '4px 10px'
            }}>
              <span style={{ fontSize: 10, color: 'var(--text4)', letterSpacing: 1 }}>{lbl}</span>
              <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 20, lineHeight: 1, color: accentColor }}>{val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Exercise card ─────────────────────────────────────────── */}
      <div style={{ flex: 1, minHeight: 0, padding: '0 10px', overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          background: 'var(--surface)',
          border: `1px solid ${accentColor}33`,
          borderRadius: 14, overflow: 'hidden',
          display: 'flex', flexDirection: 'column'
        }}>
          <div style={{ height: 3, background: `linear-gradient(90deg, ${accentColor}, transparent)`, flexShrink: 0 }} />

          <div style={{ padding: '8px 12px 6px', flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
            {/* Label repos */}
            {!isWork && nextEx && (
              <div style={{
                fontSize: 9, letterSpacing: 2, color: '#39ff14',
                marginBottom: 4, fontFamily: "'Bebas Neue',sans-serif", flexShrink: 0
              }}>▶ PROCHAIN EXERCICE</div>
            )}

            {/* Nom + catégorie */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 4, gap: 8, flexShrink: 0 }}>
              <h2 style={{
                fontFamily: "'Bebas Neue',sans-serif",
                fontSize: 19, letterSpacing: 1.2, lineHeight: 1.1,
                color: 'var(--text)', flex: 1
              }}>
                {displayEx.name}
              </h2>
              <span style={{
                fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 999,
                background: `${catColor}18`, color: catColor,
                border: `1px solid ${catColor}33`, letterSpacing: 1, whiteSpace: 'nowrap'
              }}>
                {CAT_LABEL[displayEx.cat]}
              </span>
            </div>

            {/* Description */}
            <p style={{
              fontSize: 11.5, lineHeight: 1.45,
              color: 'var(--text2)', marginBottom: 6, flexShrink: 0
            }}>
              {displayEx.desc}
            </p>

            {/* Animation */}
            <div style={{
              flex: 1, minHeight: 0,
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 8, padding: '4px 6px',
              display: 'flex', alignItems: 'center'
            }}>
              <StickFigure animType={displayEx.anim} accentColor={accentColor} isPlaying={playing} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Controls ──────────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 8, padding: '6px 10px 8px', flexShrink: 0 }}>
        <button
          onClick={skipPrev}
          aria-label="Précédent"
          style={{
            width: 46, height: 46, borderRadius: 999,
            background: 'var(--surface2)',
            border: '1px solid var(--border2)',
            color: 'var(--text2)', fontSize: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
        >⏮</button>

        <button
          onClick={togglePlay}
          style={{
            flex: 1, height: 46, borderRadius: 999,
            background: playing
              ? 'rgba(249,240,2,0.12)'
              : `linear-gradient(135deg, ${accentColor} 0%, #b44aff 100%)`,
            border: playing ? '1px solid #f9f002' : 'none',
            color: playing ? '#f9f002' : '#fff',
            fontFamily: "'Bebas Neue',sans-serif",
            fontSize: 20, letterSpacing: 3,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
          }}
        >
          {playing ? '⏸ PAUSE' : '▶ DÉMARRER'}
        </button>

        <button
          onClick={skipNext}
          aria-label="Suivant"
          style={{
            width: 52, height: 52, borderRadius: 999,
            background: 'var(--surface2)',
            border: '1px solid var(--border2)',
            color: 'var(--text2)', fontSize: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
        >⏭</button>
      </div>

    </div>
  )
}
