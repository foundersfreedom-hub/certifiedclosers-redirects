# certifiedclosers.net redirect service

Branded affiliate redirects on the **apex** domain `certifiedclosers.net`, hosted on
**GitHub Pages** (foundersfreedom-hub/certifiedclosers-redirects). Roy uses these short
links in YouTube descriptions.

## The links

| Short link | Goes to |
|---|---|
| certifiedclosers.net/propstream | https://trial.propstreampro.com/closersclub/ |
| certifiedclosers.net/dealmachine | https://app.dealmachine.com/sign-up?fpr=certifiedclosers |
| certifiedclosers.net/dialer | https://batchdialer.com/closersclub10 |
| anything else (incl. bare domain) | https://www.skool.com/digital-real-estate/about (Skool community) |

The bare apex and any unknown path land on Skool (via `index.html` and `404.html`), so
pointing the apex here did NOT break Roy's Skool forward — it absorbed it.

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
index.html             bare apex -> Skool
404.html               any unknown path -> Skool
propstream/index.html  -> PropStream affiliate
dealmachine/index.html -> DealMachine affiliate
dialer/index.html      -> BatchDialer affiliate
```

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
