// src/components/atoms.jsx
// Reusable atomic components — OpenShed design system

import { ChevronRight } from 'lucide-react'
import { C, hlt } from '../theme.js'

// ── Trust Score Ring ──────────────────────────────────────────────────────────
export function TrustRing({ score = 73, size = 84, stroke = 6 }) {
  const r = (size - stroke * 2) / 2
  const ci = 2 * Math.PI * r
  const of = ci * (1 - score / 100)
  const lv = score >= 91 ? 'Pillar' : score >= 71 ? 'Trusted Pro' : score >= 31 ? 'Neighbor' : 'Newcomer'
  return (
    <div style={{ position:'relative', width:size, height:size, flexShrink:0 }}>
      <svg width={size} height={size} style={{ position:'absolute', transform:'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(0,0,0,.08)" strokeWidth={stroke}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.orange} strokeWidth={stroke}
          strokeDasharray={ci} strokeDashoffset={of} strokeLinecap="round"/>
      </svg>
      <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
        <span style={{ color:C.t1, fontSize:size>110?32:size>84?21:16, fontWeight:800, lineHeight:1 }}>{score}</span>
        <span style={{ color:C.t2, fontSize:size>100?9:7, marginTop:2, fontWeight:600, textAlign:'center' }}>{lv.toUpperCase()}</span>
      </div>
    </div>
  )
}

// ── Health Badge ──────────────────────────────────────────────────────────────
export function HealthBadge({ pct }) {
  const h = hlt(pct)
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:4, background:h.bg, border:`1px solid ${h.c}33`, borderRadius:20, padding:'3px 9px' }}>
      <span style={{ width:6, height:6, borderRadius:3, background:h.c, display:'block', flexShrink:0 }}/>
      <span style={{ fontSize:10, fontWeight:700, color:h.c }}>{h.l}</span>
    </span>
  )
}

// ── Tool Photo Placeholder ─────────────────────────────────────────────────────
export function ToolPhoto({ tool, height = 110 }) {
  const Icon = tool.icon
  return (
    <div style={{ height, background:`linear-gradient(135deg,${tool.color}10,${tool.color}20)`, display:'flex', alignItems:'center', justifyContent:'center', position:'relative', flexShrink:0 }}>
      <div style={{ width:58, height:58, borderRadius:18, background:C.card, boxShadow:`0 4px 16px ${tool.color}30`, display:'flex', alignItems:'center', justifyContent:'center' }}>
        <Icon size={28} color={tool.color} strokeWidth={1.5}/>
      </div>
      {tool.health && (
        <div style={{ position:'absolute', top:8, right:8 }}><HealthBadge pct={tool.health}/></div>
      )}
      {tool.sponsored && (
        <div style={{ position:'absolute', top:8, left:8, background:'rgba(255,255,255,.9)', borderRadius:10, padding:'3px 8px' }}>
          <span style={{ fontSize:9, fontWeight:700, color:C.t2 }}>Sponsored</span>
        </div>
      )}
    </div>
  )
}

// ── Category / Filter Chip ────────────────────────────────────────────────────
export function Chip({ children, active, onPress }) {
  return (
    <span onClick={onPress} style={{ display:'inline-flex', alignItems:'center', gap:5, background:active?C.blue:C.card, color:active?'white':C.t1, border:`1px solid ${active?C.blue:C.brdM}`, fontSize:12, fontWeight:600, padding:'6px 14px', borderRadius:20, whiteSpace:'nowrap', flexShrink:0, boxShadow:active?'none':C.sh, cursor:'pointer', WebkitTapHighlightColor:'transparent' }}>
      {children}
    </span>
  )
}

// ── Section Label ─────────────────────────────────────────────────────────────
export function SectionLabel({ children }) {
  return (
    <div style={{ fontSize:11, fontWeight:700, color:C.t2, letterSpacing:'0.6px', padding:'18px 16px 6px', textTransform:'uppercase' }}>
      {children}
    </div>
  )
}

// ── Settings List Row ─────────────────────────────────────────────────────────
export function Row({ icon: Icon, label, value, sub, onPress, iconBg, iconColor, right, noBorder }) {
  return (
    <div onClick={onPress} style={{ display:'flex', alignItems:'center', gap:14, padding:'12px 16px', borderBottom:noBorder?undefined:`1px solid ${C.brd}`, background:C.card, cursor:onPress?'pointer':'default', WebkitTapHighlightColor:'transparent' }}>
      {Icon && (
        <div style={{ width:34, height:34, borderRadius:10, background:iconBg||C.blueL, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <Icon size={17} color={iconColor||C.blue} strokeWidth={1.5}/>
        </div>
      )}
      <div style={{ flex:1 }}>
        <div style={{ fontSize:15, fontWeight:500, color:C.t1 }}>{label}</div>
        {sub && <div style={{ fontSize:12, color:C.t2, marginTop:1 }}>{sub}</div>}
      </div>
      {right || (onPress && <ChevronRight size={16} color={C.t3}/>)}
    </div>
  )
}

// ── Global CSS Animations ──────────────────────────────────────────────────────
export function GlobalStyles() {
  return (
    <style>{`
      @keyframes pO{0%,100%{box-shadow:0 0 0 0 rgba(255,149,0,.35)}60%{box-shadow:0 0 0 12px rgba(255,149,0,0)}}
      @keyframes pR{0%,100%{box-shadow:0 0 0 0 rgba(255,59,48,.4)}60%{box-shadow:0 0 0 10px rgba(255,59,48,0)}}
      @keyframes bk{0%,100%{opacity:1}50%{opacity:.3}}
      @keyframes fu{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}
      .og{animation:pO 3s ease-in-out infinite;border-radius:50%}
      .rg{animation:pR 2s ease-in-out infinite}
      .bl{animation:bk 1.5s ease-in-out infinite}
      .au{animation:fu .18s ease forwards}
      .tp{cursor:pointer;-webkit-tap-highlight-color:transparent}
      .tp:active{opacity:.65}
    `}</style>
  )
}
