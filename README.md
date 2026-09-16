# Riverside Public Library Foundation

A landing page demo for the foundation that raises money for the City of
Riverside's eight public libraries, built so their admin staff can run it
themselves afterwards.

## Running it

```bash
npm install
npm run dev              # http://localhost:4321
npm run images           # rebuild the photography from assets-source/
npm run build
```

## What is here

| Path | What it is |
|---|---|
| `src/content/` | Every word, figure and photograph reference on the page |
| `src/components/` | The sections, none of which contain copy |
| `public/admin/` | The CMS panel, served at `/admin/` |
| `assets-source/` | Original photographs, before processing |
| `docs/design-plan.md` | The composition and palette, decided before any markup |
| `docs/CMS.md` | How the admin panel works and how to switch it on |
| `docs/OPEN-QUESTIONS.md` | What the foundation needs to decide |

## The design in one paragraph

The material is library buckram and foil stamping on the mount board of an
archival photographic plate. Both accents, the civic blue and the citrus green,
are sampled from the foundation's own seal rather than picked to suit a mood.
The hero is the 1903 Carnegie library photographed around 1910, duotoned into
that blue, because the argument of the page is that this city has funded a
public library for over a century and somebody is still minding it. Navigation
is a centred crest, which is how institutions with a crest present themselves.

## Content is the CMS

No sentence is typed into a component. Everything the page says lives in JSON
under `src/content/`, which is the same set of files the admin panel edits. See
`docs/CMS.md`.

## Forms

Four Netlify forms: `donation`, `reservation`, `newsletter`, `contact`. They
work as soon as the site is deployed to Netlify, with no backend. Each has a
honeypot field and posts to `/thank-you/`.

**No payment is taken.** The donate form and the reservation form record intent
and email the foundation. Connecting a processor is a setup step; the options
are compared in `docs/OPEN-QUESTIONS.md`.

## Before this is presented as final

Read `docs/OPEN-QUESTIONS.md`. The short version: the giving levels are
placeholders, no money moves yet, the logo needs to come from the foundation in
vector form, and the page would be considerably better with photographs of
actual people in these libraries.
