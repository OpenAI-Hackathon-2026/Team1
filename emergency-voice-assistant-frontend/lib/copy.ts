import type { NeedCategory, Urgency } from '@/lib/types'

export const appCopy = {
  pageTitle: 'Find disaster support near you',
  pageDescription:
    'Answer a few questions to find possible services for food, shelter, medical support, or evacuation.',
  safety: {
    question: 'Are you in immediate danger?',
    notice:
      'If you or someone nearby is in immediate danger, call your local emergency services now. This tool does not dispatch help.',
    continueLabel: 'No, find other support',
    emergencyLabel: 'Yes, show emergency guidance',
  },
  category: {
    heading: 'What do you need help with?',
    hint: 'Choose the most important need right now. You can describe other needs next.',
  },
  details: {
    heading: 'Tell us a little more',
    prompt: 'What is happening, and what help do you need?',
    hint: 'Do not include names, ID numbers, immigration status, or medical records.',
    microphoneLabel: 'Describe this by voice',
  },
  location: {
    heading: 'Where do you need help?',
    prompt: 'Enter a city, neighborhood, or other general area.',
    hint: 'A general location is enough. Do not enter a street address.',
  },
  people: {
    heading: 'Who needs help?',
    hint: 'Select any that apply.',
  },
  access: {
    heading: 'Do you have language or access needs?',
    hint: 'Select any that would affect whether a service works for you.',
    languagePrompt: 'Preferred language',
  },
  urgency: {
    heading: 'How soon do you need help?',
  },
  review: {
    heading: 'Here’s what we understood',
    hint: 'Check these details before we look for possible resources.',
    editLabel: 'Change answers',
    submitLabel: 'Find resources',
  },
  results: {
    heading: 'Possible resources',
    disclaimer:
      'These are possible matches, not confirmed referrals. Availability and capacity are not verified.',
    whyLabel: 'Why this may fit',
    eligibilityLabel: 'Eligibility and limits',
    freshnessLabel: 'Information last updated',
    sourceLabel: 'Source organization',
    restartLabel: 'Start over',
  },
  noMatch: {
    heading: 'We did not find a close match',
    body:
      'Try changing your answers or contact local emergency management or a trusted community organization for current options.',
    actionLabel: 'Change answers',
  },
  errors: {
    invalidInput: 'Please complete the required questions before continuing.',
    extractionFallback:
      'We could not automatically interpret every detail. Your answers are still here—please review and adjust them.',
    microphoneDenied:
      'Microphone access is off. You can continue by typing, or change your browser permission and try again.',
    microphoneNoSpeech: 'We did not hear anything. You can try again or continue by typing.',
    generic:
      'Something went wrong, but your answers have not been lost. Please review them and try again.',
  },
} as const

export const categoryOptions: ReadonlyArray<{
  value: NeedCategory
  label: string
  description: string
}> = [
  { value: 'food-water', label: 'Food and water', description: 'Meals, drinking water, or supplies' },
  { value: 'shelter', label: 'Shelter', description: 'A safe place to stay or housing support' },
  { value: 'medical', label: 'Medical support', description: 'Care, medicine, or medical supplies' },
  {
    value: 'transport',
    label: 'Transport or evacuation',
    description: 'Help leaving the area or reaching services',
  },
  { value: 'other', label: 'Other', description: 'Another urgent disaster-related need' },
]

export const urgencyOptions: ReadonlyArray<{ value: Urgency; label: string }> = [
  { value: 'now', label: 'Right now' },
  { value: 'today', label: 'Today' },
  { value: 'soon', label: 'Within the next few days' },
]
