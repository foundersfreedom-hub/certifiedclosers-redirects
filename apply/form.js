/* ===========================================================================
   CERTIFIED CLOSERS APPLICATION
   One source of truth. Renders into any element with id="cc-apply".
   Used by /apply/ (standalone) and by the sales page (embedded).

   Usage:
     <link rel="stylesheet" href="/apply/form.css">
     <div id="cc-apply" data-mode="embedded"></div>
     <script src="/apply/form.js" defer></script>

   Rebuild of the Fillout form "MASTER BOOKINGS" (1qc2KvTNQfus). Questions and
   options are word for word from it. Routing matches its branching.
   =========================================================================== */
(function () {
"use strict";

// Bump this whenever this file changes, and bump the ?v= on the <script>/<link>
// tags to match. If the form ever misbehaves, open the console: this tells you
// straight away whether the browser is running the current file or a stale one.
var VERSION = "2026-08-14h";
window.CC_APPLY_VERSION = VERSION;
console.log("[apply] form " + VERSION);

/* ------------------------------- CONFIG -------------------------------
   The only block you need to touch.
---------------------------------------------------------------------- */
var CONFIG = {
  // $30k/m Roadmap Call - 60 min, Zoom, active. (Roy's link, Aug 13 2026.)
  calendly: "https://calendly.com/closersconsultinggroup/30k-m-roadmap-call?hide_event_type_details=1&hide_gdpr_banner=1",

  // ---- WHAT CARRIES OVER INTO CALENDLY -------------------------------
  // Name and email always carry. They are Calendly's built-in invitee fields.
  //
  // Everything else (phone, what they do for work, their answers) can ONLY be
  // prefilled if that question EXISTS on the Calendly event. The Roadmap Call
  // has zero custom questions today, so there is nowhere to put them.
  //
  // To carry the rest: Calendly > the event > Invitee Questions > add them in
  // THIS order, then flip customQuestions to true. The keys are positional.
  customQuestions: false,
  questionMap: { a1: "phone", a2: "work", a3: "deals", a4: "goal" },

  // Until then the answers ride along as UTM fields, which Calendly stores on
  // the booking and forwards to Zapier/webhooks.
  passAnswersAsUtm: true,

  // Where applications get posted. This is what puts the lead into GoHighLevel
  // and fires the Discord alert. An empty string means NOTHING IS SENT and the
  // answers only reach the browser console, which is what silently swallowed
  // every test lead before 2026-08-14.
  //
  // Local dev talks to the intake running on your machine (node server.js in
  // sidequests/software/certifiedclosers-leads). Production talks to the same
  // service deployed on Railway, project "certifiedclosers-leads".
  submitUrl: (location.hostname === "localhost" || location.hostname === "127.0.0.1")
    ? "http://127.0.0.1:5959/apply"
    : "https://intake-production-9ca0.up.railway.app/apply",

  // Where someone lands the instant Calendly confirms the booking. Set to ""
  // to keep them here and show the in-page "you're booked" view instead.
  bookedRedirect: "/booking-confirmation/",

  // Where someone lands when they say they don't have the capital. Not a dead
  // end: it hands them the free training and tells them to come back. Set to ""
  // to keep them here and show the in-page DQ ending instead.
  dqRedirect: "/free-training/",

  // Which capital answer sends someone to the calendar.
  // Only two answers exist now, so "mt" is no longer reachable from the form.
  // It stays as the fallback for an unexpected value (see the submit handler):
  // an unknown answer should neither take a calendar slot nor reject a real
  // buyer, and "we'll reach out" is the only outcome that does neither.
  routes: { ready: "schedule", none: "dq" },

  freeCourse: "https://www.youtube.com/watch?v=JxQc1_Fo9AE"
};

/* ------------------------------ QUESTIONS ------------------------------ */
var DEALS = [
  "Man I just need ONE a month (Est. Return $10,000)",
  "2 Deals/mo (Est. Return $15-20K)",
  "3 Deals/mo (Est. Return $25-35K)",
  "4+ Deals/mo (Est. Return $50K+)"
];
var GOALS = [
  "How to close my first $10-30k deal!",
  "Scale past 3-5 deals a month consistently",
  "Seeking a mentor I can trust, work with 1-on-1, and expedite the success of my business.",
  "Help escape my 9-5 &amp; more time for my loved ones"
];
// The middle "Ugh - my capital is limited ($1K-$3K)" option was removed
// 2026-08-14 on Roy's call. This question is now a straight yes or no.
var CAPITAL = [
  ["ready", "Yes! - I have $3000+ ready to invest in my future today IF I believe I&rsquo;ll make it back within 30 days"],
  ["none", "Honestly, I don't have the money to invest and cashflow is tight at the moment"]
];

var CHECK_SVG = '<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
var WARN_SVG = '<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v5"/><path d="M12 16h.01"/></svg>';

function opts(name, list) {
  return '<div class="cc-opts" role="radiogroup">' +
    list.map(function (o) {
      var val = Array.isArray(o) ? o[0] : o;
      var label = Array.isArray(o) ? o[1] : o;
      return '<label class="cc-opt"><input type="radio" name="' + name + '" value="' +
        val.replace(/"/g, "&quot;") + '"><span class="cc-mark"></span>' +
        '<span class="cc-opt-text">' + label + "</span></label>";
    }).join("") + "</div>";
}

function step(id, n, label) {
  return '<div class="cc-step" data-step="' + id + '">' +
    '<span class="cc-dot"><span class="cc-num">' + n + "</span>" + CHECK_SVG + "</span>" +
    '<span class="cc-step-label">' + label + "</span></div>";
}

function markup() {
  return (
  '<div class="cc-shell">' +
    '<div class="cc-card">' +

      '<div class="cc-steps">' +
        step("apply", 1, "Apply") +
        step("schedule", 2, "Schedule") +
        step("complete", 3, "Complete") +
      "</div>" +

      '<div class="cc-body">' +

        '<form id="cc-view-apply" novalidate>' +
          '<div class="cc-field" data-name="name">' +
            '<label class="cc-q" for="cc-name">Full Name<span class="cc-req">*</span></label>' +
            '<input type="text" id="cc-name" name="name" autocomplete="name" placeholder="First and last name">' +
            '<div class="cc-err">Put your name in first.</div>' +
          "</div>" +

          '<div class="cc-field" data-name="phone">' +
            '<label class="cc-q" for="cc-phone">Phone number<span class="cc-req">*</span></label>' +
            '<div class="cc-phone" id="cc-phone-wrap"><span class="cc-cc">&#127482;&#127480; +1</span>' +
            '<input type="tel" id="cc-phone" name="phone" autocomplete="tel" inputmode="tel" placeholder="(555) 123-4567"></div>' +
            '<div class="cc-err">We need a real phone number so we can call you.</div>' +
          "</div>" +

          '<div class="cc-field" data-name="email">' +
            '<label class="cc-q" for="cc-email">Email<span class="cc-req">*</span></label>' +
            '<div class="cc-with-icon"><span class="cc-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg></span>' +
            '<input type="email" id="cc-email" name="email" autocomplete="email" inputmode="email" placeholder="you@email.com"></div>' +
            '<div class="cc-err">That email doesn\'t look right. Check it again.</div>' +
          "</div>" +

          '<hr class="cc-rule">' +

          '<div class="cc-field" data-name="work">' +
            '<label class="cc-q" for="cc-work"><strong>What do you currently do for work</strong> - and how do you feel about it right now?<span class="cc-req">*</span></label>' +
            '<textarea id="cc-work" name="work" rows="2" placeholder="Tell me straight."></textarea>' +
            '<div class="cc-err">Give me a sentence on this one.</div>' +
          "</div>" +

          '<hr class="cc-rule">' +

          '<div class="cc-field" data-name="deals">' +
            '<div class="cc-q"><span class="cc-lede">Our clients average <strong>$10,000 <em>per deal.</em></strong></span>' +
            'How many do you need to close every month to <strong>quit your job and never look back?</strong><span class="cc-req">*</span></div>' +
            opts("deals", DEALS) +
            '<div class="cc-err">Pick one so I know what you\'re aiming at.</div>' +
          "</div>" +

          '<hr class="cc-rule">' +

          '<div class="cc-field" data-name="goal">' +
            '<div class="cc-q">What exactly do you want to achieve/learn <strong>in the next 99 days working 1on1 with Roy?</strong><span class="cc-req">*</span></div>' +
            opts("goal", GOALS) +
            '<div class="cc-err">Pick the one that sounds most like you.</div>' +
          "</div>" +

          '<hr class="cc-rule">' +

          '<div class="cc-field" data-name="capital">' +
            '<div class="cc-q"><span class="cc-lede">This call will walk you through how to add an extra <strong>$10k&ndash;$30k/mo in 99 days with a custom week-by-week business roadmap...</strong></span>' +
            'The <strong>people who get results fastest are</strong> the ones who show up ready to move. Do you have $3K&ndash;$5K set aside to invest in your business right now?<span class="cc-req">*</span></div>' +
            opts("capital", CAPITAL) +
            '<div class="cc-err">Pick the honest one. It decides what happens next.</div>' +
          "</div>" +

          '<div class="cc-actions">' +
            '<button type="submit" class="cc-btn" id="cc-submit">Submit &rarr;</button>' +
          "</div>" +
        "</form>" +

        '<section id="cc-view-schedule" hidden>' +
          '<div class="cc-head">' +
          "<h2>Pick your time</h2>" +
          "<p>Grab the first slot that works. Show up on time and come ready with questions.</p></div>" +
          // Do NOT put Calendly's own "calendly-inline-widget" class on this.
          // Their widget.js auto-scans for that class on load and reads
          // data-url off it; with no data-url it throws on null.split(), which
          // kills window.Calendly and takes the whole calendar down. We mount
          // it ourselves via initInlineWidget and size it in form.css.
          '<div id="cc-cal"></div>' +
        "</section>" +

        '<section id="cc-view-complete" hidden>' +
          '<div class="cc-end" data-end="booked" hidden>' +
            '<div class="cc-ring is-ok">' + CHECK_SVG + "</div>" +
            "<h2>You're on the calendar</h2>" +
            "<p>Check your email for the invite. Put it in your phone right now so you don't miss it.</p>" +
            "<p><strong>Do this before the call:</strong> write down the number you need to make every month and why it matters. We start there.</p>" +
          "</div>" +
          // Not reachable from the form since the middle capital answer was
          // removed. Kept as the safe landing for an unexpected value.
          '<div class="cc-end" data-end="mt" hidden>' +
            '<div class="cc-ring is-warn">' + WARN_SVG + "</div>" +
            "<h2>Got it. We'll reach out.</h2>" +
            "<p>Thanks for the honest answer. That's the right one to give.</p>" +
            "<p>We'll look at your application and text you if there's a fit. In the meantime, start with the free training so you're not standing still.</p>" +
            '<a class="cc-link" href="' + CONFIG.freeCourse + '" target="_blank" rel="noopener">Watch the free course</a>' +
          "</div>" +
          '<div class="cc-end" data-end="dq" hidden>' +
            '<div class="cc-ring is-warn">' + WARN_SVG + "</div>" +
            "<h2>Not right now, and that's fine</h2>" +
            "<p>You told the truth about money being tight, so I'll tell you the truth back. Paying for coaching before you can cover your bills is how people get hurt.</p>" +
            "<p>Go watch the free course. It's the same thing I teach, it costs nothing, and people close deals off it. When money isn't tight, come back.</p>" +
            '<a class="cc-link" href="' + CONFIG.freeCourse + '" target="_blank" rel="noopener">Watch the free course</a>' +
          "</div>" +
        "</section>" +

      "</div>" +
    "</div>" +
  "</div>");
}

/* ------------------------------- BOOT ------------------------------- */
var root = document.getElementById("cc-apply");
if (!root) return;
root.classList.add("cc");
if (!root.dataset.mode) root.dataset.mode = "standalone";
root.innerHTML = markup();

var EMBEDDED = root.dataset.mode === "embedded";
var $ = function (s) { return root.querySelector(s); };
var $$ = function (s) { return Array.prototype.slice.call(root.querySelectorAll(s)); };
var FIELDS = ["name", "phone", "email", "work", "deals", "goal", "capital"];
var STORE = "cc_apply_v1";

/* ------------------------------ stepper ------------------------------ */
// skipSchedule = they never booked (MT/DQ), so Schedule must NOT show a green
// check. Claiming a step they skipped is a lie the user can see.
// The rail between dots is a ::after on each step, so marking a step "done"
// also fills the rail running from it to the next one. Nothing else to set.
function setStep(n, skipSchedule) {
  [["apply", 1], ["schedule", 2], ["complete", 3]].forEach(function (p) {
    var el = $('[data-step="' + p[0] + '"]');
    var skipped = skipSchedule && p[1] === 2;
    el.classList.toggle("is-active", p[1] === n && !skipped);
    el.classList.toggle("is-done", p[1] < n && !skipped);
  });
  scrollToTop();
}

// Standalone owns the window. Embedded must not yank the page around, so it
// only scrolls if the form's top has gone off screen.
function scrollToTop() {
  if (!EMBEDDED) { window.scrollTo({ top: 0, behavior: "smooth" }); return; }
  var top = root.getBoundingClientRect().top;
  if (top < 0) window.scrollTo({ top: top + window.scrollY - 20, behavior: "smooth" });
}

function show(id) {
  ["cc-view-apply", "cc-view-schedule", "cc-view-complete"].forEach(function (v) {
    $("#" + v).hidden = (v !== id);
  });
}

/* --------------------------- values + state --------------------------- */
function valueOf(name) {
  var r = root.querySelector('input[name="' + name + '"]:checked');
  if (r) return r.value;
  var el = root.querySelector('[name="' + name + '"]');
  return el && el.type !== "radio" ? el.value.trim() : "";
}
function collect() {
  var o = {};
  FIELDS.forEach(function (n) { o[n] = valueOf(n); });
  return o;
}
function save() { try { localStorage.setItem(STORE, JSON.stringify(collect())); } catch (e) {} }
function restore() {
  var raw; try { raw = localStorage.getItem(STORE); } catch (e) { return; }
  if (!raw) return;
  var d; try { d = JSON.parse(raw); } catch (e) { return; }
  FIELDS.forEach(function (n) {
    if (!d[n]) return;
    var radios = $$('input[name="' + n + '"]');
    if (radios.length && radios[0].type === "radio") {
      radios.forEach(function (r) {
        if (r.value === d[n]) { r.checked = true; r.closest(".cc-opt").classList.add("is-sel"); }
      });
    } else {
      var el = root.querySelector('[name="' + n + '"]');
      if (el) el.value = d[n];
    }
  });
}

/* ---------------------------- interactions ---------------------------- */
$$(".cc-opt input").forEach(function (input) {
  input.addEventListener("change", function () {
    $$('input[name="' + input.name + '"]').forEach(function (sib) {
      sib.closest(".cc-opt").classList.toggle("is-sel", sib.checked);
    });
    input.closest(".cc-field").classList.remove("is-bad");
    save();
  });
});

var phone = $("#cc-phone"), phoneWrap = $("#cc-phone-wrap");
phone.addEventListener("focus", function () { phoneWrap.classList.add("is-focus"); });
phone.addEventListener("blur", function () { phoneWrap.classList.remove("is-focus"); });
phone.addEventListener("input", function () {
  var d = phone.value.replace(/\D/g, "").slice(0, 10);
  phone.value = d.length > 6 ? "(" + d.slice(0, 3) + ") " + d.slice(3, 6) + "-" + d.slice(6)
    : d.length > 3 ? "(" + d.slice(0, 3) + ") " + d.slice(3)
    : d.length ? "(" + d : "";
  phone.closest(".cc-field").classList.remove("is-bad");
});

function check(name) {
  var field = root.querySelector('.cc-field[data-name="' + name + '"]');
  var v = valueOf(name), ok;
  if (name === "email") ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  else if (name === "phone") ok = v.replace(/\D/g, "").length === 10;
  else ok = v.length > 0;
  field.classList.toggle("is-bad", !ok);
  return ok;
}

["name", "phone", "email", "work"].forEach(function (n) {
  var el = root.querySelector('[name="' + n + '"]');
  el.addEventListener("blur", function () { if (valueOf(n)) check(n); });
  el.addEventListener("input", function () { el.closest(".cc-field").classList.remove("is-bad"); save(); });
});

restore();

/* ------------------------------ calendly ------------------------------ */
function loadCalendlyScript() {
  return new Promise(function (resolve, reject) {
    if (window.Calendly) return resolve();
    var s = document.createElement("script");
    s.src = "https://assets.calendly.com/assets/external/widget.js";
    s.async = true;
    s.onload = resolve;
    s.onerror = function () { reject(new Error("Calendly script blocked")); };
    document.head.appendChild(s);
  });
}

function prefillFor(data) {
  var parts = (data.name || "").trim().split(/\s+/);
  var digits = (data.phone || "").replace(/\D/g, "");
  var pre = {
    name: data.name || "",
    firstName: parts[0] || "",
    lastName: parts.slice(1).join(" ") || "",
    email: data.email || ""
  };
  // Calendly's documented field for the "Send text messages to" box.
  // TESTED 2026-08-13 and it does NOT fill on this event; the box stays a bare
  // "+1". Also tried sms_reminder_number / phone_number / text_reminder_number
  // as URL params, none took. Kept because it costs nothing and should start
  // working if text reminders get switched on. Do not count on it. To really
  // capture the phone, add a "Phone number" invitee question (see CONFIG).
  if (digits.length === 10) pre.smsReminderNumber = "+1" + digits;

  if (CONFIG.customQuestions) {
    pre.customAnswers = {};
    Object.keys(CONFIG.questionMap).forEach(function (slot) {
      var v = data[CONFIG.questionMap[slot]];
      if (v) pre.customAnswers[slot] = String(v);
    });
  }
  return pre;
}

function utmFor(data) {
  if (!CONFIG.passAnswersAsUtm) return undefined;
  return {
    utmSource: "certifiedclosers.net",
    utmMedium: "application",
    utmCampaign: data.capital || "",
    utmContent: data.deals || "",
    utmTerm: data.phone || ""
  };
}

function mountCalendar(data) {
  var mount = $("#cc-cal");
  if (mount.dataset.done) return;
  mount.dataset.done = "1";
  loadCalendlyScript().then(function () {
    window.Calendly.initInlineWidget({
      url: CONFIG.calendly,
      parentElement: mount,
      prefill: prefillFor(data),
      utm: utmFor(data)
    });
  }).catch(function () {
    // Never strand someone who is ready to book.
    mount.innerHTML = '<p style="text-align:center;color:#5b6169;font-size:17px;line-height:1.6">' +
      "The calendar didn't load. Book here instead:<br>" +
      '<a class="cc-link" href="' + CONFIG.calendly + '" target="_blank" rel="noopener">Open the calendar</a></p>';
  });
}

// Only Calendly gets to say a booking happened. Without the origin check any
// page or frame could post this and fake the confirmation screen.
window.addEventListener("message", function (e) {
  if (e.origin !== "https://calendly.com") return;
  if (!e.data || typeof e.data.event !== "string") return;

  if (e.data.event === "calendly.event_scheduled") {
    // The application was already posted before the calendar appeared, so there
    // is nothing left to save here. replace() rather than assign() so Back does
    // not drop them onto a calendar they have already used.
    if (CONFIG.bookedRedirect) location.replace(CONFIG.bookedRedirect);
    else finish("booked");
    return;
  }

  // Calendly reports how tall its content is, and it changes a lot through the
  // flow: ~600px for the calendar, ~765px once time slots open, up to ~990px on
  // the booking form. A fixed height leaves dead space at the start and clips at
  // the end, so track it. It also emits junk values ("26px", "2px") before the
  // real content loads, hence the floor.
  if (e.data.event === "calendly.page_height") {
    var h = parseInt((e.data.payload || {}).height, 10);
    if (h >= 300) $("#cc-cal").style.height = h + "px";
  }
});

/* ------------------------------- routing ------------------------------- */
function finish(route) {
  show("cc-view-complete");
  setStep(3, route !== "booked");
  $$("[data-end]").forEach(function (el) {
    el.hidden = el.dataset.end !== route;
  });
  try { localStorage.removeItem(STORE); } catch (e) {}
}

// Radio values are short codes ("ready"), but the CRM note has to read the way
// the question was actually answered. Turn a code back into its label, and undo
// the HTML entities the labels are written with.
function labelFor(list, val) {
  for (var i = 0; i < list.length; i++) {
    var o = list[i];
    var code = Array.isArray(o) ? o[0] : o;
    if (code !== val) continue;
    var d = document.createElement("textarea");
    d.innerHTML = Array.isArray(o) ? o[1] : o;
    return d.value;
  }
  return val || "";
}

function post(data, route) {
  var payload = Object.assign({}, data, {
    route: route,
    submittedAt: new Date().toISOString(),
    pageUrl: location.href,
    // Spelled out, because this is what gets written into the GoHighLevel note.
    answers: {
      work: data.work,
      deals: labelFor(DEALS, data.deals),
      goal: labelFor(GOALS, data.goal),
      capital: labelFor(CAPITAL, data.capital)
    }
  });
  if (!CONFIG.submitUrl) {
    console.log("[apply] no submitUrl set, nothing sent. Payload was:", payload);
    return Promise.resolve();
  }
  return fetch(CONFIG.submitUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  }).catch(function (err) { console.error("[apply] send failed", err); });
}

$("#cc-view-apply").addEventListener("submit", function (e) {
  e.preventDefault();
  var firstBad = null;
  FIELDS.forEach(function (n) { if (!check(n) && !firstBad) firstBad = n; });
  if (firstBad) {
    var el = root.querySelector('.cc-field[data-name="' + firstBad + '"]');
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    // Focus now, not on a timer. preventScroll keeps it from fighting the
    // smooth scroll, and doing it immediately means a deferred focus can never
    // land later and steal keystrokes from someone who already started typing.
    var f = el.querySelector("input:not([type=radio]), textarea, input[type=radio]");
    if (f) f.focus({ preventScroll: true });
    return;
  }
  var data = collect();
  var route = CONFIG.routes[data.capital] || "mt";
  var btn = $("#cc-submit");
  btn.disabled = true;
  btn.textContent = "Sending...";
  post(data, route).then(function () {
    if (route === "schedule") {
      show("cc-view-schedule");
      setStep(2);
      mountCalendar(data);
    } else if (route === "dq" && CONFIG.dqRedirect) {
      // post() has already resolved, so the lead is safely in the CRM before we
      // send them away. replace() so Back cannot return them to a spent form.
      try { localStorage.removeItem(STORE); } catch (e) {}
      location.replace(CONFIG.dqRedirect);
      return;
    } else {
      finish(route);
    }
    btn.disabled = false;
    btn.innerHTML = "Submit &rarr;";
  });
});

setStep(1);
})();
