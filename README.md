# certifiedclosers.net

The **homepage** plus branded affiliate redirects on the apex domain
`certifiedclosers.net`, hosted on **GitHub Pages**
(foundersfreedom-hub/certifiedclosers-redirects).

## The links

| Short link | Goes to |
|---|---|
| **certifiedclosers.net** | **the sales page (`index.html`) — book a call via the Fillout form** |
| certifiedclosers.net/apply | our own application form (`apply/index.html`), built to replace the Fillout embed |
| certifiedclosers.net/booking-confirmation | **LIVE.** Where someone lands the instant Calendly confirms their booking |
| certifiedclosers.net/dispo | JV deal submission page (`dispo/index.html`) |
| certifiedclosers.net/propstream | https://trial.propstreampro.com/closersclub/ |
| certifiedclosers.net/dealmachine | https://app.dealmachine.com/sign-up?fpr=certifiedclosers |
| certifiedclosers.net/dialer | https://batchdialer.com/closersclub10 |
| anything else (typos, wrong case) | https://www.skool.com/digital-real-estate/about (Skool community) |

**Aug 13 2026:** the bare apex no longer forwards to Skool. It now serves the
"Future Millionaire Strategy" sales page, where traffic books a call. `404.html` still
sends unknown paths to Skool so old links keep working — change that one file if
typo traffic should land on the sales page instead.

## Cache busting (read this before debugging a "it still looks broken")

`form.css` and `form.js` are loaded with a `?v=` stamp, and `form.js` sets
`window.CC_APPLY_VERSION` and logs `[apply] form <version>` on boot.
**When you change either file, bump the version in all three places:**
`index.html`, `apply/index.html`, and the `VERSION` const in `form.js`.

Neither `python -m http.server` nor GitHub Pages sends a `Cache-Control`
header, so browsers happily serve a stale copy for hours. This already cost one
debugging round where the fix was live on disk and correct in every test while
the browser kept running the old file. **If something looks wrong, open the
console and check the version line first.** If it doesn't match the file on
disk, it's cache, not code. `node serve.js` sends `no-store`, so the local
preview server never has this problem.

## Local preview

```
node serve.js          # http://localhost:5858, never caches
```
Zero dependencies, Node only. Port 5858 on purpose: the Camp app owns 5757.
`/` is the sales page, `/apply/` is the new form, `/dispo/` is the JV page.
Nothing is cached, so a reload always shows the edit you just made.

## The application form

A from-scratch rebuild of the Fillout form (`MASTER BOOKINGS`, id `1qc2KvTNQfus`)
in our own brand. Same three-step shape (Apply / Schedule / Complete), same seven
questions word for word, same routing. No framework, no build step.

**The Fillout embed was removed from the sales page on 2026-08-13.** The form now
runs in two places from ONE codebase, so they can never drift apart:

```
apply/form.js     markup + all logic + the CONFIG block      <- edit this
apply/form.css    all styles, scoped under .cc               <- and this
apply/index.html  thin shell, standalone page at /apply/
index.html        sales page, mounts the same form inline
```

To put it anywhere else:
```html
<link rel="stylesheet" href="/apply/form.css">
<div id="cc-apply" data-mode="embedded"></div>
<script src="/apply/form.js" defer></script>
```

`data-mode` picks the layout. `standalone` is the full-width 880px page,
`embedded` is the 576px card sized to sit in the sales page's `max-w-xl` column
exactly where the Fillout embed used to.

### Design rules Roy set (2026-08-13)

- **The bolding is his and it is exact.** Every `<strong>` and `<em>` run was
  pulled straight out of the Fillout config and is asserted in a test. If you
  touch question copy, keep the bold runs identical. Question text sits at
  weight 400 on purpose so the bolded words actually read as bold at 700.
- **Each answer is its own rectangle**, the whole thing clickable, one per row.
  Three states: plain white, a warm shade on hover, and shade plus a dark navy
  border plus a filled dot when chosen. **The text itself stays weight 400 in
  every state** so the only bold type on the page is the bold Roy wrote.
- **The stepper sits on the card.** No band behind it, no divider line, no
  border. Numbered dots with the label under each one, joined by a rail that
  turns green as steps complete. The rail is an `::after` on each step, so
  marking a step done fills the rail leaving it. There is nothing else to set.

