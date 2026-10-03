import type { MatchResult, NeedCategory, ResourceListing, UserNeed } from '@/lib/types'

const categoryLabels: Record<NeedCategory, string> = {
  food_water: 'food or water',
  shelter: 'shelter',
  medical: 'medical support',
  transport: 'transport or evacuation',
  other: 'related support',
}

export function matchResources(need: UserNeed, listings: ResourceListing[]): MatchResult[] {
  const description = need.description.toLowerCase()
  return listings
    .filter((listing) => listing.status !== 'inactive' && (need.category === 'other' || listing.categories.includes(need.category)))
    .map((listing) => {
      const keywordMatches = listing.keywords.filter((keyword) => description.includes(keyword.toLowerCase()))
      const populationMatches = listing.populationsServed.filter((population) =>
        need.people.toLowerCase().includes(population.toLowerCase()),
      )
      if (need.category === 'other' && keywordMatches.length === 0) return null
      const reasons = need.category === 'other'
        ? ['Your description includes a term from this organization’s service profile']
        : [`Lists services related to ${categoryLabels[need.category]}`]
      if (keywordMatches.length) reasons.push(`Your description mentioned ${keywordMatches[0]}`)
      if (populationMatches.length) reasons.push(`Lists support for ${populationMatches[0]}`)
      return {
        resourceId: listing.id,
        score: 50 + keywordMatches.length * 10 + populationMatches.length * 8,
        reasons,
        nextAction: 'Check the organization’s official local program for current service availability.',
      }
    })
    .filter((match): match is MatchResult => match !== null)
    .sort((a, b) => b.score - a.score || a.resourceId.localeCompare(b.resourceId))
    .slice(0, 3)
}
