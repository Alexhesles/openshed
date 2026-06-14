// src/screens/HomeScreen.jsx
import { Bell, ChevronRight } from 'lucide-react'
import { C } from '../theme.js'
import { TrustRing, SectionLabel } from '../components/atoms.jsx'
import ToolCard from '../components/ToolCard.jsx'
import { TOOLS } from '../data/index.js'

export default function HomeScreen({ goTool, goHandshake }) {
  return (
    <div style={{ flex:1, overflowY:'auto', background:C.bg }}>
      {/* Header */}
      <div style={{ background:C.card, padding:'8px 16px 14px', borderBottom:`1px solid ${C.brd}` }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <div style={{ fontSize:12, color:C.t2, fontWeight:500 }}>Good morning,</div>
            <div style={{ fontSize:22, fontWeight:800, color:C.t1, letterSpacing:'-0.4px' }}>Alex</div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ position:'relative' }}>
              <Bell size={22} color={C.t2} strokeWidth={1.5}/>
              <div style={{ position:'absolute', top:-2, right:-2, width:8, height:8, borderRadius:4, background:C.red, border:`1.5px solid ${C.card}` }}/>
            </div>
            <TrustRing score={73} size={52} stroke={5}/>
          </div>
        </div>
      </div>

      {/* Active loan */}
      <div onClick={goHandshake} className="tp" style={{ margin:'14px 14px 0', background:C.card, borderRadius:16, padding:'14px 16px', boxShadow:C.shM, border:`1.5px solid ${C.orange}44`, display:'flex', alignItems:'center', gap:14 }}>
        <div style={{ width:42, height:42, borderRadius:12, background:C.orangeL, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <span style={{ fontSize:20 }}>🔧</span>
        </div>
        <div style={{ flex:1 }}>
          <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:3 }}>
            <span className="bl" style={{ width:6, height:6, borderRadius:3, background:C.orange, display:'block' }}/>
            <span style={{ fontSize:11, fontWeight:700, color:C.orange, letterSpacing:'0.3px' }}>ACTIVE LOAN</span>
          </div>
          <div style={{ fontWeight:600, fontSize:14, color:C.t1 }}>Power Drill — DeWalt</div>
          <div style={{ fontSize:12, color:C.t2, marginTop:1 }}>Return by today 6:00 PM · 4h 32min left</div>
        </div>
        <ChevronRight size={18} color={C.orange}/>
      </div>

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
      <SectionLabel>Near Maple Street</SectionLabel>
      <div style={{ padding:'0 14px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:14 }}>
          {TOOLS.map(t => <ToolCard key={t.id} tool={t} onClick={t.sponsored ? null : goTool}/>)}
        </div>
      </div>

      {/* Co-op card */}
      <SectionLabel>Community Buy</SectionLabel>
      <div style={{ margin:'0 14px 24px', background:C.card, borderRadius:16, overflow:'hidden', boxShadow:C.sh, border:`1px solid ${C.brd}` }}>
        <div style={{ height:80, background:`linear-gradient(135deg,${C.green}15,${C.green}25)`, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div style={{ width:52, height:52, borderRadius:16, background:C.card, boxShadow:`0 4px 16px ${C.green}30`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:26 }}>🌳</div>
        </div>
        <div style={{ padding:'14px 16px 16px' }}>
          <div style={{ fontWeight:700, fontSize:15, color:C.t1 }}>Commercial Stump Grinder</div>
          <div style={{ fontSize:12, color:C.t2, marginTop:2 }}>6 co-owners · Maple Street Group</div>
          <div style={{ height:5, background:C.bg, borderRadius:3, overflow:'hidden', margin:'10px 0 4px' }}>
            <div style={{ height:'100%', width:'65%', background:`linear-gradient(90deg,${C.blue},${C.green})`, borderRadius:3 }}/>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:12 }}>
            <span style={{ fontSize:12, color:C.t2 }}>$650 raised</span>
            <span style={{ fontSize:12, fontWeight:600, color:C.t1 }}>Goal: $1,000</span>
          </div>
          <button style={{ width:'100%', background:C.blue, border:'none', color:'white', borderRadius:10, padding:'11px 0', fontWeight:700, fontSize:14, cursor:'pointer' }}>
            Contribute $50
          </button>
        </div>
      </div>
    </div>
  )
}
