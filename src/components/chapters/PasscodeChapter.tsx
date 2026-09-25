'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { isPasscodeCorrect } from '@/lib/passcode'

export function PasscodeChapter({ expected,hint,onUnlock }:{ expected:string; hint:string; onUnlock:()=>void }) {
  const [input,setInput]=useState(''); const [error,setError]=useState(false); const reduced=useReducedMotion()
  const inputRef=useRef('')
  const press=useCallback((key:string)=>{ if(inputRef.current.length>=expected.length)return; const next=inputRef.current+key; inputRef.current=next; setInput(next); setError(false); if(next.length===expected.length){ if(isPasscodeCorrect(next,expected))onUnlock(); else {inputRef.current='';setError(true);setInput('')} } },[expected,onUnlock])
  useEffect(()=>{ const handle=(event:KeyboardEvent)=>{ if(/^\d$/.test(event.key))press(event.key); if(event.key==='Backspace'){inputRef.current=inputRef.current.slice(0,-1);setError(false);setInput(inputRef.current)} }; window.addEventListener('keydown',handle); return()=>window.removeEventListener('keydown',handle) },[press])
  return <main className="passcode-stage relative grid min-h-svh place-items-center overflow-hidden p-5 text-white">
    <motion.div aria-hidden="true" className="absolute h-[70vw] w-[70vw] max-w-[48rem] rounded-full border border-white/10" animate={reduced?{}:{rotate:360}} transition={{duration:45,repeat:Infinity,ease:'linear'}}><div className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 rounded-full bg-[#ffc98d] shadow-[0_0_25px_#ffc98d]"/></motion.div>
    <section className="glass-panel relative w-full max-w-md rounded-[2rem] p-7 text-center text-[#33272b] sm:p-10">
      <motion.div className="relative mx-auto mb-7 h-28 w-40 [perspective:800px]" initial={reduced?false:{rotateY:-18,rotateX:8}} animate={{rotateY:0,rotateX:0}} transition={{duration:1,ease:[.16,1,.3,1]}} aria-hidden="true"><div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white to-[#f7dde4] shadow-[0_24px_60px_rgba(38,11,24,.28)]"/><div className="absolute inset-x-0 top-0 h-20 origin-top [clip-path:polygon(0_0,100%_0,50%_100%)] bg-[#ffdce5]"/><span className="absolute left-1/2 top-1/2 grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#d92f4c] text-lg text-white shadow-lg">♥</span></motion.div>
      <p className="mb-2 text-sm text-[#8b5362]">Private delivery</p><h1 className="font-display display-balance text-5xl font-semibold leading-none text-[#591c2d]">Something made only for you</h1><p className="mx-auto mt-4 max-w-xs text-sm leading-6 text-[#5f4a52]">{hint}</p>
      <motion.div animate={error&&!reduced?{x:[0,-8,8,-6,6,0]}:{x:0}} className="my-7 flex justify-center gap-3" aria-label={`${input.length} of ${expected.length} digits entered`}>{Array.from({length:expected.length},(_,i)=><span key={i} className="grid h-11 w-11 place-items-center rounded-2xl border border-[#591c2d]/12 bg-white/60 text-[#d92f4c] shadow-inner">{input[i]?'●':''}</span>)}</motion.div>
      <div className="mx-auto grid w-fit grid-cols-3 gap-3">{['1','2','3','4','5','6','7','8','9','0'].map(key=><motion.button whileHover={reduced?{}:{scale:1.08,y:-2}} whileTap={{scale:.9}} key={key} aria-label={key} onClick={()=>press(key)} className={`grid h-14 w-14 place-items-center rounded-full border border-white/80 bg-white/65 text-lg text-[#591c2d] shadow-[0_9px_25px_rgba(89,28,45,.12)] backdrop-blur ${key==='0'?'col-start-2':''}`}>{key}</motion.button>)}</div>
      {error&&<p role="alert" className="mt-4 text-sm text-[#d92f4c]">That code didn&apos;t open it. Try again.</p>}
    </section>
  </main>
}
