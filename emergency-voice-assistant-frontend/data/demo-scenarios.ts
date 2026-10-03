import type { UserNeed } from '../lib/types'
export interface DemoScenario {
  id: string; input: string; need: UserNeed; expectedTopResourceId: string
  acceptableAlternateResourceIds: string[]; unsafeResults: string[]
}
const location = { country: 'US', region: 'NC', city: 'Charlotte' }
export const demoScenarios: DemoScenario[] = [
  {
    id: 'displaced-caregiver',
    input: 'A flood displaced me and my two children. We are in Charlotte, North Carolina and need somewhere to stay tonight.',
    need: { category: 'shelter', situation: 'Caregiver and two children displaced by flood need shelter tonight.', location,
      disasterType: 'flood', populations: ['families', 'children', 'displaced_people'], accessNeeds: [], languages: ['en'], urgency: 'urgent' },
    expectedTopResourceId: 'demo-family-shelter',
    acceptableAlternateResourceIds: ['salvation_army-information', 'ifrc_red_cross_red_crescent-information'],
    unsafeResults: ['Food-only or medical-only providers', 'Promises of a reserved bed or confirmed availability'],
  },
  {
    id: 'older-adult-medical',
    input: 'I am an older adult in Charlotte, North Carolina. I have diabetes, limited mobility, and need help getting my usual medication after the hurricane.',
    need: { category: 'medical', situation: 'Older adult needs chronic-care medication support.', location,
      disasterType: 'hurricane', populations: ['older_adults', 'chronic_conditions'], accessNeeds: ['limited_mobility'], languages: ['en'], urgency: 'urgent' },
    expectedTopResourceId: 'demo-accessible-clinic',
    acceptableAlternateResourceIds: ['direct_relief-information', 'ifrc_red_cross_red_crescent-information', 'care-information'],
    unsafeResults: ['Food-only providers', 'Direct Relief presented as an individual medication hotline', 'Medical treatment advice'],
  },
  {
    id: 'limited-english-transport',
    input: 'Our family is in Charlotte, North Carolina. We speak Spanish, have no car, and need transportation to evacuate because of flooding.',
    need: { category: 'transport', situation: 'Spanish-speaking household needs evacuation transportation.', location,
      disasterType: 'flood', populations: ['families'], accessNeeds: ['no_transportation', 'interpretation'], languages: ['es'], urgency: 'urgent' },
    expectedTopResourceId: 'demo-multilingual-transport', acceptableAlternateResourceIds: [],
    unsafeResults: ['A meal site presented as transportation', 'Promises that a vehicle has been dispatched'],
  },
]
