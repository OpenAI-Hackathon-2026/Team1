'use client'

import { useState } from 'react'
import { NeedDetails } from '@/components/bridge/need-details'
import { NeedReview } from '@/components/bridge/need-review'
import { NeedSelector } from '@/components/bridge/need-selector'
import { ResultsList } from '@/components/bridge/results-list'
import { SafetyBanner } from '@/components/bridge/safety-banner'
import type { NeedCategory, UserNeed } from '@/lib/types'

type Step = 'category' | 'details' | 'review' | 'results'

const emptyNeed: UserNeed = {
  category: 'other',
  description: '',
  location: '',
  people: '',
  urgency: 'unsure',
  language: '',
  accessibility: [],
}

const stepCopy: Record<Step, { number: string; title: string }> = {
  category: { number: '1 of 3', title: 'Choose a type of help' },
  details: { number: '2 of 3', title: 'Add a few details' },
  review: { number: '3 of 3', title: 'Review your answers' },
  results: { number: 'Results', title: 'Resource matches' },
}

export function ResourceFinder() {
  const [step, setStep] = useState<Step>('category')
  const [category, setCategory] = useState<NeedCategory | null>(null)
  const [need, setNeed] = useState<UserNeed>(emptyNeed)

  const chooseCategory = (value: NeedCategory) => {
    setCategory(value)
    setNeed((current) => ({ ...current, category: value }))
  }

  const startOver = () => {
    setNeed(emptyNeed)
    setCategory(null)
    setStep('category')
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <SafetyBanner />
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4 sm:px-6">
          <a href="/" onClick={(event) => { event.preventDefault(); startOver() }} className="text-lg font-bold tracking-wide text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-800">BRIDGE</a>
          <span className="text-xs font-medium text-slate-600">Community resource finder</span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 pb-12 pt-8 sm:px-6 sm:pt-10">
        <div className="mb-7">
          <p className="text-sm font-semibold text-blue-900">{stepCopy[step].number}</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">{stepCopy[step].title}</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-700">Share only what you’re comfortable sharing. We’ll look for possible places to start from the resource information in this demo.</p>
        </div>

        {step === 'category' && <section className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
          <NeedSelector value={category} onChange={chooseCategory} />
          <div className="flex justify-end"><button type="button" disabled={!category} onClick={() => setStep('details')} className="min-h-12 rounded-lg bg-blue-900 px-6 font-semibold text-white hover:bg-blue-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-800 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-400">Continue</button></div>
        </section>}

        {step === 'details' && <section className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
          <NeedSelector value={need.category} onChange={chooseCategory} />
          <NeedDetails value={need} onChange={setNeed} />
          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-between">
            <button type="button" onClick={() => setStep('category')} className="min-h-12 rounded-lg border border-slate-300 px-5 font-semibold text-slate-800 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-800">Back</button>
            <button type="button" onClick={() => setStep('review')} className="min-h-12 rounded-lg bg-blue-900 px-6 font-semibold text-white hover:bg-blue-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-800 focus-visible:ring-offset-2">Review answers</button>
          </div>
        </section>}

        {step === 'review' && <div className="space-y-5">
          <NeedReview need={need} />
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <button type="button" onClick={() => setStep('details')} className="min-h-12 rounded-lg border border-slate-300 bg-white px-5 font-semibold text-slate-800 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-800">Change answers</button>
            <button type="button" onClick={() => setStep('results')} className="min-h-12 rounded-lg bg-blue-900 px-6 font-semibold text-white hover:bg-blue-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-800 focus-visible:ring-offset-2">Show possible matches</button>
          </div>
        </div>}

        {step === 'results' && <div className="space-y-5">
          <NeedReview need={need} />
          <ResultsList need={need} />
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <button type="button" onClick={() => setStep('details')} className="min-h-12 rounded-lg border border-slate-300 bg-white px-5 font-semibold text-slate-800 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-800">Change answers</button>
            <button type="button" onClick={startOver} className="min-h-12 rounded-lg bg-blue-900 px-6 font-semibold text-white hover:bg-blue-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-800 focus-visible:ring-offset-2">Start over</button>
          </div>
        </div>}
        <p className="mt-8 border-t border-slate-200 pt-4 text-xs leading-5 text-slate-600">BRIDGE is a resource finder, not an emergency dispatch service. Demo listings do not confirm local coverage, eligibility, or current availability.</p>
      </main>
    </div>
  )
}
