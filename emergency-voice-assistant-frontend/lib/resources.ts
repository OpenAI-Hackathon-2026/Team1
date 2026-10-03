import care from '../nonprofits/care.json'
import directRelief from '../nonprofits/direct_relief.json'
import ifrc from '../nonprofits/ifrc.json'
import salvationArmy from '../nonprofits/salvation_army.json'
import wck from '../nonprofits/world_central_kitchen.json'
import type { Organization, ResourceListing, NeedCategory } from './types'

const sources = [care, directRelief, ifrc, salvationArmy, wck]
const filenames = ['care', 'direct_relief', 'ifrc', 'salvation_army', 'world_central_kitchen']
export const organizations: Organization[] = sources.map((source, index) => ({
  id: source.id, name: source.name, services: source.services,
  disasterTypes: source.disaster_types, populationsServed: source.populations_served,
  source: `nonprofits/${filenames[index]}.json`, routingNote: source.routing_note, fictional: false,
}))
const categories: NeedCategory[][] = [
  ['food_water', 'medical', 'other'], ['medical'],
  ['food_water', 'shelter', 'medical', 'other'], ['food_water', 'shelter', 'other'], ['food_water'],
]
const details = (id: string) => ({ type: 'view_details' as const, label: 'View details', resourceId: id })
export const resourceListings: ResourceListing[] = organizations.map((org, index) => ({
  id: `${org.id}-information`, organizationId: org.id, title: `${org.name} — organization information`,
  categories: categories[index], coverage: { type: 'worldwide_information' },
  status: 'active', serviceMode: 'information', populations: [], accessNeeds: [], languages: [],
  urgencies: ['routine', 'urgent'], disasterTypes: org.disasterTypes, source: org.source,
  lastUpdated: '2026-10-03', availability: 'unverified_demo',
  limitations: [org.routingNote, 'Source describes organization capabilities, not a verified local service. Contact and availability are not verified.'],
  nextAction: details(`${org.id}-information`),
}))

// Fictional providers are independent fixtures, never presented as nonprofit partners.
const demoOrg: Organization = {
  id: 'bridge-demo', name: 'BRIDGE fictional demo services', services: [], disasterTypes: [],
  populationsServed: [], source: 'lib/resources.ts (fictional fixtures)',
  routingNote: 'These services exist only to demonstrate matching.', fictional: true,
}
organizations.push(demoOrg)
const demo = (id: string, title: string, category: NeedCategory, extra: Partial<ResourceListing>): ResourceListing => ({
  id, organizationId: demoOrg.id, title, categories: [category],
  coverage: { type: 'local', location: { country: 'US', region: 'NC', city: 'Charlotte' } },
  status: 'active', serviceMode: 'demo_service', populations: [], accessNeeds: [], languages: ['en'],
  urgencies: ['routine', 'urgent'], disasterTypes: [], source: demoOrg.source,
  lastUpdated: '2026-10-03', availability: 'unverified_demo',
  limitations: ['Fictional Charlotte demo listing; no real service, booking, dispatch, or live availability.', 'Eligibility and capacity would need confirmation with a real provider.'],
  nextAction: details(id), ...extra,
})
resourceListings.push(
  demo('demo-family-shelter', 'Demo family shelter', 'shelter', {
    populations: ['families', 'children', 'displaced_people'], accessNeeds: ['wheelchair', 'limited_mobility'],
  }),
  demo('demo-accessible-clinic', 'Demo accessible chronic-care clinic', 'medical', {
    populations: ['older_adults', 'chronic_conditions'], accessNeeds: ['limited_mobility', 'wheelchair'],
  }),
  demo('demo-multilingual-transport', 'Demo multilingual evacuation transport', 'transport', {
    populations: ['families', 'older_adults'], languages: ['en', 'es'],
    accessNeeds: ['no_transportation', 'interpretation', 'limited_mobility', 'wheelchair'],
  }),
  demo('demo-meal-distribution', 'Demo meal and water distribution', 'food_water', {
    populations: ['families', 'children', 'displaced_people'], languages: ['en', 'es'],
    accessNeeds: ['interpretation'],
  }),
)

export function getResourceDetails(id: string) {
  const resource = resourceListings.find(item => item.id === id)
  if (!resource) return undefined
  return { resource, organization: organizations.find(org => org.id === resource.organizationId)! }
}
