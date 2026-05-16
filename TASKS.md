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

## Task 2 — Replace Contact Form with Two-Button CTA Footer + Smart CV Downloader
 
### Context
The portfolio currently has a contact form at the bottom that has received zero submissions in 6+ months. It will be replaced with a minimal, high-converting two-button footer section. Separately, a smart CV download button needs to serve the correct PDF based on the active language (set in Task 3). Both changes are scoped to the bottom CTA area and the CV download logic — do not modify other sections.
 
---
 
### Subtask 2.1 — Remove the contact form entirely
- Delete the contact form component and all its related files (form handler, validation logic, email service calls, state management).
- Remove any environment variables or API keys used exclusively by the form (e.g. EmailJS, Formspree, Nodemailer config) and note them in a comment for David to clean from `.env`.
- Do **not** remove the footer wrapper or page section container — only the form content inside it.
- After deletion, confirm no broken imports or dangling references remain.
---
 
### Subtask 2.2 — Build the two-button CTA footer section
Replace the contact form content with a clean section containing exactly two buttons:
 
**Button 1 — "Let's Work Together"**
- Opens a Calendly booking page in a new tab.
- URL placeholder: `https://calendly.com/david-mayorga` — David will replace with his actual Calendly link.
- Label should be translatable (see Task 3): EN: `"Let's Work Together"` / DE: `"Zusammenarbeiten"` / ES: `"Trabajemos Juntos"`.
- Style: primary, prominent — this is the main CTA.
**Button 2 — "Download CV"**
- Triggers the smart download logic defined in Subtask 2.3.
- Label should be translatable: EN: `"Download CV"` / DE: `"Lebenslauf herunterladen"` / ES: `"Descargar Hoja de Vida"`.
- Style: secondary, outlined.
Layout: both buttons side by side on desktop, stacked on mobile. Add a short headline above them (also translatable): EN: `"Open to freelance projects and full-time roles"` / DE: `"Offen für Freelance-Projekte und Festanstellungen"` / ES: `"Disponible para proyectos freelance y roles de tiempo completo"`.
 
---
 
### Subtask 2.3 — Smart CV downloader (language-aware)
- The "Download CV" button must serve a different PDF based on the currently active language:
  - `EN` → `DavidMayorga_CV_EN.pdf`
  - `DE` → `DavidMayorga_CV_DE.pdf`
  - `ES` → `DavidMayorga_CV_ES.pdf`
- All PDFs must be hosted locally under `/public/downloads/` — no external links.
- If no language is set or the file for that language does not exist, fall back to `DavidMayorga_CV_EN.pdf`.
- The download must trigger as a file download (not open in a new tab). Use the `download` attribute on an anchor tag or equivalent.
- **Flag for David:** the actual PDF files must be manually placed in `/public/downloads/` with the exact filenames above before this feature works. Claude should add a `README` note inside that folder listing the expected files.
---
 
### Subtask 2.4 — Remove the current "Resume" button from the hero CTA row
- The hero section currently has three buttons: `Work`, `Say Hello`, and `Resume`.
- Remove the `Resume` button from the hero row — CV download is now handled exclusively by the footer CTA.
- Keep `Work` and `Say Hello` as-is. Do not restyle or reorder them.
- If `Say Hello` currently scrolls to the contact form, update its scroll target to point to the new two-button CTA footer section.

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