import { useState } from 'react'
import { ArrowLeft, CheckCircle, Camera } from 'lucide-react'
import { C } from '../theme.js'
import { supabase } from '../lib/supabase.js'

const CATEGORIES = ['Power Tools','Yard & Garden','Cleaning','Camping','Hand Tools','Other']

export default function AddToolScreen({ onBack, onSaved }) {
  const [name,     setName]     = useState('')
  const [brand,    setBrand]    = useState('')
  const [category, setCategory] = useState('Power Tools')
  const [isFree,   setIsFree]   = useState(true)
  const [price,    setPrice]    = useState('')
  const [health,   setHealth]   = useState(80)
  const [photo,    setPhoto]    = useState(null)
  const [preview,  setPreview]  = useState(null)
  const [loading,  setLoading]  = useState(false)
  const [success,  setSuccess]  = useState(false)
  const [error,    setError]    = useState('')

  const handlePhoto = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setPhoto(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleSave = async () => {
    if (!name) { setError('Tool name is required'); return }
    setLoading(true)
    setError('')

    const { data: { user } } = await supabase.auth.getUser()

    let photoUrl = null
    if (photo) {
      const ext      = photo.name.split('.').pop()
      const filePath = `${user.id}/${Date.now()}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('tool-photos')
        .upload(filePath, photo)

      if (!uploadError) {
        const { data } = supabase.storage.from('tool-photos').getPublicUrl(filePath)
        photoUrl = data.publicUrl
      }
    }

    const { error } = await supabase.from('tools').insert({
      owner_id:      user.id,
      name, brand, category, health,
      is_free:       isFree,
      price_per_day: isFree ? null : parseFloat(price),
      visibility:    'public',
      photo_urls:    photoUrl ? [photoUrl] : null,
    })

    if (error) { setError(error.message) }
    else { setSuccess(true); setTimeout(() => onSaved(), 1500) }
    setLoading(false)
  }

  const inp = { width:'100%', padding:'12px 14px', fontSize:14, border:`1px solid ${C.brdM}`, borderRadius:12, outline:'none', background:C.card, color:C.t1, fontFamily:'inherit', marginBottom:12 }

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', background:C.bg }}>
      <div style={{ background:C.card, padding:'8px 14px 14px', borderBottom:`1px solid ${C.brd}`, flexShrink:0 }}>
        <button onClick={onBack} className="tp" style={{ background:'none', border:'none', color:C.blue, fontSize:14, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:4, padding:'2px 0 10px' }}>
          <ArrowLeft size={14}/><span>My Shed</span>
        </button>
        <div style={{ fontWeight:800, fontSize:20, color:C.t1 }}>Add a Tool</div>
        <div style={{ fontSize:13, color:C.t2, marginTop:2 }}>Share with your neighborhood</div>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:16 }}>
        {success ? (
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', paddingTop:40 }}>
            <div style={{ width:72, height:72, borderRadius:36, background:C.greenL, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:16 }}>
              <CheckCircle size={40} color={C.green} strokeWidth={1.5}/>
            </div>
            <div style={{ fontWeight:800, fontSize:20, color:C.t1 }}>Tool Added!</div>
            <div style={{ fontSize:14, color:C.t2, marginTop:6 }}>Now visible to your neighbors</div>
          </div>
        ) : (
          <>
            {/* Photo upload */}
            <div style={{ marginBottom:16 }}>
              <div style={{ fontSize:11, fontWeight:700, color:C.t2, letterSpacing:'0.5px', marginBottom:8, textTransform:'uppercase' }}>Photo</div>
              <label style={{ display:'block', cursor:'pointer' }}>
                <input type="file" accept="image/*" onChange={handlePhoto} style={{ display:'none' }}/>
                <div style={{ height:160, background:preview?'transparent':C.cardAlt, borderRadius:16, border:`2px dashed ${preview?C.blue:C.brdM}`, overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:8 }}>
                  {preview ? (
                    <img src={preview} style={{ width:'100%', height:'100%', objectFit:'cover' }} alt="preview"/>
                  ) : (
                    <>
                      <Camera size={28} color={C.t3} strokeWidth={1.5}/>
                      <span style={{ fontSize:13, color:C.t2, fontWeight:500 }}>Tap to add a photo</span>
                    </>
                  )}
                </div>
              </label>
            </div>

            <div style={{ fontSize:11, fontWeight:700, color:C.t2, letterSpacing:'0.5px', marginBottom:6, textTransform:'uppercase' }}>Tool Name *</div>
            <input placeholder="e.g. Orbital Sander" value={name} onChange={e => setName(e.target.value)} style={inp}/>

            <div style={{ fontSize:11, fontWeight:700, color:C.t2, letterSpacing:'0.5px', marginBottom:6, textTransform:'uppercase' }}>Brand</div>
            <input placeholder="e.g. Bosch, DeWalt, Honda" value={brand} onChange={e => setBrand(e.target.value)} style={inp}/>

            <div style={{ fontSize:11, fontWeight:700, color:C.t2, letterSpacing:'0.5px', marginBottom:6, textTransform:'uppercase' }}>Category</div>
            <select value={category} onChange={e => setCategory(e.target.value)} style={inp}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>

            <div style={{ fontSize:11, fontWeight:700, color:C.t2, letterSpacing:'0.5px', marginBottom:8, textTransform:'uppercase' }}>Condition: {health}%</div>
            <input type="range" min={0} max={100} value={health} onChange={e => setHealth(parseInt(e.target.value))} style={{ width:'100%', marginBottom:16 }}/>

            <div style={{ fontSize:11, fontWeight:700, color:C.t2, letterSpacing:'0.5px', marginBottom:10, textTransform:'uppercase' }}>Pricing</div>
            <div style={{ display:'flex', gap:10, marginBottom:12 }}>
              {[true, false].map(f => (
                <div key={String(f)} onClick={() => setIsFree(f)} className="tp"
                  style={{ flex:1, background:isFree===f?C.blue:C.card, border:`1.5px solid ${isFree===f?C.blue:C.brdM}`, borderRadius:12, padding:'11px 0', textAlign:'center', fontWeight:700, fontSize:14, color:isFree===f?'white':C.t1, cursor:'pointer' }}>
                  {f ? 'Free' : 'Paid'}
                </div>
              ))}
            </div>

            {!isFree && <input type="number" placeholder="Price per day ($)" value={price} onChange={e => setPrice(e.target.value)} style={inp}/>}

            {error && <div style={{ background:C.redL, borderRadius:10, padding:'10px 14px', marginBottom:12, fontSize:13, color:C.red }}>{error}</div>}

            <button onClick={handleSave} disabled={loading}
              style={{ background:C.blue, color:'white', border:'none', borderRadius:12, padding:'14px 0', width:'100%', fontWeight:700, fontSize:15, cursor:'pointer', marginTop:8, boxShadow:`0 4px 16px ${C.blue}44` }}>
              {loading ? 'Saving...' : 'Add Tool to Shed'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
