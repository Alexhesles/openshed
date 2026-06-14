import { useState, useEffect } from 'react'
import { ArrowLeft, Users, Copy, Check } from 'lucide-react'
import { C } from '../theme.js'
import { supabase } from '../lib/supabase.js'

const WORDS = ['OAK','ELM','PINE','MAPLE','CEDAR','BIRCH','ASPEN','GROVE','RIDGE','CREEK']
const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
const genCode = () => {
  const word = WORDS[Math.floor(Math.random() * WORDS.length)]
  const code = Array(3).fill(0).map(() => CHARS[Math.floor(Math.random() * CHARS.length)]).join('')
  return `${word}-${code}`
}

// ── CREATE GROUP ───────────────────────────────────────────────────────────────
export function CreateGroupScreen({ onBack, onCreated }) {
  const [name,    setName]    = useState('')
  const [type,    setType]    = useState('geographic')
  const [code,    setCode]    = useState(genCode())
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  const create = async () => {
    if (!name.trim()) { setError('Group name is required'); return }
    setLoading(true); setError('')
    const { data: { user } } = await supabase.auth.getUser()
    const { data, error } = await supabase.from('groups')
      .insert({ name: name.trim(), type, invite_code: code, admin_id: user.id })
      .select().single()
    if (error) { setError(error.message); setLoading(false); return }
    await supabase.from('group_members').insert({ group_id: data.id, profile_id: user.id })
    setLoading(false)
    onCreated()
  }

  const inp = { width:'100%', padding:'12px 14px', fontSize:14, border:`1px solid ${C.brdM}`, borderRadius:12, outline:'none', background:C.card, color:C.t1, fontFamily:'inherit', marginBottom:12, boxSizing:'border-box' }

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', background:C.bg }}>
      <div style={{ background:C.card, padding:'8px 14px 14px', borderBottom:`1px solid ${C.brd}`, flexShrink:0 }}>
        <button onClick={onBack} className="tp" style={{ background:'none', border:'none', color:C.blue, fontSize:14, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:4, padding:'2px 0 10px' }}>
          <ArrowLeft size={14}/><span>Neighbors</span>
        </button>
        <div style={{ fontWeight:800, fontSize:20, color:C.t1 }}>Create a Group</div>
        <div style={{ fontSize:13, color:C.t2, marginTop:2 }}>Build your neighborhood network</div>
      </div>
      <div style={{ flex:1, overflowY:'auto', padding:16 }}>
        <div style={{ fontSize:11, fontWeight:700, color:C.t2, letterSpacing:'0.5px', marginBottom:6, textTransform:'uppercase' }}>Group Name</div>
        <input placeholder="e.g. Maple Street HOA" value={name} onChange={e => setName(e.target.value)} style={inp}/>

        <div style={{ fontSize:11, fontWeight:700, color:C.t2, letterSpacing:'0.5px', marginBottom:10, textTransform:'uppercase' }}>Type</div>
        <div style={{ display:'flex', gap:10, marginBottom:16 }}>
          {[['geographic','📍 Geographic'],['interest','🔧 Interest']].map(([id, label]) => (
            <div key={id} onClick={() => setType(id)} className="tp"
              style={{ flex:1, background:type===id?C.blue:C.card, border:`1.5px solid ${type===id?C.blue:C.brdM}`, borderRadius:12, padding:'11px 0', textAlign:'center', fontWeight:600, fontSize:13, color:type===id?'white':C.t1, cursor:'pointer' }}>
              {label}
            </div>
          ))}
        </div>

        <div style={{ fontSize:11, fontWeight:700, color:C.t2, letterSpacing:'0.5px', marginBottom:10, textTransform:'uppercase' }}>Your Invite Code</div>
        <div style={{ background:C.card, borderRadius:14, padding:20, border:`1px solid ${C.brd}`, marginBottom:16, textAlign:'center', boxShadow:C.sh }}>
          <div style={{ fontSize:30, fontWeight:900, color:C.blue, letterSpacing:6, marginBottom:8, fontFamily:'monospace' }}>{code}</div>
          <div style={{ fontSize:12, color:C.t2, marginBottom:12 }}>Share this code with neighbors to join your group</div>
          <button onClick={() => setCode(genCode())} style={{ background:'none', border:`1px solid ${C.brdM}`, borderRadius:8, padding:'6px 14px', fontSize:12, color:C.t2, cursor:'pointer' }}>
            Generate new code
          </button>
        </div>

        {error && <div style={{ background:C.redL, borderRadius:10, padding:'10px 14px', marginBottom:12, fontSize:13, color:C.red }}>{error}</div>}
        <button onClick={create} disabled={loading}
          style={{ width:'100%', background:C.blue, border:'none', color:'white', borderRadius:12, padding:'14px 0', fontWeight:700, fontSize:15, cursor:'pointer', boxShadow:`0 4px 16px ${C.blue}44` }}>
          {loading ? 'Creating...' : 'Create Group →'}
        </button>
      </div>
    </div>
  )
}

