import { matchResources } from '@/lib/matcher'
import { resources } from '@/lib/resources'
import type { UserNeed } from '@/lib/types'
import { ResourceCard } from '@/components/bridge/resource-card'

export function ResultsList({ need }: { need: UserNeed }) {
  const matches = matchResources(need, resources)
  const byId = new Map(resources.map((resource) => [resource.id, resource]))
  return (
    <section aria-labelledby="results-heading">
      <div className="mb-4">
        <h2 id="results-heading" className="text-xl font-semibold text-slate-950">Possible places to start</h2>
        <p className="mt-1 text-sm text-slate-700">These are explainable matches from demo data. Local coverage and current availability have not been verified.</p>
        <p className="mt-2 text-xs text-slate-600">This demo ranks by need category and matching terms. Its source data does not support verification of location, urgency, language, eligibility, or accessibility.</p>
      </div>
      {matches.length ? <div className="space-y-4">{matches.map((match, index) => {
        const listing = byId.get(match.resourceId)
        return listing ? <ResourceCard key={match.resourceId} listing={listing} match={match} index={index} /> : null
      })}</div> : <div className="rounded-xl border border-slate-300 bg-slate-50 p-5"><h3 className="font-semibold text-slate-950">No matching demo listings found</h3><p className="mt-2 text-sm text-slate-700">Try another category or contact local emergency management or a community information line. If you are in immediate danger, call local emergency services.</p></div>}
      {need.location && <p className="mt-4 text-xs text-slate-600">Your area ({need.location}) is shown in your answers, but the current demo records do not include verified local coverage.</p>}
    </section>
  )
}
