import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase.js'
import { GlobalStyles } from './components/atoms.jsx'
import Nav, { Sidebar } from './components/Nav.jsx'

import AuthScreen       from './screens/AuthScreen.jsx'
import HomeScreen       from './screens/HomeScreen.jsx'
import BrowseScreen     from './screens/BrowseScreen.jsx'
import DetailScreen     from './screens/DetailScreen.jsx'
import RealDetailScreen from './screens/RealDetailScreen.jsx'
import PhotoScreen      from './screens/PhotoScreen.jsx'
import ShedScreen       from './screens/ShedScreen.jsx'
import AddToolScreen    from './screens/AddToolScreen.jsx'
import EditToolScreen   from './screens/EditToolScreen.jsx'
import HandshakeScreen  from './screens/HandshakeScreen.jsx'
import MyLoansScreen    from './screens/MyLoansScreen.jsx'
import MessagesScreen   from './screens/MessagesScreen.jsx'

import NeighborsScreen, { ProfileScreen, PaywallScreen } from './screens/NeighborsProfilePaywall.jsx'
import { CreateGroupScreen, JoinGroupScreen, GroupDetailScreen } from './screens/GroupScreens.jsx'
import { NotificationsScreen, PrivacyScreen, PaymentScreen, AccountScreen } from './screens/SettingsScreens.jsx'

const FULLSCREEN = [
  'detail','realdetail','handshake','photo','paywall',
  'addtool','edittool','notifications','privacy','payment','account',
  'creategroup','joingroup','groupdetail','chat',
]

