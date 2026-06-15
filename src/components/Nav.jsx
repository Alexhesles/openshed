import { Home, Search, Box, Users, User, MessageCircle } from 'lucide-react'
import { C } from '../theme.js'

const TABS = [
  { id:'home',      Icon:Home,          label:'Home'      },
  { id:'browse',    Icon:Search,        label:'Browse'    },
  { id:'shed',      Icon:Box,           label:'Shed'      },
  { id:'neighbors', Icon:Users,         label:'Neighbors' },
  { id:'profile',   Icon:User,          label:'Profile'   },
]

// ── BOTTOM NAV (mobile) ───────────────────────────────────────────────────────
export default function Nav({ current, onChange }) {
  return (
    <div style={{ display:'flex', borderTop:`1px solid ${C.brd}`, background:C.card, flexShrink:0, paddingBottom:'env(safe-area-inset-bottom,0)' }}>
      {TABS.map(({ id, Icon, label }) => {
        const active = current === id
        return (
          <button key={id} onClick={() => onChange(id)}
            style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:3, padding:'10px 0 8px', border:'none', background:'none', cursor:'pointer' }}>
            <Icon size={22} color={active ? C.blue : C.t3} strokeWidth={active ? 2 : 1.5}/>
            <span style={{ fontSize:10, fontWeight:active?700:400, color:active?C.blue:C.t3 }}>{label}</span>
          </button>
        )
      })}
    </div>
  )
}

// ── SIDEBAR (desktop) ─────────────────────────────────────────────────────────
export function Sidebar({ current, onChange, profile, authUser, unreadMsgs, onMessages }) {
  const avatar = profile?.avatar_url || authUser?.user_metadata?.avatar_url

  return (
    <div style={{ width:220, background:'white', borderRight:`1px solid ${C.brd}`, display:'flex', flexDirection:'column', flexShrink:0, height:'100vh', position:'sticky', top:0 }}>
      {/* Logo */}
      <div style={{ padding:'28px 20px 20px', borderBottom:`1px solid ${C.brd}` }}>
        <div style={{ fontSize:22, fontWeight:900, color:C.t1, letterSpacing:'-0.5px' }}>
          Open<span style={{ color:C.blue }}>Shed</span>
        </div>
        <div style={{ fontSize:11, color:C.t2, marginTop:2 }}>Share tools, build community</div>
      </div>

      {/* Nav items */}
      <div style={{ flex:1, padding:'12px 10px', overflowY:'auto' }}>
        {TABS.map(({ id, Icon, label }) => {
          const active = current === id
          return (
            <button key={id} onClick={() => onChange(id)}
              style={{ width:'100%', display:'flex', alignItems:'center', gap:12, padding:'11px 12px', borderRadius:12, border:'none', background:active?C.blueL:'transparent', cursor:'pointer', marginBottom:2, transition:'background .15s' }}>
              <Icon size={19} color={active?C.blue:C.t2} strokeWidth={active?2:1.5}/>
              <span style={{ fontSize:14, fontWeight:active?700:400, color:active?C.blue:C.t1 }}>{label}</span>
            </button>
          )
        })}

        <div style={{ height:1, background:C.brd, margin:'10px 4px' }}/>

        {/* Messages */}
        <button onClick={onMessages}
          style={{ width:'100%', display:'flex', alignItems:'center', gap:12, padding:'11px 12px', borderRadius:12, border:'none', background:current==='messages'?C.blueL:'transparent', cursor:'pointer', position:'relative' }}>
          <MessageCircle size={19} color={current==='messages'?C.blue:C.t2} strokeWidth={current==='messages'?2:1.5}/>
          <span style={{ fontSize:14, fontWeight:current==='messages'?700:400, color:current==='messages'?C.blue:C.t1 }}>Messages</span>
          {unreadMsgs > 0 && (
            <div style={{ marginLeft:'auto', width:18, height:18, borderRadius:9, background:C.blue, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <span style={{ color:'white', fontSize:9, fontWeight:800 }}>{unreadMsgs > 9 ? '9+' : unreadMsgs}</span>
            </div>
          )}
        </button>
      </div>

      {/* User footer */}
      {profile && (
        <div onClick={() => onChange('profile')} style={{ padding:'14px 16px', borderTop:`1px solid ${C.brd}`, display:'flex', alignItems:'center', gap:12, cursor:'pointer' }}>
          <div style={{ width:36, height:36, borderRadius:18, background:C.blueL, overflow:'hidden', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
            {avatar
              ? <img src={avatar} style={{ width:36, height:36, objectFit:'cover' }} alt="avatar"/>
              : <span style={{ fontSize:15, fontWeight:700, color:C.blue }}>{(profile.full_name||'?')[0]}</span>
            }
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:13, fontWeight:600, color:C.t1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{profile.full_name}</div>
            <div style={{ fontSize:11, color:C.t2 }}>Score: {profile.trust_score || 10}</div>
          </div>
        </div>
      )}
    </div>
  )
}
