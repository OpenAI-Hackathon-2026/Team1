'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowRight, Check, MapPin, Mic, Phone, RotateCcw, ShieldCheck, Sparkles, Square, Waves } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { connectToOrganization, findOrganization, getUserFacingError, Organization, speakText, transcribeAudio } from '@/lib/api'

type Status = 'idle' | 'recording' | 'transcribing' | 'routing' | 'result' | 'connecting' | 'connected' | 'error'

const demoOrganization: Organization = {
  id: 'community-relief-network',
  name: 'Community Relief Network',
  services: ['Food assistance', 'Hurricane relief'],
  location: 'Charlotte, NC',
  phone: '704-555-0101',
  reason: 'Provides food and hurricane relief in your area.',
}

export function VoiceAssistant() {
  const [status, setStatus] = useState<Status>('idle')
  const [transcript, setTranscript] = useState('')
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [error, setError] = useState('')
  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const audioUrlRef = useRef<string | null>(null)

  const reset = useCallback(() => {
    if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current)
    audioUrlRef.current = null
    setStatus('idle')
    setTranscript('')
    setOrganization(null)
    setError('')
  }, [])

  useEffect(() => () => {
    recorderRef.current?.stream.getTracks().forEach((track) => track.stop())
    if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current)
  }, [])

  const processRecording = useCallback(async (blob: Blob) => {
    setStatus('transcribing')
    try {
      const transcription = await transcribeAudio(blob)
      if (!transcription.text.trim()) throw new Error('NO_SPEECH')
      setTranscript(transcription.text)
      setStatus('routing')
      const routed = await findOrganization(transcription.text)
      setOrganization(routed.organization)
      setStatus('result')
      try {
        const audio = await speakText(`I found ${routed.organization.name}. ${routed.organization.reason}`)
        const url = URL.createObjectURL(audio)
        audioUrlRef.current = url
        await new Audio(url).play()
      } catch {
        // TTS is optional: the visual result remains available if audio is unavailable.
      }
    } catch (caught) {
      setError(getUserFacingError(caught, 'We couldn’t find the right help right now. Please try again.'))
      setStatus('error')
    }
  }, [])

  const startRecording = async () => {
    setError('')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? 'audio/webm;codecs=opus' : 'audio/wav'
      const recorder = new MediaRecorder(stream, { mimeType })
      chunksRef.current = []
      recorder.ondataavailable = (event) => event.data.size > 0 && chunksRef.current.push(event.data)
      recorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop())
        void processRecording(new Blob(chunksRef.current, { type: recorder.mimeType }))
      }
      recorderRef.current = recorder
      recorder.start()
      setStatus('recording')
    } catch (caught) {
      setError(getUserFacingError(caught, 'We couldn’t access your microphone. Please check your browser permissions.'))
      setStatus('error')
    }
  }

  const stopRecording = () => {
    if (recorderRef.current?.state === 'recording') recorderRef.current.stop()
  }

  const connect = async () => {
    if (!organization) return
    setStatus('connecting')
    try {
      await connectToOrganization(organization.id)
      setStatus('connected')
    } catch {
      setError('We couldn’t connect you right now. Please try again or call the organization directly.')
      setStatus('error')
    }
  }

  const isBusy = ['transcribing', 'routing', 'connecting'].includes(status)

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f5f7f6] text-[#17211e]">
      <div className="pointer-events-none absolute -left-40 top-24 size-[28rem] rounded-full bg-[#dcebe5]/60 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-40 bottom-0 size-[32rem] rounded-full bg-[#e8e1d7]/60 blur-3xl" aria-hidden="true" />
      <header className="relative mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-7 lg:px-10">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-[#173b32] text-[#e7f4ed]"><Sparkles aria-hidden="true" /></div>
          <span className="text-sm font-semibold tracking-[0.16em] text-[#173b32]">BRIDGE</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-[#64736d]"><ShieldCheck aria-hidden="true" /> Private &amp; secure</div>
      </header>

      <section className="relative mx-auto flex max-w-6xl flex-col items-center px-6 pb-16 pt-12 lg:px-10 lg:pt-20">
        <div className="mb-10 text-center">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.22em] text-[#55776c]">Emergency assistance, made simple</p>
          <h1 className="max-w-2xl text-balance text-4xl font-semibold tracking-[-0.04em] text-[#173b32] sm:text-6xl">Tell us what you need help with.</h1>
          <p className="mx-auto mt-5 max-w-lg text-pretty text-base leading-7 text-[#64736d] sm:text-lg">We&apos;ll listen, find the right organization, and help connect you.</p>
        </div>

        {status === 'idle' && <button onClick={startRecording} aria-label="Start recording" className="group relative mb-8 flex size-40 items-center justify-center rounded-full bg-[#173b32] text-[#f8fbf9] shadow-[0_18px_45px_-16px_#173b32] transition duration-300 hover:scale-105 hover:bg-[#245a4c] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#9bc7b5] sm:size-48"><span className="absolute inset-2 rounded-full border border-white/15" /><Mic className="size-12 transition group-hover:scale-110" strokeWidth={1.5} /></button>}
        {status === 'recording' && <div className="mb-8 flex flex-col items-center gap-6"><div className="flex size-40 items-center justify-center rounded-full bg-[#b95747] shadow-[0_18px_45px_-16px_#b95747] sm:size-48"><button onClick={stopRecording} aria-label="Stop recording" className="flex size-full items-center justify-center rounded-full text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#e9b2a9]"><Square className="size-10 fill-current" /></button></div><div className="flex h-8 items-center gap-1.5" aria-label="Recording waveform"><Waves className="size-6 text-[#b95747]" /><span className="h-3 w-1 rounded-full bg-[#b95747] animate-pulse" /><span className="h-7 w-1 rounded-full bg-[#b95747] animate-pulse [animation-delay:100ms]" /><span className="h-5 w-1 rounded-full bg-[#b95747] animate-pulse [animation-delay:200ms]" /><span className="h-8 w-1 rounded-full bg-[#b95747] animate-pulse [animation-delay:300ms]" /><span className="h-4 w-1 rounded-full bg-[#b95747] animate-pulse [animation-delay:400ms]" /></div></div>}
        {status === 'idle' && <p className="mb-14 text-sm font-medium text-[#64736d]">Tap the microphone to begin</p>}
        {status === 'recording' && <p className="mb-14 text-sm font-semibold text-[#b95747]">Listening…</p>}
        {isBusy && <div className="mb-14 flex items-center gap-3 rounded-full bg-white/70 px-5 py-3 text-sm font-medium text-[#55776c] shadow-sm"><span className="size-2 animate-pulse rounded-full bg-[#55776c]" />{status === 'routing' ? 'Finding help…' : status === 'connecting' ? `Connecting you with ${organization?.name}…` : 'Transcribing your request…'}</div>}

        {(transcript || organization) && <div className="w-full max-w-2xl space-y-5">{transcript && <div className="rounded-2xl border border-[#dce5e0] bg-white/70 p-5"><p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#8a9992]">You said</p><p className="text-lg leading-8 text-[#30413a]">{transcript}</p></div>}
          {organization && status !== 'connecting' && status !== 'connected' && <div className="rounded-3xl border border-[#d7e6df] bg-white p-6 shadow-[0_20px_60px_-35px_#173b32] sm:p-8"><div className="mb-7 flex items-start justify-between gap-4"><div><p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#55776c]">A good place to start</p><h2 className="text-2xl font-semibold tracking-[-0.03em] text-[#173b32] sm:text-3xl">{organization.name}</h2></div><div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#e7f2ec] text-[#3f7662]"><Check /></div></div><p className="mb-6 text-base leading-7 text-[#52635b]">{organization.reason}</p><div className="flex flex-wrap gap-2">{organization.services.map((service) => <span key={service} className="rounded-full bg-[#edf4f0] px-3 py-1.5 text-sm font-medium text-[#3f6f5d]">{service}</span>)}</div><div className="mt-7 flex flex-col gap-3 border-t border-[#e4ebe7] pt-6 text-sm text-[#65766e] sm:flex-row sm:items-center sm:justify-between"><span className="flex items-center gap-2"><MapPin />{organization.location}</span>{organization.phone && <span className="flex items-center gap-2"><Phone />{organization.phone}</span>}</div><Button onClick={connect} className="mt-7 h-14 w-full rounded-2xl bg-[#173b32] text-base hover:bg-[#245a4c]">Connect me <ArrowRight data-icon="inline-end" /></Button></div>}
          {status === 'connected' && <div className="rounded-3xl bg-[#173b32] p-8 text-center text-white shadow-xl"><div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-[#d4eadf] text-[#173b32]"><Check /></div><h2 className="text-2xl font-semibold">You&apos;re connected</h2><p className="mt-2 text-[#c6ddd3]">{organization?.name} is ready to help.</p></div>}
          <button onClick={reset} className="mx-auto flex items-center gap-2 text-sm font-semibold text-[#55776c] transition hover:text-[#173b32] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9bc7b5] focus-visible:ring-offset-2"><RotateCcw /> Try again</button>
        </div>}

        {status === 'error' && <div role="alert" className="w-full max-w-md rounded-2xl border border-[#eccfc8] bg-[#fff8f6] p-5 text-center"><p className="text-sm leading-6 text-[#8d4b40]">{error}</p><Button variant="outline" onClick={reset} className="mt-4 rounded-xl border-[#ddb9b0] bg-transparent text-[#8d4b40] hover:bg-[#fff0ec]"><RotateCcw data-icon="inline-start" /> Try again</Button></div>}

        <p className="mt-20 max-w-md text-center text-xs leading-5 text-[#87958e]">Bridge helps you find community support. If you&apos;re in immediate danger, call your local emergency services.</p>
      </section>
    </main>
  )
}

