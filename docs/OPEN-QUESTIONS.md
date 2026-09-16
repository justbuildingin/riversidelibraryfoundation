# Open questions for the foundation

Things I decided in order to finish the demo that are really the foundation's
call. None of them block showing it. All of them are small changes.

## 1. Two corrections to the brief

**The name.** Their own site says **Riverside Public Library Foundation**. The
brief said "Riverside Library Foundation". The site uses the name on their
letterhead.

**The library system.** The brief said "8 branches for Riverside County". The
county system, Riverside County Library System, is a different organisation
with around thirty branches. The **City of Riverside Public Library** has
exactly eight locations, and 3900 Mission Inn Avenue is its Main Library, which
is the address in the brief. The eight are named and addressed from the city's
own listing. If the intent really was the county system, the branch list has to
be rebuilt from scratch.

## 2. The giving levels are placeholders

The foundation does not publish giving levels anywhere on their current site, so
the four on the page ($25 / $100 / $500 / $1,500, and their monthly equivalents)
are **suggestions**, flagged as such in `src/content/giving.json`. What each
level "buys" is written to be plausible, not audited.

Before launch the foundation should supply their real levels and their real
per-level impact, because a donor who gives $100 expecting a Story Time Kit and
learns otherwise is a donor lost.

## 3. Donations are captured, not charged

The donate form records intent and emails the foundation. **No money moves.**
Connecting a real processor is a setup step rather than a rebuild, and the
choice matters for a non-profit:

- **Stripe** takes 2.2% + 30 cents for registered non-profits and handles
  recurring gifts natively. Best rate, needs the most setup.
- **Donorbox** or **Givebutter** drop in with less work and handle receipting
  and donor records, at a higher effective cost.

Recurring giving is already built into the interface, so whichever is chosen
needs to support subscriptions.

## 4. The event reservation does not take payment either

Reservations land as form submissions with the seat count and the total. The
foundation confirms by email and takes payment at the door or by invoice, which
is how the current site appears to work. If they would rather collect the $150
up front, that is the same processor decision as above.

## 5. The logo is small

The only logo available on their website is 232 by 68 pixels, and the crest
inside it is 64 pixels across. It is used at small sizes here and it holds, but
it will look soft on a high-resolution screen and it cannot be printed.

**Ask the foundation for the original vector artwork.** Any organisation with a
crest this old usually has an EPS or AI file from whoever drew it.

## 6. Photographs

Only one photograph of theirs exists on their site, and at 605 by 680 pixels it
is too small for a hero. The hero and the heritage section therefore use
public-domain archival photographs of the 1903 Carnegie library, which suit the
story and cost nothing to license. Full provenance is in
`public/images/CREDITS.md`.

One image, the downtown Riverside band behind the branch list, is CC BY-SA 2.0
and **requires the attribution line in the footer**. If the foundation would
rather not carry it, replace that one image with their own photography and the
line comes out.

What would improve the page most is their own photography: the Storymobile, a
story time session, the Casa Blanca Family Learning Center, a branch interior
with people in it. Right now the page has no people in it at all, which for an
organisation about community is the biggest gap.

## 7. Nothing here is verified against their filings

No EIN, no 501(c)(3) statement and no financial figures appear on the page,
because none appear on their site and I will not invent them. Most donors look
for the tax ID before giving. The foundation should supply it, along with the
exact wording they want for tax-deductibility.

## 8. The board members are real people

The twelve names and the board assistant are reproduced from the foundation's
own public board page. They are on the demo because the brief asked for their
content. If anyone has left the board since that page was updated, this page
repeats the error.
