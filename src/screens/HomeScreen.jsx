import { useState, useEffect } from 'react'
import { Bell, ChevronRight } from 'lucide-react'
import { C } from '../theme.js'
import { supabase } from '../lib/supabase.js'
import { TrustRing, SectionLabel, HealthBadge } from '../components/atoms.jsx'
import { Wrench, Hammer, Leaf, Zap, Droplets } from 'lucide-react'

const CAT_ICONS  = { 'Power Tools':Hammer, 'Yard & Garden':Leaf, 'Cleaning':Droplets, 'Hand Tools':Wrench, 'Other':Zap }
const CAT_COLORS = { 'Power Tools':'#FF9500', 'Yard & Garden':'#34C759', 'Cleaning':'#007AFF', 'Hand Tools':'#007AFF', 'Other':'#AF52DE' }

export default function HomeScreen({ goHandshake, goRealTool }) {
  const [profile,      setProfile]      = useState(null)
  const [tools,        setTools]        = useState([])
  const [activeLoans,  setActiveLoans]  = useState([])
  const [loading,      setLoading]      = useState(true)

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser()

    const [{ data: prof }, { data: toolsData }, { data: loansData }] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('tools').select('*, profiles(full_name, trust_score)').eq('visibility','public').eq('is_available',true).neq('owner_id', user.id).limit(6),
      supabase.from('loans').select('*, tools(name)').eq('borrower_id', user.id).eq('status','active'),
    ])

    setProfile(prof)
    setTools(toolsData || [])
    setActiveLoans(loansData || [])
    setLoading(false)
  }

  const firstName = profile?.full_name?.split(' ')[0] || 'there'
  const hour      = new Date().getHours()
  const greeting  = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <div style={{ flex:1, overflowY:'auto', background:C.bg }}>
      {/* Header */}
      <div style={{ background:C.card, padding:'8px 16px 14px', borderBottom:`1px solid ${C.brd}` }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <div style={{ fontSize:12, color:C.t2, fontWeight:500 }}>{greeting},</div>
            <div style={{ fontSize:22, fontWeight:800, color:C.t1, letterSpacing:'-0.4px' }}>{firstName}</div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ position:'relative' }}>
              <Bell size={22} color={C.t2} strokeWidth={1.5}/>
              {activeLoans.length > 0 && <div style={{ position:'absolute', top:-2, right:-2, width:8, height:8, borderRadius:4, background:C.red, border:`1.5px solid ${C.card}` }}/>}
            </div>
            <TrustRing score={profile?.trust_score || 10} size={52} stroke={5}/>
          </div>
        </div>
      </div>

      {/* Active loan */}
      {activeLoans.length > 0 && (
        <div onClick={goHandshake} className="tp" style={{ margin:'14px 14px 0', background:C.card, borderRadius:16, padding:'14px 16px', boxShadow:C.shM, border:`1.5px solid ${C.orange}44`, display:'flex', alignItems:'center', gap:14 }}>
          <div style={{ width:42, height:42, borderRadius:12, background:C.orangeL, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <Hammer size={20} color={C.orange} strokeWidth={1.5}/>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:3 }}>
              <span className="bl" style={{ width:6, height:6, borderRadius:3, background:C.orange, display:'block' }}/>
              <span style={{ fontSize:11, fontWeight:700, color:C.orange }}>ACTIVE LOAN</span>
            </div>
            <div style={{ fontWeight:600, fontSize:14, color:C.t1 }}>{activeLoans[0]?.tools?.name}</div>
            <div style={{ fontSize:12, color:C.t2, marginTop:1 }}>Tap to manage</div>
          </div>
          <ChevronRight size={18} color={C.orange}/>
        </div>
      )}

      {/* Quick actions */}
      <div style={{ display:'flex', gap:10, padding:'12px 14px 0' }}>
        {[
          { emoji:'🔍', label:'Browse Tools',  color:C.blue,   bg:C.blueL   },
          { emoji:'📦', label:'My Shed',       color:C.orange, bg:C.orangeL },
          { emoji:'👥', label:'Neighbors',     color:C.green,  bg:C.greenL  },
        ].map((a, i) => (
          <div key={i} className="tp" style={{ flex:1, background:C.card, borderRadius:14, padding:'12px 8px', textAlign:'center', boxShadow:C.sh, border:`1px solid ${C.brd}` }}>
            <div style={{ fontSize:22, marginBottom:6 }}>{a.emoji}</div>
            <div style={{ fontSize:11, fontWeight:600, color:C.t1 }}>{a.label}</div>
          </div>
        ))}
      </div>

      {/* Tool feed */}
      <SectionLabel>Available Near You</SectionLabel>
      <div style={{ padding:'0 14px' }}>
        {loading ? (
          <div style={{ textAlign:'center', padding:'30px 0', fontSize:13, color:C.t2 }}>Loading tools...</div>
        ) : tools.length === 0 ? (
          <div style={{ background:C.card, borderRadius:16, padding:'28px 20px', textAlign:'center', boxShadow:C.sh, marginBottom:14 }}>
            <div style={{ fontSize:32, marginBottom:10 }}>🏗️</div>
            <div style={{ fontWeight:700, fontSize:15, color:C.t1 }}>No tools listed yet</div>
            <div style={{ fontSize:13, color:C.t2, marginTop:4 }}>Be the first to add a tool in your neighborhood!</div>
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:14 }}>
            {tools.map(t => {
              const Icon  = CAT_ICONS[t.category]  || Wrench
              const color = CAT_COLORS[t.category] || C.blue
              return (
                <div key={t.id} onClick={() => goRealTool(t)} className="tp"
                  style={{ background:C.card, borderRadius:16, overflow:'hidden', boxShadow:C.sh, border:`1px solid ${C.brd}` }}>
                  <div style={{ height:96, background:`linear-gradient(135deg,${color}10,${color}20)`, display:'flex', alignItems:'center', justifyContent:'center', position:'relative' }}>
                    <div style={{ width:52, height:52, borderRadius:16, background:C.card, boxShadow:`0 4px 16px ${color}30`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <Icon size={26} color={color} strokeWidth={1.5}/>
                    </div>
                    {t.health && <div style={{ position:'absolute', top:6, right:6 }}><HealthBadge pct={t.health}/></div>}
                  </div>
                  <div style={{ padding:'10px 12px 12px' }}>
                    <div style={{ fontWeight:700, fontSize:13, color:C.t1, lineHeight:1.3 }}>{t.name}</div>
                    <div style={{ fontSize:11, color:C.t2, marginTop:1 }}>{t.brand || 'No brand'}</div>
                    <div style={{ fontWeight:700, fontSize:14, color:t.is_free ? C.green : C.t1, marginTop:6 }}>
                      {t.is_free ? 'Free' : `$${t.price_per_day}/day`}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
