# Portfolio Tasks

> This file is intended to be read alongside `CLAUDE.md`. Each task below is self-contained with enough context to be executed independently or sequentially. Do not modify unrelated components unless explicitly noted.

---

## Task 1 — Refactor the Timeline Section into Milestones

### Context
The portfolio previously had two separate sections: `timeline` and `achievements`. The data from `achievements` has already been renamed and is now rendering under the `timeline` component. The goal is to unify both into a single, clean `Milestones` concept throughout the codebase.

### Subtasks

#### 1.1 — Merge timeline and achievements into a single `Milestones` data structure
[x] There are currently two data sources (previously `timeline` and `achievements`). Since the achievements data has already been moved and is rendering under the timeline component, consolidate all entries into **one single property or array called `milestones`**.
[x] Rename any remaining references to `timeline` or `achievements` (data keys, prop names, variable names, component display names) to `milestones` or `Milestones` as appropriate.
[x] Ensure the unified `milestones` array is the single source of truth — no duplicate or parallel arrays should remain.

#### 1.2 — Add the `place` attribute to each Milestone entry
[x] Render `place` visibly in the Timeline/Milestones tab UI, alongside the existing date and title fields.

#### 1.3 — Remove dead code scoped to the timeline/achievements component
[x] Audit **only** the timeline/milestones component file(s) for unused imports, unreferenced variables, commented-out blocks, and orphaned helper functions.
[x] Do **not** touch dead code in other components — the rest of the codebase is out of scope for this subtask.
[x] After removal, confirm the component still renders correctly with no regressions.

---

## Task 2 — Add a CV Download Button

### Context
David manages multiple versions of his CV for different audiences and languages. The portfolio needs a download mechanism that lets visitors choose which version to download.

### Requirements
[] Add a download button (or dropdown) accessible from the main navigation or hero section — visible without scrolling.
[] The button should offer at least the following options:
  [] `CV — English (Frontend Engineer)` → `DavidMayorga_CV_EN.pdf`
  [] `CV — Español (Ingeniero Senior)` → `DavidMayorga_CV_ES.pdf`
[] PDF files should be hosted under the project's own domain (e.g. `/public/downloads/`), not on external services like Google Drive.
[] On mobile, the dropdown should be touch-friendly and not overlap critical UI elements.
[] File names must be human-readable and descriptive (no UUIDs or hashes).

---

## Task 3 — Full Portfolio Translation (German & Spanish)

### Context
The portfolio currently renders in English only. To attract clients in the DACH region, Spain and Latin America, it needs to support German (DE) and Spanish (ES) alongside English (EN).

### Requirements
[x] Complete the i18n system `react-i18next` which I have started months ago, and I am sure not all the tags have its own translator in ES, and actually in DE has not been already created.
[x] I have created a structure for `react-i18next` based on the portfolio components. I you think you can improve some properties, go ahead, but tell me the changes.
[x] All visible UI text must be translatable: navigation labels, section headings, body copy, button labels, form placeholders, and footer text. If you find some plain text on portfolio, parametrize it, adding it to en.json and translate them to DE and ES.
[x] Check that the language toggle <LanguageSelector/> (EN / DE / ES) in the navigation bar, visible on all screen sizes.
[x] Focus only on the portfolio. I mean only src/components folder. Do **not** touch any internal of src/stories, because all the text it's get as parameter or the comopnents are not being used in portfolio.
[x] Translation files are in src/i18n/locales/ (i.e. src/i18n/locales/en.json ) and should be organized per language, e.g.:
  ```
  /locales/en.json
  /locales/de.json
  /locales/es.json
  ```
[x] Default language should be detected from the browser's `navigator.language` and fall back to `EN`.
[x] The selected language should persist across page reloads (localStorage or cookie).

### Subtask 3.2 — i18n-aware Data Layer for `src/data/`

#### Context
UI strings are translated via `react-i18next`, but content in `src/data/*.ts` (project descriptions, milestone narratives, project titles) is hardcoded in English. This subtask makes the data layer language-aware while keeping data in `src/data/` and preserving TypeScript type safety. Skills and tools stay English-only (professional terms standard across DE/ES tech contexts).

#### Architecture: Language-keyed Records + Getter Functions
Each data file exposes `getX(lang: Lang): T` getters. The portfolio root reads `i18n.language` and passes the right data down. Storybook stories keep importing the named EN exports unchanged.

#### What gets translated
- `milestones`: `description` only (title/place are proper nouns)
- `projectsData` (3 entries): `projectPublicTitle`, `subtitle`, `content`
- `miniProjects` (6 entries): `projectPublicTitle`, `resume`
- `skills`, `tools`: no translation

#### Subtasks

[x] Add `export type Lang = 'en' | 'es' | 'de'` to `src/interfaces/projects.ts`

[x] **`src/data/experience.ts`**
  [x] Wrap milestones in `Record<Lang, Milestone[]>` with EN/ES/DE versions — titles and descriptions translated
  [x] Export `getMilestones(lang: Lang): Milestone[]`
  [x] Wrap skills in `Record<Lang, SkillCategory[]>` with EN/ES/DE versions — categories and items translated
  [x] Export `getSkills(lang: Lang): SkillCategory[]`
  [x] Tools left as language-agnostic; `getAllSkills()`, `getAllTools()` preserved
  [x] Update `toolsAndExprience` to use `getMilestones('en')` for backwards compat

[x] **`src/data/projects.ts`**
  [x] Wrap `projectsData` in `Record<Lang, Record<string, Project>>` (only `projectPublicTitle`, `subtitle`, `content` differ)
  [x] Wrap `miniProjects` in `Record<Lang, MiniProject[]>` (only `projectPublicTitle`, `resume` differ)
  [x] Export `getProjectsData(lang: Lang)` and `getMiniProjects(lang: Lang)`
  [x] Keep named exports `projectsData` and `miniProjects` as EN aliases for Storybook backwards compat

[x] **`src/portfolio/components/portfolio.component.tsx`**
  [x] Read `i18n.language as Lang` at the `Portfolio` root
  [x] Replace static `projectsData`/`miniProjects` imports with `getProjectsData(lang)`/`getMiniProjects(lang)` calls
  [x] Replace spread with explicit `milestones={getMilestones(lang)}`, `skills={getSkills(lang)}`, `tools={tools}`

[x] Verify: `pnpm tsc --noEmit` → zero TypeScript errors

---

## Notes for Claude

[] Tasks are listed in recommended execution order but can be tackled independently.
[] Task 1 is the highest priority and most scoped — start there if uncertain.
[] When in doubt about scope, do less and ask. Avoid touching unrelated components.
[] After completing each task, briefly summarize what was changed and flag anything that needs David's manual input (e.g. actual PDF files for Task 2, final copy for Task 3 translations).