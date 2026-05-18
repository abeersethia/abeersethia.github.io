# Quick Start — Portfolio Site

**Run locally, edit the right files, preview, deploy.** This guide matches your customized al-folio portfolio (Swiss/minimal UI, case studies, institution strip, hover video cards). For deep al-folio options, see [INSTALL.md](INSTALL.md) and [CUSTOMIZE.md](CUSTOMIZE.md).

<!--ts-->

- [Quick Start — Portfolio Site](#quick-start--portfolio-site)
  - [1. Run the site locally](#1-run-the-site-locally)
  - [2. Site identity (`_config.yml`)](#2-site-identity-_configyml)
  - [3. Copy & conversion hub (`_data/portfolio.yml`)](#3-copy--conversion-hub-_dataportfolioyml)
  - [4. About page & photo](#4-about-page--photo)
  - [5. Contact, résumé & social links](#5-contact-résumé--social-links)
  - [6. Work page & projects](#6-work-page--projects)
  - [7. Institution logos & stack](#7-institution-logos--stack)
  - [8. Appearance & toggles](#8-appearance--toggles)
  - [9. Navigation & extra pages](#9-navigation--extra-pages)
  - [10. Before you commit](#10-before-you-commit)
  - [11. Deploy to GitHub Pages](#11-deploy-to-github-pages)
  - [File map (what lives where)](#file-map-what-lives-where)

<!--te-->

---

## 1. Run the site locally

**Recommended: Docker** (matches CI and avoids Ruby version issues).

```bash
docker compose pull && docker compose up
```

Open **http://localhost:8080**. Stop with `Ctrl+C`, or:

```bash
docker compose down
```

After dependency or Dockerfile changes:

```bash
docker compose up --build
```

One-off production build check:

```bash
docker compose run --rm jekyll jekyll build
```

---

## 2. Site identity (`_config.yml`)

Edit the top of `_config.yml`:

```yaml
title: blank          # keep blank to use first_name + last_name in the hero/nav
first_name: Abeer
last_name: Sethia
description: >        # SEO / meta description
url: https://abeersethia.github.io
baseurl:              # empty for user.github.io; use /repo-name/ for project sites
```

**Must stay in sync for GitHub Pages:**

| Site type | `url` | `baseurl` |
|-----------|--------|-----------|
| `username.github.io` | `https://username.github.io` | *(empty)* |
| Project site | `https://username.github.io` | `/repo-name/` |

Portfolio UI toggles (same file, search for these keys):

```yaml
enable_darkmode: true        # theme switch in nav
enable_liquid_glass: true      # glass panels on hero/nav/cards — set false for simpler/faster UI
navbar_fixed: true
search_enabled: false          # portfolio nav is minimal; leave off unless you need search
```

---

## 3. Copy & conversion hub (`_data/portfolio.yml`)

**Most homepage text is here** — not scattered across Liquid files. After editing, refresh the browser (Jekyll reloads in Docker).

| Section | What it controls |
|---------|------------------|
| `hero.role` | One line under your name (specialization + value) |
| `hero.subtitle` | Supporting paragraph in the hero |
| `hero.proof_line` | Credibility line under hero (schools / employers) |
| `buttons.work` / `buttons.cv` | Hero CTA labels and URLs |
| `nav.cta` / `nav.contact` | Nav résumé button + Contact link (`/#contact`) |
| `cta.*` | Bottom “Ready to collaborate?” band (email + copy + résumé). **`calendly_url` is unused** — no calendar integration |
| `institutions` | “Experience at” logo strip on the home page |
| `stack` | Tech chips section |
| `highlights` | Three collaboration cards (`text`, `institution`, optional `byline`) |
| `focus_areas` | Anchor tabs (must match `id` on pillars, e.g. `#pillar-2`) |
| `pillars` / `pillars_title` | “What I work on” rows |
| `stats` | Full-width stat band |
| `project_filters` | Work page filter buttons (`id` must match project `category`) |
| `pages.work.intro` | Intro paragraph on `/projects/` |

**Example — change hero only:**

```yaml
hero:
  role: Your specialization — one clear line.
  subtitle: What you build and for whom.
  proof_line: Org A · Org B · Org C
```

---

## 4. About page & photo

| File | Purpose |
|------|---------|
| `_pages/about.md` | Home page body (`permalink: /`, `layout: about`). Markdown below the front matter = intro under “What I work on”. |
| `assets/img/prof_pic.jpg` | Hero headshot (path set in `about.md` → `profile.image`) |
| `_layouts/about.liquid` | Home structure (hero, logos, pillars, stats, contact). **Rarely edit** — change copy in YAML/Markdown instead. |

In `_pages/about.md`:

```yaml
profile:
  image: prof_pic.jpg      # file lives in assets/img/
  image_circular: false
  more_info: >
    <p>Your city, country</p>
social: true               # shows icons from _data/socials.yml
```

---

## 5. Contact, résumé & social links

| File | Purpose |
|------|---------|
| `_data/socials.yml` | `email`, `github_username`, `linkedin_url`, `cv_pdf` |
| `assets/pdf/AbeerSethia_Resume.pdf` | Résumé linked from nav and CTAs — **replace file, keep path** or update URLs in `portfolio.yml` + `socials.yml` |

Email + “Copy email” use `socials.email`. The copy button is wired in `_scripts/portfolio-interactions.js` (built to `/assets/js/portfolio-interactions.js`).

Contact block at the bottom of home and case studies: `_includes/contact-cta.liquid` (copy comes from `portfolio.yml` → `cta`).

---

## 6. Work page & projects

**Work grid:** `_pages/projects.md` (layout + filter include).  
**Cards:** `_includes/project_card.liquid`.  
**Filters:** client-side in `_scripts/projects-filter.js` (no page reload).

### Add a new case study

1. Copy `_projects/template-project.md` → `_projects/your-slug.md`
2. Set front matter (see below)
3. Write body with these **H2 headings** (sticky sidebar TOC on case studies):

   - `## Summary`
   - `## Challenge`
   - `## Process`
   - `## Results`
   - `## Impact`
   - `## Links` *(optional)*

4. Set `listed: true` (or omit — default is listed). Use `listed: false` for drafts.
5. Set `importance:` higher = appears first on the grid.
6. Set `category:` to one of `project_filters` ids in `portfolio.yml` (e.g. `neuroimaging`, `segmentation`).

**Front matter reference:**

```yaml
---
layout: case-study
title: Short project title
description: One line for the card and case-study header
importance: 2
listed: true
category: neuroimaging          # must match a filter id (not "all")
img: assets/img/your-cover.jpg  # or 1.jpg under assets/img/
hover_video: assets/video/your-loop.mp4   # optional — see below
github: https://github.com/you/repo
metrics:
  - label: Dice (mean)
    value: "0.92"
  - label: Modality
    value: MRI
---
```

### Hover preview video (1–2 flagship projects)

- Add a **short (3–5 s), muted, H.264 `.mp4`** under `assets/video/`
- Set `hover_video: assets/video/filename.mp4` on that project only
- Optional smaller file: `hover_video_webm: assets/video/filename.webm`
- Video loads **on first hover** (desktop only); mobile keeps the poster image
- Respect `prefers-reduced-motion` — no autoplay for those users

**Swap placeholder loops:** replace files in `assets/video/` and update paths in the project markdown. Keep files small (target &lt; 2–3 MB each).

### Hide a project from the grid

```yaml
listed: false
```

Or delete the file from `_projects/`.

### Case study layout

`_layouts/case-study.liquid` — header metrics from YAML, body from Markdown, TOC from H2s, contact CTA at bottom.

---

## 7. Institution logos & stack

**Logos:** `assets/img/institutions/` (PNG/SVG). Register in `_data/portfolio.yml`:

```yaml
institutions:
  - name: Display name
    logo: /assets/img/institutions/my-logo.png
    logo_color: true   # optional — skip gray mono treatment
```

**Stack chips:** edit the `stack:` list in `portfolio.yml` (rendered by `_includes/stack-strip.liquid`).

---

## 8. Appearance & toggles

| Goal | Where |
|------|--------|
| Colors, spacing, type scale | `_sass/_doss-tokens.scss` (`--doss-*` CSS variables) |
| Buttons, nav, hero, footer | `_sass/_portfolio.scss` |
| Cards, filters, case study, CTA | `_sass/_portfolio-cro.scss` |
| Glass effect panels | `_sass/_liquidgl.scss` + `enable_liquid_glass` in `_config.yml` |
| Global theme (light/dark bg) | `_sass/_themes.scss`, `_sass/_variables.scss` |
| Button corner radius | `--doss-radius-btn`, `--doss-radius-card` in `_doss-tokens.scss` |

Imported from `assets/css/main.scss` — edit SCSS, save, refresh (Docker rebuilds CSS).

**Disable glass for performance/simplicity:** `_config.yml` → `enable_liquid_glass: false`.

---

## 9. Navigation & extra pages

Nav items come from `_pages/*.md` with `nav: true` and `nav_order:` (lower = earlier).

Current pattern:

- **About** — `_pages/about.md` (`permalink: /`)
- **Work** — `_pages/projects.md`
- **CV** — `_pages/cv.md` (`nav: true`)
- **Contact** — link to `/#contact` from `portfolio.yml` → `nav.contact`

To hide al-folio demo pages from nav, set `nav: false` in their front matter (blog, publications, teaching, etc.).

Dropdown example: `_pages/dropdown.md` (`nav: false` on yours).

---

## 10. Before you commit

From the repo root:

```bash
# Format (first time: npm install --save-dev prettier @shopify/prettier-plugin-liquid)
npx prettier . --write

# Build
docker compose run --rm jekyll jekyll build
```

Manually check **http://localhost:8080**:

- Home hero, logos, stats, contact CTAs  
- **Work** — filters, cards, hover video (desktop)  
- One **case study** — TOC, metrics, dark mode  
- **Copy email** and **Download résumé** links  

---

## 11. Deploy to GitHub Pages

For `abeersethia.github.io`:

1. Push to `main` (or your default branch).
2. **Actions** → wait for deploy workflow (green check).
3. **Settings → Pages** → source **gh-pages** branch (if not already).

Live URL: **https://abeersethia.github.io**

If you change `url` / `baseurl`, rebuild and verify asset paths (images, PDF, videos).

---

## File map (what lives where)

```
_config.yml              Site name, URL, feature flags (dark mode, liquidGL)
_data/portfolio.yml      Homepage + nav + CTA + filters + pillars + stats
_data/socials.yml        Email, GitHub, LinkedIn, CV path
_pages/about.md          Home intro markdown + profile photo
_pages/projects.md       Work page shell
_projects/*.md           Case studies (grid + detail pages)
_layouts/about.liquid    Home layout
_layouts/case-study.liquid
_includes/project_card.liquid
_includes/contact-cta.liquid
_includes/logo-strip.liquid
_includes/stack-strip.liquid
_includes/highlights.liquid
_scripts/portfolio-interactions.js   Copy email, scroll reveal, hover video
_scripts/projects-filter.js          Work grid filters
_scripts/case-study-toc.js           Case study sidebar TOC
_sass/_doss-tokens.scss              Design tokens
_sass/_portfolio.scss
_sass/_portfolio-cro.scss
assets/img/                          Photos, project covers, institution logos
assets/video/                        Hover loop MP4s (optional WebM)
assets/pdf/                          Résumé PDF
```

**Do not edit** generated paths under `_site/` or commit `.jekyll-cache/`.

---

**Common edits checklist**

- [ ] Hero: `_data/portfolio.yml` → `hero`, `buttons`
- [ ] Bio paragraph: `_pages/about.md`
- [ ] Photo: `assets/img/prof_pic.jpg`
- [ ] Résumé: `assets/pdf/…` + paths in `socials.yml` / `portfolio.yml`
- [ ] New project: copy `_projects/template-project.md`, set `listed: true`, write H2 sections
- [ ] Hover clip: `assets/video/` + `hover_video` in project front matter
- [ ] Logos: `assets/img/institutions/` + `institutions` in `portfolio.yml`
- [ ] Email / socials: `_data/socials.yml`

For troubleshooting: [TROUBLESHOOTING.md](TROUBLESHOOTING.md). For agent/CI conventions: [AGENTS.md](AGENTS.md).
