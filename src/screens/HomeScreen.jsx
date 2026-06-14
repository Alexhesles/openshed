import { useState, useEffect } from 'react'
import { Bell, ChevronRight, X, MessageCircle } from 'lucide-react'
import { C } from '../theme.js'
import { supabase } from '../lib/supabase.js'
import { TrustRing, SectionLabel, HealthBadge } from '../components/atoms.jsx'
import { Wrench, Hammer, Leaf, Zap, Droplets } from 'lucide-react'

const CAT_ICONS  = { 'Power Tools':Hammer, 'Yard & Garden':Leaf, 'Cleaning':Droplets, 'Hand Tools':Wrench, 'Other':Zap }
const CAT_COLORS = { 'Power Tools':'#FF9500', 'Yard & Garden':'#34C759', 'Cleaning':'#007AFF', 'Hand Tools':'#007AFF', 'Other':'#AF52DE' }

export default function HomeScreen({ goHandshake, goRealTool, navigate }) {
  const [profile,         setProfile]         = useState(null)
  const [tools,           setTools]           = useState([])
  const [activeLoans,     setActiveLoans]     = useState([])
  const [pendingRequests, setPendingRequests] = useState([])
  const [unreadMsgs,      setUnreadMsgs]      = useState(0)
  const [pendingOpen,     setPendingOpen]     = useState(false)
  const [loading,         setLoading]         = useState(true)

  useEffect(() => {
    loadData()
    let channel
    supabase.auth.getUser().then(({ data: { user } }) => {
      channel = supabase.channel('unread-msgs')
        .on('postgres_changes', { event: '*', schema:'public', table:'messages', filter:`to_id=eq.${user.id}` },
          async () => {
            const { data } = await supabase.from('messages').select('id').eq('to_id', user.id).eq('read', false)
            setUnreadMsgs(data?.length || 0)
          }
        ).subscribe()
    })
    return () => { if (channel) supabase.removeChannel(channel) }
  }, [])

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser()

    const [{ data: prof }, { data: toolsData }, { data: loansData }, { data: myTools }, { data: unread }] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('tools').select('*, profiles(full_name, trust_score)').eq('visibility','public').eq('is_available',true).neq('owner_id', user.id).limit(6),
      supabase.from('loans').select('*, tools(name)').eq('borrower_id', user.id).in('status',['active','approved','requested']),
      supabase.from('tools').select('id').eq('owner_id', user.id),
      supabase.from('messages').select('id', { count:'exact' }).eq('to_id', user.id).eq('read', false),
    ])

    setProfile(prof)
    setTools(toolsData || [])
    setActiveLoans(loansData || [])
    setUnreadMsgs(unread?.length || 0)

    if (myTools?.length > 0) {
      const ids = myTools.map(t => t.id)
      const { data: requests } = await supabase
        .from('loans')
        .select('*, tools(name), profiles!borrower_id(full_name)')
        .in('tool_id', ids)
        .eq('status', 'requested')
      setPendingRequests(requests || [])
    }
    setLoading(false)
  }

  const approveRequest = async (loanId) => {
    await supabase.from('loans').update({ status:'approved' }).eq('id', loanId)
    setPendingRequests(p => p.filter(r => r.id !== loanId))
  }

  const declineRequest = async (loanId) => {
    await supabase.from('loans').update({ status:'cancelled' }).eq('id', loanId)
    setPendingRequests(p => p.filter(r => r.id !== loanId))
  }

  const firstName = profile?.full_name?.split(' ')[0] || 'there'
  const hour      = new Date().getHours()
  const greeting  = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  const quickActions = [
    { emoji:'🔍', label:'Browse',   go:'browse'  },
    { emoji:'📦', label:'My Shed',  go:'shed'    },
    { emoji:'📋', label:'My Loans', go:'myloans' },
  ]

  return (
    <div style={{ flex:1, overflowY:'auto', background:C.bg }}>
      {/* Header */}
      <div style={{ background:C.card, padding:'8px 16px 14px', borderBottom:`1px solid ${C.brd}` }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <div style={{ fontSize:12, color:C.t2, fontWeight:500 }}>{greeting},</div>
            <div style={{ fontSize:22, fontWeight:800, color:C.t1, letterSpacing:'-0.4px' }}>{firstName}</div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            {/* Messages */}
            <div onClick={() => navigate('messages')} className="tp" style={{ position:'relative', cursor:'pointer' }}>
              <MessageCircle size={22} color={unreadMsgs>0?C.blue:C.t2} strokeWidth={1.5}/>
              {unreadMsgs > 0 && (
                <div style={{ position:'absolute', top:-4, right:-4, width:16, height:16, borderRadius:8, background:C.blue, border:`1.5px solid ${C.card}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <span style={{ color:'white', fontSize:9, fontWeight:800 }}>{unreadMsgs > 9 ? '9+' : unreadMsgs}</span>
                </div>
              )}
            </div>
            {/* Bell */}
            <div onClick={() => setPendingOpen(p => !p)} className="tp" style={{ position:'relative', cursor:'pointer' }}>
              <Bell size={22} color={pendingRequests.length>0?C.orange:C.t2} strokeWidth={1.5}/>
              {pendingRequests.length > 0 && (
                <div style={{ position:'absolute', top:-4, right:-4, width:16, height:16, borderRadius:8, background:C.red, border:`1.5px solid ${C.card}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <span style={{ color:'white', fontSize:9, fontWeight:800 }}>{pendingRequests.length}</span>
                </div>
              )}
            </div>
            <TrustRing score={profile?.trust_score||10} size={52} stroke={5}/>
          </div>
        </div>
      </div>

      {/* Notifications panel */}
      {pendingOpen && (
        <div style={{ margin:'0 14px', marginTop:10, background:C.card, borderRadius:16, boxShadow:C.shM, border:`1px solid ${C.brd}`, overflow:'hidden' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 14px', borderBottom:`1px solid ${C.brd}` }}>
            <div style={{ fontWeight:700, fontSize:14, color:C.t1 }}>Loan Requests</div>
            <X size={16} color={C.t3} onClick={() => setPendingOpen(false)} style={{ cursor:'pointer' }}/>
          </div>
          {pendingRequests.length === 0 ? (
            <div style={{ padding:'20px 14px', textAlign:'center', fontSize:13, color:C.t2 }}>No pending requests</div>
          ) : pendingRequests.map(r => (
            <div key={r.id} style={{ padding:'12px 14px', borderBottom:`1px solid ${C.brd}` }}>
              <div style={{ fontSize:13, fontWeight:600, color:C.t1 }}>
                {r.profiles?.full_name || 'Someone'} wants to borrow <b>{r.tools?.name}</b>
              </div>
              <div style={{ display:'flex', gap:8, marginTop:10 }}>
                <button onClick={() => approveRequest(r.id)}
                  style={{ flex:1, background:C.green, border:'none', color:'white', borderRadius:10, padding:'9px 0', fontWeight:700, fontSize:13, cursor:'pointer' }}>
                  Approve ✓
                </button>
                <button onClick={() => declineRequest(r.id)}
                  style={{ flex:1, background:C.redL, border:`1px solid ${C.red}33`, color:C.red, borderRadius:10, padding:'9px 0', fontWeight:700, fontSize:13, cursor:'pointer' }}>
                  Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Active loan banner */}
      {activeLoans.length > 0 && (
        <div onClick={goHandshake} className="tp" style={{ margin:'14px 14px 0', background:C.card, borderRadius:16, padding:'14px 16px', boxShadow:C.shM, border:`1.5px solid ${C.orange}44`, display:'flex', alignItems:'center', gap:14 }}>
          <div style={{ width:42, height:42, borderRadius:12, background:C.orangeL, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <Hammer size={20} color={C.orange} strokeWidth={1.5}/>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:3 }}>
              <span style={{ width:6, height:6, borderRadius:3, background:C.orange, display:'block' }}/>
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
        {quickActions.map((a, i) => (
          <div key={i} onClick={() => navigate(a.go)} className="tp"
            style={{ flex:1, background:C.card, borderRadius:14, padding:'12px 8px', textAlign:'center', boxShadow:C.sh, border:`1px solid ${C.brd}`, cursor:'pointer' }}>
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
            <div style={{ fontSize:13, color:C.t2, marginTop:4 }}>Be the first to add a tool!</div>
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:14 }}>
            {tools.map(t => {
              const Icon  = CAT_ICONS[t.category]  || Wrench
              const color = CAT_COLORS[t.category] || C.blue
              return (
                <div key={t.id} onClick={() => goRealTool(t)} className="tp"
                  style={{ background:C.card, borderRadius:16, overflow:'hidden', boxShadow:C.sh, border:`1px solid ${C.brd}` }}>
                  <div style={{ height:96, background:`linear-gradient(135deg,${color}10,${color}20)`, display:'flex', alignItems:'center', justifyContent:'center', position:'relative', overflow:'hidden' }}>
                    {t.photo_urls?.[0]
                      ? <img src={t.photo_urls[0]} style={{ width:'100%', height:'100%', objectFit:'contain', padding:6 }} alt={t.name}/>
                      : <div style={{ width:52, height:52, borderRadius:16, background:C.card, boxShadow:`0 4px 16px ${color}30`, display:'flex', alignItems:'center', justifyContent:'center' }}><Icon size={26} color={color} strokeWidth={1.5}/></div>
                    }
                    {t.health && <div style={{ position:'absolute', top:6, right:6 }}><HealthBadge pct={t.health}/></div>}
                  </div>
                  <div style={{ padding:'10px 12px 12px' }}>
                    <div style={{ fontWeight:700, fontSize:13, color:C.t1, lineHeight:1.3 }}>{t.name}</div>
                    <div style={{ fontSize:11, color:C.t2, marginTop:1 }}>{t.brand || 'No brand'}</div>
                    <div style={{ fontWeight:700, fontSize:14, color:t.is_free?C.green:C.t1, marginTop:6 }}>
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
