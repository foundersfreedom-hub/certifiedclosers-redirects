# THE APPLICATION FORM — captured spec

Captured Aug 13 2026 from the live Fillout form **"MASTER BOOKINGS"** (`1qc2KvTNQfus`)
before replacing it with GoHighLevel. This is the record of what the form asked, so the
qualifying logic survives the migration.

Roy wrote these questions. **The wording is the asset — carry it over verbatim**,
including the choice labels with their dollar estimates.

---

## The 8 fields, in order

**1. Full Name** — short answer, required
**2. Phone number** — phone input, required
**3. Email** — email input, required

**4. What do you currently do for work - and how do you feel about it right now?**
Short answer, open text. This is the qualitative one that reveals pain on the call.

**5. Our clients average $10,000 per deal. How many do you need to close every month to quit your job and never look back?**
Multiple choice:
- Man I just need ONE a month (Est. Return $10,000)
- 2 Deals/mo (Est. Return $15-20K)
- 3 Deals/mo (Est. Return $25-35K)
- 4+ Deals/mo (Est. Return $50K+)

**6. What exactly do you want to achieve/learn in the next 99 days working 1on1 with Roy?**
Multiple choice:
- How to close my first $10-30k deal!
- Scale past 3-5 deals a month consistently
- Seeking a mentor I can trust, work with 1-on-1, and expedite the success of my business.
- Help escape my 9-5 & more time for my loved ones

**7. This call will walk you through how to add an extra $10k–$30k/mo in 99 days with a custom week-by-week business roadmap... The people who get results fastest are the ones who show up ready to move. Do you have $3K–$5K set aside to invest in your business right now?**
Multiple choice — **this is the money-qualifier**:
- Yes! - I have $3000+ ready to invest in my future today IF I believe I'll make it back within 30 days
- Honestly, I don't have the money to invest and cashflow is tight at the moment

**8. Calendly** — booking step, embedded at the end. Booking happens *after* qualifying.

---

## What the design is doing

- **Contact first, qualify second, book last.** Name/phone/email are captured on step one,
  so an abandoned application is still a lead you own.
- **Question 5 makes them do the math on themselves** before anyone asks for money.
- **Question 7 is the budget filter and it is written to be answerable honestly.** The "no"
  option gives them a dignified exit ("cashflow is tight") instead of forcing a lie. Keep
  that. It is what stops broke applicants from clogging the calendar, and it matches the
  page copy that says under $500 in the bank means this isn't for you.
- **Nothing asks for a credit card.** The form's only job is a booked, qualified call.

---

## Carrying this to GoHighLevel

When rebuilt in GHL, each answer needs somewhere to live:

| Field | GHL destination |
|---|---|
| Full Name | standard contact first/last name |
| Phone | standard contact phone |
| Email | standard contact email |
| Q4 current work | custom field, long text |
| Q5 deals needed | custom field, dropdown (keep labels verbatim) |
| Q6 99-day goal | custom field, dropdown (keep labels verbatim) |
| Q7 budget ready | custom field, dropdown — **drives routing** |
| Booking | GHL calendar, or keep Calendly |

Open decisions for Roy:
1. Keep Calendly for booking, or move to a GHL calendar so booking and CRM are one system?
2. Should a "no budget" answer still be allowed to book, or route to nurture instead?
3. Which pipeline and stage should a new application land in?

**Do not delete the Fillout form until GHL is live and tested** — it holds the historical
submissions.
