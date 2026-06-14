import { useState, useEffect } from 'react'
import { Bell, ChevronRight, User, Bell as BellIcon, Shield as ShieldIcon, Award as AwardIcon, Settings as SettingsIcon, TrendingUp, ArrowLeft } from 'lucide-react'
import { C } from '../theme.js'
import { supabase } from '../lib/supabase.js'
import { TrustRing, HealthBadge, SectionLabel, Row } from '../components/atoms.jsx'
import { ACTIVITY_FEED, PLANS } from '../data/index.js'
import { CheckCircle } from 'lucide-react'

// ── NEIGHBORS ─────────────────────────────────────────────────────────────────
export default function NeighborsScreen() {
  const [sos, setSos] = useState(false)
  const GROUPS = [
    { name:'Maple Street HOA',  sub:'Geographic · 0.3 mi radius · 22 members · 89 tools',  rank:'#3 lender this month', color:C.blue   },
    { name:'Woodworking Guild', sub:'Interest group · Members only · 67 members · 203 tools', rank:'Active member',       color:C.purple },
  ]
  return (
    <div style={{ flex:1, overflowY:'auto', background:C.bg }}>
      <div style={{ background:C.card, padding:'8px 16px 14px', borderBottom:`1px solid ${C.brd}` }}>
        <div style={{ fontSize:22, fontWeight:800, color:C.t1, letterSpacing:'-0.4px' }}>Neighbors</div>
        <div style={{ fontSize:13, color:C.t2, marginTop:2 }}>2 groups · 47 active neighbors</div>
      </div>
      <div style={{ padding:'14px 14px 0' }}>
        <div style={{ background:sos?C.redL:C.card, border:`1.5px solid ${sos?C.red:C.brd}`, borderRadius:16, padding:16, marginBottom:14, boxShadow:C.sh }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
            <button className="rg tp" style={{ background:C.red, border:'none', borderRadius:20, padding:'6px 14px', display:'flex', alignItems:'center', gap:6 }}>
              <BellIcon size={12} color="white" strokeWidth={1.5}/><span style={{ color:'white', fontWeight:800, fontSize:11 }}>EMERGENCY SOS</span>
            </button>
            <span style={{ fontSize:12, color:C.t2 }}>Neighborhood alert</span>
          </div>
          <div style={{ fontSize:12, color:C.t2, lineHeight:1.6, marginBottom:12 }}>Alert neighbors within 0.5 miles. Responding in 1 hour earns <span style={{ fontWeight:700, color:C.orange }}>double Trust Points</span>.</div>
          {!sos ? (
            <button onClick={() => setSos(true)} style={{ background:C.red, color:'white', border:'none', borderRadius:10, padding:'11px 0', width:'100%', fontWeight:700, fontSize:13, cursor:'pointer' }}>Send Emergency Alert</button>
          ) : (
            <div>
              <div style={{ display:'flex', gap:6, alignItems:'center', marginBottom:6 }}>
                <span className="bl" style={{ width:7, height:7, borderRadius:4, background:C.red, display:'block' }}/>
                <span style={{ fontWeight:700, fontSize:13, color:C.red }}>ALERT ACTIVE · expires in 3h 42min</span>
              </div>
              <div style={{ fontSize:12, color:C.t2, marginBottom:10 }}>3 neighbors notified · 1 replied: "I have one, be there in 20 min"</div>
              <button onClick={() => setSos(false)} style={{ background:'transparent', border:`1.5px solid ${C.red}`, color:C.red, borderRadius:10, padding:'9px 0', width:'100%', fontSize:12, fontWeight:700, cursor:'pointer' }}>Cancel Alert</button>
            </div>
          )}
        </div>
        <SectionLabel>Live Activity</SectionLabel>
        <div style={{ background:C.card, borderRadius:16, overflow:'hidden', marginBottom:6, boxShadow:C.sh, border:`1px solid ${C.brd}` }}>
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
        <SectionLabel>My Groups</SectionLabel>
        {GROUPS.map((cl, i) => (
          <div key={i} className="tp" style={{ background:C.card, borderRadius:14, padding:14, marginBottom:10, boxShadow:C.sh, border:`1px solid ${C.brd}` }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
              <div>
                <div style={{ fontWeight:700, fontSize:14, color:C.t1 }}>{cl.name}</div>
                <div style={{ fontSize:11, color:C.t2, marginTop:2 }}>{cl.sub}</div>
              </div>
              <ChevronRight size={16} color={C.t3}/>
            </div>
            <div style={{ marginTop:8, background:`${cl.color}15`, borderRadius:8, padding:'4px 10px', display:'inline-block', border:`1px solid ${cl.color}33` }}>
              <span style={{ fontSize:11, color:cl.color, fontWeight:700 }}>{cl.rank}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── PROFILE ───────────────────────────────────────────────────────────────────
export function ProfileScreen({ goPaywall }) {
  const [profile,  setProfile]  = useState(null)
  const [authUser, setAuthUser] = useState(null)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setAuthUser(user)
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(data)
    }
    load()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  const avatar = authUser?.user_metadata?.avatar_url

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
        <div style={{ fontSize:22, fontWeight:800, color:C.t1, letterSpacing:'-0.4px' }}>Profile</div>
        <div style={{ display:'flex', alignItems:'center', gap:16, marginTop:14 }}>
          <div style={{ width:64, height:64, borderRadius:32, background:C.blueL, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, overflow:'hidden' }}>
            {avatar
              ? <img src={avatar} style={{ width:64, height:64, objectFit:'cover' }} alt="avatar"/>
              : <User size={30} color={C.blue} strokeWidth={1.5}/>
            }
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:700, fontSize:17, color:C.t1 }}>{profile?.full_name || authUser?.user_metadata?.full_name || 'Loading...'}</div>
            <div style={{ fontSize:13, color:C.t2, marginTop:1 }}>
              Member since {profile ? new Date(profile.created_at).toLocaleDateString('en-US',{month:'long',year:'numeric'}) : '...'}
            </div>
          </div>
          <TrustRing score={profile?.trust_score || 10} size={62} stroke={5}/>
        </div>
      </div>

      <div style={{ margin:'14px 14px 0', background:`linear-gradient(135deg,${C.blue},${C.blueD})`, borderRadius:16, padding:16, boxShadow:C.shM }}>
        <div style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,.7)', letterSpacing:'0.5px', marginBottom:4 }}>CURRENT PLAN</div>
        <div style={{ fontSize:20, fontWeight:800, color:'white', marginBottom:12, textTransform:'capitalize' }}>{profile?.plan || 'Starter'} — Free</div>
        <button onClick={goPaywall} style={{ background:'white', border:'none', color:C.blue, borderRadius:10, padding:'11px 0', width:'100%', fontWeight:700, fontSize:14, cursor:'pointer' }}>
          Upgrade — from $4.99/mo
        </button>
      </div>

      <SectionLabel>Trust Score</SectionLabel>
      <div style={{ margin:'0 14px', background:C.card, borderRadius:16, padding:16, boxShadow:C.sh, border:`1px solid ${C.brd}` }}>
        <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:14 }}>
          <TrustRing score={profile?.trust_score || 10} size={80} stroke={6}/>
          <div>
            <div style={{ fontWeight:700, fontSize:16, color:C.t1 }}>
              {(profile?.trust_score||10) >= 71 ? 'Trusted Pro' : (profile?.trust_score||10) >= 31 ? 'Neighbor' : 'Newcomer'}
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

      <SectionLabel>Settings</SectionLabel>
      <div style={{ margin:'0 14px 0', background:C.card, borderRadius:16, overflow:'hidden', boxShadow:C.sh, border:`1px solid ${C.brd}` }}>
        <Row icon={BellIcon}     iconBg={C.redL}    iconColor={C.red}    label="Notifications"    sub="Loan alerts, SOS, replies"  onPress={() => {}}/>
        <Row icon={ShieldIcon}   iconBg={C.greenL}  iconColor={C.green}  label="Privacy & Safety" sub="Visibility, blocked users"   onPress={() => {}}/>
        <Row icon={AwardIcon}    iconBg={C.orangeL} iconColor={C.orange} label="Payment & Payouts" sub="Stripe · $0 balance"         onPress={() => {}}/>
        <Row icon={SettingsIcon} iconBg={C.cardAlt} iconColor={C.t2}     label="Account Settings"  noBorder                          onPress={() => {}}/>
      </div>

      <div style={{ margin:'12px 14px 24px' }}>
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
        <div style={{ display:'flex', gap:0, marginTop:12, background:C.cardAlt, borderRadius:10, padding:3, border:`1px solid ${C.brd}` }}>
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
        <div style={{ fontSize:11, color:C.t2, textAlign:'center', marginBottom:24 }}>Cancel anytime. No contracts. Prices in USD.</div>
      </div>
    </div>
  )
}
