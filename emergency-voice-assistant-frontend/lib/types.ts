export type NeedCategory = 'food_water' | 'shelter' | 'medical' | 'transport' | 'other'
export type Urgency = 'immediate' | 'soon' | 'planning' | 'unsure'

export interface UserNeed {
  category: NeedCategory
  description: string
  location: string
  people: string
  urgency: Urgency
  language: string
  accessibility: string[]
}

export interface Organization {
  id: string
  name: string
  type: string
  geographicScope: string
  routingNote: string
}

export interface ResourceListing {
  id: string
  organization: Organization
  service: string
  categories: NeedCategory[]
  keywords: string[]
  populationsServed: string[]
  coverage: string
  eligibilityLimit: string
  languages: string[]
  accessibility: string[]
  status: 'active' | 'inactive' | 'unknown'
  lastUpdated: string
  source: string
}

export interface MatchResult {
  resourceId: string
  score: number
  reasons: string[]
  nextAction: string
}
