// src/screens/ShedScreen.jsx
import { useState } from 'react'
import { Plus, ChevronRight } from 'lucide-react'
import { C, hlt } from '../theme.js'
import { HealthBadge } from '../components/atoms.jsx'
import { MY_TOOLS } from '../data/index.js'

export default function ShedScreen() {
  const [exp, setExp] = useState(null)
  return (
    <div style={{ flex:1, overflowY:'auto', background:C.bg }}>
      <div style={{ background:C.card, padding:'8px 16px 14px', borderBottom:`1px solid ${C.brd}` }}>
        <div style={{ fontSize:22, fontWeight:800, color:C.t1, letterSpacing:'-0.4px', marginBottom:2 }}>My Shed</div>
        <div style={{ fontSize:13, color:C.t2 }}>4 tools · 2 groups</div>
        <div style={{ display:'flex', gap:10, marginTop:12 }}>
          {[{ v:'38', l:'Loans out' }, { v:'$420', l:'Earned' }, { v:'#3', l:'HOA Rank' }].map((s, i) => (
            <div key={i} style={{ flex:1, background:C.cardAlt, borderRadius:12, padding:'10px 8px', textAlign:'center', border:`1px solid ${C.brd}` }}>
              <div style={{ fontWeight:800, fontSize:18, color:C.t1 }}>{s.v}</div>
              <div style={{ fontSize:10, color:C.t2, marginTop:1, fontWeight:500 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding:'14px 14px 24px' }}>
        <button style={{ width:'100%', background:C.card, border:`1.5px dashed ${C.blue}`, borderRadius:14, padding:'13px 0', display:'flex', alignItems:'center', justifyContent:'center', gap:8, marginBottom:14, cursor:'pointer', boxShadow:C.sh }}>
          <Plus size={16} color={C.blue} strokeWidth={2}/><span style={{ color:C.blue, fontWeight:700, fontSize:14 }}>Add a Tool</span>
        </button>
        {MY_TOOLS.map((t, i) => {
          const h = hlt(t.h), I = t.icon
          return (
            <div key={i} style={{ background:C.card, borderRadius:16, marginBottom:10, overflow:'hidden', boxShadow:C.sh, border:`1px solid ${t.maint ? `${C.orange}44` : C.brd}` }}>
              <div onClick={() => setExp(exp === i ? null : i)} className="tp" style={{ padding:14, display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:48, height:48, borderRadius:14, background:`${t.color}15`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <I size={22} color={t.color} strokeWidth={1.5}/>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, fontSize:14, color:C.t1 }}>{t.name}</div>
                  <div style={{ fontSize:11, color:C.t2, marginTop:2 }}>{t.badge} · {t.loans} loans</div>
                  <div style={{ display:'flex', gap:6, marginTop:5, alignItems:'center' }}>
                    <HealthBadge pct={t.h}/>
                    {t.maint && <span style={{ fontSize:10, fontWeight:700, color:C.orange }}>Service due</span>}
                    {t.ghost && <span style={{ fontSize:10, fontWeight:600, color:C.blue }}>Private link</span>}
                  </div>
                </div>
                <ChevronRight size={16} color={C.t3} style={{ transform:exp === i ? 'rotate(90deg)' : 'none', transition:'transform .2s' }}/>
              </div>
              {exp === i && (
                <div style={{ borderTop:`1px solid ${C.brd}`, padding:'14px 16px', background:C.cardAlt }}>
                  <div style={{ marginBottom:12 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                      <span style={{ fontSize:12, color:C.t2 }}>Usage: {t.hrs}h of {t.max}h</span>
                      <span style={{ fontSize:12, fontWeight:600, color:h.c }}>{Math.round((t.hrs / t.max) * 100)}%</span>
                    </div>
                    <div style={{ height:5, background:C.brd, borderRadius:3, overflow:'hidden' }}>
                      <div style={{ height:'100%', width:`${(t.hrs / t.max) * 100}%`, background:t.maint ? C.orange : h.c, borderRadius:3 }}/>
                    </div>
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                    {[['Loans', ''+t.loans], ['Last service', '12 days'], ['Avg rating', '4.8 ★'], ['Next service', t.maint ? 'Now!' : '18h']].map(([l, v], j) => (
                      <div key={j} style={{ background:C.card, borderRadius:10, padding:'9px 11px', border:`1px solid ${C.brd}` }}>
                        <div style={{ fontSize:10, color:C.t3, fontWeight:500 }}>{l}</div>
                        <div style={{ fontSize:14, fontWeight:700, color:j === 3 && t.maint ? C.orange : C.t1, marginTop:3 }}>{v}</div>
                      </div>
                    ))}
                  </div>
                  {t.maint && <button style={{ marginTop:12, width:'100%', background:C.orange, border:'none', color:'white', borderRadius:10, padding:'10px 0', fontWeight:700, fontSize:13, cursor:'pointer' }}>Find Service — Sponsored by Ace Hardware</button>}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
