import { useState, useEffect } from 'react'
import { Search, Truck, Hammer, Wrench, Leaf, Droplets, ChevronRight } from 'lucide-react'
import { C } from '../theme.js'
import { supabase } from '../lib/supabase.js'
import { Chip, HealthBadge } from '../components/atoms.jsx'

const CAT_ICONS  = { 'Power Tools':Hammer, 'Yard & Garden':Leaf, 'Cleaning':Droplets, 'Hand Tools':Wrench, 'Other':Truck }
const CAT_COLORS = { 'Power Tools':'#FF9500', 'Yard & Garden':'#34C759', 'Cleaning':'#007AFF', 'Hand Tools':'#007AFF', 'Other':'#AF52DE' }
const CATEGORIES = ['All', 'Power Tools', 'Yard & Garden', 'Cleaning', 'Camping', 'Hand Tools']

export default function BrowseScreen({ goRealTool }) {
  const [tools,    setTools]    = useState([])
  const [loading,  setLoading]  = useState(true)
  const [query,    setQuery]    = useState('')
  const [category, setCategory] = useState('All')

  useEffect(() => { fetchTools() }, [])

  const fetchTools = async () => {
    setLoading(true)
    let q = supabase.from('tools').select(`*, profiles(full_name, trust_score)`).eq('visibility','public').eq('is_available', true)
    const { data } = await q.order('created_at', { ascending: false })
    setTools(data || [])
    setLoading(false)
  }

  const filtered = tools.filter(t => {
    const matchQuery    = t.name.toLowerCase().includes(query.toLowerCase()) || (t.brand||'').toLowerCase().includes(query.toLowerCase())
    const matchCategory = category === 'All' || t.category === category
    return matchQuery && matchCategory
  })

  const commercial = [
    { Icon:Truck,  color:C.orange, name:'Sunbelt Rentals',        detail:'Available today · $55/day · 2.1 mi' },
    { Icon:Hammer, color:C.blue,   name:'Home Depot Tool Rental',  detail:'In-store rental · $65/day · 3.4 mi' },
    { Icon:Wrench, color:C.green,  name:'United Rentals',          detail:'Delivery available · $48/day · 4.0 mi' },
  ]

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflowY:'auto', background:C.bg }}>
      <div style={{ background:C.card, padding:'8px 14px 12px', borderBottom:`1px solid ${C.brd}`, flexShrink:0 }}>
        <div style={{ fontSize:22, fontWeight:800, color:C.t1, letterSpacing:'-0.4px', marginBottom:10 }}>Browse Tools</div>
        <div style={{ background:C.cardAlt, borderRadius:12, padding:'9px 14px', display:'flex', alignItems:'center', gap:8, border:`1px solid ${C.brd}` }}>
          <Search size={15} color={C.t2} strokeWidth={1.5}/>
          <input
            placeholder="Search tools, equipment…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{ border:'none', outline:'none', flex:1, fontSize:14, color:C.t1, background:'transparent' }}
          />
        </div>
        <div style={{ display:'flex', gap:8, marginTop:10, overflowX:'auto', paddingBottom:2 }}>
          {CATEGORIES.map((c, i) => (
            <Chip key={i} active={category === c} onPress={() => setCategory(c)}>{c}</Chip>
          ))}
        </div>
      </div>

      <div style={{ padding:'12px 14px' }}>
        {loading ? (
          <div style={{ textAlign:'center', padding:'40px 0', color:C.t2, fontSize:13 }}>Loading tools nearby...</div>
        ) : filtered.length > 0 ? (
          <>
            <div style={{ fontSize:13, color:C.t2, marginBottom:12 }}>{filtered.length} tool{filtered.length !== 1 ? 's' : ''} available</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              {filtered.map(t => {
                const Icon  = CAT_ICONS[t.category]  || Wrench
                const color = CAT_COLORS[t.category] || C.blue
                return (
                  <div key={t.id} onClick={() => goRealTool(t)} className="tp" style={{ background:C.card, borderRadius:16, overflow:'hidden', boxShadow:C.sh, border:`1px solid ${C.brd}` }}>
                    <div style={{ height:100, background:`linear-gradient(135deg,${color}10,${color}20)`, display:'flex', alignItems:'center', justifyContent:'center', position:'relative' }}>
                      <div style={{ width:52, height:52, borderRadius:16, background:C.card, boxShadow:`0 4px 16px ${color}30`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                        <Icon size={26} color={color} strokeWidth={1.5}/>
                      </div>
                      {t.health && <div style={{ position:'absolute', top:8, right:8 }}><HealthBadge pct={t.health}/></div>}
                    </div>
                    <div style={{ padding:'10px 12px 12px' }}>
                      <div style={{ fontWeight:700, fontSize:13, color:C.t1, lineHeight:1.3 }}>{t.name}</div>
                      <div style={{ fontSize:11, color:C.t2, marginTop:1 }}>{t.brand || 'No brand'} · {t.category}</div>
                      <div style={{ fontSize:11, color:C.t2, marginTop:2 }}>by {t.profiles?.full_name || 'Neighbor'}</div>
                      <div style={{ fontWeight:700, fontSize:14, color:t.is_free ? C.green : C.t1, marginTop:6 }}>
                        {t.is_free ? 'Free' : `$${t.price_per_day}/day`}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        ) : (
          <div className="au">
            <div style={{ background:C.card, borderRadius:16, padding:'28px 20px', textAlign:'center', boxShadow:C.sh, marginBottom:14 }}>
              <div style={{ width:56, height:56, borderRadius:16, background:C.cardAlt, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px' }}>
                <Search size={24} color={C.t3} strokeWidth={1.5}/>
              </div>
              <div style={{ fontWeight:700, fontSize:16, color:C.t1 }}>
                {query ? `No results for "${query}"` : 'No tools available yet'}
              </div>
              <div style={{ fontSize:13, color:C.t2, marginTop:6, lineHeight:1.5 }}>
                {query ? 'Try a different search or check commercial rentals below.' : 'Be the first to list a tool in your neighborhood!'}
              </div>
            </div>

            <div style={{ background:C.orangeL, borderRadius:12, padding:'8px 12px', marginBottom:12, display:'flex', alignItems:'center', gap:8, border:`1px solid ${C.orange}22` }}>
              <span style={{ fontSize:10, fontWeight:700, color:C.orange, background:'white', padding:'2px 7px', borderRadius:8 }}>Plan B</span>
              <span style={{ fontSize:12, color:C.orange, fontWeight:500 }}>Commercial rentals with availability now</span>
            </div>

            {commercial.map((r, i) => (
              <div key={i} className="tp" style={{ background:C.card, borderRadius:14, padding:'14px 16px', marginBottom:10, display:'flex', alignItems:'center', gap:14, boxShadow:C.sh, border:`1px solid ${C.brd}` }}>
                <div style={{ width:44, height:44, borderRadius:12, background:`${r.color}15`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <r.Icon size={22} color={r.color} strokeWidth={1.5}/>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:600, fontSize:14, color:C.t1 }}>{r.name}</div>
                  <div style={{ fontSize:12, color:C.t2, marginTop:2 }}>{r.detail}</div>
                </div>
                <div style={{ textAlign:'right', flexShrink:0 }}>
                  <div style={{ fontSize:9, fontWeight:700, color:C.t2, background:C.cardAlt, borderRadius:8, padding:'2px 7px', marginBottom:4 }}>Sponsored</div>
                  <ChevronRight size={14} color={C.t3}/>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
