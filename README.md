# certifiedclosers.net

The **homepage** plus branded affiliate redirects on the apex domain
`certifiedclosers.net`, hosted on **GitHub Pages**
(foundersfreedom-hub/certifiedclosers-redirects).

## The links

| Short link | Goes to |
|---|---|
| **certifiedclosers.net** | **the sales page (`index.html`) — book a call via the Fillout form** |
| certifiedclosers.net/dispo | JV deal submission page (`dispo/index.html`) |
| certifiedclosers.net/propstream | https://trial.propstreampro.com/closersclub/ |
| certifiedclosers.net/dealmachine | https://app.dealmachine.com/sign-up?fpr=certifiedclosers |
| certifiedclosers.net/dialer | https://batchdialer.com/closersclub10 |
| anything else (typos, wrong case) | https://www.skool.com/digital-real-estate/about (Skool community) |

**Aug 13 2026:** the bare apex no longer forwards to Skool. It now serves the
"Future Millionaire Strategy" sales page, where traffic books a call. `404.html` still
sends unknown paths to Skool so old links keep working — change that one file if
typo traffic should land on the sales page instead.

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
index.html             THE HOMEPAGE — sales page + Fillout booking form
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
