import care from '@/nonprofits/care.json'
import directRelief from '@/nonprofits/direct_relief.json'
import ifrc from '@/nonprofits/ifrc.json'
import salvationArmy from '@/nonprofits/salvation_army.json'
import worldCentralKitchen from '@/nonprofits/world_central_kitchen.json'
import type { NeedCategory, ResourceListing } from '@/lib/types'

type SourceRecord = {
  id: string
  name: string
  type: string
  geographic_scope: string
  services: string[]
  populations_served: string[]
  routing_tags: string[]
  routing_note: string
}

const categoryKeywords: Record<NeedCategory, string[]> = {
  food_water: ['food', 'meal', 'water', 'nutrition', 'hunger', 'drink'],
  shelter: ['shelter', 'housing', 'temporary_housing', 'refuge', 'displacement'],
  medical: ['medical', 'health', 'medicine', 'clinic', 'healthcare', 'patient'],
  transport: ['transport', 'evacuation', 'logistics', 'displacement'],
  other: [],
}

const sources = [care, directRelief, ifrc, salvationArmy, worldCentralKitchen] as SourceRecord[]

function inferCategories(record: SourceRecord): NeedCategory[] {
  const searchable = [...record.services, ...record.routing_tags].join(' ').toLowerCase()
  return (Object.keys(categoryKeywords) as NeedCategory[]).filter((category) =>
    category === 'other' ? false : categoryKeywords[category].some((word) => searchable.includes(word)),
  )
}

export const resources: ResourceListing[] = sources.map((record) => ({
  id: record.id,
  organization: {
    id: record.id,
    name: record.name,
    type: record.type,
    geographicScope: record.geographic_scope,
    routingNote: record.routing_note,
  },
  service: record.services.slice(0, 4).map((service) => service.replaceAll('_', ' ')).join(', '),
  categories: inferCategories(record),
  keywords: [...record.services, ...record.routing_tags].map((value) => value.replaceAll('_', ' ')),
  populationsServed: record.populations_served.map((value) => value.replaceAll('_', ' ')),
  coverage: 'Global organization profile; local coverage is not verified in this demo.',
  eligibilityLimit: record.routing_note,
  languages: [],
  accessibility: [],
  status: 'unknown',
  lastUpdated: 'Demo source data; review date not provided',
  source: `nonprofits/${record.id}.json`,
}))
