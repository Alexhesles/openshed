import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase.js'
import { GlobalStyles } from './components/atoms.jsx'
import Nav from './components/Nav.jsx'
import AuthScreen from './screens/AuthScreen.jsx'

import HomeScreen      from './screens/HomeScreen.jsx'
import BrowseScreen    from './screens/BrowseScreen.jsx'
import DetailScreen    from './screens/DetailScreen.jsx'
import PhotoScreen     from './screens/PhotoScreen.jsx'
import ShedScreen      from './screens/ShedScreen.jsx'
import HandshakeScreen from './screens/HandshakeScreen.jsx'
import NeighborsScreen, { ProfileScreen, PaywallScreen } from './screens/NeighborsProfilePaywall.jsx'

const FULLSCREEN = ['detail', 'handshake', 'photo', 'paywall']

export default function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [screen,  setScreen]  = useState('home')
  const [prev,    setPrev]    = useState('home')
  const [tool,    setTool]    = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  const navigate = (s) => { setPrev(screen); setScreen(s) }
  const goBack   = ()  => { setScreen(prev || 'home'); setTool(null) }
  const goTool   = (t) => { setTool(t); navigate('detail') }

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background:'#F5F5F7' }}>
      <div style={{ fontSize:32 }}>🏗️</div>
    </div>
  )

  const screens = {
    home:      <HomeScreen goTool={goTool} goHandshake={() => navigate('handshake')}/>,
    browse:    <BrowseScreen goTool={goTool}/>,
    detail:    tool ? <DetailScreen tool={tool} onBack={goBack} goPhoto={() => navigate('photo')}/> : null,
    photo:     <PhotoScreen onBack={goBack} mode="return"/>,
    shed:      <ShedScreen/>,
    handshake: <HandshakeScreen onBack={goBack} goPhoto={() => navigate('photo')}/>,
    neighbors: <NeighborsScreen/>,
    profile:   <ProfileScreen goPaywall={() => navigate('paywall')}/>,
    paywall:   <PaywallScreen onBack={goBack}/>,
  }

  return (
    <div style={{ display:'flex', justifyContent:'center', alignItems:'center', minHeight:'100vh', padding:20, background:'#E8E8ED', fontFamily:"'Inter','SF Pro Display',-apple-system,sans-serif" }}>
      <GlobalStyles/>
      <div style={{ width:390, height:844, background:'#F5F5F7', borderRadius:54, overflow:'hidden', boxShadow:'0 40px 80px rgba(0,0,0,.22), 0 0 0 10px rgba(0,0,0,.08)', display:'flex', flexDirection:'column' }}>
        <div style={{ height:44, background:'#FFFFFF', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, borderBottom:'1px solid rgba(60,60,67,.1)' }}>
          <div style={{ width:120, height:6, background:'#1D1D1F', borderRadius:3 }}/>
        </div>
        <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
          {!session
            ? <AuthScreen onAuth={() => setScreen('home')}/>
            : screens[screen] || screens.home
          }
        </div>
        {session && !FULLSCREEN.includes(screen) && <Nav current={screen} onChange={setScreen}/>}
      </div>
    </div>
  )
}
