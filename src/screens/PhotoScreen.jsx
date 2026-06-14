// src/screens/PhotoScreen.jsx
import { useState, useRef } from 'react'
import { ArrowLeft, Camera, CheckCircle, Shield, Hammer, Award, Activity } from 'lucide-react'
import { C } from '../theme.js'
import { HealthBadge } from '../components/atoms.jsx'

const CONDS = [
  { id:'better', label:'Better than received',  color:'#34C759', Icon:Award     },
  { id:'same',   label:'Same condition',          color:'#007AFF', Icon:CheckCircle },
  { id:'minor',  label:'Minor scuffs / dirt',     color:'#FF9500', Icon:Activity  },
  { id:'damage', label:'Visible damage',           color:'#FF3B30', Icon:Shield    },
]

export default function PhotoScreen({ onBack, mode = 'pickup' }) {
  const [stage, setStage]  = useState('capture')
  const [photos, setPhotos] = useState([])
  const [cond, setCond]     = useState(null)
  const [split, setSplit]   = useState(50)
  const ref  = useRef(null)
  const drag = useRef(false)
  const NEED = 3
  const ANGLES = ['Front view', 'Left side', 'Mechanism / motor']

  const capture = () => {
    if (photos.length < NEED) setPhotos(p => [...p, { id:Date.now(), a:ANGLES[p.length] }])
  }

  const updateSplit = (cx) => {
    if (!ref.current) return
    const { left, width } = ref.current.getBoundingClientRect()
    setSplit(Math.max(18, Math.min(82, ((cx - left) / width) * 100)))
  }

  const C_BLUE   = '#007AFF'
  const C_ORANGE = '#FF9500'

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', background:'#F5F5F7' }}>
      {/* Header */}
      <div style={{ background:'#FFFFFF', padding:'8px 14px 16px', borderBottom:'1px solid rgba(60,60,67,.1)', flexShrink:0 }}>
        <button onClick={onBack} className="tp" style={{ background:'none', border:'none', color:C_BLUE, fontSize:14, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:4, padding:'2px 0 10px' }}>
          <ArrowLeft size={14}/><span>Back</span>
        </button>
        <div style={{ fontWeight:800, fontSize:20, color:'#1D1D1F', letterSpacing:'-0.3px' }}>
          {mode === 'pickup' ? 'Condition at Pickup' : 'Condition at Return'}
        </div>
        <div style={{ fontSize:13, color:'#6E6E73', marginTop:2 }}>
          {stage === 'capture' ? `Photo ${photos.length + 1} of ${NEED}` : stage === 'review' ? 'Confirm photos' : 'Before vs. After'}
        </div>
        {/* Progress */}
        <div style={{ display:'flex', gap:6, marginTop:12 }}>
          {['Capture', 'Review', 'Compare'].map((s, i) => {
            const active = (stage === 'capture' && i === 0) || (stage === 'review' && i === 1) || (stage === 'compare' && i === 2)
            const done   = (stage === 'review' && i === 0) || (stage === 'compare' && i <= 1)
            return (
              <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', gap:4, alignItems:'center' }}>
                <div style={{ width:'100%', height:3, borderRadius:2, background:active || done ? C_BLUE : '#F2F2F7' }}/>
                <span style={{ fontSize:9, fontWeight:600, color:active || done ? C_BLUE : '#AEAEB2' }}>{s.toUpperCase()}</span>
              </div>
            )
          })}
        </div>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:16 }}>

        {/* ── CAPTURE ── */}
        {stage === 'capture' && (
          <div>
            <div onClick={capture} className="tp" style={{ background:'#FFFFFF', border:`2px dashed ${photos.length >= NEED ? '#34C759' : 'rgba(60,60,67,.18)'}`, borderRadius:20, height:220, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:14, marginBottom:16, position:'relative', boxShadow:'0 1px 3px rgba(0,0,0,.07)' }}>
              {photos.length >= NEED ? (
                <>
                  <div style={{ width:64, height:64, borderRadius:20, background:'#E8F9ED', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <CheckCircle size={32} color="#34C759" strokeWidth={1.5}/>
                  </div>
                  <span style={{ fontWeight:700, fontSize:15, color:'#34C759' }}>3 photos captured</span>
                </>
              ) : (
                <>
                  <div style={{ width:64, height:64, borderRadius:20, background:'#EAF3FF', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <Camera size={30} color={C_BLUE} strokeWidth={1.5}/>
                  </div>
                  <div style={{ textAlign:'center', padding:'0 24px' }}>
                    <div style={{ fontWeight:600, fontSize:14, color:'#1D1D1F' }}>{ANGLES[photos.length]}</div>
                    <div style={{ fontSize:12, color:'#6E6E73', marginTop:4 }}>Tap to capture · Frame clearly</div>
                  </div>
                </>
              )}
              <div style={{ position:'absolute', bottom:10, left:14, background:'rgba(0,0,0,.55)', borderRadius:8, padding:'3px 8px' }}>
                <span style={{ color:'white', fontSize:9, fontWeight:600 }}>Jun 12 · 11:23 AM · GPS locked</span>
              </div>
            </div>

            {/* Thumbnails */}
            <div style={{ display:'flex', gap:10, marginBottom:20 }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ flex:1, height:76, background:'#FFFFFF', border:`1.5px solid ${photos[i] ? '#34C759' : 'rgba(60,60,67,.1)'}`, borderRadius:14, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:5, boxShadow:'0 1px 3px rgba(0,0,0,.07)' }}>
                  {photos[i] ? (
                    <><CheckCircle size={18} color="#34C759" strokeWidth={1.5}/><span style={{ fontSize:9, fontWeight:700, color:'#34C759', textAlign:'center', padding:'0 4px' }}>{photos[i].a}</span></>
                  ) : (
                    <><Camera size={16} color="#AEAEB2" strokeWidth={1.5}/><span style={{ fontSize:9, color:'#AEAEB2' }}>Shot {i + 1}</span></>
                  )}
                </div>
              ))}
            </div>

            <button onClick={() => photos.length >= NEED && setStage('review')} style={{ background:photos.length >= NEED ? C_BLUE : '#C7C7CC', color:'white', border:'none', borderRadius:12, padding:'14px 0', width:'100%', fontWeight:700, fontSize:15, cursor:photos.length >= NEED ? 'pointer' : 'not-allowed' }}>
              {photos.length >= NEED ? 'Review Photos →' : `${NEED - photos.length} more photo${NEED - photos.length !== 1 ? 's' : ''} needed`}
            </button>
          </div>
        )}

        {/* ── REVIEW ── */}
        {stage === 'review' && (
          <div className="au">
            <div style={{ fontWeight:700, fontSize:17, color:'#1D1D1F', marginBottom:14 }}>Confirm your photos</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, marginBottom:16 }}>
              {photos.map((p) => (
                <div key={p.id} style={{ background:'#FFFFFF', borderRadius:12, padding:10, boxShadow:'0 1px 3px rgba(0,0,0,.07)', border:'1px solid rgba(60,60,67,.1)' }}>
                  <div style={{ height:50, background:'#EAF3FF', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:6 }}>
                    <Camera size={18} color={C_BLUE} strokeWidth={1.5}/>
                  </div>
                  <div style={{ fontSize:9, fontWeight:700, color:C_BLUE, textAlign:'center' }}>{p.a}</div>
                  <div style={{ fontSize:8, color:'#AEAEB2', textAlign:'center', marginTop:2 }}>11:23 AM</div>
                </div>
              ))}
            </div>
            <div style={{ background:'#E8F9ED', borderRadius:12, padding:12, display:'flex', gap:10, marginBottom:16, border:'1px solid rgba(52,199,89,.33)' }}>
              <Shield size={16} color="#34C759" style={{ flexShrink:0, marginTop:1 }} strokeWidth={1.5}/>
              <span style={{ fontSize:12, color:'#1A6B3A', lineHeight:1.5 }}>Photos are GPS-tagged and timestamped. Tamper-proof. Available as evidence in disputes.</span>
            </div>
            <button onClick={() => setStage(mode === 'return' ? 'compare' : 'done')} style={{ background:C_BLUE, color:'white', border:'none', borderRadius:12, padding:'14px 0', width:'100%', fontWeight:700, fontSize:15, cursor:'pointer', boxShadow:`0 4px 16px ${C_BLUE}44` }}>
              {mode === 'return' ? 'View Before & After →' : 'Confirm & Continue →'}
            </button>
          </div>
        )}

        {/* ── COMPARE ── */}
        {(stage === 'compare' || stage === 'done') && (
          <div className="au">
            <div style={{ fontWeight:700, fontSize:17, color:'#1D1D1F', marginBottom:4 }}>Before vs. After</div>
            <div style={{ fontSize:12, color:'#6E6E73', marginBottom:14 }}>Drag the handle to compare</div>

            <div
              ref={ref}
              onMouseDown={e => { drag.current = true; updateSplit(e.clientX) }}
              onMouseMove={e => { drag.current && updateSplit(e.clientX) }}
              onMouseUp={() => drag.current = false}
              onMouseLeave={() => drag.current = false}
              onTouchStart={e => updateSplit(e.touches[0].clientX)}
              onTouchMove={e => { e.preventDefault(); updateSplit(e.touches[0].clientX) }}
              style={{ position:'relative', height:210, borderRadius:18, overflow:'hidden', cursor:'col-resize', userSelect:'none', marginBottom:20, boxShadow:'0 4px 20px rgba(0,0,0,.09)', touchAction:'none', border:'1px solid rgba(60,60,67,.1)' }}
            >
              {/* Before */}
              <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg,#EAF3FF,#E0EDFF)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <div style={{ width:70, height:70, borderRadius:20, background:'white', boxShadow:'0 4px 20px rgba(0,0,0,.09)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <Hammer size={34} color={C_ORANGE} strokeWidth={1.5}/>
                </div>
                <div style={{ position:'absolute', top:10, right:12, background:'rgba(0,0,0,.55)', borderRadius:8, padding:'3px 8px' }}>
                  <span style={{ color:'white', fontSize:9, fontWeight:600 }}>BEFORE · Jun 12 · 11:23</span>
                </div>
                <div style={{ position:'absolute', bottom:10, left:10 }}>
                  <HealthBadge pct={88}/>
                </div>
              </div>

              {/* After — clipped reveal */}
              <div style={{ position:'absolute', top:0, left:0, bottom:0, width:`${split}%`, overflow:'hidden' }}>
                <div style={{ position:'absolute', top:0, bottom:0, left:0, background:'linear-gradient(135deg,#EFF5EB,#DDF0D3)', display:'flex', alignItems:'center', justifyContent:'center', width:split > 0 ? `${(100 / split) * 100}%` : '100%' }}>
                  <div style={{ width:70, height:70, borderRadius:20, background:'white', boxShadow:'0 4px 20px rgba(0,0,0,.09)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <Hammer size={34} color={C_ORANGE} strokeWidth={1.5}/>
                  </div>
                  <div style={{ position:'absolute', top:10, left:12, background:'rgba(0,0,0,.55)', borderRadius:8, padding:'3px 8px' }}>
                    <span style={{ color:'white', fontSize:9, fontWeight:600 }}>AFTER · Jun 14 · 5:48 PM</span>
                  </div>
                  <div style={{ position:'absolute', bottom:10, right:10 }}>
                    <HealthBadge pct={86}/>
                  </div>
                </div>
              </div>

              {/* Drag handle */}
              <div style={{ position:'absolute', top:0, bottom:0, left:`${split}%`, transform:'translateX(-50%)', width:3, background:'white', zIndex:20, pointerEvents:'none', boxShadow:'0 0 8px rgba(0,0,0,.2)' }}>
                <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:30, height:30, borderRadius:15, background:'white', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 2px 12px rgba(0,0,0,.2)', fontSize:13, fontWeight:700, color:'#1D1D1F' }}>⇔</div>
              </div>

              {/* AI badge */}
              <div style={{ position:'absolute', bottom:10, left:'50%', transform:'translateX(-50%)', background:'rgba(52,199,89,.92)', backdropFilter:'blur(6px)', borderRadius:20, padding:'5px 14px', display:'flex', alignItems:'center', gap:6, zIndex:30, whiteSpace:'nowrap' }}>
                <CheckCircle size={12} color="white" strokeWidth={2}/><span style={{ color:'white', fontSize:11, fontWeight:700 }}>AI: No damage detected</span>
              </div>
            </div>

            {/* Condition picker */}
            <div style={{ fontWeight:700, fontSize:14, color:'#1D1D1F', marginBottom:10 }}>How are you returning it?</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:16 }}>
              {CONDS.map(co => (
                <div key={co.id} onClick={() => setCond(co.id)} className="tp" style={{ background:cond === co.id ? `${co.color}12` : '#FFFFFF', border:`1.5px solid ${cond === co.id ? co.color : 'rgba(60,60,67,.1)'}`, borderRadius:12, padding:'10px 12px', display:'flex', alignItems:'center', gap:10, boxShadow:'0 1px 3px rgba(0,0,0,.07)' }}>
                  <div style={{ width:30, height:30, borderRadius:8, background:`${co.color}18`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <co.Icon size={14} color={co.color} strokeWidth={1.5}/>
                  </div>
                  <span style={{ fontSize:11, fontWeight:600, color:cond === co.id ? co.color : '#1D1D1F', lineHeight:1.3 }}>{co.label}</span>
                </div>
              ))}
            </div>
            <button onClick={onBack} disabled={!cond} style={{ background:cond ? C_BLUE : '#C7C7CC', color:'white', border:'none', borderRadius:12, padding:'14px 0', width:'100%', fontWeight:700, fontSize:15, cursor:cond ? 'pointer' : 'not-allowed' }}>
              Confirm Return →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
