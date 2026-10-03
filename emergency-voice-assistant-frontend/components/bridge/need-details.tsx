import type { UserNeed } from '@/lib/types'

const accessOptions = ['Limited mobility', 'Visual access needs', 'Hearing access needs', 'Other access needs']

export function NeedDetails({ value, onChange }: { value: UserNeed; onChange: (value: UserNeed) => void }) {
  const update = <K extends keyof UserNeed,>(key: K, next: UserNeed[K]) => onChange({ ...value, [key]: next })
  const toggleAccess = (option: string) => update(
    'accessibility',
    value.accessibility.includes(option)
      ? value.accessibility.filter((item) => item !== option)
      : [...value.accessibility, option],
  )

  return (
    <div className="space-y-5">
      <div>
        <label htmlFor="need-description" className="mb-2 block font-semibold text-slate-950">Tell us a little more <span className="font-normal text-slate-500">(optional)</span></label>
        <textarea id="need-description" rows={3} maxLength={1000} value={value.description} onChange={(event) => update('description', event.target.value)} placeholder="What would be most helpful right now?" className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-950 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-800" />
      </div>
      <div>
        <label htmlFor="location" className="mb-2 block font-semibold text-slate-950">Where do you need help? <span className="font-normal text-slate-500">(city, county, or ZIP; optional)</span></label>
        <input id="location" autoComplete="postal-code" maxLength={100} value={value.location} onChange={(event) => update('location', event.target.value)} placeholder="For example, Raleigh, NC" className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-950 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-800" />
        <p className="mt-1 text-xs text-slate-600">A general area is enough. Don’t enter a street address.</p>
      </div>
      <div>
        <label htmlFor="people" className="mb-2 block font-semibold text-slate-950">Who needs support? <span className="font-normal text-slate-500">(optional)</span></label>
        <input id="people" maxLength={120} value={value.people} onChange={(event) => update('people', event.target.value)} placeholder="For example, an older adult and a caregiver" className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-950 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-800" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="urgency" className="mb-2 block font-semibold text-slate-950">When is help needed? <span className="font-normal text-slate-500">(optional)</span></label>
          <select id="urgency" value={value.urgency} onChange={(event) => update('urgency', event.target.value as UserNeed['urgency'])} className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-base text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-800">
            <option value="unsure">Select one</option><option value="immediate">As soon as possible</option><option value="soon">Today or soon</option><option value="planning">Planning ahead</option>
          </select>
        </div>
        <div>
          <label htmlFor="language" className="mb-2 block font-semibold text-slate-950">Preferred language <span className="font-normal text-slate-500">(optional)</span></label>
          <input id="language" maxLength={60} value={value.language} onChange={(event) => update('language', event.target.value)} placeholder="For example, Spanish" className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-950 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-800" />
        </div>
      </div>
      <fieldset>
        <legend className="mb-2 font-semibold text-slate-950">Access needs <span className="font-normal text-slate-500">(optional)</span></legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {accessOptions.map((option) => <label key={option} className="flex min-h-11 items-center gap-3 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800"><input type="checkbox" checked={value.accessibility.includes(option)} onChange={() => toggleAccess(option)} className="size-4 accent-blue-800" />{option}</label>)}
        </div>
      </fieldset>
    </div>
  )
}
