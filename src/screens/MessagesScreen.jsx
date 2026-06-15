import { useState, useEffect, useRef } from 'react'
import { ArrowLeft, Send, MessageCircle } from 'lucide-react'
import { C } from '../theme.js'
import { supabase } from '../lib/supabase.js'

// ── INBOX ─────────────────────────────────────────────────────────────────────
function InboxView({ currentUserId, onOpenChat }) {
  const [convs,   setConvs]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!currentUserId) return
    fetchConvs()
    // Mark ALL unread as read when inbox is opened
    supabase.from('messages').update({ read: true })
      .eq('to_id', currentUserId).eq('read', false)
  }, [currentUserId])

  const fetchConvs = async () => {
    const { data } = await supabase
      .from('messages')
      .select('*, from_profile:from_id(id, full_name), to_profile:to_id(id, full_name)')
      .or(`from_id.eq.${currentUserId},to_id.eq.${currentUserId}`)
      .order('created_at', { ascending: false })

    const map = {}
    data?.forEach(msg => {
      const pid   = msg.from_id === currentUserId ? msg.to_id   : msg.from_id
      const pname = msg.from_id === currentUserId ? msg.to_profile?.full_name : msg.from_profile?.full_name
      if (!map[pid]) map[pid] = { pid, pname, last: msg.content, time: msg.created_at }
    })
    setConvs(Object.values(map))
    setLoading(false)
  }

  if (loading) return <div style={{ textAlign:'center', padding:'40px 0', fontSize:13, color:C.t2 }}>Loading...</div>

  if (convs.length === 0) return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'48px 24px' }}>
      <div style={{ width:72, height:72, borderRadius:24, background:C.blueL, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:16 }}>
        <MessageCircle size={34} color={C.blue} strokeWidth={1.5}/>
      </div>
      <div style={{ fontWeight:700, fontSize:16, color:C.t1 }}>No messages yet</div>
      <div style={{ fontSize:13, color:C.t2, marginTop:6, textAlign:'center', lineHeight:1.5 }}>Browse tools and message an owner to start a conversation</div>
    </div>
  )

  return (
    <div style={{ padding:'14px 14px 0' }}>
      {convs.map(c => (
        <div key={c.pid} onClick={() => onOpenChat(c.pid, c.pname)} className="tp"
          style={{ background:C.card, borderRadius:14, padding:'14px 16px', marginBottom:10, display:'flex', alignItems:'center', gap:12, boxShadow:C.sh, border:`1px solid ${C.brd}` }}>
          <div style={{ width:46, height:46, borderRadius:23, background:C.blueL, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <span style={{ fontSize:18, fontWeight:700, color:C.blue }}>{(c.pname||'?')[0].toUpperCase()}</span>
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontWeight:600, fontSize:14, color:C.t1 }}>{c.pname || 'User'}</div>
            <div style={{ fontSize:12, color:C.t2, marginTop:2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.last}</div>
          </div>
          <div style={{ fontSize:10, color:C.t3, flexShrink:0 }}>
            {new Date(c.time).toLocaleDateString('en-US',{month:'short',day:'numeric'})}
          </div>
        </div>
      ))}
    </div>
  )
}

