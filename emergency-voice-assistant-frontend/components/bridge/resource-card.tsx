import type { MatchResult, ResourceListing } from '@/lib/types'

export function ResourceCard({ listing, match, index }: { listing: ResourceListing; match: MatchResult; index: number }) {
  return (
    <article className="rounded-xl border border-slate-300 bg-white p-5 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wide text-blue-900">Match {index + 1} · Demo listing</p>
      <h3 className="mt-2 text-xl font-semibold text-slate-950">{listing.organization.name}</h3>
      <p className="mt-1 text-sm capitalize text-slate-700">{listing.service}</p>
      <div className="mt-4">
        <h4 className="text-sm font-semibold text-slate-950">Why it matched</h4>
        <ul className="mt-1 list-inside list-disc text-sm text-slate-700">{match.reasons.map((reason) => <li key={reason}>{reason}</li>)}</ul>
      </div>
      <p className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-950"><strong>Coverage:</strong> {listing.coverage}</p>
      <p className="mt-3 text-sm text-slate-700"><strong>Limit:</strong> {listing.eligibilityLimit}</p>
      <p className="mt-3 text-sm text-slate-700"><strong>Last updated:</strong> {listing.lastUpdated}</p>
      <p className="mt-3 text-sm text-slate-700"><strong>Next step:</strong> {match.nextAction}</p>
      <details className="mt-4 border-t border-slate-200 pt-3">
        <summary className="min-h-11 cursor-pointer py-2 text-sm font-semibold text-blue-900 underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-800">View listing details</summary>
        <div className="mt-2 space-y-2 text-sm text-slate-700">
          <p>Services in source data: {listing.service}.</p>
          <p>People listed: {listing.populationsServed.join(', ') || 'Not specified'}.</p>
          <p>Language and accessibility information are not included in this source record.</p>
          <p>Source: {listing.source}. No direct phone number or local contact is provided.</p>
        </div>
      </details>
    </article>
  )
}
