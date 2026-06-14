import { useState } from 'react'
import { ArrowLeft, User, Star, Shield, CheckCircle } from 'lucide-react'
import { C, hlt } from '../theme.js'
import { supabase } from '../lib/supabase.js'
import { HealthBadge } from '../components/atoms.jsx'
import { Wrench, Hammer, Leaf, Zap, Droplets } from 'lucide-react'

const CAT_ICONS  = { 'Power Tools':Hammer, 'Yard & Garden':Leaf, 'Cleaning':Droplets, 'Hand Tools':Wrench, 'Other':Zap }
const CAT_COLORS = { 'Power Tools':'#FF9500', 'Yard & Garden':'#34C759', 'Cleaning':'#007AFF', 'Hand Tools':'#007AFF', 'Other':'#AF52DE' }

export default function RealDetailScreen({ tool, onBack }) {
  const [waiver,    setWaiver]    = useState(false)
  const [requested, setRequested] = useState(false)
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')

  const h     = hlt(tool.health || 80)
  const Icon  = CAT_ICONS[tool.category]  || Wrench
  const color = CAT_COLORS[tool.category] || C.blue

  const requestLoan = async () => {
    setLoading(true)
    setError('')
    const { data: { user } } = await supabase.auth.getUser()
    if (user.id === tool.owner_id) {
      setError("You can't borrow your own tool")
      setLoading(false)
      return
    }
    const returnBy = new Date()
    returnBy.setDate(returnBy.getDate() + 1)
    const { error } = await supabase.from('loans').insert({
      tool_id:          tool.id,
      borrower_id:      user.id,
      lender_id:        tool.owner_id,
      status:           'requested',
      return_by:        returnBy.toISOString(),
      waiver_signed_at: new Date().toISOString(),
    })
    if (error) { setError(error.message) }
    else { setRequested(true) }
    setLoading(false)
  }

  if (requested) return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:C.bg, padding:24 }}>
      <div style={{ width:80, height:80, borderRadius:40, background:C.greenL, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:20 }}>
        <CheckCircle size={44} color={C.green} strokeWidth={1.5}/>
      </div>
      <div style={{ fontWeight:800, fontSize:24, color:C.t1, textAlign:'center', letterSpacing:'-0.4px', marginBottom:8 }}>Request Sent!</div>
      <div style={{ fontSize:14, color:C.t2, textAlign:'center', lineHeight:1.6, marginBottom:28 }}>
        {tool.profiles?.full_name || 'The owner'} will be notified and can approve your request.
      </div>
      <button onClick={onBack} style={{ background:C.blue, color:'white', border:'none', borderRadius:12, padding:'14px 32px', fontWeight:700, fontSize:15, cursor:'pointer' }}>
        Back to Browse
      </button>
    </div>
  )

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflowY:'auto', background:C.bg }}>

      {/* HERO */}
      <div style={{ height:220, position:'relative', flexShrink:0, overflow:'hidden', background:`linear-gradient(135deg,${color}10,${color}22)`, display:'flex', alignItems:'center', justifyContent:'center' }}>
        {tool.photo_urls?.[0] ? (
          <img src={tool.photo_urls[0]} style={{ width:'100%', height:'100%', objectFit:'contain' }} alt={tool.name}/>
        ) : (
          <div style={{ width:80, height:80, borderRadius:24, background:C.card, boxShadow:`0 8px 24px ${color}30`, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <Icon size={40} color={color} strokeWidth={1.5}/>
          </div>
        )}
        <button onClick={onBack} className="tp" style={{ position:'absolute', top:12, left:12, background:'rgba(255,255,255,.9)', backdropFilter:'blur(10px)', border:`1px solid ${C.brd}`, borderRadius:20, padding:'7px 14px', display:'flex', alignItems:'center', gap:6 }}>
          <ArrowLeft size={13} color={C.t1}/><span style={{ fontSize:12, fontWeight:600, color:C.t1 }}>Back</span>
        </button>
        {tool.health && (
          <div style={{ position:'absolute', bottom:12, right:12 }}>
            <HealthBadge pct={tool.health}/>
          </div>
        )}
      </div>

      <div style={{ padding:16 }}>
        <div style={{ fontSize:22, fontWeight:800, color:C.t1, letterSpacing:'-0.4px' }}>{tool.name}</div>
        <div style={{ fontSize:14, color:C.t2, marginTop:2 }}>{tool.brand || 'No brand'} · {tool.category}</div>
        <div style={{ fontSize:20, fontWeight:800, color:tool.is_free ? C.green : C.t1, marginTop:8 }}>
          {tool.is_free ? 'Free' : `$${tool.price_per_day}/day`}
        </div>

        {/* Owner */}
        <div style={{ display:'flex', alignItems:'center', gap:12, marginTop:14, padding:14, background:C.card, borderRadius:14, boxShadow:C.sh, border:`1px solid ${C.brd}` }}>
          <div style={{ width:44, height:44, borderRadius:22, background:C.blueL, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <User size={20} color={C.blue} strokeWidth={1.5}/>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:600, fontSize:14, color:C.t1 }}>{tool.profiles?.full_name || 'Neighbor'}</div>
            <div style={{ display:'flex', alignItems:'center', gap:4, marginTop:2 }}>
              <Star size={11} color={C.orange} fill={C.orange}/>
              <span style={{ fontSize:12, color:C.t2 }}>Trust Score: {tool.profiles?.trust_score || 10}</span>
            </div>
          </div>
        </div>

        {/* Condition */}
        <div style={{ marginTop:12, background:C.card, borderRadius:14, padding:14, boxShadow:C.sh, border:`1px solid ${C.brd}` }}>
          <div style={{ fontWeight:700, fontSize:14, color:C.t1, marginBottom:10 }}>Tool Condition</div>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
            <span style={{ fontSize:12, color:C.t2 }}>Overall</span>
            <span style={{ fontSize:12, fontWeight:600, color:h.c }}>{h.l}</span>
          </div>
          <div style={{ height:4, background:C.bg, borderRadius:2, overflow:'hidden' }}>
            <div style={{ height:'100%', width:`${tool.health||80}%`, background:`linear-gradient(90deg,${h.c},${h.c}88)`, borderRadius:2 }}/>
          </div>
        </div>

        {/* Waiver */}
        <div style={{ marginTop:12, background:C.orangeL, borderRadius:14, padding:14, border:`1px solid ${C.orange}33` }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
            <Shield size={15} color={C.orange}/>
            <span style={{ fontWeight:700, fontSize:13, color:C.orange }}>Liability Waiver Required</span>
          </div>
          <div style={{ fontSize:12, color:C.t1, lineHeight:1.6, marginBottom:10 }}>
            By signing you release <b>{tool.profiles?.full_name || 'the owner'}</b> from liability.
          </div>
          {!waiver ? (
            <button onClick={() => setWaiver(true)} style={{ background:C.orange, color:'white', border:'none', borderRadius:10, padding:'11px 0', width:'100%', fontWeight:700, fontSize:13, cursor:'pointer' }}>
              Review & Sign Waiver →
            </button>
          ) : (
            <div style={{ display:'flex', alignItems:'center', gap:8, color:C.green }}>
              <CheckCircle size={15}/><span style={{ fontWeight:700, fontSize:13 }}>Signed</span>
            </div>
          )}
        </div>

        {error && (
          <div style={{ marginTop:12, background:C.redL, borderRadius:10, padding:'10px 14px', fontSize:13, color:C.red }}>{error}</div>
        )}
        <div style={{ height:100 }}/>
      </div>

      {/* Footer */}
      <div style={{ position:'sticky', bottom:0, background:'rgba(255,255,255,.95)', backdropFilter:'blur(20px)', borderTop:`1px solid ${C.brd}`, padding:'12px 16px', flexShrink:0 }}>
        <button onClick={requestLoan} disabled={!waiver || loading}
          style={{ background:waiver ? C.blue : '#C7C7CC', color:'white', border:'none', borderRadius:12, padding:'14px 0', width:'100%', fontWeight:700, fontSize:15, cursor:waiver ? 'pointer' : 'not-allowed', boxShadow:waiver ? `0 4px 16px ${C.blue}44` : 'none' }}>
          {loading ? 'Sending request...' : waiver ? 'Request to Borrow →' : 'Sign Waiver First'}
        </button>
      </div>
    </div>
  )
}
