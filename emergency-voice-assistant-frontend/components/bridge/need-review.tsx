import type { NeedCategory, UserNeed } from '@/lib/types'

const labels: Record<NeedCategory, string> = { food_water: 'Food and water', shelter: 'Shelter', medical: 'Medical support', transport: 'Transport or evacuation', other: 'Other' }

export function NeedReview({ need }: { need: UserNeed }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-slate-50 p-5" aria-labelledby="review-heading">
      <h2 id="review-heading" className="text-lg font-semibold text-slate-950">Here’s what we understood</h2>
      <dl className="mt-4 grid gap-x-5 gap-y-3 sm:grid-cols-2">
        <ReviewRow label="Need" value={labels[need.category]} />
        <ReviewRow label="Area" value={need.location || 'Not provided'} />
        <ReviewRow label="Who needs support" value={need.people || 'Not provided'} />
        <ReviewRow label="Timing" value={{ immediate: 'As soon as possible', soon: 'Today or soon', planning: 'Planning ahead', unsure: 'Not provided' }[need.urgency]} />
        <ReviewRow label="Language" value={need.language || 'Not provided'} />
        <ReviewRow label="Access needs" value={need.accessibility.length ? need.accessibility.join(', ') : 'Not provided'} />
      </dl>
      {need.description && <div className="mt-4 border-t border-slate-200 pt-3"><p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Your description</p><p className="mt-1 whitespace-pre-wrap text-sm text-slate-900">{need.description}</p></div>}
    </section>
  )
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return <div><dt className="text-xs font-semibold uppercase tracking-wide text-slate-600">{label}</dt><dd className="mt-1 text-sm text-slate-900">{value}</dd></div>
}
