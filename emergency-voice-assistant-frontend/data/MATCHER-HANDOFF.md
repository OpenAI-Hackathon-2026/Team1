# Person 3 handoff

Import shared contracts from `lib/types.ts`, `matchResources` from `lib/matcher.ts`, and `resourceListings`, `organizations`, and `getResourceDetails` from `lib/resources.ts`. The existing `lib/api.ts` Organization contract belongs to the legacy voice prototype; use the new contracts for the guided flow.

Call `matchResources(userNeed)` for the built-in catalog or pass a catalog as the second argument. Resolve result IDs with `getResourceDetails(id)`. Render organization, service title, reasons, limitations, lastUpdated, availability, and nextAction. View-details actions reference catalog IDs. Every fictional service must show its fictional label. The fixture date is a normalization date, not a live service verification date.

Five preserved nonprofit sources provide worldwide organization information with unverified local coverage. Four independent fictional Charlotte fixtures cover shelter, medical support, evacuation transport, and food/water. No affiliation, contact number, capacity, booking, or live availability is invented.

Local matching uses trimmed, case-insensitive country/region/city strings. Use country and region codes (US, NC) and consistent city names. Missing locality excludes local services. Worldwide informational entries do not establish local service availability.

Ranking gates active status, category, and local coverage. Base scores: demo service 100, organization information 20; local coverage +20; supported population +8; access need +10; language +6; urgency +4; disaster type +2. Ties sort by ID; duplicate preferences do not inflate scores. Unsupported preferences do not earn points; a match does not guarantee every requirement. Show limitations. At most three results are returned. Immediate danger returns no matches: prioritize the emergency-services notice. Other empty results need the frontend no-match state.

`data/demo-scenarios.ts` contains exact utterances, structured needs, expected winners, acceptable alternates, and unsafe outcomes for all three acceptance scenarios.

Run from the frontend directory:

```sh
npx --yes --package tsx tsx --test data/matcher.test.ts
```

The tests cover all scenarios, coverage mismatch/missing locality, inactive listings, category filtering, immediate danger, provenance, preference ranking, duplicates, and stable ties. The runner may download on first use; matching itself requires no network, LLM, or credentials.