// ── JOIN GROUP ────────────────────────────────────────────────────────────────
export function JoinGroupScreen({ onBack, onJoined }) {
  const [code,    setCode]    = useState('')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  const join = async () => {
    if (!code.trim()) return
    setLoading(true); setError('')
    const { data: group } = await supabase.from('groups').select('*').eq('invite_code', code.toUpperCase().trim()).single()
    if (!group) { setError('Group not found. Check the code and try again.'); setLoading(false); return }
    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await supabase.from('group_members').insert({ group_id: group.id, profile_id: user.id })
    if (error && error.code !== '23505') { setError('Could not join group. You may already be a member.'); setLoading(false); return }
    setLoading(false)
    onJoined()
  }

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', background:C.bg }}>
      <div style={{ background:C.card, padding:'8px 14px 14px', borderBottom:`1px solid ${C.brd}`, flexShrink:0 }}>
        <button onClick={onBack} className="tp" style={{ background:'none', border:'none', color:C.blue, fontSize:14, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:4, padding:'2px 0 10px' }}>
          <ArrowLeft size={14}/><span>Neighbors</span>
        </button>
        <div style={{ fontWeight:800, fontSize:20, color:C.t1 }}>Join a Group</div>
        <div style={{ fontSize:13, color:C.t2, marginTop:2 }}>Enter the invite code from your neighbor</div>
      </div>
      <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:28 }}>
        <div style={{ width:80, height:80, borderRadius:24, background:C.blueL, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:24 }}>
          <Users size={38} color={C.blue} strokeWidth={1.5}/>
        </div>
        <div style={{ fontSize:16, fontWeight:700, color:C.t1, marginBottom:6 }}>Enter Invite Code</div>
        <div style={{ fontSize:13, color:C.t2, textAlign:'center', marginBottom:24 }}>Ask your neighbor or HOA admin for the group code</div>
        <input
          placeholder="e.g. MAPLE-3K7"
          value={code}
          onChange={e => setCode(e.target.value.toUpperCase())}
          style={{ width:'100%', padding:'16px 14px', fontSize:22, fontWeight:800, textAlign:'center', letterSpacing:4, border:`2px solid ${code?C.blue:C.brdM}`, borderRadius:14, outline:'none', background:C.card, color:C.t1, fontFamily:'monospace', marginBottom:12, boxSizing:'border-box', transition:'border-color .2s' }}
        />
        {error && <div style={{ background:C.redL, borderRadius:10, padding:'10px 14px', marginBottom:12, fontSize:13, color:C.red, width:'100%', textAlign:'center' }}>{error}</div>}
        <button onClick={join} disabled={loading || !code.trim()}
          style={{ width:'100%', background:code.trim()?C.blue:'#C7C7CC', border:'none', color:'white', borderRadius:12, padding:'14px 0', fontWeight:700, fontSize:15, cursor:code.trim()?'pointer':'not-allowed', boxShadow:code.trim()?`0 4px 16px ${C.blue}44`:'none' }}>
          {loading ? 'Joining...' : 'Join Group →'}
        </button>
      </div>
    </div>
  )
}

