import React, { useEffect, useRef } from 'react'

const PUCK = '#00f5ff'
const BRIDGE = '#39ff14'
const STICK = '#aaaacc'
const ARROW = '#f9f002'

function drawFrame(svg, type, frame, accentColor) {
  if (!svg) return
  const t = (frame % 60) / 60
  const s = Math.sin(t * Math.PI * 2)
  const a = Math.abs(s)

  const body = '#e8e8ff'
  const joint = '#c0c0e8'
  const W = 280, H = 120
  const CX = 80, CY = 10

  // ── Enhanced body parts ────────────────────────────────────────────

  const head = (cx, cy) =>
    // Helmet arc + face circle
    `<circle cx="${cx}" cy="${cy+8}" r="8.5" fill="none" stroke="${body}" stroke-width="2.5"/>` +
    `<path d="M${cx-7.5},${cy+4} Q${cx},${cy-5} ${cx+7.5},${cy+4}" fill="none" stroke="${accentColor}" stroke-width="3" stroke-linecap="round"/>` +
    `<line x1="${cx-7.5}" y1="${cy+4}" x2="${cx+7.5}" y2="${cy+4}" stroke="${accentColor}" stroke-width="1.5" opacity="0.5"/>`

  const torso = (cx, cy) =>
    // Spine + shoulder bar
    `<line x1="${cx}" y1="${cy+16}" x2="${cx}" y2="${cy+34}" stroke="${body}" stroke-width="3" stroke-linecap="round"/>` +
    `<line x1="${cx-12}" y1="${cy+19}" x2="${cx+12}" y2="${cy+19}" stroke="${body}" stroke-width="2" stroke-linecap="round" opacity="0.55"/>`

  const armL = (cx, cy, a2 = 25) => {
    const r = a2 * Math.PI / 180
    const ex = cx - 11, ey = cy + 25
    const hx = cx - 18, hy = cy + 21 + Math.sin(r) * 9
    return `<line x1="${cx}" y1="${cy+19}" x2="${ex}" y2="${ey}" stroke="${body}" stroke-width="2.2" stroke-linecap="round"/>` +
           `<circle cx="${ex}" cy="${ey}" r="2" fill="${joint}"/>` +
           `<line x1="${ex}" y1="${ey}" x2="${hx}" y2="${hy}" stroke="${body}" stroke-width="2" stroke-linecap="round"/>`
  }

  const armR = (cx, cy, a2 = 25) => {
    const r = a2 * Math.PI / 180
    const ex = cx + 11, ey = cy + 25
    const hx = cx + 18, hy = cy + 21 - Math.sin(r) * 9
    return `<line x1="${cx}" y1="${cy+19}" x2="${ex}" y2="${ey}" stroke="${body}" stroke-width="2.2" stroke-linecap="round"/>` +
           `<circle cx="${ex}" cy="${ey}" r="2" fill="${joint}"/>` +
           `<line x1="${ex}" y1="${ey}" x2="${hx}" y2="${hy}" stroke="${body}" stroke-width="2" stroke-linecap="round"/>`
  }

  const legL = (cx, cy, sp = 11) => {
    const kx = cx - sp * 0.5, ky = cy + 46
    const fx = cx - sp, fy = cy + 60
    return `<line x1="${cx}" y1="${cy+34}" x2="${kx}" y2="${ky}" stroke="${body}" stroke-width="2.8" stroke-linecap="round"/>` +
           `<circle cx="${kx}" cy="${ky}" r="2.5" fill="${joint}"/>` +
           `<line x1="${kx}" y1="${ky}" x2="${fx}" y2="${fy}" stroke="${body}" stroke-width="2.5" stroke-linecap="round"/>`
  }

  const legR = (cx, cy, sp = 11) => {
    const kx = cx + sp * 0.5, ky = cy + 46
    const fx = cx + sp, fy = cy + 60
    return `<line x1="${cx}" y1="${cy+34}" x2="${kx}" y2="${ky}" stroke="${body}" stroke-width="2.8" stroke-linecap="round"/>` +
           `<circle cx="${kx}" cy="${ky}" r="2.5" fill="${joint}"/>` +
           `<line x1="${kx}" y1="${ky}" x2="${fx}" y2="${fy}" stroke="${body}" stroke-width="2.5" stroke-linecap="round"/>`
  }

  const boots = (cx, cy, sp = 11) => {
    const lx = cx - sp, rx = cx + sp, by = cy + 60
    return `<line x1="${lx-7}" y1="${by}" x2="${lx+7}" y2="${by}" stroke="${accentColor}" stroke-width="3.5" stroke-linecap="round"/>` +
           `<line x1="${lx-5}" y1="${by-1}" x2="${lx+5}" y2="${by-1}" stroke="rgba(255,255,255,0.25)" stroke-width="1.2"/>` +
           `<line x1="${rx-7}" y1="${by}" x2="${rx+7}" y2="${by}" stroke="${accentColor}" stroke-width="3.5" stroke-linecap="round"/>` +
           `<line x1="${rx-5}" y1="${by-1}" x2="${rx+5}" y2="${by-1}" stroke="rgba(255,255,255,0.25)" stroke-width="1.2"/>`
  }

  const stickR = (cx, cy, angle = 15) => {
    const r = angle * Math.PI / 180
    const sx = cx + 18, sy = cy + 21
    const ex = cx + Math.cos(r) * 40, ey = cy + Math.sin(r) * 15
    return `<line x1="${sx}" y1="${sy}" x2="${ex}" y2="${ey}" stroke="${STICK}" stroke-width="3" stroke-linecap="round"/>` +
           `<line x1="${ex-6}" y1="${ey-2}" x2="${ex+10}" y2="${ey+6}" stroke="${STICK}" stroke-width="3.5" stroke-linecap="round"/>`
  }

  const stickL = (cx, cy, angle = 165) => {
    const r = angle * Math.PI / 180
    const sx = cx - 18, sy = cy + 21
    const ex = cx + Math.cos(r) * 40, ey = cy + Math.sin(r) * 15
    return `<line x1="${sx}" y1="${sy}" x2="${ex}" y2="${ey}" stroke="${STICK}" stroke-width="3" stroke-linecap="round"/>` +
           `<line x1="${ex-8}" y1="${ey+4}" x2="${ex+5}" y2="${ey-3}" stroke="${STICK}" stroke-width="3.5" stroke-linecap="round"/>`
  }

  const puck = (px, py, rx = 6) =>
    `<ellipse cx="${px}" cy="${py}" rx="${rx}" ry="${Math.round(rx * 0.5)}" fill="${PUCK}"/>` +
    `<ellipse cx="${px}" cy="${py-1}" rx="${rx-1}" ry="${Math.round((rx-1)*0.4)}" fill="rgba(255,255,255,0.25)"/>`

  const bridge = (bx, by, w = 52, h = 18) =>
    `<rect x="${bx}" y="${by}" width="${w}" height="${h}" rx="4" fill="rgba(57,255,20,0.08)" stroke="${BRIDGE}" stroke-width="2.5"/>` +
    `<line x1="${bx+12}" y1="${by+h}" x2="${bx+9}" y2="${by+h+9}" stroke="${BRIDGE}" stroke-width="2"/>` +
    `<line x1="${bx+w-12}" y1="${by+h}" x2="${bx+w-9}" y2="${by+h+9}" stroke="${BRIDGE}" stroke-width="2"/>` +
    `<text x="${bx+w/2}" y="${by+h*0.7}" text-anchor="middle" font-size="8" fill="${BRIDGE}" font-family="Inter,sans-serif" font-weight="700" letter-spacing="1">PONT</text>`

  const arrow = (x1, y1, x2, y2) => {
    const dx = x2-x1, dy = y2-y1, len = Math.sqrt(dx*dx+dy*dy)
    const ux = dx/len, uy = dy/len
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${ARROW}" stroke-width="1.5" stroke-dasharray="5 3" opacity="0.6"/>` +
           `<polygon points="${x2},${y2} ${x2-ux*7-uy*4},${y2-uy*7+ux*4} ${x2-ux*7+uy*4},${y2-uy*7-ux*4}" fill="${ARROW}" opacity="0.6"/>`
  }

  const fig = (cx = CX, cy = CY, sp = 11, ar = 25) =>
    head(cx, cy) + torso(cx, cy) +
    armL(cx, cy, ar) + armR(cx, cy, ar) +
    legL(cx, cy, sp) + legR(cx, cy, sp) +
    boots(cx, cy, sp)

  const floor = `<line x1="20" y1="${CY+64}" x2="${W-20}" y2="${CY+64}" stroke="rgba(255,255,255,0.06)" stroke-width="1.5"/>`
  const shadow = (cx, cy = CY+65) => `<ellipse cx="${cx}" cy="${cy}" rx="22" ry="5" fill="rgba(0,0,200,0.1)"/>`

  let c = floor + shadow(CX)

  if (type === 'figure8') {
    const px = 175 + s * 28, py = CY + 54 + Math.sin(t * Math.PI * 2 + 1) * (-7)
    const path8 = `<path d="M152,${CY+56} Q168,${CY+40} 184,${CY+56} Q200,${CY+72} 184,${CY+56}" fill="none" stroke="${PUCK}" stroke-width="1" stroke-dasharray="4 3" opacity="0.25"/>`
    c += path8 + fig() + stickR(CX, CY, 14) + puck(px, py)
  } else if (type === 'bridge_lateral') {
    const px = 178 + s * 26
    c += bridge(158, CY + 26, 52) + fig() + stickR(CX, CY, 16) + puck(px, CY + 64) + arrow(160, CY + 78, 210, CY + 78)
  } else if (type === 'frontback') {
    const py = CY + 52 + s * 14
    c += fig() + stickR(CX, CY, 14) + puck(172, py) + arrow(172, CY + 42, 172, CY + 66)
  } else if (type === 'slalom') {
    const px = 165 + s * 24
    c += bridge(150, CY + 16, 46) + bridge(182, CY + 36, 46)
    c += `<path d="M158,${CY+80} Q170,${CY+56} 182,${CY+70} Q194,${CY+84} 208,${CY+70}" fill="none" stroke="${PUCK}" stroke-width="1" stroke-dasharray="4 2" opacity="0.3"/>`
    c += fig() + stickR(CX, CY, 16) + puck(px, CY + 78)
  } else if (type === 'crossover') {
    const px = 175 + s * 22, py = CY + 54 + a * (-5)
    c += fig() + stickR(CX, CY, 20) + puck(px, py) + arrow(158, CY + 63, 196, CY + 53) + arrow(196, CY + 53, 158, CY + 63)
  } else if (type === 'chasse_front') {
    const xo = Math.round(s * 14)
    c += shadow(CX + xo) + fig(CX + xo, CY, 11, 14) + stickR(CX + xo, CY, 12) + puck(172, CY + 54) + arrow(100, CY + 76, 135, CY + 76)
  } else if (type === 'bridge_left') {
    const px = 158 + a * 22
    c += bridge(150, CY + 26, 50) + fig() + stickR(CX, CY, 15) + puck(px, CY + 64) + arrow(152, CY + 78, 198, CY + 78)
  } else if (type === 'bridge_right') {
    const px = 198 - a * 22
    c += bridge(158, CY + 26, 50) + fig() + stickR(CX, CY, 15) + puck(px, CY + 64) + arrow(196, CY + 78, 150, CY + 78)
  } else if (type === 'lateral_move') {
    const xo = Math.round(s * 16)
    c += shadow(CX + xo) + fig(CX + xo, CY, 11, 18) + stickR(CX + xo, CY, 15) + puck(175, CY + 54) + arrow(100, CY + 78, 138, CY + 78)
  } else if (type === 'behind_back') {
    const px = CX + 6 + s * 16, py = CY + 44
    c += fig(CX, CY, 11, -18) + stickL(CX, CY, 172) + puck(px, py)
  } else if (type === 'bridge_cross') {
    const xo = Math.round(s * 9), px = 170 + a * 18
    c += bridge(152, CY + 26, 48) + shadow(CX + xo) + fig(CX + xo, CY, 13, 18) + stickR(CX + xo, CY, 15) + puck(px, CY + 64)
  } else if (type === 'rapid_dribble') {
    const py = CY + 48 + a * 18
    const dots = [0,1,2].map(i => `<ellipse cx="170" cy="${CY+42+i*9}" rx="3.5" ry="2" fill="${PUCK}" opacity="${0.12+i*0.12}"/>`).join('')
    c += dots + fig() + stickR(CX, CY, 14) + puck(170, py)
  } else if (type === 'lateral_jump') {
    const xo = Math.round(s * 18), yo = a * 13
    c += fig(CX + xo, CY - yo, 14, 12) + stickR(CX + xo, CY - yo, 12) + puck(174, CY + 54)
  } else if (type === 'bridge_turn') {
    const xo = Math.round(s * 11), ang = 14 + s * 14
    const pivotArc = `<path d="M130,${CY+66} Q155,${CY+46} 178,${CY+66}" fill="none" stroke="${ARROW}" stroke-width="1.5" stroke-dasharray="4 2" opacity="0.5"/>`
    c += bridge(150, CY + 26, 48) + pivotArc + fig(CX, CY, 9 + a * 6, 18) + stickR(CX, CY, ang) + puck(166 + xo, CY + 63)
  } else if (type === 'bridge_back') {
    const px = 168 + s * 18
    c += bridge(150, CY + 26, 50) + fig(CX, CY, 11, -14) + stickL(CX, CY, 168) + puck(px, CY + 64)
  } else if (type === 'slalom_cross') {
    const xo = Math.round(s * 9), px = 165 + s * 22
    c += bridge(146, CY + 14, 44) + bridge(178, CY + 34, 44) + shadow(CX + xo)
    c += fig(CX + xo, CY, 13, 16) + stickR(CX + xo, CY, 15) + puck(px, CY + 78)
  } else if (type === 'backward_lateral') {
    const xo = Math.round(s * 16)
    c += shadow(CX + xo) + fig(CX + xo, CY, 11, -12) + stickL(CX + xo, CY, 170) + puck(174, CY + 54) + arrow(135, CY + 76, 97, CY + 76)
  } else if (type === 'jump_frontback') {
    const xo = Math.round(s * 7), yo = a * 13
    c += fig(CX + xo, CY - yo, 11, 20) + stickR(CX + xo, CY - yo, 14) + puck(172, CY + 54) + arrow(172, CY + 46, 172, CY + 62)
  } else if (type === 'chasse_side') {
    const xo = Math.round(s * 13)
    c += shadow(CX + xo) + fig(CX + xo, CY, 11, 38) + stickR(CX + xo, CY, 28) + puck(CX + xo + 38 + s * 9, CY + 54)
  } else if (type === 'circular') {
    const angle = t * Math.PI * 2
    const px = 175 + Math.cos(angle) * 28, py = CY + 56 + Math.sin(angle) * 12
    c += `<ellipse cx="175" cy="${CY+56}" rx="28" ry="12" fill="none" stroke="${PUCK}" stroke-width="1" stroke-dasharray="5 2" opacity="0.25"/>`
    c += fig() + stickR(CX, CY, 14 + s * 16) + puck(px, py)
  } else {
    c += fig() + stickR(CX, CY, 14) + puck(172, CY + 54)
  }

  svg.innerHTML = c
}

export default function StickFigure({ animType, accentColor, isPlaying }) {
  const svgRef = useRef(null)
  const frameRef = useRef(0)
  const timerRef = useRef(null)

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    frameRef.current = 0
    drawFrame(svgRef.current, animType, 0, accentColor)
    timerRef.current = setInterval(() => {
      if (isPlaying) frameRef.current++
      drawFrame(svgRef.current, animType, frameRef.current, accentColor)
    }, 75)
    return () => clearInterval(timerRef.current)
  }, [animType, accentColor, isPlaying])

  return (
    <svg
      ref={svgRef}
      width="280"
      height="110"
      viewBox="0 0 280 110"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', width: '100%', height: 'auto' }}
    />
  )
}
