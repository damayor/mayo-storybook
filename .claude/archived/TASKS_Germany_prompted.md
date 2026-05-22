# German Website Compliance Tasks

> Reference: https://allaboutberlin.com/guides/website-compliance-germany  
> Context: Personal portfolio for a freelance developer based in Germany. No products or services sold directly on the site.

---

## 1. Impressum (Legal Notice) — REQUIRED

**Why:** Even though the site is non-commercial, you are a freelancer in Germany and this portfolio markets your services. German law (§ 5 DDG) considers this a "commercial" online presence. Missing or incomplete Impressum can result in an *Abmahnung* (cease-and-desist letter).

**Must be reachable from every page** (link in footer or dedicated section visible at all times).

**Required fields:**

- [ ] Full legal name (first + last name)
- [ ] Full physical address (street, city, postal code, country — no PO box)
- [ ] Email address
- [ ] Phone number (optional if email provides "rapid contact")
- [ ] If registered as a *Freiberufler/Gewerbetreibender*: your *Steuernummer* or *USt-IdNr.*
- [ ] Responsible for content (*Verantwortlicher i.S.d. § 55 Abs. 2 RStV*): your name + address

**Implementation note:**  
- [ ] Add an `Impressum` page in the portfolio. Create the footer section on the portoflio and add a link in the footer pointing to it. Must be available in every language the site offers (EN, DE, ES) — at minimum the German version.

---

## 2. Privacy Policy (Datenschutzerklärung) — REQUIRED

**Why:** GDPR applies to any website serving EU residents, including non-commercial portfolios. Your site processes personal data in at least two ways (see section 3 below).

**The policy must cover:**

- [ ] Who is responsible for data processing (your name + contact — mirrors Impressum)
- [ ] What data is collected and why
- [ ] Legal basis for each processing activity (GDPR Art. 6)
- [ ] How long data is retained
- [ ] User rights: access, rectification, deletion, portability, objection
- [ ] Contact for data-related requests
- [ ] Right to complain to a supervisory authority (*Datenschutzbehörde*)

**Specific items to disclose for this site:**

- [ ] `localStorage` usage for language preference (`i18n-lang` key) — see section 3
- [ ] External image requests to `flagcdn.com` — see section 3
- [ ] Outbound links to Calendly, GitHub, LinkedIn, Instagram, Behance (note you don't control their data practices)

**Implementation note:**  
Add a `Datenschutz` / `Privacy Policy` section or page. Link it in the footer alongside Impressum. Must be present in the site's footer at all times.

---

## 3. Cookies & localStorage — PARTIAL ACTION NEEDED

### What the code actually does

| What | Where | Details |
|---|---|---|
| `localStorage.setItem('i18n-lang', lng)` | [src/i18n/config.ts:31](src/i18n/config.ts#L31) | Saves selected language on language change |
| `localStorage.getItem('i18n-lang')` | [src/i18n/config.ts:9](src/i18n/config.ts#L9) | Reads saved language on page load |
| External image load: `flagcdn.com/w40/{flag}.png` | [src/portfolio/components/portfolio.component.tsx:45](src/portfolio/components/portfolio.component.tsx#L45) | Sends user IP to a third-party CDN on every page load |

**No HTTP cookies are set anywhere in this codebase.**  
**No analytics, tracking pixels, or Google Analytics are present.**

### Do you need a cookie banner?

**No cookie banner needed** — for the following reasons:
- You are not setting HTTP cookies.
- The `localStorage` entry (`i18n-lang`) stores only a UI preference, contains no personal data, and is considered "strictly necessary" for functionality (remembering user's language choice). Under GDPR/ePrivacy, strictly necessary storage does not require a consent banner.
- There is no tracking or analytics.

### What you DO need

- [ ] **Mention `localStorage` in your Privacy Policy** — briefly state that the site saves language preference locally in the browser and that no personal data is involved.
- [ ] **Mention `flagcdn.com`** in your Privacy Policy as a third-party service that receives the user's IP when loading flag images. Consider self-hosting the flag images to eliminate this entirely (simple SVG flags or a local `/assets/flags/` folder would remove the dependency and the disclosure obligation).

---

## 4. Terms & Conditions (AGB) — NOT REQUIRED

Since you don't sell products or services directly through the site, you do not need AGB. Not applicable here.

---

## 5. Image Attribution — CHECK

- [ ] Review all images used in the portfolio (project screenshots, assets in `src/gltf/`, `public/assets/`).
- [ ] If any image comes from a Creative Commons source, add attribution in the format: *Title, Author, Source, Licence*.
- [ ] Images you created yourself need no attribution.
- [ ] Images from clients/employers: confirm you have permission to display them publicly.

---

## 6. Affiliate / Sponsored Content — NOT APPLICABLE

No affiliate links or sponsored content present. No action needed.

---

## Summary Checklist

| Task | Priority | Effort |
|---|---|---|
| Add **Impressum** section/page with full contact details | 🔴 High | Low |
| Add **Privacy Policy** section/page | 🔴 High | Medium |
| Add **footer links** to both Impressum and Privacy Policy | 🔴 High | Low |
| Disclose `localStorage` language preference in Privacy Policy | 🟡 Medium | Low |
| Disclose or eliminate `flagcdn.com` external dependency | 🟡 Medium | Low |
| Review image licenses and add attribution where needed | 🟡 Medium | Low |
| No cookie banner needed | ✅ Done | — |
| No analytics consent needed | ✅ Done | — |
