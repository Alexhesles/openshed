import { useState } from 'react'
import { supabase } from '../lib/supabase.js'
import { C } from '../theme.js'
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react'

export default function AuthScreen({ onAuth }) {
  const [mode, setMode]       = useState('login')
  const [name, setName]       = useState('')
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const handleEmail = async () => {
    setLoading(true)
    setError('')
    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { data: { full_name: name } }
        })
        if (error) throw error
        setError('Check your email to confirm your account.')
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        onAuth()
      }
    } catch (e) {
      setError(e.message)
    }
    setLoading(false)
  }

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    })
  }

  const inp = (icon, placeholder, value, setValue, type = 'text') => (
    <div style={{ position:'relative', marginBottom:12 }}>
      <div style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)' }}>
        {icon}
      </div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => setValue(e.target.value)}
        style={{ width:'100%', padding:'13px 14px 13px 44px', fontSize:15, border:`1px solid ${C.brdM}`, borderRadius:12, outline:'none', background:C.card, color:C.t1, fontFamily:'inherit' }}
      />
    </div>
  )

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', background:C.bg, padding:24 }}>
      <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center' }}>
        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:36 }}>
          <div style={{ fontSize:40, marginBottom:8 }}>🏗️</div>
          <div style={{ fontSize:28, fontWeight:800, color:C.t1, letterSpacing:'-0.5px' }}>OpenShed</div>
          <div style={{ fontSize:14, color:C.t2, marginTop:4 }}>Your neighborhood's digital shed</div>
        </div>

        {/* Toggle */}
        <div style={{ display:'flex', background:C.cardAlt, borderRadius:12, padding:3, marginBottom:24, border:`1px solid ${C.brd}` }}>
          {['login','signup'].map(m => (
            <button key={m} onClick={() => { setMode(m); setError('') }}
              style={{ flex:1, border:'none', borderRadius:10, padding:'9px 0', fontWeight:600, fontSize:14, cursor:'pointer', background:mode===m ? C.card : 'transparent', color:mode===m ? C.t1 : C.t2, boxShadow:mode===m ? C.sh : 'none' }}>
              {m === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          ))}
        </div>

        {/* Form */}
        {mode === 'signup' && inp(<User size={16} color={C.t3}/>, 'Full name', name, setName)}
        {inp(<Mail size={16} color={C.t3}/>, 'Email address', email, setEmail, 'email')}
        <div style={{ position:'relative', marginBottom:12 }}>
          <div style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)' }}>
            <Lock size={16} color={C.t3}/>
          </div>
          <input
            type={showPass ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ width:'100%', padding:'13px 44px 13px 44px', fontSize:15, border:`1px solid ${C.brdM}`, borderRadius:12, outline:'none', background:C.card, color:C.t1, fontFamily:'inherit' }}
          />
          <div onClick={() => setShowPass(s => !s)} style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', cursor:'pointer' }}>
            {showPass ? <EyeOff size={16} color={C.t3}/> : <Eye size={16} color={C.t3}/>}
          </div>
        </div>

        {error && (
          <div style={{ background:error.includes('Check') ? C.greenL : C.redL, borderRadius:10, padding:'10px 14px', marginBottom:12, fontSize:13, color:error.includes('Check') ? C.green : C.red }}>
            {error}
          </div>
        )}

        <button onClick={handleEmail} disabled={loading}
          style={{ background:C.blue, color:'white', border:'none', borderRadius:12, padding:'14px 0', width:'100%', fontWeight:700, fontSize:15, cursor:'pointer', boxShadow:`0 4px 16px ${C.blue}44`, marginBottom:16 }}>
          {loading ? 'Loading...' : mode === 'login' ? 'Sign In' : 'Create Account'}
        </button>

        {/* Divider */}
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
          <div style={{ flex:1, height:1, background:C.brd }}/>
          <span style={{ fontSize:13, color:C.t3 }}>or</span>
          <div style={{ flex:1, height:1, background:C.brd }}/>
        </div>

        {/* Google */}
        <button onClick={handleGoogle}
          style={{ background:C.card, color:C.t1, border:`1px solid ${C.brdM}`, borderRadius:12, padding:'13px 0', width:'100%', fontWeight:600, fontSize:15, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:10, boxShadow:C.sh }}>
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>
      </div>
    </div>
  )
}
