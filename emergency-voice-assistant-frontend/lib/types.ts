/** Shared BRIDGE contracts. Locations are coarse; never include street addresses. */
export const NEED_CATEGORIES = ['food_water', 'shelter', 'medical', 'transport', 'other'] as const
export type NeedCategory = typeof NEED_CATEGORIES[number]
export type Urgency = 'routine' | 'urgent' | 'immediate_danger'
export type Population = 'children' | 'families' | 'older_adults' | 'displaced_people' | 'chronic_conditions'
export type AccessNeed = 'limited_mobility' | 'wheelchair' | 'no_transportation' | 'interpretation'
export interface CoarseLocation { country: string; region?: string; city?: string }
export interface UserNeed {
  category: NeedCategory
  situation: string
  location: CoarseLocation
  disasterType?: string
  populations: Population[]
  accessNeeds: AccessNeed[]
  /** Language codes such as en and es; an empty list means unknown. */
  languages: string[]
  urgency: Urgency
}
export interface Organization {
  id: string
  name: string
  services: string[]
  disasterTypes: string[]
  populationsServed: string[]
  source: string
  routingNote: string
  fictional: boolean
}
export type NextAction =
  | { type: 'view_details'; label: string; resourceId: string }
  | { type: 'call'; label: string; phone: string }
  | { type: 'visit_website'; label: string; url: string }
export interface ResourceListing {
  id: string
  organizationId: string
  title: string
  categories: NeedCategory[]
  /** Worldwide listings are informational, not proof of local coverage. */
  coverage: { type: 'local'; location: CoarseLocation } | { type: 'worldwide_information' }
  status: 'active' | 'inactive'
  serviceMode: 'demo_service' | 'information'
  populations: Population[]
  accessNeeds: AccessNeed[]
  languages: string[]
  urgencies: Exclude<Urgency, 'immediate_danger'>[]
  disasterTypes: string[]
  source: string
  lastUpdated: string
  availability: 'unverified_demo'
  limitations: string[]
  nextAction: NextAction
}
export interface MatchResult {
  resourceId: string
  score: number
  reasons: string[]
  nextAction: NextAction
}