// ── CHAT ──────────────────────────────────────────────────────────────────────
function ChatView({ partnerId, partnerName, currentUserId, onBack }) {
  const [msgs,    setMsgs]    = useState([])
  const [text,    setText]    = useState('')
  const [sending, setSending] = useState(false)
  const endRef = useRef(null)

  useEffect(() => {
    if (!partnerId || !currentUserId) return
    fetchMsgs()
    // Mark messages from this partner as read
    supabase.from('messages').update({ read: true })
      .eq('to_id', currentUserId).eq('from_id', partnerId).eq('read', false)
  }, [partnerId, currentUserId])

  useEffect(() => { endRef.current?.scrollIntoView({ behavior:'smooth' }) }, [msgs])

  const fetchMsgs = async () => {
    const { data } = await supabase.from('messages')
      .select('*')
      .or(`and(from_id.eq.${currentUserId},to_id.eq.${partnerId}),and(from_id.eq.${partnerId},to_id.eq.${currentUserId})`)
      .order('created_at', { ascending: true })
    setMsgs(data || [])
  }

  const send = async () => {
    if (!text.trim() || sending) return
    setSending(true)
    const { data } = await supabase.from('messages')
      .insert({ from_id:currentUserId, to_id:partnerId, content:text.trim() })
      .select().single()
    if (data) setMsgs(p => [...p, data])
    setText(''); setSending(false)
  }

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 14px', borderBottom:`1px solid ${C.brd}`, background:C.card, flexShrink:0 }}>
        <button onClick={onBack} className="tp" style={{ background:'none', border:'none', cursor:'pointer', padding:4, display:'flex' }}>
          <ArrowLeft size={18} color={C.blue}/>
        </button>
        <div style={{ width:36, height:36, borderRadius:18, background:C.blueL, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <span style={{ fontSize:14, fontWeight:700, color:C.blue }}>{(partnerName||'?')[0].toUpperCase()}</span>
        </div>
        <div style={{ fontWeight:700, fontSize:15, color:C.t1 }}>{partnerName}</div>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:14, display:'flex', flexDirection:'column', gap:8 }}>
        {msgs.length === 0 && (
          <div style={{ textAlign:'center', padding:'24px 0', fontSize:13, color:C.t2 }}>Say hello! Start the conversation.</div>
        )}
        {msgs.map(msg => {
          const mine = msg.from_id === currentUserId
          return (
            <div key={msg.id} style={{ display:'flex', justifyContent:mine?'flex-end':'flex-start' }}>
              <div style={{ maxWidth:'76%', background:mine?C.blue:C.card, borderRadius:mine?'16px 16px 4px 16px':'16px 16px 16px 4px', padding:'10px 14px', boxShadow:C.sh, border:mine?'none':`1px solid ${C.brd}` }}>
                <div style={{ fontSize:14, color:mine?'white':C.t1, lineHeight:1.5 }}>{msg.content}</div>
                <div style={{ fontSize:10, color:mine?'rgba(255,255,255,.55)':C.t3, marginTop:4, textAlign:'right' }}>
                  {new Date(msg.created_at).toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'})}
                </div>
              </div>
            </div>
          )
        })}
        <div ref={endRef}/>
      </div>

      <div style={{ display:'flex', gap:10, padding:'10px 14px', borderTop:`1px solid ${C.brd}`, background:C.card, flexShrink:0, alignItems:'center' }}>
        <input value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key==='Enter'&&send()}
          placeholder="Message..."
          style={{ flex:1, padding:'10px 14px', fontSize:14, border:`1px solid ${C.brdM}`, borderRadius:22, outline:'none', background:'#F5F5F7', color:C.t1, fontFamily:'inherit' }}/>
        <button onClick={send} disabled={!text.trim()||sending}
          style={{ width:40, height:40, borderRadius:20, background:text.trim()?C.blue:'#C7C7CC', border:'none', display:'flex', alignItems:'center', justifyContent:'center', cursor:text.trim()?'pointer':'not-allowed', flexShrink:0, boxShadow:text.trim()?`0 4px 12px ${C.blue}44`:'none' }}>
          <Send size={15} color="white" strokeWidth={2}/>
        </button>
      </div>
    </div>
  )
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
export default function MessagesScreen({ initialRecipientId, initialRecipientName, onBack }) {
  const [view,      setView]      = useState(initialRecipientId ? 'chat' : 'inbox')
  const [pid,       setPid]       = useState(initialRecipientId  || null)
  const [pname,     setPname]     = useState(initialRecipientName|| '')
  const [currentId, setCurrentId] = useState(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data:{ user } }) => setCurrentId(user?.id))
  }, [])

  const openChat = (id, name) => { setPid(id); setPname(name); setView('chat') }

  if (!currentId) return null

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', background:'#F5F5F7', overflow:'hidden' }}>
      {view === 'inbox' ? (
        <>
          <div style={{ background:'white', padding:'8px 16px 14px', borderBottom:`1px solid #E5E5EA`, flexShrink:0 }}>
            <div style={{ fontSize:22, fontWeight:800, color:'#1D1D1F', letterSpacing:'-0.4px' }}>Messages</div>
          </div>
          <div style={{ flex:1, overflowY:'auto' }}>
            <InboxView currentUserId={currentId} onOpenChat={openChat}/>
          </div>
        </>
      ) : (
        <ChatView partnerId={pid} partnerName={pname} currentUserId={currentId}
          onBack={() => initialRecipientId ? onBack() : setView('inbox')}/>
      )}
    </div>
  )
}
