# CERTIFIED CLOSERS — BRAND IDENTITY

**The homepage IS the brand.** `index.html` at the apex is the reference implementation.
Roy wrote every word and approved every pixel (Aug 13 2026). Anything new built for
Certified Closers matches this or it is wrong.

Source of truth: `index.html` in this folder. When this doc and the page disagree, the
page wins and this doc gets updated.

---

## 1. THE FEELING

Expensive, dark, and confrontational. It reads like a private invitation, not a pitch.
The cream paper and the serif line give it money; the Anton slabs and the "Ew, this isn't
for you" column give it teeth. It is warm where it talks about family and cold where it
talks about money.

Three rules that hold the whole thing together:

1. **Cream and near-black, never pure white and never pure black.** The canvas is
   `#EEE8DF` (warm paper) and the ink is `#0f0f0f`. Pure `#FFFFFF` appears only as card
   fills and highlight boxes, never as a page background.
2. **Every section owns one colour.** Sections alternate dark and light and each has a
   single background. Never two backgrounds in one section.
3. **The CTA never changes its words.** "Apply For Private Coaching", five times, in the
   same shape. Only its colours invert to sit on the section behind it.

---

## 2. COLOUR

### Core
| Token | Hex | Use |
|---|---|---|
| Base / paper | `#EEE8DF` | the main canvas, and headline ink on dark sections |
| Ink | `#0f0f0f` | body text on light, and the dark button fill |
| Gold | `#B8860B` | the deep end of the headline gradient, link hover |
| Hero gradient | `#FFD700` → `#FCEE21` → `#B8860B` | the money headline only |

### Section backgrounds, in page order
| # | Section | Background | Notes |
|---|---|---|---|
| 1 | Hero + VSL | `#051025` → `#0f0f0f` gradient | navy fading to black |
| 2 | CTA / form | `#EEE8DF` | the cream break, where the form lives |
| 3 | Social proof | `#214444` | deep teal, the "proof" colour |
| 4 | Promise | `#1E1512` outer, white card | near-black brown |
| 5 | Ideal student | `#E7E5DB` | second cream, a shade cooler than base |
| 6 | Wealth map | `#3F415D` | slate purple, cards `#DDDEEE` |
| 7 | Founder bio | `#111215` | the coldest black on the page |
| 8 | Footer | `#1E1512` | matches the promise section |

### Accents
| Hex | Meaning |
|---|---|
| `#166534` + `green-400` | proof, money made, "you belong here" |
| `#991b1b` | disqualification, "this isn't for you" |
| `#49110B` | the burnt red on "WORK FOR YOU:" |
| `#F4A641` | the amber sparkle icons in the promise list |
| `#543310` | brown, on "THAT'S a LOT OF WINS" |
| `#89CFF0` | baby blue, the founder eyebrow line |
| `#2C365A` / `#041642` / `#051025` | the navy ladder in the cream CTA |
| `#1C1E4D` / `#1A2332` | wealth-map card ink |

**Green means money, red means rejection.** Do not use green for an error or red for a
highlight anywhere in this brand.

### Grain
Every page carries a full-height SVG `feTurbulence` noise overlay at **3% opacity**
(`.bg-grain::before`). It is what keeps the flat colours from looking like a template.
Keep it on any new page.

---

## 3. TYPE

Four families, each with exactly one job.

| Role | Family | Where |
|---|---|---|
| **Display** | **Anton** (`.font-display`) | every big uppercase slab headline |
| **Body** | **Inter** (`body` default) | paragraphs, promise list, testimonial copy |
| **Utility** | **Space Grotesk** (`.font-future`) | buttons, eyebrows, small tracked labels, footer legal |
| **Romantic** | **Cormorant Garamond** (`.font-serif-luxury`) | exactly one line: *"Book a call and give me 99 days"* |

The Cormorant line is the single soft moment on the page. **Use it once per page, never
twice.** It is what makes the cream section feel like a wedding invitation instead of a
funnel.

### The `font-sans` gotcha
`font-sans` is a Tailwind class and it does **not** mean Inter. It resolves to the
device's own system font (SF Pro on iPhone and Mac, Roboto on Android, Segoe on Windows).
It is deliberately used on "Meet The Founder, Roy.", the proof bullets, "HERE'S HOW I KEEP
MY PROMISE:" and the disclaimer. Those headings therefore look slightly different per
device. That is the current identity — just know that when you copy a class list, and
never assume `font-sans` will render as Inter.

### Scale
- Big section headlines: `text-5xl sm:text-7xl lg:text-8xl`, `leading-[0.9]`, uppercase,
  `tracking-tight`. They are meant to feel too big.
- Hero: `text-[2.4rem] sm:text-5xl md:text-6xl lg:text-[4.8rem]`, `leading-[1.05]`.
- Body: `text-lg` to `text-xl`, `font-light` for testimonial copy, `leading-relaxed`.
- Eyebrows and buttons: small, uppercase, `tracking-[0.2em]` or wider. The wide letter
  spacing on tiny text is a signature — do not tighten it.

