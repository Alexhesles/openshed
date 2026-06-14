import { useState, useEffect } from 'react'
import { ArrowLeft, ChevronRight, Check } from 'lucide-react'
import { C } from '../theme.js'
import { supabase } from '../lib/supabase.js'

function Toggle({ value, onChange }) {
  return (
    <div onClick={() => onChange(!value)} style={{ width:44, height:26, borderRadius:13, background:value?C.blue:'#C7C7CC', position:'relative', cursor:'pointer', transition:'background .2s', flexShrink:0 }}>
      <div style={{ position:'absolute', top:3, left:value?20:3, width:20, height:20, borderRadius:10, background:'white', transition:'left .2s', boxShadow:'0 1px 3px rgba(0,0,0,.2)' }}/>
    </div>
  )
}

function ScreenHeader({ onBack, title, sub }) {
  return (
    <div style={{ background:C.card, padding:'8px 14px 14px', borderBottom:`1px solid ${C.brd}`, flexShrink:0 }}>
      <button onClick={onBack} className="tp" style={{ background:'none', border:'none', color:C.blue, fontSize:14, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:4, padding:'2px 0 10px' }}>
        <ArrowLeft size={14}/><span>Profile</span>
      </button>
      <div style={{ fontWeight:800, fontSize:20, color:C.t1 }}>{title}</div>
      {sub && <div style={{ fontSize:13, color:C.t2, marginTop:2 }}>{sub}</div>}
    </div>
  )
}

