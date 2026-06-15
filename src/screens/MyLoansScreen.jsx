import { useState, useEffect } from 'react'
import { C } from '../theme.js'
import { supabase } from '../lib/supabase.js'
import { Wrench, Hammer, Leaf, Zap, Droplets, Clock, CheckCircle, XCircle, RotateCcw, Star } from 'lucide-react'

const CAT_ICONS  = { 'Power Tools':Hammer, 'Yard & Garden':Leaf, 'Cleaning':Droplets, 'Hand Tools':Wrench, 'Other':Zap }
const CAT_COLORS = { 'Power Tools':'#FF9500', 'Yard & Garden':'#34C759', 'Cleaning':'#007AFF', 'Hand Tools':'#007AFF', 'Other':'#AF52DE' }

const STATUS = {
  requested:      { label:'Pending approval',               color:'#FF9500', bg:'#FFF4E0', Icon:Clock       },
  approved:       { label:'Approved — Ready to pickup!',    color:'#34C759', bg:'#E8F9ED', Icon:CheckCircle },
  active:         { label:'Active loan',                    color:'#007AFF', bg:'#EAF3FF', Icon:CheckCircle },
  return_pending: { label:'Waiting for owner confirmation', color:'#AF52DE', bg:'#F5EEFF', Icon:Clock       },
  returned:       { label:'Returned ✓',                     color:'#8E8E93', bg:'#F2F2F7', Icon:CheckCircle },
  cancelled:      { label:'Declined',                       color:'#FF3B30', bg:'#FFECEB', Icon:XCircle     },
  disputed:       { label:'Disputed',                       color:'#FF3B30', bg:'#FFECEB', Icon:XCircle     },
}
const LABELS = ['','Poor','Fair','Good','Great','Excellent!']

function StarRating({ value, onChange }) {
  return (
    <div style={{ display:'flex', gap:8, justifyContent:'center', margin:'16px 0' }}>
      {[1,2,3,4,5].map(n => (
        <Star key={n} size={38} color={C.orange} fill={n<=value?C.orange:'none'}
          strokeWidth={1.5} onClick={() => onChange(n)} style={{ cursor:'pointer' }}/>
      ))}
    </div>
  )
}