// ── GROUP DETAIL ──────────────────────────────────────────────────────────────
export function GroupDetailScreen({ group, onBack }) {
  const [members, setMembers] = useState([])
  const [copied,  setCopied]  = useState(false)
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=OPENSHED-${group.invite_code}&bgcolor=ffffff&color=007AFF&margin=10`

  useEffect(() => {
    supabase.from('group_members')
      .select('*, profiles(full_name, trust_score)')
      .eq('group_id', group.id)
      .then(({ data }) => setMembers(data || []))
  }, [group.id])

  const copyCode = () => {
    navigator.clipboard?.writeText(group.invite_code).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', background:C.bg }}>
      <div style={{ background:C.card, padding:'8px 14px 14px', borderBottom:`1px solid ${C.brd}`, flexShrink:0 }}>
        <button onClick={onBack} className="tp" style={{ background:'none', border:'none', color:C.blue, fontSize:14, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:4, padding:'2px 0 10px' }}>
          <ArrowLeft size={14}/><span>Neighbors</span>
        </button>
        <div style={{ fontWeight:800, fontSize:20, color:C.t1 }}>{group.name}</div>
        <div style={{ fontSize:13, color:C.t2, marginTop:2 }}>{members.length} member{members.length !== 1 ? 's' : ''} · {group.type}</div>
      </div>
      <div style={{ flex:1, overflowY:'auto', padding:'14px 14px 0' }}>
        {/* Invite card */}
        <div style={{ background:C.card, borderRadius:16, padding:20, boxShadow:C.sh, border:`1px solid ${C.brd}`, marginBottom:14, textAlign:'center' }}>
          <div style={{ fontSize:13, fontWeight:600, color:C.t2, marginBottom:10 }}>Invite neighbors to join</div>
          <div style={{ fontSize:26, fontWeight:900, color:C.blue, letterSpacing:5, marginBottom:14, fontFamily:'monospace' }}>{group.invite_code}</div>
          <img src={qrUrl} style={{ width:160, height:160, borderRadius:14, marginBottom:14, border:`1px solid ${C.brd}` }} alt="QR Code"/>
          <button onClick={copyCode}
            style={{ width:'100%', background:copied?C.green:C.blueL, border:`1px solid ${copied?C.green:C.blue}33`, borderRadius:10, padding:'11px 0', fontWeight:700, fontSize:13, color:copied?'white':C.blue, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
            {copied ? <><Check size={14}/>Copied!</> : <><Copy size={14}/>Copy Invite Code</>}
          </button>
        </div>

        <div style={{ fontSize:11, fontWeight:700, color:C.t2, letterSpacing:'0.5px', marginBottom:10, textTransform:'uppercase', paddingLeft:4 }}>Members</div>
        <div style={{ background:C.card, borderRadius:16, overflow:'hidden', boxShadow:C.sh, border:`1px solid ${C.brd}`, marginBottom:24 }}>
          {members.length === 0 ? (
            <div style={{ padding:'20px', textAlign:'center', fontSize:13, color:C.t2 }}>No members yet</div>
          ) : members.map((m, i) => (
            <div key={m.profile_id || i} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 14px', borderTop:i?`1px solid ${C.brd}`:'none' }}>
              <div style={{ width:38, height:38, borderRadius:19, background:C.blueL, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <span style={{ fontSize:15, fontWeight:700, color:C.blue }}>{(m.profiles?.full_name||'?')[0].toUpperCase()}</span>
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14, fontWeight:500, color:C.t1 }}>{m.profiles?.full_name || 'Member'}</div>
              </div>
              <div style={{ fontSize:12, fontWeight:700, color:C.orange }}>{m.profiles?.trust_score || 10} pts</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
