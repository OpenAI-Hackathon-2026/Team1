import type { CoarseLocation, MatchResult, ResourceListing, UserNeed } from './types'
import { resourceListings } from './resources'
const normalize = (value: string) => value.trim().toLowerCase()
const labels: Record<string, string> = {
  children: 'children', families: 'families', older_adults: 'older adults',
  displaced_people: 'displaced people', chronic_conditions: 'chronic conditions',
  limited_mobility: 'limited mobility', wheelchair: 'wheelchair access',
  no_transportation: 'people without transportation', interpretation: 'interpretation',
}
function covers(coverage: CoarseLocation, requested: CoarseLocation): boolean {
  // Missing required locality cannot establish local coverage.
  return (['country', 'region', 'city'] as const).every(key =>
    !coverage[key] || (!!requested[key] && normalize(coverage[key]!) === normalize(requested[key]!)))
}
/** Pure, network-free ranking. Empty results for immediate danger: show the safety notice. */
export function matchResources(need: UserNeed, resources: readonly ResourceListing[] = resourceListings): MatchResult[] {
  if (need.urgency === 'immediate_danger' || !need.location.country.trim()) return []
  const urgency = need.urgency
  return resources.flatMap(resource => {
    if (resource.status !== 'active' || !resource.categories.includes(need.category)) return []
    if (resource.coverage.type === 'local' && !covers(resource.coverage.location, need.location)) return []
    let score = resource.serviceMode === 'demo_service' ? 100 : 20
    const reasons = [`Lists support for ${need.category.replace('_', ' and ')}.`]
    if (resource.coverage.type === 'local') { score += 20; reasons.push('Matches your coarse location in the fictional demo.'); }
    else reasons.push('Organization information only; local coverage is unverified.')
    for (const value of new Set(need.populations)) {
      if (resource.populations.includes(value)) { score += 8; reasons.push(`Lists support for ${labels[value]}.`) }
    }
    for (const value of new Set(need.accessNeeds)) {
      if (resource.accessNeeds.includes(value)) { score += 10; reasons.push(`Lists support for ${labels[value]}.`) }
    }
    for (const value of new Set(need.languages.map(normalize))) {
      if (resource.languages.map(normalize).includes(value)) { score += 6; reasons.push(`Lists language support: ${value}.`) }
    }
    if (resource.urgencies.includes(urgency)) { score += 4; reasons.push(`Listed for ${need.urgency} needs; availability is unverified.`) }
    if (need.disasterType && resource.disasterTypes.map(normalize).includes(normalize(need.disasterType))) {
      score += 2; reasons.push(`Source includes ${need.disasterType.replaceAll('_', ' ')} response.`)
    }
    return [{ resourceId: resource.id, score, reasons, nextAction: resource.nextAction }]
  }).sort((a, b) => b.score - a.score || (a.resourceId < b.resourceId ? -1 : a.resourceId > b.resourceId ? 1 : 0)).slice(0, 3)
}
