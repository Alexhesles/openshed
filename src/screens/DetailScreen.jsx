// src/screens/DetailScreen.jsx
import { useState } from 'react'
import { ArrowLeft, User, Star, Shield, Camera, ChevronRight, CheckCircle, Award } from 'lucide-react'
import { C, hlt } from '../theme.js'
import { HealthBadge, ToolPhoto, SectionLabel } from '../components/atoms.jsx'
import { CONSUMABLES } from '../data/index.js'

export default function DetailScreen({ tool, onBack, goPhoto }) {
  const [qty, setQty] = useState([0, 0, 0, 0])
  const [waiver, setWaiver] = useState(false)

  const h = hlt(tool.health || 72)
  const base = tool.price === 'Free' ? 0 : 15
  const consTotal = CONSUMABLES.reduce((s, c, i) => s + c.price * qty[i], 0)
  const total = base + consTotal
  const adj = (i, d) => setQty(q => { const n = [...q]; n[i] = Math.max(0, n[i] + d); return n })

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflowY:'auto', background:C.bg }}>
      {/* Hero image area */}
      <div style={{ position:'relative', flexShrink:0 }}>
        <ToolPhoto tool={tool} height={200}/>
        <button onClick={onBack} className="tp" style={{ position:'absolute', top:12, left:12, background:'rgba(255,255,255,.9)', backdropFilter:'blur(10px)', border:`1px solid ${C.brd}`, borderRadius:20, padding:'7px 14px', display:'flex', alignItems:'center', gap:6 }}>
          <ArrowLeft size={13} color={C.t1}/><span style={{ fontSize:12, fontWeight:600, color:C.t1 }}>Back</span>
        </button>
        <div style={{ position:'absolute', bottom:12, right:12, background:'rgba(255,255,255,.92)', backdropFilter:'blur(8px)', borderRadius:10, padding:'5px 12px' }}>
          <span style={{ fontSize:11, fontWeight:700, color:C.green }}>No Deposit Required</span>
        </div>
      </div>

      <div style={{ padding:16 }}>
        {/* Title */}
        <div style={{ fontSize:22, fontWeight:800, color:C.t1, letterSpacing:'-0.4px' }}>{tool.name}</div>
        <div style={{ fontSize:14, color:C.t2, marginTop:2 }}>{tool.brand} · {tool.dist} away</div>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:8 }}>
          {tool.health && <HealthBadge pct={tool.health}/>}
          {tool.swap && <span style={{ background:C.purpleL, border:`1px solid ${C.purple}33`, borderRadius:20, padding:'3px 9px', fontSize:10, fontWeight:700, color:C.purple }}>Skill Swap</span>}
        </div>

        {/* Owner card */}
        <div style={{ display:'flex', alignItems:'center', gap:12, marginTop:14, padding:14, background:C.card, borderRadius:14, boxShadow:C.sh, border:`1px solid ${C.brd}` }}>
          <div style={{ width:44, height:44, borderRadius:22, background:C.blueL, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <User size={20} color={C.blue} strokeWidth={1.5}/>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:600, fontSize:14, color:C.t1 }}>{tool.lender}</div>
            <div style={{ display:'flex', alignItems:'center', gap:4, marginTop:2 }}>
              <Star size={11} color={C.orange} fill={C.orange}/>
              <span style={{ fontSize:12, color:C.t2 }}>4.9 · 34 loans · responds in &lt;30 min</span>
            </div>
          </div>
          <div style={{ textAlign:'center' }}>
            <div style={{ fontSize:20, fontWeight:800, color:C.orange }}>{tool.ls}</div>
            <div style={{ fontSize:9, color:C.t2, fontWeight:600 }}>TRUST</div>
          </div>
        </div>

        {/* Health detail */}
        <div style={{ marginTop:12, background:C.card, borderRadius:14, padding:14, boxShadow:C.sh, border:`1px solid ${C.brd}` }}>
          <div style={{ fontWeight:700, fontSize:14, color:C.t1, marginBottom:12 }}>Tool Condition</div>
          {[
            { l:'Overall condition',  v:h.l,              c:h.c,      bar:tool.health||72 },
            { l:'Usage this cycle',   v:'46h / 80h',      c:C.t2,     bar:57 },
            { l:'Last serviced',      v:'12 days ago',    c:C.green,  bar:null },
            { l:'Borrower rating',    v:'4.9 ★ (34 loans)',c:C.orange,bar:null },
          ].map((row, i) => (
            <div key={i} style={{ marginBottom:i < 2 ? 10 : 6 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:row.bar ? 5 : 0 }}>
                <span style={{ fontSize:12, color:C.t2 }}>{row.l}</span>
                <span style={{ fontSize:12, fontWeight:600, color:row.c }}>{row.v}</span>
              </div>
              {row.bar && (
                <div style={{ height:4, background:C.bg, borderRadius:2, overflow:'hidden' }}>
                  <div style={{ height:'100%', width:`${row.bar}%`, background:`linear-gradient(90deg,${h.c},${h.c}88)`, borderRadius:2 }}/>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Consumables shop */}
        <SectionLabel>Add-on Supplies</SectionLabel>
        <div style={{ fontSize:11, color:C.orange, fontWeight:600, padding:'0 16px 8px', display:'flex', alignItems:'center', gap:4 }}>
          <Award size={12} color={C.orange}/> Sponsored by Ace Hardware & Home Depot
        </div>
        <div style={{ display:'flex', gap:10, overflowX:'auto', padding:'0 14px 4px' }}>
          {CONSUMABLES.map((c, i) => (
            <div key={c.id} style={{ flexShrink:0, width:136, background:C.card, border:`1.5px solid ${qty[i] > 0 ? C.blue : C.brd}`, borderRadius:14, padding:'12px 12px', boxShadow:C.sh }}>
              <div style={{ width:36, height:36, borderRadius:10, background:`${c.color}15`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:8 }}>
                <c.icon size={18} color={c.color} strokeWidth={1.5}/>
              </div>
              <div style={{ fontWeight:600, fontSize:12, color:C.t1, lineHeight:1.3 }}>{c.name}</div>
              <div style={{ fontSize:10, color:C.t2, marginTop:2 }}>{c.unit} · {c.store}</div>
              {c.popular && <div style={{ fontSize:9, fontWeight:700, color:C.orange, marginTop:3 }}>Most popular</div>}
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:10 }}>
                <span style={{ fontWeight:800, fontSize:14, color:C.t1 }}>${c.price}</span>
                <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                  <button onClick={() => adj(i, -1)} style={{ width:24, height:24, borderRadius:8, background:C.bg, border:`1px solid ${C.brdM}`, color:C.t1, fontSize:15, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>−</button>
                  <span style={{ fontSize:13, fontWeight:700, color:qty[i] > 0 ? C.blue : C.t1, minWidth:14, textAlign:'center' }}>{qty[i]}</span>
                  <button onClick={() => adj(i, 1)} style={{ width:24, height:24, borderRadius:8, background:C.blue, border:'none', color:'white', fontSize:15, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>+</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Liability waiver */}
        <div style={{ marginTop:16, background:C.orangeL, borderRadius:14, padding:14, border:`1px solid ${C.orange}33` }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
            <Shield size={15} color={C.orange}/>
            <span style={{ fontWeight:700, fontSize:13, color:C.orange }}>Liability Waiver Required</span>
          </div>
          <div style={{ fontSize:12, color:C.t1, lineHeight:1.6, marginBottom:10 }}>
            Digitally sign to release <b>{tool.lender}</b> from liability. PDF archived with this loan.
          </div>
          {!waiver ? (
            <button onClick={() => setWaiver(true)} style={{ background:C.orange, color:'white', border:'none', borderRadius:10, padding:'11px 0', width:'100%', fontWeight:700, fontSize:13, cursor:'pointer' }}>
              Review & Sign Waiver →
            </button>
          ) : (
            <div style={{ display:'flex', alignItems:'center', gap:8, color:C.green }}>
              <CheckCircle size={15}/><span style={{ fontWeight:700, fontSize:13 }}>Signed · PDF sent to both parties</span>
            </div>
          )}
        </div>

        {/* Photo docs */}
        <div onClick={goPhoto} className="tp" style={{ marginTop:12, background:C.card, borderRadius:14, padding:14, display:'flex', alignItems:'center', gap:14, boxShadow:C.sh, border:`1px solid ${C.brd}` }}>
          <div style={{ width:44, height:44, borderRadius:12, background:C.blueL, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <Camera size={20} color={C.blue} strokeWidth={1.5}/>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:600, fontSize:14, color:C.t1 }}>Photo Documentation</div>
            <div style={{ fontSize:12, color:C.t2, marginTop:1 }}>Capture condition at pickup & return · auto-compare</div>
          </div>
          <ChevronRight size={16} color={C.t3}/>
        </div>
        <div style={{ height:100 }}/>
      </div>

      {/* Sticky footer */}
      <div style={{ position:'sticky', bottom:0, background:'rgba(255,255,255,.95)', backdropFilter:'blur(20px)', borderTop:`1px solid ${C.brd}`, padding:'12px 16px', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
        <div>
          <div style={{ fontSize:11, color:C.t2 }}>Total</div>
          <div style={{ fontWeight:800, fontSize:24, color:C.t1, lineHeight:1 }}>${total.toFixed(0)}<span style={{ fontSize:12, fontWeight:400, color:C.t2 }}> USD</span></div>
          <div style={{ fontSize:11, color:C.green, fontWeight:600 }}>No security deposit</div>
        </div>
        <button disabled={!waiver} style={{ background:waiver ? C.blue : '#C7C7CC', color:'white', border:'none', borderRadius:12, padding:'14px 24px', fontWeight:700, fontSize:15, cursor:waiver ? 'pointer' : 'not-allowed', minWidth:160, boxShadow:waiver ? `0 4px 16px ${C.blue}44` : 'none' }}>
          {waiver ? 'Request Loan →' : 'Sign Waiver First'}
        </button>
      </div>
    </div>
  )
}
