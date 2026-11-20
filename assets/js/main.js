(function () {
  "use strict";

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
  var money2 = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });
  var num = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  /* ---------- Animated counters (skipped for reduced motion) ---------- */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var prefix = el.getAttribute("data-prefix") || "";
    if (!isFinite(target)) return;
    if (reduceMotion) { el.textContent = prefix + num.format(target); return; }
    var start = null, duration = 1100;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + num.format(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var counters = $$("[data-count]");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { animateCount(e.target); obs.unobserve(e.target); }
      });
    }, { threshold: 0.4 });
    counters.forEach(function (c) { io.observe(c); });
  } else {
    counters.forEach(animateCount);
  }

  /* ---------- Measurement dashboard (illustrative data only) ---------- */
  // All figures are fictional demonstration data for a sample fashion brand.
  var SAMPLE = {
    "30": {
      label: "Compared with the prior 30 days",
      current:  { store: 50000,  email: 8000,  flows: 3200, campaigns: 4800, recipients: 240000, aov: 80, repeat: 22, unsub: 0.32 },
      baseline: { store: 47000,  email: 7100,  flows: 2900, campaigns: 4200, recipients: 236000, aov: 78, repeat: 20, unsub: 0.35 }
    },
    "90": {
      label: "Compared with the prior 90 days",
      current:  { store: 148000, email: 23500, flows: 9400, campaigns: 14100, recipients: 700000, aov: 80, repeat: 24, unsub: 0.30 },
      baseline: { store: 139000, email: 20600, flows: 8100, campaigns: 12500, recipients: 680000, aov: 77, repeat: 19, unsub: 0.36 }
    },
    "mom": {
      label: "Compared with the previous month",
      current:  { store: 50000,  email: 8000,  flows: 3200, campaigns: 4800, recipients: 240000, aov: 80, repeat: 22, unsub: 0.32 },
      baseline: { store: 46000,  email: 6400,  flows: 2600, campaigns: 3800, recipients: 230000, aov: 79, repeat: 20, unsub: 0.35 }
    }
  };

  var KPIS = [
    { name: "Total store revenue", hint: "All channels", key: "store", fmt: function (v) { return money.format(v); }, kind: "up" },
    { name: "Email-attributed revenue", hint: "Flows + campaigns", key: "email", fmt: function (v) { return money.format(v); }, kind: "up" },
    { name: "Email revenue share", hint: "Email ÷ store revenue", derive: function (d) { return d.email / d.store * 100; }, fmt: function (v) { return v.toFixed(1) + "%"; }, kind: "up" },
    { name: "Automated flow revenue", hint: "Welcome, cart, post-purchase, browse, winback", key: "flows", fmt: function (v) { return money.format(v); }, kind: "up" },
    { name: "Campaign revenue", hint: "Scheduled sends", key: "campaigns", fmt: function (v) { return money.format(v); }, kind: "up" },
    { name: "Revenue per recipient", hint: "Email revenue ÷ recipients emailed", derive: function (d) { return d.email / d.recipients; }, fmt: function (v) { return money2.format(v); }, kind: "up" },
    { name: "Email-attributed orders", hint: "Email revenue ÷ AOV", derive: function (d) { return d.email / d.aov; }, fmt: function (v) { return num.format(Math.round(v)); }, kind: "up" },
    { name: "Average order value", hint: "Email-attributed", key: "aov", fmt: function (v) { return money.format(v); }, kind: "up" },
    { name: "Repeat purchase rate", hint: "Customers buying again", key: "repeat", fmt: function (v) { return v + "%"; }, kind: "up" },
    { name: "Unsubscribe rate", hint: "Lower is better", key: "unsub", fmt: function (v) { return v.toFixed(2) + "%"; }, kind: "down" }
  ];

  function kpiValue(kpi, d) {
    return kpi.derive ? kpi.derive(d) : d[kpi.key];
  }

  function renderKpis(rangeKey) {
    var set = SAMPLE[rangeKey];
    if (!set) return;
    var tbody = $("#kpi-table tbody");
    tbody.innerHTML = "";
    KPIS.forEach(function (kpi) {
      var base = kpiValue(kpi, set.baseline);
      var cur = kpiValue(kpi, set.current);
      var diff = cur - base;
      var pct = base !== 0 ? (diff / base) * 100 : 0;
      var good = kpi.kind === "up" ? diff > 0 : diff < 0;
      var cls = Math.abs(diff) < 1e-9 ? "delta-flat" : (good ? "delta-up" : "delta-down");
      var sign = diff > 0 ? "+" : "";
      var deltaText = kpi.kind === "down"
        ? (sign + diff.toFixed(2) + " pts")
        : (sign + pct.toFixed(1) + "%");
      var tr = document.createElement("tr");
      tr.innerHTML =
        '<th scope="row" class="kpi-name">' + kpi.name + '<span class="kpi-hint">' + kpi.hint + '</span></th>' +
        '<td class="num">' + kpi.fmt(base) + '</td>' +
        '<td class="num">' + kpi.fmt(cur) + '</td>' +
        '<td class="num ' + cls + '">' + deltaText + '</td>';
      tbody.appendChild(tr);
    });
    $("#comparison-label").textContent = set.label + " · Illustrative data";
  }

  $$(".filter").forEach(function (btn) {
    btn.addEventListener("click", function () {
      $$(".filter").forEach(function (b) {
        b.classList.remove("is-active");
        b.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("is-active");
      btn.setAttribute("aria-pressed", "true");
      renderKpis(btn.getAttribute("data-range"));
    });
  });
  renderKpis("30");

  /* ---------- Revenue calculator ---------- */
  var form = $("#calc-form");
  if (form) {
    var storeIn = $("#calc-store"), emailIn = $("#calc-email"), aovIn = $("#calc-aov");
    var shareOut = $("#calc-share"), shareBig = $("#calc-share-out"), ordersOut = $("#calc-orders");
    var scenarioCells = $$("[data-s]");

    function readNum(el) {
      var v = parseFloat(el.value);
      return isFinite(v) && v >= 0 ? v : null;
    }

    function updateCalc() {
      var store = readNum(storeIn), email = readNum(emailIn), aov = readNum(aovIn);

      if (store && email !== null && store > 0) {
        var share = (email / store) * 100;
        shareOut.textContent = share.toFixed(1) + "% of store revenue";
        shareBig.textContent = share.toFixed(1) + "%";
      } else {
        shareOut.textContent = "Enter store and email revenue";
        shareBig.textContent = "—";
      }

      if (email !== null && aov && aov > 0) {
        ordersOut.textContent = num.format(Math.round(email / aov));
      } else {
        ordersOut.textContent = "—";
      }

      scenarioCells.forEach(function (cell) {
        var s = parseFloat(cell.getAttribute("data-s"));
        var f = cell.getAttribute("data-f");
        if (email === null) {
          cell.textContent = "—";
          return;
        }
        var monthly = email * (1 + s);
        var add = email * s;
        var yr = add * 12;
        if (f === "month") cell.textContent = money.format(monthly);
        if (f === "add") cell.textContent = "+" + money.format(add);
        if (f === "year") cell.textContent = "+" + money.format(yr);
      });
    }

    [storeIn, emailIn, aovIn].forEach(function (el) {
      el.addEventListener("input", updateCalc);
    });
    form.addEventListener("submit", function (e) { e.preventDefault(); });
    updateCalc();
  }

  /* ---------- Contact form ---------- */
  var contactForm = $("#contact-form");
  var statusEl = $("#form-status");

  function setStatus(msg, type) {
    statusEl.textContent = msg;
    statusEl.className = "form-status" + (type ? " is-" + type : "");
  }

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var endpoint = (window.CONVERTID_CONFIG && window.CONVERTID_CONFIG.formEndpoint) || "";

      // Basic validation for required fields
      var missing = $$("[required]", contactForm).filter(function (el) {
        return !el.value.trim();
      });
      if (missing.length) {
        missing[0].focus();
        setStatus("Please complete the required fields.", "error");
        return;
      }

      // Honeypot check
      var hp = contactForm.querySelector('[name="_gotcha"]');
      if (hp && hp.value) { setStatus("Thanks. Your enquiry has been received.", "success"); contactForm.reset(); return; }

      if (!endpoint) {
        setStatus(
          "The form is not connected to a submission service yet, so your enquiry has not been sent. " +
          "Please email support.convertid@gmail.com or book a call at calendly.com/anajumiati/30min.",
          "info"
        );
        return;
      }

      var data = new FormData(contactForm);
      data.delete("_gotcha");
      var btn = contactForm.querySelector('button[type="submit"]');
      btn.disabled = true;
      setStatus("Sending…", "info");

      fetch(endpoint, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" }
      }).then(function (res) {
        if (res.ok) {
          setStatus("Thank you. We've received your request and will reply to your work email.", "success");
          contactForm.reset();
        } else {
          setStatus("Something went wrong and your enquiry was not sent. Please email support.convertid@gmail.com.", "error");
        }
      }).catch(function () {
        setStatus("We couldn't reach the form service. Please email support.convertid@gmail.com.", "error");
      }).finally(function () {
        btn.disabled = false;
      });
    });
  }

  /* ---------- Subtle reveal on scroll ---------- */
  if ("IntersectionObserver" in window && !reduceMotion) {
    var targets = $$(".card, .service, .project, .tier, .faq details");
    targets.forEach(function (el) { el.classList.add("reveal"); });
    var rio = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-visible"); obs.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    targets.forEach(function (el) { rio.observe(el); });
  }
})();