### The nowrap rule
The hero headline and "Meet The Founder, Roy." are locked to one line with
`whitespace-nowrap`, and `.fit-hero` / `.fit-founder` scale them to fit phones below
640px. **If you edit either line, re-check it at 375px wide** or it will run off the
screen. See the README for the measuring method.

---

## 4. COMPONENTS

### The button (never redesign it)
```
px-10 py-5 · font-future · font-bold · uppercase · tracking-[0.2em]
rounded-sm · hover:opacity-90 · transition-all duration-300
```
Colours invert to contrast the section: white-on-teal, black-on-cream, white-on-slate,
white-on-black. Label is always **Apply For Private Coaching**. It always scrolls to the
form; it is never a link to another page.

### Cards
- Proof cards: white fill, `border-green-200`, `rounded-sm`, `shadow-elegant`, video on
  top, headline with the dollar amount in `green-700`, quote in `font-light`.
- Wealth map cards: `#DDDEEE` fill, `rounded-xl`, `aspect-square`, centered, icon in a
  20×20 tinted circle, `hover:-translate-y-2`.
- `shadow-elegant` = `0 10px 30px -10px rgba(0,0,0,0.1)`. Soft and low. Never a hard drop
  shadow.

### Corners
`rounded-sm` almost everywhere (2px). The wealth-map cards are the one exception at
`rounded-xl`. Sharp corners are part of the expensive feel — do not round things up.

### Motion
- `fade-in-up`: 0.8s ease-out, the only entrance animation.
- The shooting star across the video frame, 8s loop. It is the one piece of delight.
- Hover: opacity or a 2px lift. Nothing bounces, nothing scales.
- All of it is disabled under `prefers-reduced-motion`.

### Video
Wistia, 16:9, black fill. The VSL sits in a cream frame that is open at the bottom
(`h-[91%]` border) so the video bleeds down into the cream section below it. That overlap
is deliberate. Testimonial videos lazy-load as you scroll.

---

## 5. VOICE

Roy writes this himself. The page is the reference. Full voice guide:
`brain/01-identity/roy-copywriting-voice.md`.

**What the page actually does:**

- **Talks to one person as "you."** Never "our clients will find that…"
- **Numbers instead of adjectives.** Not "great results" but "$60,000 Profit On Her First
  Deal", "150+ Motivated Sellers Every Month", "3 Deals In 99 Days".
- **Names the enemy.** "lists that 1,000 other wholesalers already called", "cold calling
  dead leads", "chasing ghosts".
- **Every feature is followed by the relief, in parentheses.**
  "Done-For-You Leads (So You Stop Chasing Ghosts):" — the pattern is
  *Feature (So You Stop / So You Actually / So You Can)*. Hold this exactly.
- **Disqualification sells.** A whole column titled "EW, THIS ISN'T FOR YOU:" ending in
  "Go cry about life to mommy." The rudeness is the filter, and it is on purpose.
- **Risk reversal, repeated.** "Or You Don't Pay" in the H1, "keep the training and take
  your money back" under the video, the full disclaimer at the bottom.
- **The proof ladder.** The origin story climbs $500 → $10,000 → $105,000 → $1M, then
  lands on feeling, not money: "Gave me my life back."
- **A soft aside in a different register.** "(love you mama)", "(love you again mom)",
  "(the traditional route)" — small, italic, grey. One human beat inside the numbers.
- **Specific dignity details.** "stop overthinking the price of groceries", "checking your
  bank account before buying gas", "missing your kid's game". Never "financial freedom".
- **Emoji, rarely.** 🏆 and 🫤. Two on the whole page.
- Reading level stays 5th-to-9th grade. Short words, short sentences.

**Do not:** write corporate filler, hedge a claim, use "unlock/leverage/elevate", stack
adjectives, or soften the exclusion column. Do not add a second Cormorant line.

**Two things on the live page worth a decision (not changed, Roy's call):**
- "You've been scammed before, **dont** let it happen again" — missing apostrophe.
- The page uses em dashes in two places ("$500 in their bank account — this is NOT for
  you", "— Lisa Dudley"), which conflicts with the standing no-em-dash rule in CLAUDE.md.

---

## 6. BUILD NOTES

- Tailwind is **compiled and inlined**, not the Play CDN. Adding a new Tailwind class
  requires rebuilding that CSS or it silently does nothing. See README.
- Fonts load from Google Fonts. The weight list in that URL is deliberate — changing it
  changes how Cormorant renders. Leave it alone.
- The founder photo is self-hosted (`roy.webp`) on purpose. Do not point it back at the
  LeadConnector CDN; that account is CCG-era and can disappear.
- Legal entity in the footer is **CLOSERS CONSULTING GROUP, LLC**, support email
  `support@certifiedclosers.net`.
- There is currently **no tracking pixel** on the page.
