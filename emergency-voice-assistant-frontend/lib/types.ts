export const needCategories = [
  'food-water',
  'shelter',
  'medical',
  'transport',
  'other',
] as const

export type NeedCategory = (typeof needCategories)[number]

export const disasterTypes = ['flood', 'earthquake', 'wildfire', 'other', 'unknown'] as const

export type DisasterType = (typeof disasterTypes)[number]

export const urgencyLevels = ['now', 'today', 'soon'] as const

export type Urgency = (typeof urgencyLevels)[number]

export const populationTags = [
  'adult',
  'older-adult',
  'child',
  'caregiver',
  'family',
  'displaced-person',
] as const

export type PopulationTag = (typeof populationTags)[number]

export const accessNeeds = [
  'limited-mobility',
  'wheelchair-access',
  'walker-access',
  'accessible-transport',
  'medication-continuity',
  'medication-refrigeration',
  'translated-information',
  'no-transportation',
] as const

export type AccessNeed = (typeof accessNeeds)[number]

export interface UserNeed {
  category: NeedCategory
  description: string
  coarseLocation: string
  disasterType: DisasterType
  urgency: Urgency
  populations: PopulationTag[]
  accessNeeds: AccessNeed[]
  preferredLanguage: string
  immediateDanger: boolean
}

export interface Organization {
  id: string
  name: string
  type: 'humanitarian_nonprofit' | 'humanitarian_network'
  geographicScope: string
  disasterTypes: string[]
  services: string[]
  populationsServed: string[]
  routingTags: string[]
  routingNote: string
}

export type ResourceStatus = 'active' | 'inactive' | 'unknown'

export interface ContactAction {
  kind: 'call' | 'link' | 'details'
  label: string
  href?: string
}

export interface ResourceSource {
  organizationId: string
  organizationName: string
  sourceUrl?: string
}

export interface ResourceListing {
  id: string
  name: string
  description: string
  categories: NeedCategory[]
  coverageAreas: string[]
  disasterTypes: DisasterType[]
  populations: PopulationTag[]
  accessFeatures: AccessNeed[]
  languages: string[]
  status: ResourceStatus
  lastUpdated: string
  capacityNote: string
  eligibility: string
  limitation: string
  nextAction: ContactAction
  source: ResourceSource
  isDemoData: boolean
}

export interface MatchResult {
  resourceId: string
  score: number
  reasons: string[]
  nextAction: ContactAction
}
