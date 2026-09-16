# Riverside Public Library Foundation — design plan

A landing page demo for the shareholders, built so the foundation's admin staff
can eventually run it themselves.

## Two corrections to the brief, both verified

**The organisation is the Riverside **Public** Library Foundation.**
Their own site titles it "Riverside Public Library Foundation", not "Riverside
Library Foundation". The site uses their name.

**It supports the City of Riverside's library, not the county system.** The
brief said "Riverside County". Riverside County Library System is a separate
organisation with roughly thirty branches. The City of Riverside Public Library
has exactly **eight** locations, which matches the eight in the brief, and
3900 Mission Inn Avenue is its Main Library. All eight are named and addressed
from the city's own listing, not invented.

## What a visitor should feel in the first 3 seconds

**"This institution has stood here for a century, and it is in careful hands."**

Not excitement. Confidence. A shareholder should feel the weight of the thing
before they read a word, and a donor should feel that money given here is money
that will still be doing work in twenty years.

## Composition (declared before any markup)

Checked against `used-directions.md`. The three most recent rows are The Music
Room (floating pill / massive / none / layered), Shahnawaz (minimal / luxury
serif / layered photography / grid) and Bounce House City (split / playful /
cutout object / immersive). **All four choices below differ from all three.**

| Category | Choice | Why this one |
|---|---|---|
| **Navigation** | **centred logo** | The seal sits alone on the centre line with the links flanking it and Donate detached to the right. This is how institutions with a crest present themselves, and this client has a genuine one. Differs from floating pill, the most recent row. |
| **Typography** | **editorial** | A masthead, a standfirst, letterspaced metadata, a hairline rule under the name. The page reads as the foundation's annual report rather than as a campaign. That is what "educated, not flashy" actually looks like. |
| **Image treatment** | **fullscreen** | The 1910 Carnegie library, full bleed, duotoned into the foundation's own blue. Archival photography at full size is the single most premium move available here and it costs nothing in licensing. |
| **Layout** | **editorial** | A drawn hairline grid, stepped columns, figure numbers, a colophon. The photographs are the only things allowed to break the grid. |

## Material and palette

Derived from two real things: **the foundation's own seal**, and **the mount
board of an archival photographic plate.** Deliberately not cream-and-terracotta,
which is the default this brief could easily have fallen into given Riverside's
Mission Revival architecture.

| Token | Value | What it is |
|---|---|---|
| Ink | `#0D2233` | Archival board. Their civic blue taken down to near-black. The hero ground and the footer. |
| Civic | `#005696` | **Sampled from their seal.** Structure, links, rules. |
| Citrus | `#C2D832` | **Sampled from their seal.** The one living colour: Riverside's citrus, used for the single thing on screen that is growing. Never decorative. |
| Brass | `#B08D4F` | Foil stamping. The premium tell, used only where a real binding would be stamped: the seal, the rules, the figure numbers. |
| Paper | `#F2EEE2` | Warm text stock. Matches the highlight end of the duotone ramp exactly, so photographs sit into the page rather than on it. |

Brass on warm paper is a gold-foil-on-cloth reference, not the banned cream and
terracotta pair: the dominant surface is deep blue-black, and both accents come
from the client's own mark.

## Signature element and load sequence

About 1.9s, in this order:

1. The hero photograph is already there, held under a deep scrim.
2. The masthead hairline **draws** across the full width.
3. The seal fades up and a **sheen sweeps across it once**, the way light moves
   over foil stamping when a book is tilted.
4. The three headline lines rise from behind the rule, staggered.
5. The standfirst, then the two actions.

Nothing bounces. Nothing scales in. An institution does not bounce.

## The live accent

A **countdown to the real RSVP deadline** for the 2026 fundraiser, which closes
23 October 2026 for the 13 November event. It is a genuine readout of a genuine
deadline, it changes while you watch, and it is the one piece of urgency the
page is entitled to.

Second live element: the impact figures count up once, and every one of them is
a real claim taken from the foundation's own site.

## Motion floor

Lenis, GSAP ScrollTrigger, reveals at 20 to 30px staggered 60 to 90ms, one
easing token, hover lift on cards. Everything visible with JavaScript off,
finished state under reduced motion.

## Structure

1. Hero, full bleed, centred-seal navigation over it
2. The mission, set as a standfirst
3. What the foundation has actually done, with real figures
4. Heritage: 1910 beside today
5. The eight libraries, all named and addressed
6. Giving, with **one-time and monthly** on a real toggle
7. The 2026 fundraiser, with reservation
8. The board, named
9. Newsletter and contact
10. Colophon footer with the social links and the image credits

## Built for a CMS from the start

Every line of copy, every photograph reference, every branch, tier and board
member lives in JSON under `src/content/`. No sentence is typed into a
component. That is what makes "admin staff can change the verbiage" a real
claim rather than an aspiration, and it is why Decap CMS can be pointed at this
repository and immediately work. See `docs/CMS.md`.
