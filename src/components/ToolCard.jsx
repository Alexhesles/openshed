// src/components/ToolCard.jsx
import { C } from '../theme.js'
import { ToolPhoto } from './atoms.jsx'

export default function ToolCard({ tool, onClick }) {
  return (
    <div
      onClick={() => onClick && onClick(tool)}
      className="tp"
      style={{ background:C.card, borderRadius:16, overflow:'hidden', boxShadow:C.sh, border:`1px solid ${C.brd}` }}
    >
      <ToolPhoto tool={tool} height={100}/>
      <div style={{ padding:'10px 12px 12px' }}>
        {tool.badge && (
          <div style={{ fontSize:9, fontWeight:700, color:C.blue, background:C.blueL, borderRadius:8, padding:'2px 7px', display:'inline-block', marginBottom:4 }}>
            {tool.badge.toUpperCase()}
          </div>
        )}
        <div style={{ fontWeight:700, fontSize:13, color:C.t1, lineHeight:1.3 }}>{tool.name}</div>
        <div style={{ fontSize:11, color:C.t2, marginTop:1 }}>{tool.brand} · {tool.dist}</div>
        <div style={{ display:'flex', alignItems:'baseline', gap:4, marginTop:6 }}>
          <span style={{ fontWeight:700, fontSize:14, color:tool.price==='Free'?C.green:C.t1 }}>{tool.price}</span>
          {tool.extra && <span style={{ fontSize:10, color:C.t3 }}>{tool.extra}</span>}
        </div>
      </div>
    </div>
  )
}
