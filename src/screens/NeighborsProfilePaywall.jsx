import { useState, useEffect } from 'react'
import { Bell, ChevronRight, Plus, Users, TrendingUp, TrendingDown, ArrowLeft, Camera, AlertTriangle, Package, RotateCcw, Star, UserPlus } from 'lucide-react'
import { C } from '../theme.js'
import { supabase } from '../lib/supabase.js'
import { TrustRing, SectionLabel, Row } from '../components/atoms.jsx'
import { PLANS } from '../data/index.js'
import { CheckCircle, Bell as BellIcon, Shield as ShieldIcon, Award as AwardIcon, Settings as SettingsIcon } from 'lucide-react'

// ── NEIGHBORS ─────────────────────────────────────────────────────────────────
export default function NeighborsScreen({ goCreateGroup, goJoinGroup, goGroupDetail }) {
  const [sosActive,  setSosActive]  = useState(false)
  const [sosId,      setSosId]      = useState(null)
  const [sosAlerts,  setSosAlerts]  = useState([])
  const [groups,     setGroups]     = useState([])
  const [activity,   setActivity]   = useState([])
  const [userId,     setUserId]     = useState(null)
  const [userName,   setUserName]   = useState('')

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUserId(user.id)
      const { data: prof } = await supabase.from('profiles').select('full_name').eq('id', user.id).single()
      setUserName(prof?.full_name || 'Neighbor')

      const [{ data: memberships }, { data: alerts }, { data: loans }, { data: newTools }] = await Promise.all([
        supabase.from('group_members').select('group_id, groups(id, name, type, invite_code)').eq('profile_id', user.id),
        supabase.from('sos_alerts').select('*, profiles!sender_id(full_name)').gt('expires_at', new Date().toISOString()),
        supabase.from('loans').select('created_at, status, tools(name), profiles!borrower_id(full_name)').in('status',['approved','returned','requested']).order('created_at',{ascending:false}).limit(6),
        supabase.from('tools').select('created_at, name, profiles(full_name)').eq('visibility','public').order('created_at',{ascending:false}).limit(4),
      ])

      setGroups(memberships?.map(m => m.groups).filter(Boolean) || [])
      setSosAlerts(alerts || [])
      const myAlert = alerts?.find(a => a.sender_id === user.id)
      if (myAlert) { setSosActive(true); setSosId(myAlert.id) }

      // Build real activity feed
      const acts = []
      loans?.forEach(l => {
        const name = l.profiles?.full_name?.split(' ')[0] || 'A neighbor'
        const tool = l.tools?.name || 'a tool'
        if (l.status === 'approved')   acts.push({ Icon:Package,    color:C.blue,   msg:`${name} borrowed ${tool}`,           t: timeAgo(l.created_at) })
        if (l.status === 'returned')   acts.push({ Icon:RotateCcw,  color:C.green,  msg:`${name} returned ${tool} ✓`,          t: timeAgo(l.created_at) })
        if (l.status === 'requested')  acts.push({ Icon:Star,       color:C.orange, msg:`${name} requested to borrow ${tool}`, t: timeAgo(l.created_at) })
      })
      newTools?.forEach(t => {
        const name = t.profiles?.full_name?.split(' ')[0] || 'A neighbor'
        acts.push({ Icon:UserPlus, color:'#AF52DE', msg:`${name} listed ${t.name} to share`, t: timeAgo(t.created_at) })
      })
      // Sort by recency (approximate since timeAgo is text)
      setActivity(acts.slice(0, 8))
    }
    init()
  }, [])

  const timeAgo = (d) => {
    const diff = Date.now() - new Date(d).getTime()
    const m = Math.floor(diff / 60000)
    if (m < 60) return `${m}m ago`
    const h = Math.floor(m / 60)
    if (h < 24) return `${h}h ago`
    return `${Math.floor(h/24)}d ago`
  }

  const activateSOS = async () => {
    const { data } = await supabase.from('sos_alerts').insert({ sender_id:userId, sender_name:userName, message:'Emergency tool needed!' }).select().single()
    if (data) { setSosId(data.id); setSosActive(true) }
  }

  const cancelSOS = async () => {
    if (sosId) await supabase.from('sos_alerts').delete().eq('id', sosId)
    setSosActive(false); setSosId(null)
    setSosAlerts(a => a.filter(s => s.id !== sosId))
  }

  const otherAlerts = sosAlerts.filter(a => a.sender_id !== userId)

  return (
    <div style={{ flex:1, overflowY:'auto', background:C.bg }}>
      <div style={{ background:C.card, padding:'8px 16px 14px', borderBottom:`1px solid ${C.brd}` }}>
        <div style={{ fontSize:22, fontWeight:800, color:C.t1, letterSpacing:'-0.4px' }}>Neighbors</div>
        <div style={{ fontSize:13, color:C.t2, marginTop:2 }}>{groups.length} group{groups.length!==1?'s':''} · Community hub</div>
      </div>
      <div style={{ padding:'14px 14px 0' }}>

        {otherAlerts.length > 0 && (
          <div style={{ background:C.redL, borderRadius:16, padding:14, marginBottom:14, border:`1.5px solid ${C.red}44` }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
              <span style={{ width:8, height:8, borderRadius:4, background:C.red, display:'block' }}/>
              <span style={{ fontWeight:800, fontSize:12, color:C.red }}>SOS FROM NEIGHBORS</span>
            </div>
            {otherAlerts.map(alert => (
              <div key={alert.id} style={{ marginBottom:8 }}>
                <div style={{ fontSize:13, fontWeight:600, color:C.t1, marginBottom:6 }}>
                  🚨 <b>{alert.sender_name || alert.profiles?.full_name || 'A neighbor'}</b> needs emergency tool help!
                </div>
                <div style={{ fontSize:11, color:C.t2, marginBottom:8 }}>Responding within 1 hour earns <span style={{ fontWeight:700, color:C.orange }}>double Trust Points</span></div>
                <button style={{ width:'100%', background:C.red, border:'none', color:'white', borderRadius:10, padding:'10px 0', fontWeight:700, fontSize:13, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
                  <AlertTriangle size={14}/>I Can Help →
                </button>
              </div>
            ))}
          </div>
        )}

        {/* SOS */}
        <div style={{ background:sosActive?C.redL:C.card, border:`1.5px solid ${sosActive?C.red:C.brd}`, borderRadius:16, padding:16, marginBottom:14, boxShadow:C.sh }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
            <div style={{ background:C.red, borderRadius:20, padding:'6px 14px', display:'flex', alignItems:'center', gap:6 }}>
              <BellIcon size={12} color="white" strokeWidth={1.5}/>
              <span style={{ color:'white', fontWeight:800, fontSize:11 }}>EMERGENCY SOS</span>
            </div>
            {sosActive && <span style={{ fontSize:11, fontWeight:600, color:C.red }}>● ACTIVE</span>}
          </div>
          <div style={{ fontSize:12, color:C.t2, lineHeight:1.6, marginBottom:12 }}>
            Alert neighbors within 0.5 miles. Responding within 1 hour earns <span style={{ fontWeight:700, color:C.orange }}>double Trust Points</span>.
          </div>
          {!sosActive ? (
            <button onClick={activateSOS} style={{ background:C.red, color:'white', border:'none', borderRadius:10, padding:'11px 0', width:'100%', fontWeight:700, fontSize:13, cursor:'pointer' }}>Send Emergency Alert</button>
          ) : (
            <div>
              <div style={{ fontSize:12, color:C.t2, marginBottom:10 }}>Your alert is live — neighbors can see it. Expires in 4 hours.</div>
              <button onClick={cancelSOS} style={{ background:'transparent', border:`1.5px solid ${C.red}`, color:C.red, borderRadius:10, padding:'9px 0', width:'100%', fontSize:12, fontWeight:700, cursor:'pointer' }}>Cancel Alert</button>
            </div>
          )}
        </div>

        {/* Group buttons */}
        <div style={{ display:'flex', gap:10, marginBottom:14 }}>
          <button onClick={goCreateGroup} style={{ flex:1, background:C.blue, border:'none', color:'white', borderRadius:12, padding:'11px 0', fontWeight:700, fontSize:13, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:6, boxShadow:`0 4px 12px ${C.blue}44` }}>
            <Plus size={15}/>Create Group
          </button>
          <button onClick={goJoinGroup} style={{ flex:1, background:C.card, border:`1.5px solid ${C.blue}`, color:C.blue, borderRadius:12, padding:'11px 0', fontWeight:700, fontSize:13, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
            <Users size={15}/>Join Group
          </button>
        </div>

        <SectionLabel>My Groups</SectionLabel>
        {groups.length === 0 ? (
          <div style={{ background:C.card, borderRadius:16, padding:'24px 20px', textAlign:'center', boxShadow:C.sh, border:`1px solid ${C.brd}`, marginBottom:14 }}>
            <div style={{ fontSize:32, marginBottom:10 }}>👥</div>
            <div style={{ fontWeight:700, fontSize:15, color:C.t1 }}>No groups yet</div>
            <div style={{ fontSize:13, color:C.t2, marginTop:6 }}>Create a group or join one with an invite code</div>
          </div>
        ) : groups.map(g => (
          <div key={g.id} onClick={() => goGroupDetail(g)} className="tp"
            style={{ background:C.card, borderRadius:14, padding:14, marginBottom:10, boxShadow:C.sh, border:`1px solid ${C.brd}` }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div>
                <div style={{ fontWeight:700, fontSize:14, color:C.t1 }}>{g.name}</div>
                <div style={{ fontSize:11, color:C.t2, marginTop:2 }}>{g.type} · Code: <span style={{ fontFamily:'monospace', fontWeight:700, color:C.blue }}>{g.invite_code}</span></div>
              </div>
              <ChevronRight size={16} color={C.t3}/>
            </div>
          </div>
        ))}

        <SectionLabel>Live Activity</SectionLabel>
        <div style={{ background:C.card, borderRadius:16, overflow:'hidden', marginBottom:24, boxShadow:C.sh, border:`1px solid ${C.brd}` }}>
          {activity.length === 0 ? (
            <div style={{ padding:'20px 14px', textAlign:'center', fontSize:13, color:C.t2 }}>No recent activity yet</div>
          ) : activity.map((a, i) => (
            <div key={i} style={{ display:'flex', gap:12, padding:'12px 14px', borderTop:i?`1px solid ${C.brd}`:'none', alignItems:'center' }}>
              <div style={{ width:34, height:34, borderRadius:10, background:`${a.color}15`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <a.Icon size={16} color={a.color} strokeWidth={1.5}/>
              </div>
              <div style={{ flex:1 }}><span style={{ fontSize:12, color:C.t1, lineHeight:1.5 }}>{a.msg}</span></div>
              <span style={{ fontSize:10, color:C.t3, flexShrink:0 }}>{a.t}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── PROFILE ───────────────────────────────────────────────────────────────────
export function ProfileScreen({ goPaywall, goNotifications, goPrivacy, goPayment, goAccount, refreshKey }) {
  const [profile,      setProfile]      = useState(null)
  const [authUser,     setAuthUser]     = useState(null)
  const [trustEvents,  setTrustEvents]  = useState([])
  const [uploadingPic, setUploadingPic] = useState(false)

  useEffect(() => { loadAll() }, [refreshKey])

  const loadAll = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setAuthUser(user)
    const [{ data: prof }, { data: lenderLoans }, { data: borrowerLoans }, { data: tools }] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('loans').select('status, created_at, tools(name)').eq('lender_id', user.id),
      supabase.from('loans').select('status, rating, created_at, tools(name)').eq('borrower_id', user.id),
      supabase.from('tools').select('id, name, created_at').eq('owner_id', user.id),
    ])
    let score = 10
    score += 20
    score += Math.min((tools?.length || 0) * 3, 15)
    score += (lenderLoans?.filter(l => l.status === 'returned').length || 0) * 5
    score += (borrowerLoans?.filter(l => l.status === 'returned').length || 0) * 5
    score -= (borrowerLoans?.filter(l => l.status === 'disputed').length || 0) * 10
    score = Math.min(100, Math.max(0, score))
    if (prof && prof.trust_score !== score) {
      await supabase.from('profiles').update({ trust_score: score }).eq('id', user.id)
    }
    setProfile({ ...prof, trust_score: score })
    const fmt = (d) => new Date(d).toLocaleDateString('en-US',{month:'short',day:'numeric'})
    const events = [
      { d:'+20', l:'Identity verified · Google', f:fmt(user.created_at), p:true },
      ...(tools||[]).map(t => ({ d:'+3', l:`Tool listed · ${t.name}`, f:fmt(t.created_at), p:true })),
      ...(lenderLoans||[]).filter(l=>l.status==='returned').map(l=>({ d:'+5', l:`Loan confirmed · ${l.tools?.name||'Tool'}`, f:fmt(l.created_at), p:true })),
      ...(borrowerLoans||[]).filter(l=>l.status==='returned').map(l=>({ d:'+5', l:`On-time return · ${l.tools?.name||'Tool'}`, f:fmt(l.created_at), p:true })),
      ...(borrowerLoans||[]).filter(l=>l.status==='disputed').map(l=>({ d:'-10', l:`Disputed · ${l.tools?.name||'Tool'}`, f:fmt(l.created_at), p:false })),
    ].slice(0, 8)
    setTrustEvents(events)
  }

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0]; if (!file) return
    setUploadingPic(true)
    const { data: { user } } = await supabase.auth.getUser()
    const path = `${user.id}/avatar-${Date.now()}.${file.name.split('.').pop()}`
    await supabase.storage.from('tool-photos').upload(path, file)
    const { data } = supabase.storage.from('tool-photos').getPublicUrl(path)
    const freshUrl = `${data.publicUrl}?t=${Date.now()}`
    await supabase.from('profiles').update({ avatar_url: freshUrl }).eq('id', user.id)
    setProfile(p => ({ ...p, avatar_url: freshUrl }))
    setUploadingPic(false)
  }

  const handleSignOut = async () => { await supabase.auth.signOut() }
  const avatar  = profile?.avatar_url || authUser?.user_metadata?.avatar_url
  const score   = profile?.trust_score || 10
  const tier    = score >= 71 ? 'Trusted Pro' : score >= 31 ? 'Neighbor' : 'Newcomer'
  const nextTier= score >= 71 ? 'Community Pillar' : score >= 31 ? 'Trusted Pro' : 'Neighbor'
  const nextAt  = score >= 71 ? 100 : score >= 31 ? 71 : 31

  return (
    <div style={{ flex:1, overflowY:'auto', background:C.bg }}>
      <div style={{ background:C.card, padding:'8px 16px 20px', borderBottom:`1px solid ${C.brd}` }}>
        <div style={{ fontSize:22, fontWeight:800, color:C.t1, letterSpacing:'-0.4px', marginBottom:14 }}>Profile</div>
        <div style={{ display:'flex', alignItems:'center', gap:16 }}>
          <label style={{ position:'relative', cursor:'pointer', flexShrink:0 }}>
            <input type="file" accept="image/*" onChange={handleAvatarChange} style={{ display:'none' }}/>
            <div style={{ width:64, height:64, borderRadius:32, background:C.blueL, overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center' }}>
              {uploadingPic ? <div style={{ fontSize:11, color:C.blue }}>...</div>
                : avatar ? <img src={avatar} style={{ width:64, height:64, objectFit:'cover' }} alt="avatar"/>
                : <span style={{ fontSize:26, fontWeight:700, color:C.blue }}>{(profile?.full_name||'?')[0]}</span>
              }
            </div>
            <div style={{ position:'absolute', bottom:0, right:0, width:22, height:22, borderRadius:11, background:C.blue, border:`2px solid ${C.card}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Camera size={10} color="white" strokeWidth={2}/>
            </div>
          </label>
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:700, fontSize:17, color:C.t1 }}>{profile?.full_name || authUser?.user_metadata?.full_name || '...'}</div>
            <div style={{ fontSize:13, color:C.t2, marginTop:2 }}>Member since {profile ? new Date(profile.created_at).toLocaleDateString('en-US',{month:'long',year:'numeric'}) : '...'}</div>
            <div style={{ fontSize:11, color:C.t3, marginTop:2 }}>Tap photo to change</div>
          </div>
          <TrustRing score={score} size={62} stroke={5}/>
        </div>
      </div>

      <div style={{ margin:'14px 14px 0', background:`linear-gradient(135deg,${C.blue},${C.blueD})`, borderRadius:16, padding:16, boxShadow:C.shM }}>
        <div style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,.7)', letterSpacing:'0.5px', marginBottom:4 }}>CURRENT PLAN</div>
        <div style={{ fontSize:20, fontWeight:800, color:'white', marginBottom:12, textTransform:'capitalize' }}>{profile?.plan||'Starter'} — Free</div>
        <button onClick={goPaywall} style={{ background:'white', border:'none', color:C.blue, borderRadius:10, padding:'11px 0', width:'100%', fontWeight:700, fontSize:14, cursor:'pointer' }}>Upgrade — from $4.99/mo</button>
      </div>

      <SectionLabel>Trust Score</SectionLabel>
      <div style={{ margin:'0 14px', background:C.card, borderRadius:16, padding:16, boxShadow:C.sh, border:`1px solid ${C.brd}` }}>
        <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:10 }}>
          <TrustRing score={score} size={80} stroke={6}/>
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:700, fontSize:16, color:C.t1 }}>{tier}</div>
            <div style={{ fontSize:12, color:C.t2, marginTop:2 }}>{nextAt - score} pts to {nextTier}</div>
            <div style={{ marginTop:8, height:4, background:C.bg, borderRadius:2, overflow:'hidden' }}>
              <div style={{ height:'100%', width:`${Math.min((score/nextAt)*100,100)}%`, background:`linear-gradient(90deg,${C.blue},${C.orange})`, borderRadius:2 }}/>
            </div>
          </div>
        </div>
        {trustEvents.length === 0 ? (
          <div style={{ textAlign:'center', padding:'12px 0', fontSize:13, color:C.t2 }}>Complete loans to earn Trust Points</div>
        ) : trustEvents.map((e, i) => (
          <div key={i} style={{ display:'flex', alignItems:'center', gap:12, paddingTop:10, borderTop:`1px solid ${C.brd}` }}>
            <div style={{ width:32, height:32, borderRadius:10, background:`${e.p?C.green:C.red}15`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              {e.p ? <TrendingUp size={14} color={C.green} strokeWidth={1.5}/> : <TrendingDown size={14} color={C.red} strokeWidth={1.5}/>}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12, fontWeight:500, color:C.t1 }}>{e.l}</div>
              {e.f && <div style={{ fontSize:10, color:C.t3, marginTop:1 }}>{e.f}</div>}
            </div>
            <span style={{ fontWeight:800, fontSize:15, color:e.p?C.green:C.red }}>{e.d}</span>
          </div>
        ))}
      </div>

      <SectionLabel>Settings</SectionLabel>
      <div style={{ margin:'0 14px', background:C.card, borderRadius:16, overflow:'hidden', boxShadow:C.sh, border:`1px solid ${C.brd}` }}>
        <Row icon={BellIcon}     iconBg={C.redL}    iconColor={C.red}    label="Notifications"    sub="Loan alerts, SOS, replies"  onPress={goNotifications}/>
        <Row icon={ShieldIcon}   iconBg={C.greenL}  iconColor={C.green}  label="Privacy & Safety" sub="Visibility, blocked users"   onPress={goPrivacy}/>
        <Row icon={AwardIcon}    iconBg={C.orangeL} iconColor={C.orange} label="Payment & Payouts" sub="Stripe · $0 balance"         onPress={goPayment}/>
        <Row icon={SettingsIcon} iconBg={C.cardAlt} iconColor={C.t2}     label="Account Settings"  noBorder                          onPress={goAccount}/>
      </div>

      <div style={{ margin:'12px 14px 28px' }}>
        <button onClick={handleSignOut} style={{ width:'100%', background:C.card, border:`1px solid ${C.red}33`, borderRadius:14, padding:'13px 0', fontWeight:700, fontSize:14, color:C.red, cursor:'pointer', boxShadow:C.sh }}>
          Sign Out
        </button>
      </div>
    </div>
  )
}

// ── PAYWALL ───────────────────────────────────────────────────────────────────
export function PaywallScreen({ onBack }) {
  const [sel, setSel] = useState('neighbor')
  const [annual, setAnnual] = useState(false)
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflowY:'auto', background:C.bg }}>
      <div style={{ background:C.card, padding:'8px 14px 14px', borderBottom:`1px solid ${C.brd}`, flexShrink:0 }}>
        <button onClick={onBack} className="tp" style={{ background:'none', border:'none', color:C.blue, fontSize:14, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:4, padding:'2px 0 10px' }}>
          <ArrowLeft size={14}/><span>Profile</span>
        </button>
        <div style={{ fontWeight:800, fontSize:22, color:C.t1, letterSpacing:'-0.4px' }}>Choose a Plan</div>
        <div style={{ fontSize:13, color:C.t2, marginTop:2 }}>Own less. Do more. Save money.</div>
        <div style={{ display:'flex', marginTop:12, background:C.cardAlt, borderRadius:10, padding:3, border:`1px solid ${C.brd}` }}>
          {['Monthly','Annual (save 20%)'].map((lbl,i) => (
            <button key={i} onClick={() => setAnnual(i===1)} style={{ flex:1, border:'none', borderRadius:8, padding:'7px 0', fontWeight:600, fontSize:12, cursor:'pointer', background:annual===(i===1)?C.card:'transparent', color:annual===(i===1)?C.t1:C.t2, boxShadow:annual===(i===1)?C.sh:'none' }}>{lbl}</button>
          ))}
        </div>
      </div>
      <div style={{ padding:'14px 14px 0' }}>
        {PLANS.map(plan => (
          <div key={plan.id} onClick={() => setSel(plan.id)} className="tp"
            style={{ background:C.card, borderRadius:16, padding:18, marginBottom:12, boxShadow:sel===plan.id?C.shM:C.sh, border:`2px solid ${sel===plan.id?plan.color:C.brd}`, position:'relative' }}>
            {plan.popular && <div style={{ position:'absolute', top:-10, left:'50%', transform:'translateX(-50%)', background:C.blue, color:'white', borderRadius:20, padding:'4px 14px', fontSize:11, fontWeight:700, whiteSpace:'nowrap' }}>Most Popular</div>}
            <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:14 }}>
              <div>
                <div style={{ fontWeight:800, fontSize:18, color:C.t1 }}>{plan.name}</div>
                <div style={{ fontSize:24, fontWeight:800, color:plan.color, marginTop:4 }}>{plan.price}<span style={{ fontSize:13, fontWeight:500, color:C.t2 }}>{annual&&plan.price!=='Free'?'/mo billed annually':plan.period}</span></div>
              </div>
              <div style={{ width:28, height:28, borderRadius:14, border:`2px solid ${sel===plan.id?plan.color:C.brd}`, background:sel===plan.id?plan.color:'transparent', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                {sel===plan.id&&<CheckCircle size={16} color="white" strokeWidth={2}/>}
              </div>
            </div>
            {plan.features.map((f,i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:i<plan.features.length-1?8:0 }}>
                <CheckCircle size={14} color={plan.color} strokeWidth={2} style={{ flexShrink:0 }}/>
                <span style={{ fontSize:13, color:C.t1 }}>{f}</span>
              </div>
            ))}
          </div>
        ))}
        <button style={{ background:sel==='starter'?'#C7C7CC':C.blue, color:'white', border:'none', borderRadius:14, padding:'16px 0', width:'100%', fontWeight:800, fontSize:16, cursor:'pointer', marginBottom:8 }}>
          {sel==='starter'?'Continue Free →':`Start ${PLANS.find(p=>p.id===sel)?.name} — 7-day free trial`}
        </button>
        <div style={{ fontSize:11, color:C.t2, textAlign:'center', marginBottom:28 }}>Cancel anytime. No contracts. Prices in USD.</div>
      </div>
    </div>
  )
}