Everything you'd want to change lives in the `CONFIG` object at the top of
`form.js`: the Calendly link, what carries into Calendly, where submissions get
posted, and which capital answer routes to the calendar.

> [!note] The CSS is scoped under `.cc` because the sales page runs Tailwind.
> Never add a bare element selector to `form.css` or it will leak into the page.
> Watch specificity too: `.cc input[type=email]` outranks `.cc-with-icon input`,
> which is what put the envelope icon on top of the placeholder text once.

**Routing** (copied from the Fillout branching):

| Capital answer | Goes to |
|---|---|
| "Yes! I have $3000+ ready" | Schedule step, Calendly loads |
| "Ugh, my capital is limited ($1K–$3K)" | MT ending, no calendar |
| "Honestly I don't have the money" | DQ ending, no calendar |

> [!warning] Never put Calendly's `calendly-inline-widget` class on `#cc-cal`.
> Their `widget.js` auto-scans the page for that class and reads `data-url` off
> whatever it finds. Our mount has no `data-url`, so their script throws on
> `null.split()`, `window.Calendly` never gets defined, and the whole calendar
> dies. We mount it ourselves with `initInlineWidget` and size it in `form.css`
> (`#cc-cal{height:700px}` plus `#cc-cal iframe{height:100%}`). Without that
> height the iframe collapses to the browser default of 150px and you get a
> "Select a Day" header floating above empty space. Both failures are covered by
> tests that assert the iframe is over 600px tall and that the calendar renders
> more than 20 selectable days.

**The calendar** is the `$30k/m Roadmap Call`
(`calendly.com/closersconsultinggroup/30k-m-roadmap-call`, 60 min, Zoom, active),
loaded through Calendly's official inline widget so it sizes itself and fires
`calendly.event_scheduled` when someone books, which is what advances the form to
Complete. The script loads on demand at the Schedule step, not on page load.

### What carries over into Calendly

| Field | Carries? | How |
|---|---|---|
| Name | yes, verified | Calendly's built-in invitee field |
| Email | yes, verified | Calendly's built-in invitee field |
| Phone | **no** | see below |
| Their answers | as UTM only | stored on the booking, forwarded to Zapier/webhooks |

Phone does not prefill. Tested 2026-08-13 against the live event: the widget's
documented `smsReminderNumber`, plus `sms_reminder_number`, `phone_number` and
`text_reminder_number` as URL params. The "Send text messages to" box stays a
bare `+1` in every case.

**To carry the phone and the answers onto the booking itself:** open the event in
Calendly, add them under Invitee Questions in the same order as
`CONFIG.questionMap`, then set `CONFIG.customQuestions = true`. The `a1/a2/a3`
keys are positional, so the order you add them in is the order they map.

> [!note] The old Fillout form still books into a dead event.
> `$30k/m Strategy Call - VIII (HT)` (`calendly.com/d/cvd9-5vp-556/...`) is
> `active: false` in Calendly, so it renders "This Calendly URL is not valid."
> Anyone who qualifies on the CURRENT live Fillout embed cannot book. That is
> fixed by this form pointing at the Roadmap Call, but the Fillout embed is
> still what the live sales page serves until it gets swapped.

**Submissions go nowhere yet.** `CONFIG.submitUrl` is an empty string, so answers
are only logged to the browser console. Set it to a Discord webhook (the pattern
`/dispo` uses), a GoHighLevel inbound URL, or any endpoint that takes JSON.

## How it works

Static HTML redirect pages, one folder per slug. Each page does an instant
`location.replace()` (plus a `<meta refresh>` fallback for no-JS). GitHub Pages maps
`/propstream` and `/propstream/` to `propstream/index.html` natively, so trailing
slashes just work. Unknown paths hit `404.html`, which bounces to Skool.

To change where a link points: edit that slug's `index.html`, commit, push. The short
link never changes — only the destination. Because the redirect is client-side (not a
cached 301), a swap is live the moment Pages rebuilds.

## Files

