# BRIDGE Hackathon Plan

## Goal

Build a local-first disaster resource navigator that helps someone describe their situation and receive 1–3 explainable matches from known resource data in under 60 seconds.

BRIDGE is not a universal 911 service. It does not dispatch help or guarantee availability.

## Product direction

- Build a guided public-service finder, not a generic AI chatbot.
- Lead with tappable need categories, short follow-up questions, and text.
- Use AI behind the scenes to interpret free text.
- Keep voice as an optional input mode after the typed flow works.
- Match primarily on need, location, urgency, accessibility, language, and eligibility—not only disaster type.
- Skip AWS and Alibaba Cloud for this prototype.

## Core interface

1. Persistent notice: “In immediate danger? Call local emergency services.”
2. “What do you need help with?” categories:
   - Food and water
   - Shelter
   - Medical support
   - Transport or evacuation
   - Other
3. Text area with a small optional microphone action.
4. Short follow-up questions: coarse location, who needs help, urgency, language, and accessibility.
5. Editable “Here’s what we understood” review.
6. Up to three resource cards with:
   - Organization and service
   - Why it matched
   - Coverage or eligibility limitation
   - Last-updated value
   - Truthful Call or View details action
7. Change answers, no-match guidance, and typed fallback when AI or microphone access fails.

Use a calm civic-utility visual style: clear hierarchy, strong contrast, familiar controls, minimal decoration, mobile-first layout, and content-first cards.

## What we can salvage

Keep:

- Next.js, React, TypeScript, Tailwind, shadcn, and pnpm setup
- Five nonprofit JSON source files
- Browser `MediaRecorder` setup and cleanup
- Typed request and microphone error-handling utilities
- Reusable button primitive

Refactor:

- Split `components/voice-assistant.tsx` into focused task components.
- Replace `Organization` and `RouteResponse` with shared `UserNeed`, `Organization`, `ResourceListing`, and `MatchResult` types.
- Turn global nonprofit capabilities into clearly labeled demo resource listings.

Discard:

- Giant microphone orb, gradient blobs, sparkles, waveform theater, and generic AI-assistant composition
- Hard-coded `demoOrganization` and invented Charlotte contact details
- Unsupported “Private & secure,” “You’re connected,” and “is ready to help” claims
- Fake connect/TTS controls and unimplemented routes unless made real

## Four-person task breakdown

### Person 1 — Jessie: product, conversation, and demo

#### P0.1 — Lock the user journey

- Finalize the sequence: safety → category → situation → location → people/access needs → review → results.
- Mark every question required or optional.
- Define when a question can be skipped.

Acceptance: the frontend developer can build every state without inventing behavior.

#### P0.2 — Deliver final interface copy

- Write the page title, safety notice, categories, prompts, hints, microphone label, review copy, result labels, no-match state, and errors.
- Use plain language.
- Do not promise dispatch, live availability, privacy, or a completed connection.

Acceptance: all copy comes from one approved handoff.

#### P0.3 — Define three acceptance scenarios

For each scenario, provide:

- Exact user input
- Facts the system should extract
- Expected top match
- Acceptable alternate matches
- Unsafe or clearly wrong results

Use:

1. Displaced caregiver with children
2. Older adult with limited mobility and diabetes
3. Limited-English household without transportation

#### P0.4 — Review and demo

- Review working builds at the integration checkpoints.
- Make scope-cut decisions.
- Own the 90-second demo narrative and two rehearsals.

### Person 2 — Frontend developer and integration captain

Branch: `feat/ui-shell`

Owned files: `app/page.tsx`, `components/**`, styling, app state

#### P0.1 — Verify and simplify the scaffold

- Run the existing app.
- Keep tooling and reusable primitives.
- Remove the current visual composition and hard-coded result.
- Add `.env.example` if credentials are needed.

Acceptance: a clean task-first shell runs locally with fixture data.

#### P0.2 — Build the guided interaction

- Build `SafetyBanner`.
- Build `NeedSelector`.
- Build `NeedDetails`.
- Build `NeedReview`.
- Build `ResultsList`.
- Build `ResourceCard`.
- Support category selection, text input, location, accessibility/language choices, back/edit, and submit.
- Use mocked `UserNeed` and `MatchResult[]` until integrations land.

Acceptance: the complete typed journey works without APIs or a microphone at mobile width.

#### P0.3 — Integrate and harden

- Integrate deterministic matching first.
- Integrate AI extraction second.
- Add loading, invalid-input, no-match, and API-fallback states without losing answers.
- Check keyboard navigation, visible focus, labels, touch sizes, and contrast.

Acceptance: all three scenarios work from `main`, including with the API key removed.

#### P0.4 — Own the release

