// src/screens/HandshakeScreen.jsx
import { useState } from 'react'
import { ArrowLeft, Shield, QrCode, Camera, CheckCircle } from 'lucide-react'
import { C } from '../theme.js'

export default function HandshakeScreen({ onBack, goPhoto }) {
  const [step, setStep] = useState(0)
  const STEPS = ['Sign Waiver', 'Scan QR', 'Photos', 'Active!']

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', background:C.bg }}>
      {/* Header */}
      <div style={{ background:C.card, padding:'8px 14px 16px', borderBottom:`1px solid ${C.brd}`, flexShrink:0 }}>
        <button onClick={onBack} className="tp" style={{ background:'none', border:'none', color:C.blue, fontSize:14, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:4, padding:'2px 0 10px' }}>
          <ArrowLeft size={14}/><span>Back</span>
        </button>
        <div style={{ fontWeight:800, fontSize:20, color:C.t1, letterSpacing:'-0.3px' }}>Tool Pickup</div>
        <div style={{ fontSize:13, color:C.t2, marginTop:2 }}>Power Drill — Carlos M.</div>
        <div style={{ display:'flex', gap:6, marginTop:12 }}>
          {STEPS.map((s, i) => (
            <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', gap:4, alignItems:'center' }}>
              <div style={{ width:'100%', height:3, borderRadius:2, background:i <= step ? C.blue : C.bg }}/>
              <span style={{ fontSize:8, fontWeight:600, color:i <= step ? C.blue : C.t3 }}>{s.toUpperCase()}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:18 }}>
        {/* Step 0 — Waiver */}
        {step === 0 && (
          <div>
            <div style={{ background:C.orangeL, borderRadius:14, padding:16, marginBottom:16, border:`1px solid ${C.orange}33` }}>
              <div style={{ display:'flex', gap:10, alignItems:'center', marginBottom:10 }}>
                <Shield size={18} color={C.orange} strokeWidth={1.5} style={{ flexShrink:0 }}/>
                <div style={{ fontWeight:700, fontSize:14, color:C.orange }}>Liability Waiver</div>
              </div>
              <div style={{ fontSize:12, color:C.t1, lineHeight:1.7, fontStyle:'italic' }}>
                "I, <b style={{ fontStyle:'normal' }}>Alex Ortega</b>, acknowledge that the <b style={{ fontStyle:'normal' }}>DeWalt Power Drill 850W</b> is potentially hazardous and release Carlos M. from all liability for injury or damage during use."
              </div>
            </div>
            <div style={{ background:C.card, border:`1.5px dashed ${C.brdM}`, borderRadius:12, height:72, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:16, boxShadow:C.sh }}>
              <div style={{ textAlign:'center' }}>
                <div style={{ fontSize:13, color:C.t2, fontWeight:500 }}>Sign with your finger</div>
                <div style={{ fontSize:11, color:C.t3, marginTop:2 }}>PDF sent to both parties</div>
              </div>
            </div>
            <button onClick={() => setStep(1)} style={{ background:C.orange, color:'white', border:'none', borderRadius:12, padding:'14px 0', width:'100%', fontWeight:700, fontSize:15, cursor:'pointer', boxShadow:`0 4px 16px ${C.orange}44` }}>
              Sign & Continue →
            </button>
          </div>
        )}

        {/* Step 1 — QR */}
        {step === 1 && (
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
            <div style={{ fontWeight:700, fontSize:17, color:C.t1, marginBottom:4, textAlign:'center' }}>Have Carlos show his QR code</div>
            <div style={{ fontSize:13, color:C.t2, marginBottom:22, textAlign:'center' }}>Scanning starts the loan timer</div>
            <div style={{ width:180, height:180, background:C.card, border:`2px solid ${C.blue}33`, borderRadius:22, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:22, boxShadow:C.shM }}>
              <QrCode size={110} color={C.blue} strokeWidth={1.3}/>
            </div>
            <div style={{ background:C.blueL, borderRadius:12, padding:12, width:'100%', textAlign:'center', marginBottom:18, border:`1px solid ${C.blue}22` }}>
              <span style={{ fontSize:12, color:C.blue, fontWeight:500 }}>Not available? Request a Drop Zone code instead</span>
            </div>
            <button onClick={() => setStep(2)} style={{ background:C.blue, color:'white', border:'none', borderRadius:12, padding:'14px 0', width:'100%', fontWeight:700, fontSize:15, cursor:'pointer', boxShadow:`0 4px 16px ${C.blue}44` }}>
              QR Scanned — Continue →
            </button>
          </div>
        )}

        {/* Step 2 — Photos */}
        {step === 2 && (
          <div>
            <div style={{ fontWeight:700, fontSize:17, color:C.t1, marginBottom:4 }}>Document current condition</div>
            <div style={{ fontSize:13, color:C.t2, marginBottom:16 }}>3 photos protect both parties if a dispute arises</div>
            <div onClick={goPhoto} className="tp" style={{ background:C.card, borderRadius:16, padding:20, display:'flex', flexDirection:'column', alignItems:'center', gap:14, marginBottom:14, boxShadow:C.shM, border:`1px solid ${C.brd}` }}>
              <div style={{ width:64, height:64, borderRadius:20, background:C.blueL, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Camera size={30} color={C.blue} strokeWidth={1.5}/>
              </div>
              <div style={{ textAlign:'center' }}>
                <div style={{ fontWeight:700, fontSize:15, color:C.t1 }}>Open Documentation Camera</div>
                <div style={{ fontSize:12, color:C.t2, marginTop:4 }}>Front view · left side · motor / mechanism</div>
              </div>
              <div style={{ background:C.blueL, borderRadius:10, padding:'8px 18px', border:`1px solid ${C.blue}22` }}>
                <span style={{ fontSize:13, color:C.blue, fontWeight:600 }}>Tap to open →</span>
              </div>
            </div>
            <div style={{ background:C.orangeL, borderRadius:10, padding:10, display:'flex', gap:10, marginBottom:16, border:`1px solid ${C.orange}22` }}>
              <Shield size={14} color={C.orange} style={{ flexShrink:0, marginTop:2 }} strokeWidth={1.5}/>
              <span style={{ fontSize:11, color:'#A05000', lineHeight:1.5 }}>Photos are GPS-tagged and timestamped. Cannot be altered after capture.</span>
            </div>
            <button onClick={() => setStep(3)} style={{ background:C.blue, color:'white', border:'none', borderRadius:12, padding:'14px 0', width:'100%', fontWeight:700, fontSize:15, cursor:'pointer' }}>
              Photos Done — Activate Loan →
            </button>
          </div>
        )}

        {/* Step 3 — Confirmed */}
        {step === 3 && (
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', paddingTop:16 }}>
            <div style={{ width:80, height:80, borderRadius:40, background:C.greenL, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:16, boxShadow:`0 0 30px ${C.green}33` }}>
              <CheckCircle size={44} color={C.green} strokeWidth={1.5}/>
            </div>
            <div style={{ fontWeight:800, fontSize:24, color:C.t1, textAlign:'center', letterSpacing:'-0.4px', marginBottom:6 }}>Loan Active!</div>
            <div style={{ fontSize:14, color:C.t2, textAlign:'center', marginBottom:22 }}>Power Drill is your responsibility until 6:00 PM today</div>
            <div style={{ background:C.card, borderRadius:14, padding:16, width:'100%', marginBottom:16, boxShadow:C.sh, border:`1px solid ${C.brd}` }}>
              {[['Tool','DeWalt Power Drill 850W'],['Owner','Carlos M.'],['Started','Today · 11:23 AM'],['Return by','Today · 6:00 PM'],['Security deposit','$0 — Trusted Pro']].map(([l, v], i) => (
                <div key={i} style={{ display:'flex', justifyContent:'space-between', paddingTop:i ? 10 : 0, borderTop:i ? `1px solid ${C.brd}` : 'none' }}>
                  <span style={{ fontSize:13, color:C.t2 }}>{l}</span>
                  <span style={{ fontSize:13, fontWeight:600, color:C.t1 }}>{v}</span>
                </div>
              ))}
            </div>
            <button onClick={onBack} style={{ background:C.blue, color:'white', border:'none', borderRadius:12, padding:'14px 0', width:'100%', fontWeight:700, fontSize:15, cursor:'pointer', boxShadow:`0 4px 16px ${C.blue}44` }}>
              Back to Home
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
