import type { UserNeed } from '@/lib/types'

export interface DemoScenario {
  id: 'caregiver' | 'older-adult' | 'limited-english'
  label: string
  userInput: string
  expectedNeed: UserNeed
  expectedTopResourceId: string
  acceptableAlternateResourceIds: string[]
  unsafeResults: string[]
}

export const demoScenarios: DemoScenario[] = [
  {
    id: 'caregiver',
    label: 'Caregiver with children',
    userInput:
      'The flood forced me and my two children out of our home. We are near Riverside and need a safe family shelter, drinking water, food, and baby supplies today.',
    expectedNeed: {
      category: 'shelter',
      description:
        'Displaced caregiver with two children needs family shelter, water, food, and baby supplies.',
      coarseLocation: 'Riverside demo area',
      disasterType: 'flood',
      urgency: 'today',
      populations: ['adult', 'caregiver', 'child', 'family', 'displaced-person'],
      accessNeeds: [],
      preferredLanguage: 'English',
      immediateDanger: false,
    },
    expectedTopResourceId: 'riverside-family-relief-hub',
    acceptableAlternateResourceIds: ['riverside-community-meals'],
    unsafeResults: [
      'A healthcare-provider-only program as the first result',
      'A service outside the Riverside demo area presented as locally available',
      'Any claim that shelter space or supplies are confirmed',
    ],
  },
  {
    id: 'older-adult',
    label: 'Older adult with medical and mobility needs',
    userInput:
      'I’m near Riverside, use a walker, and have one insulin dose left. I need an accessible place that can help keep my medication cold today.',
    expectedNeed: {
      category: 'medical',
      description:
        'Older adult using a walker needs insulin continuity, refrigeration, and an accessible service.',
      coarseLocation: 'Riverside demo area',
      disasterType: 'unknown',
      urgency: 'today',
      populations: ['adult', 'older-adult'],
      accessNeeds: ['limited-mobility', 'walker-access', 'medication-continuity', 'medication-refrigeration'],
      preferredLanguage: 'English',
      immediateDanger: false,
    },
    expectedTopResourceId: 'riverside-accessible-health-point',
    acceptableAlternateResourceIds: ['riverside-accessible-shelter'],
    unsafeResults: [
      'Food-only support as the first result',
      'A location without walker access presented as accessible',
      'A claim that insulin or refrigeration is currently available',
    ],
  },
  {
    id: 'limited-english',
    label: 'Spanish-speaking household without transportation',
    userInput:
      'Somos una familia cerca de Riverside. Hay un incendio forestal y no tenemos carro. Necesitamos transporte para evacuar, instrucciones en español y un refugio seguro ahora.',
    expectedNeed: {
      category: 'transport',
      description:
        'Family affected by a wildfire needs evacuation transport, Spanish instructions, and safe shelter.',
      coarseLocation: 'Riverside demo area',
      disasterType: 'wildfire',
      urgency: 'now',
      populations: ['adult', 'family'],
      accessNeeds: ['accessible-transport', 'translated-information', 'no-transportation'],
      preferredLanguage: 'Spanish',
      immediateDanger: false,
    },
    expectedTopResourceId: 'riverside-multilingual-evacuation',
    acceptableAlternateResourceIds: ['riverside-family-relief-hub'],
    unsafeResults: [
      'An English-only service as the first result',
      'A result requiring private transportation without warning',
      'Any claim that evacuation or shelter placement has been dispatched',
    ],
  },
]
