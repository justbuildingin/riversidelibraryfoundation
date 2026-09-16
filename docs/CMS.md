# The admin panel

The brief asked for a CMS so staff can post updates, change wording and swap
photographs without a developer. This is how that works, and what is left to
switch on.

## The idea

**Nothing on this site is typed into a component.** Every sentence, every
figure, every branch, every giving level and every board member lives in a JSON
file under `src/content/`. The page reads those files at build time. That is
what makes the CMS claim real rather than aspirational: the admin panel and the
website are looking at the same files.

```
src/content/
  site.json        name, mission, address, email, social links
  branches.json    the eight libraries
  impact.json      the headline figures and the programmes
  giving.json      the giving levels, one-time and monthly
  event.json       the annual fundraiser, including the RSVP deadline
  board.json       officers and directors
  updates/         one file per news post, created from the panel
```

## The panel

Decap CMS, served at **`/admin/`**. It is a git-backed CMS: an edit is a commit
to this repository, Netlify sees the commit and rebuilds, and the change is
live in about a minute.

For a non-profit board this is the right shape. There is no database to pay for
or back up, no server to patch, and every change anyone makes is in git history
with a name and a date on it. If somebody deletes a paragraph by accident, the
previous version is one revert away.

## Right now: demo mode

`public/admin/config.yml` ships with `backend: test-repo`. The whole panel runs
in the browser with **no login and no saving**, which is exactly what you want
for a shareholder demo: anyone can open `/admin/`, click into "The foundation",
change the mission statement, add a news post, and see the editing experience,
without touching the real site.

## Switching it on for real

Three steps, all in the Netlify dashboard and this file.

1. In `public/admin/config.yml`, comment out `name: test-repo` and uncomment the
   `git-gateway` lines.
2. On the Netlify site, enable **Identity**, then under Identity settings enable
   **Git Gateway**.
3. Invite the staff by email from the Identity tab. They set a password and can
   then sign in at `/admin/`.

Set Identity registration to **invite only**, or anybody can create an account
on the panel that edits the foundation's website.

## What staff can do once it is on

- **Post updates.** News, campaign announcements, grants. They appear in the
  "From the foundation" section, newest first.
- **Change any wording on the page**, including the mission statement, the
  giving levels and what each level buys.
- **Swap photographs.** Uploads go to `public/images/` and can be picked from
  any image field. Anything replacing the hero should be large, at least 2400px
  wide, or it will look soft on a big screen.
- **Update the event** each year: name, date, venue, price, and the RSVP
  deadline that the countdown on the page runs against.
- **Edit the board list** as it changes.

## What still needs a developer

Adding a whole new *section* to the page, changing the layout, or changing the
colours. The panel edits content, not design. That is the correct boundary: it
is what stops a website slowly becoming unusable one well-meant edit at a time.