export function NotificationsScreen({ onBack }) {
  const [s, setS] = useState({ loanRequests:true, approvals:true, returns:true, sos:true, messages:false, marketing:false })
  const toggle = k => setS(prev => ({ ...prev, [k]:!prev[k] }))
  const rows = [
    { k:'loanRequests', label:'Loan requests',   sub:'Someone wants to borrow your tool'     },
    { k:'approvals',    label:'Loan approved',    sub:'Your borrow request was approved'       },
    { k:'returns',      label:'Tool returned',    sub:'A borrower marked your tool returned'   },
    { k:'sos',          label:'SOS alerts',       sub:'Emergency tool requests nearby'         },
    { k:'messages',     label:'Messages',         sub:'Direct messages from neighbors'         },
    { k:'marketing',    label:'Tips & updates',   sub:'OpenShed news and feature updates'      },
  ]
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', background:C.bg }}>
      <ScreenHeader onBack={onBack} title="Notifications"/>
      <div style={{ flex:1, overflowY:'auto', padding:'14px 14px 0' }}>
        <div style={{ background:C.card, borderRadius:16, overflow:'hidden', boxShadow:C.sh, border:`1px solid ${C.brd}` }}>
          {rows.map((row, i) => (
            <div key={row.k} style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 16px', borderTop:i?`1px solid ${C.brd}`:'none' }}>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:15, fontWeight:500, color:C.t1 }}>{row.label}</div>
                <div style={{ fontSize:12, color:C.t2, marginTop:2 }}>{row.sub}</div>
              </div>
              <Toggle value={s[row.k]} onChange={() => toggle(row.k)}/>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function PrivacyScreen({ onBack }) {
  const [visibility, setVisibility] = useState('public')
  const opts = [
    { id:'public',  label:'Public',      sub:'All OpenShed users can see your tools'  },
    { id:'groups',  label:'Groups only', sub:'Only members of your neighborhood groups'},
    { id:'private', label:'Private',     sub:'Only people with your direct link'       },
  ]
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', background:C.bg }}>
      <ScreenHeader onBack={onBack} title="Privacy & Safety"/>
      <div style={{ flex:1, overflowY:'auto', padding:'14px 14px 0' }}>
        <div style={{ fontSize:11, fontWeight:700, color:C.t2, letterSpacing:'0.5px', marginBottom:10, textTransform:'uppercase', paddingLeft:4 }}>Default Tool Visibility</div>
        <div style={{ background:C.card, borderRadius:16, overflow:'hidden', boxShadow:C.sh, border:`1px solid ${C.brd}`, marginBottom:16 }}>
          {opts.map((opt, i) => (
            <div key={opt.id} onClick={() => setVisibility(opt.id)} className="tp"
              style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 16px', borderTop:i?`1px solid ${C.brd}`:'none' }}>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:15, fontWeight:500, color:C.t1 }}>{opt.label}</div>
                <div style={{ fontSize:12, color:C.t2, marginTop:2 }}>{opt.sub}</div>
              </div>
              {visibility === opt.id && <Check size={18} color={C.blue} strokeWidth={2.5}/>}
            </div>
          ))}
        </div>
        <div style={{ background:C.blueL, borderRadius:14, padding:16, border:`1px solid ${C.blue}22` }}>
          <div style={{ fontSize:14, fontWeight:700, color:C.blue, marginBottom:6 }}>Your data is safe</div>
          <div style={{ fontSize:13, color:C.t2, lineHeight:1.6 }}>OpenShed never sells your data. Your exact location is never shared — only your general neighborhood area is visible to other users.</div>
        </div>
      </div>
    </div>
  )
}

export function PaymentScreen({ onBack }) {
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', background:C.bg }}>
      <ScreenHeader onBack={onBack} title="Payment & Payouts"/>
      <div style={{ flex:1, overflowY:'auto', padding:'14px 14px 0' }}>
        <div style={{ background:C.card, borderRadius:16, padding:24, boxShadow:C.sh, border:`1px solid ${C.brd}`, marginBottom:14, textAlign:'center' }}>
          <div style={{ fontSize:40, marginBottom:12 }}>💳</div>
          <div style={{ fontWeight:700, fontSize:16, color:C.t1 }}>No payment method yet</div>
          <div style={{ fontSize:13, color:C.t2, marginTop:6, lineHeight:1.5 }}>Add a payment method to charge for your tools or receive payouts when you lend paid tools.</div>
          <button style={{ marginTop:16, background:C.blue, border:'none', color:'white', borderRadius:12, padding:'12px 28px', fontWeight:700, fontSize:14, cursor:'pointer', boxShadow:`0 4px 16px ${C.blue}44` }}>
            Connect with Stripe →
          </button>
        </div>
        <div style={{ background:C.card, borderRadius:16, overflow:'hidden', boxShadow:C.sh, border:`1px solid ${C.brd}` }}>
          {[['Total Earned','$0.00'],['Pending Payout','$0.00'],['Total Transactions','0']].map(([label, val], i) => (
            <div key={label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 16px', borderTop:i?`1px solid ${C.brd}`:'none' }}>
              <span style={{ fontSize:14, color:C.t2 }}>{label}</span>
              <span style={{ fontWeight:700, fontSize:14, color:C.t1 }}>{val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function AccountScreen({ onBack, onSignOut }) {
  const [name,       setName]       = useState('')
  const [saving,     setSaving]     = useState(false)
  const [saved,      setSaved]      = useState(false)
  const [showDelete, setShowDelete] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      supabase.from('profiles').select('full_name').eq('id', user.id).single()
        .then(({ data }) => { if (data) setName(data.full_name || '') })
    })
  }, [])

  const saveName = async () => {
    if (!name.trim()) return
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('profiles').update({ full_name: name.trim() }).eq('id', user.id)
    setSaving(false); setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', background:C.bg }}>
      <ScreenHeader onBack={onBack} title="Account Settings"/>
      <div style={{ flex:1, overflowY:'auto', padding:'14px 14px 0' }}>
        <div style={{ fontSize:11, fontWeight:700, color:C.t2, letterSpacing:'0.5px', marginBottom:10, textTransform:'uppercase', paddingLeft:4 }}>Display Name</div>
        <div style={{ background:C.card, borderRadius:16, padding:16, boxShadow:C.sh, border:`1px solid ${C.brd}`, marginBottom:16 }}>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Your full name"
            style={{ width:'100%', padding:'12px 14px', fontSize:14, border:`1px solid ${C.brdM}`, borderRadius:12, outline:'none', background:C.cardAlt, color:C.t1, fontFamily:'inherit', marginBottom:12, boxSizing:'border-box' }}/>
          <button onClick={saveName} disabled={saving}
            style={{ width:'100%', background:saved?C.green:C.blue, color:'white', border:'none', borderRadius:12, padding:'12px 0', fontWeight:700, fontSize:14, cursor:'pointer', transition:'background .3s' }}>
            {saved ? '✓ Saved!' : saving ? 'Saving...' : 'Save Name'}
          </button>
        </div>

        <div style={{ background:C.card, borderRadius:16, overflow:'hidden', boxShadow:C.sh, border:`1px solid ${C.brd}`, marginBottom:16 }}>
          <div onClick={onSignOut} className="tp" style={{ padding:'16px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <span style={{ fontSize:15, color:C.red, fontWeight:600 }}>Sign Out</span>
            <ChevronRight size={16} color={C.red}/>
          </div>
        </div>

        <div style={{ background:C.redL, borderRadius:16, overflow:'hidden', border:`1px solid ${C.red}22` }}>
          {!showDelete ? (
            <div onClick={() => setShowDelete(true)} className="tp" style={{ padding:'16px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <span style={{ fontSize:15, color:C.red, fontWeight:500 }}>Delete Account</span>
              <ChevronRight size={16} color={C.red}/>
            </div>
          ) : (
            <div style={{ padding:16 }}>
              <div style={{ fontSize:14, color:C.red, fontWeight:700, marginBottom:8 }}>Are you sure?</div>
              <div style={{ fontSize:13, color:C.t2, marginBottom:14, lineHeight:1.5 }}>This permanently deletes your account and all your tools. This cannot be undone.</div>
              <div style={{ display:'flex', gap:10 }}>
                <button onClick={() => setShowDelete(false)} style={{ flex:1, background:C.card, border:`1px solid ${C.brd}`, borderRadius:10, padding:'10px 0', fontWeight:600, fontSize:13, color:C.t1, cursor:'pointer' }}>Cancel</button>
                <button style={{ flex:1, background:C.red, border:'none', borderRadius:10, padding:'10px 0', fontWeight:700, fontSize:13, color:'white', cursor:'pointer' }}>Delete</button>
              </div>
            </div>
          )}
        </div>
        <div style={{ height:24 }}/>
      </div>
    </div>
  )
}
