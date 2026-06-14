// src/App.jsx
// OpenShed — Main application router
// Current state: prototype / UI shell (no real backend yet)
// Next steps: connect Supabase for auth + DB, Stripe for payments

import { useState } from 'react'
import { GlobalStyles } from './components/atoms.jsx'
import Nav from './components/Nav.jsx'

import HomeScreen      from './screens/HomeScreen.jsx'
import BrowseScreen    from './screens/BrowseScreen.jsx'
import DetailScreen    from './screens/DetailScreen.jsx'
import PhotoScreen     from './screens/PhotoScreen.jsx'
import ShedScreen      from './screens/ShedScreen.jsx'
import HandshakeScreen from './screens/HandshakeScreen.jsx'
import NeighborsScreen, { ProfileScreen, PaywallScreen } from './screens/NeighborsProfilePaywall.jsx'

// Screens that hide the bottom tab bar
const FULLSCREEN = ['detail', 'handshake', 'photo', 'paywall']

export default function App() {
  const [screen, setScreen] = useState('home')
  const [prev,   setPrev]   = useState('home')
  const [tool,   setTool]   = useState(null)

  const navigate = (s) => { setPrev(screen); setScreen(s) }
  const goBack   = ()  => { setScreen(prev || 'home'); setTool(null) }
  const goTool   = (t) => { setTool(t); navigate('detail') }

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

  const hideNav = FULLSCREEN.includes(screen)

  return (
    // Phone frame wrapper — remove in production mobile build
    <div style={{
      display:'flex', justifyContent:'center', alignItems:'center',
      minHeight:'100vh', padding:20,
      background:'#E8E8ED',
      fontFamily:"'Inter','SF Pro Display',-apple-system,sans-serif",
    }}>
      <GlobalStyles/>

      {/* Phone frame */}
      <div style={{
        width:390, height:844,
        background:'#F5F5F7',
        borderRadius:54, overflow:'hidden',
        boxShadow:'0 40px 80px rgba(0,0,0,.22), 0 0 0 10px rgba(0,0,0,.08)',
        display:'flex', flexDirection:'column',
      }}>
        {/* Status bar / notch */}
        <div style={{ height:44, background:'#FFFFFF', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, borderBottom:'1px solid rgba(60,60,67,.1)' }}>
          <div style={{ width:120, height:6, background:'#1D1D1F', borderRadius:3 }}/>
        </div>

        {/* Active screen */}
        <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
          {screens[screen] || screens.home}
        </div>

        {/* Bottom navigation */}
        {!hideNav && <Nav current={screen} onChange={setScreen}/>}
      </div>

      {/* Prototype label */}
      <div style={{ position:'fixed', bottom:16, left:0, right:0, textAlign:'center' }}>
        <span style={{ color:'rgba(0,0,0,.25)', fontSize:10, letterSpacing:'0.1em', fontWeight:600 }}>
          OPENSHED PROTOTYPE · Tap tool cards · Browse screens · Drag before/after slider
        </span>
      </div>
    </div>
  )
}
