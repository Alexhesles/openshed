import { useState, useEffect } from 'react'
import { Plus, ChevronRight } from 'lucide-react'
import { C, hlt } from '../theme.js'
import { supabase } from '../lib/supabase.js'
import { HealthBadge } from '../components/atoms.jsx'
import { Wrench, Hammer, Leaf, Zap, Droplets } from 'lucide-react'

const CAT_ICONS  = { 'Power Tools':Hammer, 'Yard & Garden':Leaf, 'Cleaning':Droplets, 'Hand Tools':Wrench, 'Other':Zap }
const CAT_COLORS = { 'Power Tools':'#FF9500', 'Yard & Garden':'#34C759', 'Cleaning':'#007AFF', 'Hand Tools':'#007AFF', 'Other':'#AF52DE' }

export default function ShedScreen({ onAddTool }) {
  const [tools,   setTools]   = useState([])
  const [loading, setLoading] = useState(true)
  const [exp,     setExp]     = useState(null)

  useEffect(() => { fetchTools() }, [])

  const fetchTools = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    const { data } = await supabase.from('tools').select('*').eq('owner_id', user.id).order('created_at', { ascending: false })
    setTools(data || [])
    setLoading(false)
  }

  if (loading) return (
    <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', background:C.bg }}>
      <div style={{ fontSize:13, color:C.t2 }}>Loading your shed...</div>
    </div>
  )

  return (
    <div style={{ flex:1, overflowY:'auto', background:C.bg }}>
      <div style={{ background:C.card, padding:'8px 16px 14px', borderBottom:`1px solid ${C.brd}` }}>
        <div style={{ fontSize:22, fontWeight:800, color:C.t1, letterSpacing:'-0.4px' }}>My Shed</div>
        <div style={{ fontSize:13, color:C.t2, marginTop:2 }}>{tools.length} tools listed</div>
        <div style={{ display:'flex', gap:10, marginTop:12 }}>
          {[{ v:tools.length, l:'Tools' },{ v:'0', l:'Active loans' },{ v:'$0', l:'Earned' }].map((s,i) => (
            <div key={i} style={{ flex:1, background:C.cardAlt, borderRadius:12, padding:'10px 8px', textAlign:'center', border:`1px solid ${C.brd}` }}>
              <div style={{ fontWeight:800, fontSize:18, color:C.t1 }}>{s.v}</div>
              <div style={{ fontSize:10, color:C.t2, marginTop:1 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding:'14px 14px 24px' }}>
        <button onClick={onAddTool} style={{ width:'100%', background:C.card, border:`1.5px dashed ${C.blue}`, borderRadius:14, padding:'13px 0', display:'flex', alignItems:'center', justifyContent:'center', gap:8, marginBottom:14, cursor:'pointer', boxShadow:C.sh }}>
          <Plus size={16} color={C.blue} strokeWidth={2}/>
          <span style={{ color:C.blue, fontWeight:700, fontSize:14 }}>Add a Tool</span>
        </button>

        {tools.length === 0 ? (
          <div style={{ background:C.card, borderRadius:16, padding:'32px 20px', textAlign:'center', boxShadow:C.sh }}>
            <div style={{ fontSize:40, marginBottom:12 }}>🏗️</div>
            <div style={{ fontWeight:700, fontSize:16, color:C.t1 }}>Your shed is empty</div>
            <div style={{ fontSize:13, color:C.t2, marginTop:6 }}>Add your first tool to start sharing</div>
          </div>
        ) : tools.map((t, i) => {
          const h     = hlt(t.health || 80)
          const Icon  = CAT_ICONS[t.category]  || Wrench
          const color = CAT_COLORS[t.category] || C.blue
          return (
            <div key={t.id} style={{ background:C.card, borderRadius:16, marginBottom:10, overflow:'hidden', boxShadow:C.sh, border:`1px solid ${C.brd}` }}>
              <div onClick={() => setExp(exp===i?null:i)} className="tp" style={{ padding:14, display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:48, height:48, borderRadius:14, background:`${color}15`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <Icon size={22} color={color} strokeWidth={1.5}/>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, fontSize:14, color:C.t1 }}>{t.name}</div>
                  <div style={{ fontSize:11, color:C.t2, marginTop:2 }}>{t.brand || 'No brand'} · {t.category}</div>
                  <div style={{ marginTop:5 }}><HealthBadge pct={t.health || 80}/></div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontWeight:700, fontSize:13, color:t.is_free?C.green:C.t1 }}>{t.is_free?'Free':`$${t.price_per_day}/day`}</div>
                  <ChevronRight size={16} color={C.t3} style={{ transform:exp===i?'rotate(90deg)':'none', transition:'transform .2s' }}/>
                </div>
              </div>
              {exp===i && (
                <div style={{ borderTop:`1px solid ${C.brd}`, padding:'12px 14px', background:C.cardAlt }}>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                    {[['Condition',`${t.health||80}%`],['Visibility',t.visibility],['Category',t.category],['Added',new Date(t.created_at).toLocaleDateString()]].map(([l,v],j) => (
                      <div key={j} style={{ background:C.card, borderRadius:10, padding:'9px 11px', border:`1px solid ${C.brd}` }}>
                        <div style={{ fontSize:10, color:C.t3 }}>{l}</div>
                        <div style={{ fontSize:13, fontWeight:700, color:C.t1, marginTop:3 }}>{v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