export default function MyLoansScreen() {
  const [loans,      setLoans]      = useState([])
  const [loading,    setLoading]    = useState(true)
  const [tab,        setTab]        = useState('active')
  const [returning,  setReturning]  = useState(null)
  const [rating,     setRating]     = useState(0)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => { fetchLoans() }, [])

  const fetchLoans = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    const { data } = await supabase
      .from('loans')
      .select('*, tools(id, name, brand, category, health, is_free, price_per_day, photo_urls), profiles!lender_id(full_name)')
      .eq('borrower_id', user.id)
      .order('created_at', { ascending: false })
    setLoans(data || [])
    setLoading(false)
  }

  const confirmReturn = async () => {
    if (rating === 0) return
    setSubmitting(true)
    // Set to return_pending — owner must confirm
    await supabase.from('loans').update({
      status: 'return_pending',
      actual_return_date: new Date().toISOString(),
      rating,
    }).eq('id', returning.id)
    setLoans(prev => prev.map(l => l.id === returning.id ? { ...l, status:'return_pending', rating } : l))
    setReturning(null); setRating(0); setSubmitting(false)
  }

  const active  = loans.filter(l => ['requested','approved','active','return_pending'].includes(l.status))
  const history = loans.filter(l => ['returned','cancelled','disputed'].includes(l.status))
  const shown   = tab === 'active' ? active : history

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflowY:'auto', background:C.bg }}>

      {/* Rating modal */}
      {returning && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.5)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
          <div style={{ background:C.card, borderRadius:20, padding:24, width:'100%', maxWidth:320 }}>
            <div style={{ fontWeight:800, fontSize:18, color:C.t1, textAlign:'center', marginBottom:4 }}>How was the tool?</div>
            <div style={{ fontSize:13, color:C.t2, textAlign:'center', marginBottom:4 }}>Rate your experience with <b>{returning.tools?.name}</b></div>
            <StarRating value={rating} onChange={setRating}/>
            <div style={{ fontSize:13, fontWeight:600, color:C.orange, textAlign:'center', height:20, marginBottom:16 }}>
              {rating > 0 ? LABELS[rating] : 'Tap a star to rate'}
            </div>
            <div style={{ background:C.purpleL||'#F5EEFF', borderRadius:10, padding:'10px 12px', marginBottom:14, fontSize:12, color:'#AF52DE', textAlign:'center' }}>
              The owner will confirm they received the tool
            </div>
            <div style={{ display:'flex', gap:10 }}>
              <button onClick={() => { setReturning(null); setRating(0) }}
                style={{ flex:1, background:C.cardAlt, border:`1px solid ${C.brd}`, borderRadius:12, padding:'12px 0', fontWeight:600, fontSize:13, color:C.t1, cursor:'pointer' }}>
                Cancel
              </button>
              <button onClick={confirmReturn} disabled={rating===0||submitting}
                style={{ flex:1, background:rating>0?C.blue:'#C7C7CC', border:'none', borderRadius:12, padding:'12px 0', fontWeight:700, fontSize:13, color:'white', cursor:rating>0?'pointer':'not-allowed' }}>
                {submitting ? 'Sending...' : 'Mark Returned'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ background:C.card, padding:'8px 16px 14px', borderBottom:`1px solid ${C.brd}` }}>
        <div style={{ fontSize:22, fontWeight:800, color:C.t1, letterSpacing:'-0.4px' }}>My Loans</div>
        <div style={{ fontSize:13, color:C.t2, marginTop:2 }}>{active.length} active · {history.length} past</div>
        <div style={{ display:'flex', marginTop:12, background:C.cardAlt, borderRadius:10, padding:3, border:`1px solid ${C.brd}` }}>
          {[['active','Active'],['history','History']].map(([id,label]) => (
            <button key={id} onClick={() => setTab(id)}
              style={{ flex:1, border:'none', borderRadius:8, padding:'8px 0', fontWeight:600, fontSize:13, cursor:'pointer', background:tab===id?C.card:'transparent', color:tab===id?C.t1:C.t2, boxShadow:tab===id?C.sh:'none' }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding:'14px 14px 24px' }}>
        {loading ? (
          <div style={{ textAlign:'center', padding:'40px 0', fontSize:13, color:C.t2 }}>Loading loans...</div>
        ) : shown.length === 0 ? (
          <div style={{ background:C.card, borderRadius:16, padding:'32px 20px', textAlign:'center', boxShadow:C.sh }}>
            <div style={{ fontSize:36, marginBottom:12 }}>📦</div>
            <div style={{ fontWeight:700, fontSize:15, color:C.t1 }}>{tab==='active'?'No active loans':'No loan history yet'}</div>
            <div style={{ fontSize:13, color:C.t2, marginTop:6 }}>{tab==='active'?'Browse tools and request to borrow one!':'Completed loans appear here.'}</div>
          </div>
        ) : shown.map(loan => {
          const st    = STATUS[loan.status] || STATUS.requested
          const tool  = loan.tools
          const Icon  = CAT_ICONS[tool?.category] || Wrench
          const color = CAT_COLORS[tool?.category] || C.blue
          const canReturn = ['approved','active'].includes(loan.status)

          return (
            <div key={loan.id} style={{ background:C.card, borderRadius:16, marginBottom:12, overflow:'hidden', boxShadow:C.sh, border:`1px solid ${C.brd}` }}>
              <div style={{ display:'flex', alignItems:'center', gap:12, padding:14 }}>
                <div style={{ width:56, height:56, borderRadius:14, background:`${color}15`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, overflow:'hidden' }}>
                  {tool?.photo_urls?.[0]
                    ? <img src={tool.photo_urls[0]} style={{ width:'100%', height:'100%', objectFit:'contain' }} alt={tool.name}/>
                    : <Icon size={24} color={color} strokeWidth={1.5}/>
                  }
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, fontSize:14, color:C.t1 }}>{tool?.name || 'Tool'}</div>
                  <div style={{ fontSize:11, color:C.t2, marginTop:2 }}>{tool?.brand || ''} · Owner: {loan.profiles?.full_name || 'Neighbor'}</div>
                </div>
                <div style={{ fontSize:14, fontWeight:700, color:tool?.is_free?C.green:C.t1 }}>
                  {tool?.is_free ? 'Free' : `$${tool?.price_per_day}/day`}
                </div>
              </div>

              <div style={{ margin:'0 14px', background:st.bg, borderRadius:10, padding:'10px 12px', display:'flex', alignItems:'center', gap:8, border:`1px solid ${st.color}33` }}>
                <st.Icon size={15} color={st.color} strokeWidth={1.5}/>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, fontSize:13, color:st.color }}>{st.label}</div>
                  <div style={{ fontSize:11, color:C.t2, marginTop:1 }}>{new Date(loan.created_at).toLocaleDateString('en-US',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'})}</div>
                </div>
                {loan.rating > 0 && (
                  <div style={{ display:'flex', gap:2 }}>
                    {[1,2,3,4,5].map(n => <Star key={n} size={12} color={C.orange} fill={n<=loan.rating?C.orange:'none'} strokeWidth={1.5}/>)}
                  </div>
                )}
              </div>

              {canReturn && (
                <div style={{ padding:'12px 14px' }}>
                  <button onClick={() => setReturning(loan)}
                    style={{ width:'100%', background:C.blue, border:'none', color:'white', borderRadius:10, padding:'11px 0', fontWeight:700, fontSize:13, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                    <RotateCcw size={14} strokeWidth={2}/>Mark as Returned
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
