// src/components/Nav.jsx
import { Home, Search, Package, Users, User } from 'lucide-react'
import { C } from '../theme.js'

const TABS = [
  { id:'home',      Icon:Home,    label:'Home'      },
  { id:'browse',    Icon:Search,  label:'Browse'    },
  { id:'shed',      Icon:Package, label:'Shed'      },
  { id:'neighbors', Icon:Users,   label:'Neighbors' },
  { id:'profile',   Icon:User,    label:'Profile'   },
]

export default function Nav({ current, onChange }) {
  return (
    <div style={{ background:'rgba(255,255,255,.95)', backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)', borderTop:`1px solid ${C.brd}`, display:'flex', paddingBottom:6, paddingTop:6, flexShrink:0 }}>
      {TABS.map(({ id, Icon, label }) => {
        const active = current === id
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            className="tp"
            style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:3, border:'none', background:'transparent', padding:'4px 0' }}
          >
            <Icon size={22} color={active ? C.blue : C.t3} strokeWidth={active ? 2 : 1.5}/>
            <span style={{ fontSize:9, fontWeight:active ? 700 : 500, color:active ? C.blue : C.t3 }}>{label}</span>
          </button>
        )
      })}
    </div>
  )
}
