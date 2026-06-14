// src/screens/BrowseScreen.jsx
import { useState } from 'react'
import { Search, Truck, Hammer, Wrench, Leaf, Droplets, ChevronRight } from 'lucide-react'
import { C } from '../theme.js'
import { Chip } from '../components/atoms.jsx'
import ToolCard from '../components/ToolCard.jsx'
import { TOOLS } from '../data/index.js'

export default function BrowseScreen({ goTool }) {
  const [empty, setEmpty] = useState(false)
  const cats = [
    { label:'Power Tools',  Icon:Hammer   },
    { label:'Yard & Garden',Icon:Leaf     },
    { label:'Cleaning',     Icon:Droplets },
    { label:'Camping',      Icon:Truck    },
    { label:'Hand Tools',   Icon:Wrench   },
  ]
  const commercial = [
    { Icon:Truck,  color:C.orange, name:'Sunbelt Rentals',       detail:'Available today · $55/day · 2.1 mi' },
    { Icon:Hammer, color:C.blue,   name:'Home Depot Tool Rental', detail:'In-store rental · $65/day · 3.4 mi' },
    { Icon:Wrench, color:C.green,  name:'United Rentals',         detail:'Delivery available · $48/day · 4.0 mi' },
  ]
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflowY:'auto', background:C.bg }}>
      <div style={{ background:C.card, padding:'8px 14px 12px', borderBottom:`1px solid ${C.brd}`, flexShrink:0 }}>
        <div style={{ fontSize:22, fontWeight:800, color:C.t1, letterSpacing:'-0.4px', marginBottom:10 }}>Browse Tools</div>
        <div style={{ background:C.cardAlt, borderRadius:12, padding:'9px 14px', display:'flex', alignItems:'center', gap:8, border:`1px solid ${C.brd}` }}>
          <Search size={15} color={C.t2} strokeWidth={1.5}/>
          <input placeholder="Search tools, equipment…" style={{ border:'none', outline:'none', flex:1, fontSize:14, color:C.t1, background:'transparent' }}/>
        </div>
        <div style={{ display:'flex', gap:8, marginTop:10, overflowX:'auto', paddingBottom:2 }}>
          {cats.map((c, i) => (
            <Chip key={i} active={i === 0}>
              <c.Icon size={13} color={i === 0 ? 'white' : C.t2} strokeWidth={1.5}/>{c.label}
            </Chip>
          ))}
        </div>
      </div>

      <div style={{ padding:'12px 14px' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
          <span style={{ fontSize:13, color:C.t2 }}>{empty ? 'No P2P results nearby' : '5 tools near you · 0–0.6 mi'}</span>
          <button onClick={() => setEmpty(e => !e)} style={{ background:'none', border:`1px solid ${C.brdM}`, borderRadius:20, padding:'5px 12px', fontSize:11, fontWeight:600, color:C.blue, cursor:'pointer' }}>
            {empty ? 'Show results' : 'Simulate empty'}
          </button>
        </div>

        {!empty ? (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            {TOOLS.filter(t => !t.sponsored).map(t => <ToolCard key={t.id} tool={t} onClick={goTool}/>)}
          </div>
        ) : (
          <div className="au">
            <div style={{ background:C.card, borderRadius:16, padding:'28px 20px', textAlign:'center', boxShadow:C.sh, marginBottom:14 }}>
              <div style={{ width:56, height:56, borderRadius:16, background:C.cardAlt, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px' }}>
                <Search size={24} color={C.t3} strokeWidth={1.5}/>
              </div>
              <div style={{ fontWeight:700, fontSize:16, color:C.t1 }}>Nothing nearby yet</div>
              <div style={{ fontSize:13, color:C.t2, marginTop:6, lineHeight:1.5 }}>No neighbors have this item. Try commercial rentals or post a request.</div>
              <button style={{ marginTop:14, background:C.blue, border:'none', color:'white', borderRadius:10, padding:'10px 20px', fontWeight:600, fontSize:13, cursor:'pointer' }}>Post a Request</button>
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
