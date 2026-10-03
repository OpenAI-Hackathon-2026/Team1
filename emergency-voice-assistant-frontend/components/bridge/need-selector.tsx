import type { NeedCategory } from '@/lib/types'

const categories: { id: NeedCategory; label: string; hint: string }[] = [
  { id: 'food_water', label: 'Food and water', hint: 'Meals, groceries, drinking water' },
  { id: 'shelter', label: 'Shelter', hint: 'A safe place to stay or housing help' },
  { id: 'medical', label: 'Medical support', hint: 'Medicines, supplies, or health services' },
  { id: 'transport', label: 'Transport or evacuation', hint: 'A ride or help leaving an area' },
  { id: 'other', label: 'Other', hint: 'Tell us what kind of support you need' },
]

export function NeedSelector({ value, onChange }: { value: NeedCategory | null; onChange: (value: NeedCategory) => void }) {
  return (
    <fieldset>
      <legend className="mb-4 text-lg font-semibold text-slate-950">What do you need help with?</legend>
      <div className="grid gap-3 sm:grid-cols-2">
        {categories.map((category) => {
          const selected = value === category.id
          return (
            <button
              key={category.id}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(category.id)}
              className={`min-h-20 rounded-xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-800 focus-visible:ring-offset-2 ${selected ? 'border-blue-800 bg-blue-50 ring-1 ring-blue-800' : 'border-slate-300 bg-white hover:border-slate-500'}`}
            >
              <span className="block font-semibold text-slate-950">{category.label}</span>
              <span className="mt-1 block text-sm text-slate-600">{category.hint}</span>
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}
