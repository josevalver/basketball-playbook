import React, { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'


const Court = ({ children }) => (
<svg viewBox="0 0 100 94" className="w-full rounded-2xl shadow ring-1 ring-white/10 bg-emerald-900/10">
{/* simple half-court */}
<rect x="0" y="0" width="100" height="94" rx="2" fill="url(#g)" />
<defs>
<linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
<stop offset="0%" stopOpacity="0.1" />
<stop offset="100%" stopOpacity="0.2" />
</linearGradient>
</defs>
{/* midline & 3pt arc simplified */}
<line x1="0" y1="70" x2="100" y2="70" stroke="currentColor" strokeOpacity="0.2" />
{children}
</svg>
)


const Dot = ({ id, role, x, y, active }) => (
<motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
<motion.circle cx={x} cy={y} r={3.6} strokeWidth={0.6} className={`fill-white/90 ${active? 'stroke-emerald-400' : 'stroke-white/40'}`} />
<text x={x} y={y+0.7} fontSize={3.2} textAnchor="middle" className="fill-emerald-900">{id}</text>
{role && <text x={x} y={y+6.6} fontSize={2.8} textAnchor="middle" className="fill-white/70">{role}</text>}
</motion.g>
)


const Arrow = ({ from, to }) => {
const dx = to.x - from.x, dy = to.y - from.y
const len = Math.hypot(dx, dy)
const angle = Math.atan2(dy, dx) * 180/Math.PI
return (
<g transform={`translate(${from.x} ${from.y}) rotate(${angle})`}>
<line x1="0" y1="0" x2={len-3} y2="0" stroke="currentColor" strokeWidth={0.6} className="stroke-yellow-300" />
<polygon points="0,0 0,0 0,0" />
<polygon points={`${len-3},0 ${len-5},1.8 ${len-5},-1.8`} className="fill-yellow-300" />
</g>
)
}


function useVoiceControls(onCmd) {
useEffect(() => {
const SR = window.SpeechRecognition || window.webkitSpeechRecognition
if (!SR) return
const r = new SR()
r.lang = 'en-US'
r.continuous = true
r.interimResults = false
r.onresult = (e) => {
const last = e.results[e.results.length-1][0].transcript.trim().toLowerCase()
if (["next", "go", "play", "siguiente"].includes(last)) onCmd('next')
if (["back", "previous", "atrás", "atras"].includes(last)) onCmd('prev')
if (["reset", "inicio"].includes(last)) onCmd('reset')
}
r.start()
return () => { try { r.stop() } catch {} }
}, [onCmd])
}


export default function PlayAnimator({ play }) {
const [step, setStep] = useState(0)
const [auto, setAuto] = useState(false)
const steps = play.steps ?? []


const idx = Math.max(0, Math.min(step, steps.length-1))
const frame = steps[idx]


const playersById = useMemo(() => Object.fromEntries(frame.players.map(p => [p.id, p])), [frame])


// Keyboard controls
useEffect(() => {
const onKey = (e) => {
if (e.code === 'Space' || e.key === ' ') { e.preventDefault(); setStep(s => Math.min(s+1, steps.length-1)) }
if (e.key === 'ArrowRight') setStep(s => Math.min(s+1, steps.length-1))
if (e.key === 'ArrowLeft') setStep(s => Math.max(s-1, 0))
if (e.key.toLowerCase() === 'r') { setStep(0); setAuto(false) }
}
window.addEventListener('keydown', onKey)
return () => window.removeEventListener('keydown', onKey)
}, [steps.length])


// Voice controls (optional)
useVoiceControls((cmd) => {
}