import { useState, useEffect } from 'react'
import { Bell, ChevronRight, Plus, Users, TrendingUp, ArrowLeft, Camera } from 'lucide-react'
import { C } from '../theme.js'
import { supabase } from '../lib/supabase.js'
import { TrustRing, SectionLabel, Row } from '../components/atoms.jsx'
import { ACTIVITY_FEED, PLANS } from '../data/index.js'
import { CheckCircle, Bell as BellIcon, Shield as ShieldIcon, Award as AwardIcon, Settings as SettingsIcon } from 'lucide-react'

// ── NEIGHBORS ─────────────────────────────────────────────────────────────────
export default function NeighborsScreen({ goCreateGroup, goJoinGroup, goGroupDetail }) {
  const [sos,    setSos]    = useState(false)
  const [groups, setGroups] = useState([])

  useEffect(() => {
    const fetch = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      const { data } = await supabase.from('group_members')
        .select('group_id, groups(id, name, type, invite_code)')
        .eq('profile_id', user.id)
      setGroups(data?.map(m => m.groups).filter(Boolean) || [])
    }
    fetch()
  }, [])

  return (
    <div style={{ flex:1, overflowY:'auto', background:C.bg }}>
      <div style={{ background:C.card, padding:'8px 16px 14px', borderBottom:`1px solid ${C.brd}` }}>
        <div style={{ fontSize:22, fontWeight:800, color:C.t1, letterSpacing:'-0.4px' }}>Neighbors</div>
        <div style={{ fontSize:13, color:C.t2, marginTop:2 }}>{groups.length} group{groups.length!==1?'s':''} · Community hub</div>
      </div>
      <div style={{ padding:'14px 14px 0' }}>
        {/* SOS */}
        <div style={{ background:sos?C.redL:C.card, border:`1.5px solid ${sos?C.red:C.brd}`, borderRadius:16, padding:16, marginBottom:14, boxShadow:C.sh }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
            <button className="rg tp" style={{ background:C.red, border:'none', borderRadius:20, padding:'6px 14px', display:'flex', alignItems:'center', gap:6 }}>
              <BellIcon size={12} color="white" strokeWidth={1.5}/>
              <span style={{ color:'white', fontWeight:800, fontSize:11 }}>EMERGENCY SOS</span>
            </button>
            <span style={{ fontSize:12, color:C.t2 }}>Neighborhood alert</span>
          </div>
          <div style={{ fontSize:12, color:C.t2, lineHeight:1.6, marginBottom:12 }}>
            Alert neighbors within 0.5 miles. Responding within 1 hour earns <span style={{ fontWeight:700, color:C.orange }}>double Trust Points</span>.
          </div>
          {!sos ? (
            <button onClick={() => setSos(true)} style={{ background:C.red, color:'white', border:'none', borderRadius:10, padding:'11px 0', width:'100%', fontWeight:700, fontSize:13, cursor:'pointer' }}>Send Emergency Alert</button>
          ) : (
            <div>
              <div style={{ display:'flex', gap:6, alignItems:'center', marginBottom:6 }}>
                <span style={{ width:7, height:7, borderRadius:4, background:C.red, display:'block' }}/>
                <span style={{ fontWeight:700, fontSize:13, color:C.red }}>ALERT ACTIVE · expires in 3h 42min</span>
              </div>
              <div style={{ fontSize:12, color:C.t2, marginBottom:10 }}>3 neighbors notified</div>
              <button onClick={() => setSos(false)} style={{ background:'transparent', border:`1.5px solid ${C.red}`, color:C.red, borderRadius:10, padding:'9px 0', width:'100%', fontSize:12, fontWeight:700, cursor:'pointer' }}>Cancel Alert</button>
            </div>
          )}
        </div>

        {/* Group actions */}
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
          {ACTIVITY_FEED.map((a, i) => (
            <div key={i} style={{ display:'flex', gap:12, padding:'12px 14px', borderTop:i?`1px solid ${C.brd}`:'none', alignItems:'flex-start' }}>
              <div style={{ width:34, height:34, borderRadius:10, background:`${a.color}15`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <a.icon size={16} color={a.color} strokeWidth={1.5}/>
              </div>
              <div style={{ flex:1 }}><span style={{ fontSize:12, color:C.t1, lineHeight:1.5 }}>{a.msg}</span></div>
              <span style={{ fontSize:10, color:C.t3, flexShrink:0, marginTop:1 }}>{a.t}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── PROFILE ───────────────────────────────────────────────────────────────────
export function ProfileScreen({ goPaywall, goNotifications, goPrivacy, goPayment, goAccount }) {
  const [profile,      setProfile]      = useState(null)
  const [authUser,     setAuthUser]     = useState(null)
  const [uploadingPic, setUploadingPic] = useState(false)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setAuthUser(user)
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(data)
    }
    load()
  }, [])

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploadingPic(true)
    const { data: { user } } = await supabase.auth.getUser()
    const ext = file.name.split('.').pop()
    const path = `${user.id}/avatar.${ext}`
    await supabase.storage.from('tool-photos').upload(path, file, { upsert: true })
    const { data } = supabase.storage.from('tool-photos').getPublicUrl(path)
    await supabase.from('profiles').update({ avatar_url: data.publicUrl }).eq('id', user.id)
    setProfile(p => ({ ...p, avatar_url: data.publicUrl }))
    setUploadingPic(false)
  }

  const handleSignOut = async () => { await supabase.auth.signOut() }

  const avatar = profile?.avatar_url || authUser?.user_metadata?.avatar_url

  const EVS = [
    { d:'+5',  l:'On-time return · Orbital Sander',       f:'Jun 8',  p:true  },
    { d:'+10', l:'Skill Swap hosted · Woodworking',        f:'Jun 5',  p:true  },
    { d:'+5',  l:'On-time return · Power Drill',           f:'May 29', p:true  },
    { d:'-5',  l:'Late return (< 24h) · Pressure Washer', f:'May 15', p:false },
    { d:'+20', l:'Identity verified',                       f:'Apr 10', p:true  },
  ]

  return (
    <div style={{ flex:1, overflowY:'auto', background:C.bg }}>
      <div style={{ background:C.card, padding:'8px 16px 20px', borderBottom:`1px solid ${C.brd}` }}>
        <div style={{ fontSize:22, fontWeight:800, color:C.t1, letterSpacing:'-0.4px', marginBottom:14 }}>Profile</div>
        <div style={{ display:'flex', alignItems:'center', gap:16 }}>
          {/* Avatar with edit */}
          <label style={{ position:'relative', cursor:'pointer', flexShrink:0 }}>
            <input type="file" accept="image/*" onChange={handleAvatarChange} style={{ display:'none' }}/>
            <div style={{ width:64, height:64, borderRadius:32, background:C.blueL, overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center' }}>
              {uploadingPic ? (
                <div style={{ fontSize:11, color:C.blue, fontWeight:600 }}>...</div>
              ) : avatar ? (
                <img src={avatar} style={{ width:64, height:64, objectFit:'cover' }} alt="avatar"/>
              ) : (
                <span style={{ fontSize:26, fontWeight:700, color:C.blue }}>{(profile?.full_name||'?')[0]}</span>
              )}
            </div>
            <div style={{ position:'absolute', bottom:0, right:0, width:22, height:22, borderRadius:11, background:C.blue, border:`2px solid ${C.card}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Camera size={10} color="white" strokeWidth={2}/>
            </div>
          </label>
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:700, fontSize:17, color:C.t1 }}>{profile?.full_name || authUser?.user_metadata?.full_name || '...'}</div>
            <div style={{ fontSize:13, color:C.t2, marginTop:2 }}>
              Member since {profile ? new Date(profile.created_at).toLocaleDateString('en-US',{month:'long',year:'numeric'}) : '...'}
            </div>
            <div style={{ fontSize:11, color:C.t3, marginTop:2 }}>Tap photo to change</div>
          </div>
          <TrustRing score={profile?.trust_score||10} size={62} stroke={5}/>
        </div>
      </div>

      {/* Plan banner */}
      <div style={{ margin:'14px 14px 0', background:`linear-gradient(135deg,${C.blue},${C.blueD})`, borderRadius:16, padding:16, boxShadow:C.shM }}>
        <div style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,.7)', letterSpacing:'0.5px', marginBottom:4 }}>CURRENT PLAN</div>
        <div style={{ fontSize:20, fontWeight:800, color:'white', marginBottom:12, textTransform:'capitalize' }}>{profile?.plan||'Starter'} — Free</div>
        <button onClick={goPaywall} style={{ background:'white', border:'none', color:C.blue, borderRadius:10, padding:'11px 0', width:'100%', fontWeight:700, fontSize:14, cursor:'pointer' }}>
          Upgrade — from $4.99/mo
        </button>
      </div>

      {/* Trust Score */}
      <SectionLabel>Trust Score</SectionLabel>
      <div style={{ margin:'0 14px', background:C.card, borderRadius:16, padding:16, boxShadow:C.sh, border:`1px solid ${C.brd}` }}>
        <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:14 }}>
          <TrustRing score={profile?.trust_score||10} size={80} stroke={6}/>
          <div>
            <div style={{ fontWeight:700, fontSize:16, color:C.t1 }}>
              {(profile?.trust_score||10)>=71?'Trusted Pro':(profile?.trust_score||10)>=31?'Neighbor':'Newcomer'}
            </div>
            <div style={{ fontSize:12, color:C.t2, marginTop:2 }}>Keep lending to grow your score</div>
          </div>
        </div>
        {EVS.map((e, i) => (
          <div key={i} style={{ display:'flex', alignItems:'center', gap:12, paddingTop:i?10:0, borderTop:i?`1px solid ${C.brd}`:'none' }}>
            <div style={{ width:32, height:32, borderRadius:10, background:`${e.p?C.green:C.red}15`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <TrendingUp size={14} color={e.p?C.green:C.red} strokeWidth={1.5}/>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12, fontWeight:500, color:C.t1 }}>{e.l}</div>
              <div style={{ fontSize:10, color:C.t3, marginTop:1 }}>{e.f}</div>
            </div>
            <span style={{ fontWeight:800, fontSize:15, color:e.p?C.green:C.red }}>{e.d}</span>
          </div>
        ))}
      </div>

      {/* Settings */}
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
  const [sel,    setSel]    = useState('neighbor')
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
            <button key={i} onClick={() => setAnnual(i===1)}
              style={{ flex:1, border:'none', borderRadius:8, padding:'7px 0', fontWeight:600, fontSize:12, cursor:'pointer', background:annual===(i===1)?C.card:'transparent', color:annual===(i===1)?C.t1:C.t2, boxShadow:annual===(i===1)?C.sh:'none' }}>
              {lbl}
            </button>
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
                <div style={{ fontSize:24, fontWeight:800, color:plan.color, marginTop:4 }}>
                  {plan.price}<span style={{ fontSize:13, fontWeight:500, color:C.t2 }}>{annual&&plan.price!=='Free'?'/mo billed annually':plan.period}</span>
                </div>
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
