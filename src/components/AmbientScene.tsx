'use client'
import { motion, useReducedMotion } from 'framer-motion'

export function AmbientScene() {
  const reduced=useReducedMotion()
  return <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
    <div className="ambient-orb ambient-orb-a"/><div className="ambient-orb ambient-orb-b"/><div className="ambient-grid"/>
    {!reduced&&Array.from({length:9},(_,i)=><motion.span key={i} className="absolute h-1 w-1 rounded-full bg-[#d92f4c]" style={{left:`${8+i*11}%`,top:`${18+(i%4)*19}%`}} animate={{y:[0,-18,0],opacity:[.12,.45,.12],scale:[1,1.8,1]}} transition={{duration:4+i*.45,repeat:Infinity,delay:i*.3}}/>)}
  </div>
}