- Be the only merge captain.
- Resolve conflicts and keep `main` runnable.
- Freeze features.
- Run the final build on the judging laptop.
- Capture the backup recording.

### Person 3 — Data and matching developer

Branch: `feat/resource-matcher`

Owned files: `lib/types.ts`, `lib/resources.ts`, `lib/matcher.ts`, `nonprofits/**`, `data/demo-scenarios.ts`

#### P0.1 — Publish shared contracts first

Define:

- `UserNeed`
- `Organization`
- `ResourceListing`
- `MatchResult`

Include categories, coarse location, disaster type, population/access needs, language, urgency, reasons, and next action.

Acceptance: publish or merge `lib/types.ts` first so the other developers share one contract.

#### P0.2 — Normalize resource data

- Preserve the five source organization files.
- Derive normalized listings with demo coverage, status, freshness, contact action, and limitations.
- Add only enough fictional local listings for meaningful location-aware results.
- Never invent live availability.

Acceptance: every listing identifies its source and limitation.

#### P0.3 — Build and verify deterministic matching

- Gate by active status and compatible coverage.
- Rank category, population, language, accessibility, and urgency.
- Return up to three matches with deterministic reasons and next actions.

Acceptance: all three scenarios return the expected top result without an LLM or network call.

### Person 4 — AI extraction and optional voice developer

Branch: `feat/need-extraction`

Owned files: `app/api/extract-need/route.ts`, extraction utilities, optional voice adapter

#### P0.1 — Implement constrained need extraction

- Convert free text into the shared `UserNeed` shape.
- Use structured output and schema validation.
- Never select, generate, or modify organizations in the model response.

Acceptance: all three scenario utterances produce valid structured needs; malformed output returns a safe error.

#### P0.2 — Add resilient fallback

- Handle timeouts, missing keys, and invalid model output.
- Return control to guided fields or basic keyword extraction.
- Never block deterministic matching.
- Delete or hide fake connect/TTS actions.

Acceptance: removing credentials still leaves a complete demo path.

#### P1 — Add voice only if the core path passes

- Reuse `MediaRecorder` in a small `VoiceInput` component or add ElevenLabs behind a feature flag.
- Voice must populate the same editable text/review flow.
- Do not create a separate voice-only experience.
- Cut this task if typed matching is not stable by the voice decision checkpoint.

## Shared contracts

```text
extractNeed(message) -> UserNeed
matchResources(userNeed, resources) -> MatchResult[]
```

`MatchResult` includes:

- `resourceId`
- `score`
- `reasons[]`
- `nextAction`

The frontend developer creates fixtures with these shapes. The data and AI developers do not edit page/layout files.

## Handoff and merge sequence

1. Frontend verifies the app while Jessie locks the flow.
2. Data developer publishes `lib/types.ts`.
3. Frontend and AI developers rebase or merge the shared types.
4. Jessie sends copy to frontend and scenario expectations to data.
5. Frontend works with fixtures while data and AI work independently.
6. Merge matcher/data and prove all scenarios without APIs.
7. Merge AI extraction and verify the missing-key fallback.
8. Decide on voice only after the first seven steps pass.

Merge order:

1. Shared types and one normalized resource
2. Matcher and remaining data
3. AI extraction and fallback
4. Optional voice

## Git rules

- Keep `main` runnable.
- Use `feat/ui-shell`, `feat/resource-matcher`, and `feat/need-extraction`.
- One owner per file.
- Push small checkpoints every 20–30 minutes.
- Before handoff, update from `main` and resolve conflicts on your own branch.
- Tell the integration captain the exact smoke test for each handoff.
- Freeze nonessential features before final regression.

## Timeline from pickup

- Minute 10: app runs; journey, contracts, ownership, and branches are locked.
- Minute 25: shared types are published; UI uses fixtures.
- Minute 45: one typed scenario works end to end with deterministic matching.
- Minute 65: all three scenarios return plausible ranked cards from `main`.
- Minute 80: review/edit, no-match, and missing-key paths work; make the final voice decision.
- Minute 90: feature freeze.
- Final 20 minutes: accessibility and polish, regression, two rehearsals, and backup recording.

## Safety and acceptance

- Immediate danger always routes to local emergency services.
- Collect only coarse location and need-related details.
- Do not collect names, ID numbers, immigration status, or medical records.
- Every result explains why it matched and shows a next action.
- Availability is clearly unverified demo data.
- No unknown organization may appear.
- The app survives a missing API key.
- The full demo takes under 90 seconds.

## What this prototype does not prove

- Real-time inventory
- Organizational onboarding
- Global coverage
- Successful handoff
- Outcome tracking
- Offline or low-bandwidth operation
- Human escalation