```
CNAME                  certifiedclosers.net   (tells Pages the custom domain)
index.html             THE HOMEPAGE — sales page, mounts the application form
apply/form.js          the form: markup, logic, CONFIG   <- the source of truth
apply/form.css         the form's styles, scoped under .cc
apply/index.html       standalone form page at /apply/
serve.js               local preview server (node serve.js -> :5858)
roy.webp               founder photo used by index.html (self-hosted on purpose)
404.html               any unknown path -> Skool
dispo/index.html       JV deal submission page
propstream/index.html  -> PropStream affiliate
dealmachine/index.html -> DealMachine affiliate
dialer/index.html      -> BatchDialer affiliate
```

## Editing the homepage

`index.html` is standalone: the Tailwind CSS is **compiled and inlined** in a `<style>`
block, not pulled from the Play CDN (`cdn.tailwindcss.com` is a dev tool — it ships
~120KB of JS and compiles CSS in the browser, which flashes unstyled content on phones).

If you add or change Tailwind classes, the inlined CSS must be rebuilt or the new
classes will do nothing:

```
npx tailwindcss@3.4.17 -i in.css -o out.css --minify   # in.css = the 3 @tailwind lines
```
then paste `out.css` back into the first `<style>` block. Everything else (copy, colors,
the custom `<style>` rules) is edited directly in the file.

Two headlines are locked to one line with `whitespace-nowrap` and would otherwise run off
narrow phones, so `.fit-hero` / `.fit-founder` scale them to the column below 640px. Both
cap at their designed size, so tablet and desktop render exactly as designed. If you edit
that headline copy, re-check it on a 375px-wide screen.

## DNS (Squarespace) — the one manual step

Apex `certifiedclosers.net` points at GitHub Pages with FOUR A records (GitHub serves
apex from these four IPs; use all four for redundancy):

- **A  @  185.199.108.153**
- **A  @  185.199.109.153**
- **A  @  185.199.110.153**
- **A  @  185.199.111.153**

These REPLACE the four Squarespace domain-forwarding A records
(198.185.159.144/145, 198.49.23.144/145) that used to forward the apex to Skool.

Leave untouched: the `t` CNAME (Hyros tracking), the `admin` CNAME (the Camp app),
and the `www` forward to Skool. GitHub issues HTTPS automatically once DNS resolves
(can take up to an hour after the records change).

## Watch-outs

- Slugs are lowercase and case-sensitive. `/Propstream` falls through to Skool.
- Do not delete `index.html` or `404.html` — they are what keep the bare domain and
  typos landing on Skool instead of a GitHub 404.
- Public repo on purpose: GitHub Pages custom domains are free only on public repos, and
  every URL in here is already public.

## The confirmation page (`booking-confirmation/index.html`)

Where someone lands the moment Calendly confirms their booking. Same build rules as
the homepage: Tailwind compiled and inlined, no Play CDN, no icon library (this page
uses zero icons), `noindex` because a thank-you page has no business in search.

**The videos are the whole performance story.** The original mounted 19 Wistia players
and pulled 21 embed scripts in `<head>`. Deferring only the scripts does nothing:
once `player.js` is running it initialises *every* `<wistia-player>` in the document.
So the elements themselves stay out of the DOM until they scroll near view, and a
`.wistia-lazy` placeholder holds the identical box in the meantime. First load on a
phone: **158 network requests down to 43.**

If you add a video, add it as a placeholder, not a player:

```html
<div class="wistia-lazy w-full h-full" data-media-id="XXXX" data-aspect="1.7777777777777777"></div>
```

The hero (`qsod2x9q1u`) is the one deliberate exception and loads immediately.

**Do not flatten `pt-32 md:pt-40`** on the section under the hero. The video above it
is pushed down by a percentage of its own height, so it overhangs ~51px on desktop but
only ~20px on a phone. A single flat value leaves 140px of dead white on mobile.

### Getting people here after they book

`apply/form.js` listens for Calendly's `invitee.created` postMessage and calls
`location.replace(CONFIG.bookedRedirect)`. Change the destination in that one
CONFIG line; set it to `""` to go back to the in-page "you're booked" view.

The origin check on that listener (`e.origin !== "https://calendly.com"`) is load
bearing. Without it any page or frame could fake a booking. Don't remove it.