export default function App() {
  const [session,       setSession]       = useState(null)
  const [loading,       setLoading]       = useState(true)
  const [screen,        setScreen]        = useState('home')
  const [history,       setHistory]       = useState(['home'])
  const [homeKey,       setHomeKey]       = useState(0)
  const [isDesktop,     setIsDesktop]     = useState(window.innerWidth >= 768)
  const [profile,       setProfile]       = useState(null)
  const [authUser,      setAuthUser]      = useState(null)
  const [unreadMsgs,    setUnreadMsgs]    = useState(0)
  const [tool,          setTool]          = useState(null)
  const [realTool,      setRealTool]      = useState(null)
  const [editTool,      setEditTool]      = useState(null)
  const [selGroup,      setSelGroup]      = useState(null)
  const [msgRecipient,  setMsgRecipient]  = useState({ id:null, name:'' })
  const [profileRefresh,setProfileRefresh]= useState(0)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session); setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s)
      if (s) loadSidebarData(s.user.id)
    })

    const handleResize = () => setIsDesktop(window.innerWidth >= 768)
    window.addEventListener('resize', handleResize)
    return () => { subscription.unsubscribe(); window.removeEventListener('resize', handleResize) }
  }, [])

  const loadSidebarData = async (userId) => {
    const [{ data: prof }, { data: user }, { data: unread }] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', userId).single(),
      supabase.auth.getUser(),
      supabase.from('messages').select('id').eq('to_id', userId).eq('read', false),
    ])
    setProfile(prof)
    setAuthUser(user?.data?.user)
    setUnreadMsgs(unread?.length || 0)
  }

  useEffect(() => {
    if (session?.user?.id) loadSidebarData(session.user.id)
  }, [session])

  const navigate = (s) => { setHistory(h => [...h, s]); setScreen(s) }

  const goBack = () => {
    setHistory(h => {
      const prev = h.length > 1 ? h[h.length - 2] : 'home'
      if (screen === 'account') setProfileRefresh(r => r + 1)
      if (prev === 'home') setHomeKey(k => k + 1)
      setScreen(prev)
      setTool(null); setRealTool(null); setEditTool(null); setSelGroup(null)
      return h.slice(0, -1)
    })
  }

  const handleNavChange = (s) => {
    if (s === 'home') setHomeKey(k => k + 1)
    if (s === 'messages') { setMsgRecipient({ id:null, name:'' }) }
    setHistory([s]); setScreen(s)
    setTool(null); setRealTool(null); setEditTool(null); setSelGroup(null)
  }

  const goTool        = (t)      => { setTool(t);     navigate('detail')      }
  const goRealTool    = (t)      => { setRealTool(t); navigate('realdetail')  }
  const goEditTool    = (t)      => { setEditTool(t); navigate('edittool')    }
  const goGroupDetail = (g)      => { setSelGroup(g); navigate('groupdetail') }
  const goMessage     = (id, nm) => { setMsgRecipient({ id, name:nm }); navigate('chat') }

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background:'#F5F5F7', flexDirection:'column', gap:12 }}>
      <div style={{ fontSize:36 }}>🏗️</div>
      <div style={{ fontSize:13, color:'#6E6E73' }}>Loading OpenShed...</div>
    </div>
  )

  const screens = {
    home:          <HomeScreen         key={homeKey} goHandshake={() => navigate('myloans')} goRealTool={goRealTool} navigate={navigate}/>,
    browse:        <BrowseScreen       goRealTool={goRealTool}/>,
    detail:        tool        ? <DetailScreen      tool={tool}      onBack={goBack} goPhoto={() => navigate('photo')}/> : null,
    realdetail:    realTool    ? <RealDetailScreen  tool={realTool}  onBack={goBack} goMessage={goMessage}/> : null,
    photo:         <PhotoScreen        onBack={goBack} mode="return"/>,
    shed:          <ShedScreen         onAddTool={() => navigate('addtool')} onEditTool={goEditTool}/>,
    addtool:       <AddToolScreen      onBack={goBack} onSaved={() => { goBack(); setScreen('shed') }}/>,
    edittool:      editTool    ? <EditToolScreen    tool={editTool}  onBack={goBack} onSaved={() => { goBack(); setScreen('shed') }}/> : null,
    handshake:     <HandshakeScreen    onBack={goBack} goPhoto={() => navigate('photo')}/>,
    myloans:       <MyLoansScreen/>,
    messages:      <MessagesScreen     onBack={goBack}/>,
    chat:          <MessagesScreen     initialRecipientId={msgRecipient.id} initialRecipientName={msgRecipient.name} onBack={goBack}/>,
    neighbors:     <NeighborsScreen    goCreateGroup={() => navigate('creategroup')} goJoinGroup={() => navigate('joingroup')} goGroupDetail={goGroupDetail}/>,
    profile:       <ProfileScreen      goPaywall={() => navigate('paywall')} goNotifications={() => navigate('notifications')} goPrivacy={() => navigate('privacy')} goPayment={() => navigate('payment')} goAccount={() => navigate('account')} refreshKey={profileRefresh}/>,
    paywall:       <PaywallScreen      onBack={goBack}/>,
    notifications: <NotificationsScreen onBack={goBack}/>,
    privacy:       <PrivacyScreen      onBack={goBack}/>,
    payment:       <PaymentScreen      onBack={goBack}/>,
    account:       <AccountScreen      onBack={goBack} onSignOut={async () => await supabase.auth.signOut()}/>,
    creategroup:   <CreateGroupScreen  onBack={goBack} onCreated={() => { goBack(); setScreen('neighbors') }}/>,
    joingroup:     <JoinGroupScreen    onBack={goBack} onJoined={() => { goBack(); setScreen('neighbors') }}/>,
    groupdetail:   selGroup    ? <GroupDetailScreen  group={selGroup} onBack={goBack}/> : null,
  }

  const currentScreen = screens[screen] || screens.home

  // ── DESKTOP ────────────────────────────────────────────────────────────────
  if (isDesktop && session) {
    return (
      <div style={{ display:'flex', height:'100vh', background:'#F2F2F7', fontFamily:"'Inter','SF Pro Display',-apple-system,sans-serif" }}>
        <GlobalStyles/>
        <Sidebar
          current={screen}
          onChange={handleNavChange}
          profile={profile}
          authUser={authUser}
          unreadMsgs={unreadMsgs}
          onMessages={() => handleNavChange('messages')}
        />
        <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
          <div style={{ flex:1, overflowY:'auto', display:'flex', flexDirection:'column', maxWidth:720, width:'100%', margin:'0 auto', alignSelf:'stretch' }}>
            {currentScreen}
          </div>
        </div>
      </div>
    )
  }

  // ── MOBILE (phone frame) ───────────────────────────────────────────────────
  if (!session) {
    return (
      <div style={{ display:'flex', justifyContent:'center', alignItems:'center', minHeight:'100vh', padding:20, background:'#E8E8ED', fontFamily:"'Inter','SF Pro Display',-apple-system,sans-serif" }}>
        <GlobalStyles/>
        <div style={{ width:390, height:844, background:'#F5F5F7', borderRadius:54, overflow:'hidden', boxShadow:'0 40px 80px rgba(0,0,0,.22), 0 0 0 10px rgba(0,0,0,.08)', display:'flex', flexDirection:'column' }}>
          <div style={{ height:44, background:'#FFFFFF', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, borderBottom:'1px solid rgba(60,60,67,.1)' }}>
            <div style={{ width:120, height:6, background:'#1D1D1F', borderRadius:3 }}/>
          </div>
          <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
            <AuthScreen onAuth={() => setScreen('home')}/>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display:'flex', justifyContent:'center', alignItems:'center', minHeight:'100vh', padding:20, background:'#E8E8ED', fontFamily:"'Inter','SF Pro Display',-apple-system,sans-serif" }}>
      <GlobalStyles/>
      <div style={{ width:390, height:844, background:'#F5F5F7', borderRadius:54, overflow:'hidden', boxShadow:'0 40px 80px rgba(0,0,0,.22), 0 0 0 10px rgba(0,0,0,.08)', display:'flex', flexDirection:'column' }}>
        <div style={{ height:44, background:'#FFFFFF', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, borderBottom:'1px solid rgba(60,60,67,.1)' }}>
          <div style={{ width:120, height:6, background:'#1D1D1F', borderRadius:3 }}/>
        </div>
        <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
          {currentScreen}
        </div>
        {!FULLSCREEN.includes(screen) && <Nav current={screen} onChange={handleNavChange}/>}
      </div>
    </div>
  )
}
