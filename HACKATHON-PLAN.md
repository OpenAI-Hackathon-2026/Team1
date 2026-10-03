# Disaster Resource Navigator

## Product decision
- Position this as a **disaster resource navigator**, not a “universal 911.” It does not dispatch help or guarantee availability.
- Demo promise: **In under 60 seconds, describe where you are and what you need; receive 1–3 verified-looking resource matches with eligibility, contact method, and a plain-language reason for each match.**
- Primary path: a **guided public-service finder** with tappable categories, short follow-up questions, text, and optional voice. AI interprets needs behind the scenes; it is not the visual metaphor.
- Voice is a secondary input mode via the existing recorder or the [ElevenLabs multimodal widget](https://elevenlabs.io/docs/eleven-agents/customization/widget), only after the guided path works.
- Skip AWS and Alibaba Cloud. They add infrastructure risk without improving a local judging demo.

## Research-backed scope
- Use three sudden-onset scenarios: **flood, earthquake, wildfire**. The disaster type supplies context, but matching should prioritize expressed needs, location, urgency, accessibility, and eligibility.
- Support three demo profiles:
  1. **Displaced caregiver with children:** safe family shelter, water, food, hygiene/baby supplies, medical help, family reunification.
  2. **Older adult with limited mobility and diabetes:** accessible transport/shelter, medication continuity or refrigeration, assistive devices, medical care.
  3. **Limited-English household without transportation:** evacuation transport, translated instructions, safe shelter, food/water, verified updates.
- This aligns with [IFRC’s immediate-needs categories](https://www.ifrc.org/our-work/disasters-climate-and-crises/supporting-local-humanitarian-action/emergency-needs), [UNHCR’s displaced-family priorities](https://www.unhcr.org/what-we-do/respond-emergencies), and [WHO guidance for disability and continuity of care](https://www.who.int/publications/i/item/guidance-note-on-disability-and-emergency-risk-management-for-health).

## Build architecture
- Work in the clean shared clone at [repo root](./), with the app in [`emergency-voice-assistant-frontend/`](emergency-voice-assistant-frontend/). It already uses Next.js 16, React 19, TypeScript, Tailwind 4, shadcn, and pnpm.
- Normalize the five existing files in [`nonprofits/`](emergency-voice-assistant-frontend/nonprofits/) into a shared `Resource` type. Add only fields required for the demo: coverage, languages/accessibility, status, freshness, contact action, and capacity note.
- Add the three judge scenarios in `data/demo-scenarios.ts`.
- Implement deterministic matching in `lib/matcher.ts`. Location and active status are gates; need, population, language, and accessibility tags determine ranking.
- Replace the currently unimplemented endpoint assumptions in [`lib/api.ts`](emergency-voice-assistant-frontend/lib/api.ts) with one working extraction route and local matching.
- Rebuild [`components/voice-assistant.tsx`](emergency-voice-assistant-frontend/components/voice-assistant.tsx) into small task-focused components rather than preserving its existing presentation.

## Salvage audit

### Keep and build on
- The package/tooling setup, aliases, pnpm lockfile, Tailwind pipeline, and reusable button primitive.
- The five nonprofit JSON files and their useful disaster, service, population, routing-tag, and routing-note fields.
- The browser `MediaRecorder` setup, MIME fallback, track cleanup, and optional audio behavior; move these into a secondary voice-input component.
- The typed request helper and user-facing microphone permission/no-speech error handling in `lib/api.ts`.
- The basic status/state concept and mobile-responsive technical foundation.

### Refactor
- Split the single large `voice-assistant.tsx` component into `SafetyBanner`, `NeedSelector`, `NeedDetails`, `NeedReview`, `ResourceCard`, `ResultsList`, and optional `VoiceInput`.
- Replace the thin `Organization` and `RouteResponse` contracts with `UserNeed`, `Resource`, and `MatchResult`.
- Convert global nonprofit capabilities into demo-specific local service entries or clearly label them as routing destinations; a global organization is not automatically locally available.

### Discard
- The gradient blobs, giant microphone orb, sparkles, waveform theater, decorative pill overload, and generic “AI assistant” hero composition.
- The hard-coded `demoOrganization`, one-result flow, and invented Charlotte contact details.
- Unsupported claims: “Private & secure,” “You’re connected,” and “is ready to help.”
- Broken `/api/transcribe`, `/api/route`, `/api/speak`, and `/api/connect` interactions unless a developer makes them real.

## Evidence-based interface direction
- Use a **calm civic-utility aesthetic**: clear hierarchy, strong contrast, minimal decoration, familiar form controls, and content-first resource cards. The visual reference is a service finder or government benefits tool—not ChatGPT.
- Google PAIR recommends familiar interaction patterns, staged expectations, explanations tied to decisions, and the ability to edit or override AI output. Source: [PAIR human-AI patterns](https://pair.withgoogle.com/guidebook-v2/patterns).
- People under stress have poorer recall and make more input errors. Ask one short question at a time, explain why information is needed, and use calm no-blame errors. Source: [USWDS trust guidance](https://designsystem.digital.gov/patterns/complete-a-complex-form/establish-trust/).
- Use a prominent emergency notice, semantic structure, keyboard focus, non-color status cues, large touch targets, and fast mobile loading. Sources: [USWDS alerts](https://designsystem.digital.gov/components/alert/) and [ITU emergency UI guidance](https://www.itu.int/rec/T-REC-F.760.2-202404-I/en).
- Offer quick choices, text, and optional voice; explicitly support language/accessibility needs. Voice cannot be the only route. Sources: [USWDS language preferences](https://designsystem.digital.gov/patterns/select-a-language/language-preferences/) and [GSMA humanitarian language guidance](https://www.gsma.com/solutions-and-impact/connectivity-for-good/mobile-for-development/wp-content/uploads/2024/04/GSMA_Language-and-Digital-Humanitarian-Action_R_Web.pdf).
- Show service limitations, source, freshness, and a way to change answers. IFRC frames trustworthy humanitarian communication as timely, accessible, transparent, and two-way. Source: [IFRC community engagement guidance](https://communityengagementhub.org/wp-content/uploads/sites/2/2019/06/IFRC-CEA-GUIDE-0612-LR-1.pdf).

## Screen and interaction specification
1. **Safety banner:** persistent “In immediate danger? Call local emergency services.”
2. **Need selection:** “What do you need help with?” plus large cards for Food & water, Shelter, Medical support, Transport/evacuation, and Other.
3. **Multimodal detail:** plain text area first, with a small microphone action and an example tied to the selected category.
4. **Guided follow-up:** only coarse location, who needs help, urgency, and language/accessibility constraints. Use chips, radios, and checkboxes.
5. **Review:** “Here’s what we understood” with editable tags before matching.
6. **Results:** up to three stacked cards showing service, why it matched, limits/eligibility, source/freshness, and a truthful Call or View details action.
7. **Recovery:** Change answers, no-match guidance, and typed fallback when microphone or LLM fails without losing progress.
8. **Demo shortcuts:** three clearly labeled example scenarios, visually secondary to the real task.

## Four-person parallel split

### Jessie — product, conversation, and demo owner
- In the first 10 minutes, finalize the screen flow, exact question wording, selectable answers, and required versus optional fields.
- Finalize the three scenarios, safety/trust copy, result labels, empty/error states, and 90-second demo narrative.
- Give Developer 2 the resource fields and expected top result for each scenario; do not edit `resources.json` in parallel.
- Review builds at minutes 35 and 75. Make scope calls and cut features; do not become a fourth coder during the critical path.

### Developer 1 — frontend and integration captain
- Own `app/page.tsx`, `components/**`, styling, app state, accessibility, and the safety gate.
- Confirm the scaffold runs, then replace—not reskin—the current AI-assistant screen with the task-first screen sequence.
- Publish `.env.example` and shared contracts.
- Consume the matcher through one agreed function and the LLM through one API endpoint; use stubs until those branches land.
- Own final merges, conflict resolution, the runnable laptop, and the backup recording.

### Developer 2 — data contract and matching
- Own `lib/types.ts`, `nonprofits/**`, `data/demo-scenarios.ts`, and `lib/matcher.ts`.
- Within 15 minutes, merge `UserNeed`, `Resource`, and `MatchResult` plus one normalized existing nonprofit record.
- Normalize the five current organizations and add only a few fictional local service records if necessary.
- Build scoring logic with active-status/location gates and plain-language match reasons.
- Verify expected ordering for all three scenarios without any external API.

### Developer 3 — intelligence and voice adapter
- Own route handlers, LLM prompting/schema validation, environment handling, transcription, and the optional voice adapter.
- Convert free text into `UserNeed`; return only the agreed structured type. Do not rank resources or generate organization facts in the model.
- Implement missing-key, malformed-output, and timeout fallbacks.
- Make one extraction path work end to end; remove or stub misleading connect/TTS actions instead of exposing broken controls.
- Add ElevenLabs only after the guided path passes all scenarios; keep voice behind a feature flag.

## Immediate team task board

### Jessie — Product and conversation owner

**P0.1 — Lock the user journey (10 minutes)**
- Deliver the exact sequence: safety notice → need category → describe situation → location → people/access needs → review → results.
- Mark each question required or optional and define when it can be skipped.
- Acceptance: Developer 1 can build every state without inventing product behavior.

**P0.2 — Deliver production copy and options (15 minutes, parallel)**
- Write the page title, safety notice, five need-category labels, field prompts/hints, microphone label, review text, result labels, no-match state, and error/fallback messages.
- Use plain, non-institutional language; never promise dispatch, availability, privacy, or completed connection.
- Acceptance: all interface copy is approved in one handoff; developers do not independently rewrite it.

**P0.3 — Define three acceptance scenarios (10 minutes, parallel)**
- For each profile, provide the exact user input, structured facts the system should extract, expected top match, acceptable alternate matches, and unsafe/wrong results.
- Hand these to Developer 2 as matcher fixtures and Developer 1 as demo shortcuts.

**P0.4 — Product reviews and demo (ongoing)**
- Review the real UI at integration checkpoints; prioritize clarity, trust, and mobile usability.
- At feature freeze, own the 90-second narrative and run two rehearsals.

### Developer 1 — Frontend and integration captain

**P0.1 — Verify and simplify the scaffold (10 minutes)**
- Branch: `feat/ui-shell`.
- Run the existing app; keep tooling and reusable primitives.
- Remove the current visual composition and hard-coded demo result from the user path.
- Create `.env.example` if credentials are required.
- Acceptance: clean task-first shell runs locally and can render fixture data.

**P0.2 — Build the guided interaction (30 minutes)**
- Own `app/page.tsx` and `components/**`.
- Build `SafetyBanner`, `NeedSelector`, `NeedDetails`, `NeedReview`, `ResultsList`, and `ResourceCard`.
- Make category cards, text input, location, accessibility/language choices, back/edit, and submit work with local state.
- Use mocked `UserNeed` and `MatchResult[]` until integrations land.
- Acceptance: a user can complete the full typed journey without APIs or a microphone on a mobile-width viewport.

**P0.3 — Integrate and harden (25 minutes)**
- Connect Developer 2’s matcher first, then Developer 3’s extractor.
- Add loading, no-match, invalid-input, and API-fallback states without losing user answers.
- Check keyboard navigation, visible focus, semantic labels, touch sizes, and contrast.
- Acceptance: all three scenarios work from `main`; disabling the API key does not break the guided route.

**P0.4 — Own the release**
- Be the only merge captain.
- Freeze features, run the final build, keep the judging laptop on the known-good commit, and capture the backup recording.

### Developer 2 — Resource data and deterministic matching

**P0.1 — Publish contracts first (15 minutes)**
- Branch: `feat/resource-matcher`.
- Own `lib/types.ts`.
- Define `UserNeed`, `Organization`, `ResourceListing`, and `MatchResult`.
- Include categories, coarse location, disaster type, population/access needs, language, urgency, reasons, and next action.
- Merge or hand off this file first so UI and API work against the same types.

**P0.2 — Normalize resource data (20 minutes)**
- Own `nonprofits/**` plus `lib/resources.ts`.
- Preserve the five source organization records; derive normalized resource listings with demo coverage, status, freshness, contact action, and service limitations.
- Add only enough fictional local listings to produce meaningful location-aware matches.
- Acceptance: every listing names its source and limitations; no invented “live availability.”

**P0.3 — Build and verify the matcher (25 minutes)**
- Own `lib/matcher.ts` and `data/demo-scenarios.ts`.
- Gate by active status and compatible coverage; rank need category, population, language, accessibility, and urgency.
- Return up to three results with deterministic reasons and next actions.
- Acceptance: all three Jessie-defined scenarios return the expected first match without any LLM or network call.

### Developer 3 — Need extraction and optional voice

**P0.1 — Implement constrained extraction (25 minutes)**
- Branch: `feat/need-extraction`.
- Own `app/api/extract-need/route.ts` and extraction utilities.
- Convert free text into the shared `UserNeed` shape using structured output/schema validation.
- Never select, generate, or modify organizations in the model response.
- Acceptance: the three scenario utterances produce valid structured needs; malformed model output returns a safe error.

**P0.2 — Add resilient fallback (15 minutes)**
- Implement timeout, missing-key, and invalid-output behavior.
- Return control to guided fields or basic keyword extraction; never block deterministic matching.
- Delete or hide the current fake connect/TTS actions.
- Acceptance: removing credentials still leaves a complete demo path.

**P1 — Add voice only after integration passes (maximum 15 minutes)**
- Reuse the current `MediaRecorder` logic in a small `VoiceInput` component or connect ElevenLabs behind a feature flag.
- Voice should populate the same editable text/review flow; it must not create a separate experience.
- Cut this task immediately if typed matching is not stable by feature freeze.

## Team handoff sequence
1. Developer 1 verifies the app while Jessie locks the flow and Developers 2/3 prepare branches.
2. Developer 2 publishes `lib/types.ts`; Developers 1 and 3 immediately rebase/merge it.
3. Jessie hands copy to Developer 1 and scenario expectations to Developer 2.
4. Developer 1 finishes the UI with fixtures; Developer 2 finishes local matching; Developer 3 finishes extraction independently.
5. Merge matcher/data first and prove all scenarios without APIs.
6. Merge extraction second and verify no-key fallback.
7. Decide on voice only after the first six steps pass.

## Shared contracts to lock before parallel work
- `extractNeed(message) -> UserNeed`
- `matchResources(userNeed, resources) -> MatchResult[]`
- `MatchResult` includes `resourceId`, `score`, `reasons[]`, and `nextAction`.
- Developer 1 creates UI stubs returning those shapes. Developers 2 and 3 must not edit page/layout files.
- Jessie approves copy in one shared note or chat message; one developer applies it to avoid copy-related merge conflicts.

## Git workflow for a two-hour sprint
- Keep `main` runnable. Developer 1 is the single integration captain.
- Use three short-lived branches: `feat/ui-shell`, `feat/resource-matcher`, and `feat/need-extraction`.
- Commit small vertical checkpoints and push at least every 20–30 minutes. Open lightweight PRs; do not wait for formal reviews when the owner and integration captain have paired on the change.
- Before handoff, each developer rebases or merges the latest `main`, resolves conflicts on their own branch, and tells the captain the exact smoke test.
- Merge order: shared types/sample data → matcher/data → LLM extraction → voice widget. Freeze nonessential features 30 minutes before judging.
- Never let two people edit the same file. If an urgent cross-owner change is needed, message the owner and let them make it.

## Integration milestones from now
- **Minute 10:** scaffold runs; journey, contracts, file ownership, and branches are locked.
- **Minute 25:** shared types are published; UI uses fixtures; resource normalization and extraction are underway.
- **Minute 45:** one typed guided scenario works end to end with deterministic local matching.
- **Minute 65:** all three scenarios return plausible ranked cards from `main`.
- **Minute 80:** review/edit, no-match, and no-key paths work. Make the final voice/no-voice decision.
- **Minute 90:** feature freeze.
- **Final 20 minutes:** accessibility/polish check, regression, two rehearsals, and backup recording.

## Safety and trust requirements
- First turn: “Are you in immediate danger?” If yes, direct the user to the appropriate local emergency service; do not continue as if this app dispatches aid.
- Collect only coarse location and need-related facts; no names, ID numbers, immigration status, or medical records. This follows the ICRC’s [humanitarian data-protection guidance](https://www.icrc.org/en/data-protection-humanitarian-action-handbook).
- Every result shows why it matched, a “last updated” value, availability as unverified/demo data, and the next action. Never claim a referral was completed.
- Include “none found” and API-failure states with a safe fallback rather than fabricating a result.

## Remaining approximately 110-minute execution
- **0–10 min:** run scaffold, lock contracts/copy, assign file ownership, branch.
- **10–35 min:** frontend rebuilds the interface; data owner normalizes resources/matcher; API owner implements extraction/fallback; Jessie delivers final copy.
- **35–65 min:** integrate safety, need selection, follow-ups, review, deterministic ranking, and result cards.
- **65–80 min:** add validated LLM extraction while preserving the guided no-key path.
- **80–90 min:** mobile/accessibility pass, empty/error states, and final voice decision.
- **90–110 min:** feature freeze, regression, two rehearsals, and backup recording.

## Demo narrative and acceptance checks
- Open with the supply-to-need coordination gap, not a claim that aid is generally abundant everywhere.
- Run the older-adult scenario: “I’m near Riverside, use a walker, and have one insulin dose left.” Show location filtering, urgent health/accessibility signals, and explainable ranked matches.
- Show the caregiver and limited-English scenarios through one-click presets to prove breadth.
- Pass criteria: all three scenarios return plausible top matches; no unknown organization can appear; the app survives a missing API key; immediate danger triggers the safety route; the full demo takes under 90 seconds.

## What this POC does not prove
- Real-time inventory, organizational onboarding, global coverage, successful handoff, or outcome tracking. Those are the real product risks and should be stated as the next phase, alongside offline/low-bandwidth access and human escalation.