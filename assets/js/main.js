/* Mibusca v3 — interações premium, sem dependências */
(function () {
  "use strict";

  /* ── Scroll progress bar ───────────────────────────────────────── */
  var bar = document.getElementById("scroll-progress");
  if (bar) {
    window.addEventListener("scroll", function () {
      var s = document.documentElement;
      bar.style.width = ((s.scrollTop / (s.scrollHeight - s.clientHeight)) * 100) + "%";
    }, { passive: true });
  }

  /* ── Parallax blobs no hero ────────────────────────────────────── */
  var blobs = document.querySelectorAll(".hero__blob");
  if (blobs.length && window.matchMedia("(min-width:760px)").matches) {
    var ticking = false;
    window.addEventListener("scroll", function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          var y = window.scrollY * .18;
          blobs.forEach(function (b, i) {
            var dir = i % 2 === 0 ? 1 : -1;
            b.style.transform = "translateY(" + (y * dir * (i + 1) * .4) + "px)";
          });
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ── Mobile nav ────────────────────────────────────────────────── */
  var nav = document.querySelector(".nav");
  var toggle = document.querySelector(".nav__toggle");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.addEventListener("click", function (e) {
      if (nav.classList.contains("open") && !nav.contains(e.target)) {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ── FAQ accordion ─────────────────────────────────────────────── */
  document.querySelectorAll(".faq__item").forEach(function (item) {
    var q = item.querySelector(".faq__q");
    var a = item.querySelector(".faq__a");
    if (!q || !a) return;
    q.addEventListener("click", function () {
      var isOpen = item.classList.contains("open");
      document.querySelectorAll(".faq__item.open").forEach(function (o) {
        o.classList.remove("open");
        o.querySelector(".faq__q").setAttribute("aria-expanded", "false");
        o.querySelector(".faq__a").style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add("open");
        q.setAttribute("aria-expanded", "true");
        a.style.maxHeight = a.scrollHeight + "px";
      }
    });
  });

  /* ── Reveal on scroll ──────────────────────────────────────────── */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ── Stagger reveal children ───────────────────────────────────── */
  document.querySelectorAll(".grid.reveal-stagger").forEach(function (grid) {
    Array.from(grid.children).forEach(function (child, i) {
      child.style.transitionDelay = (i * 80) + "ms";
    });
  });

  /* ── Animated counters ─────────────────────────────────────────── */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var dec    = el.getAttribute("data-dec") === "1";
    var dur    = 1800, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = target * eased;
      el.textContent = dec ? val.toFixed(1) : Math.round(val).toLocaleString("pt-BR");
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window && counters.length) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { animateCount(e.target); co.unobserve(e.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { co.observe(el); });
  }

  /* ── Hero bars ─────────────────────────────────────────────────── */
  document.querySelectorAll(".bars span").forEach(function (s, i) {
    setTimeout(function () {
      s.style.setProperty("--h", s.getAttribute("data-h") + "%");
    }, 350 + i * 100);
  });

  /* ── Card tilt (desktop only) ──────────────────────────────────── */
  if (window.matchMedia("(min-width:980px) and (hover:hover)").matches) {
    document.querySelectorAll(".card, .plan, .quote").forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var rect = card.getBoundingClientRect();
        var cx = rect.left + rect.width  / 2;
        var cy = rect.top  + rect.height / 2;
        var dx = (e.clientX - cx) / (rect.width  / 2);
        var dy = (e.clientY - cy) / (rect.height / 2);
        card.style.transform = "translateY(-6px) rotateX(" + (-dy * 3) + "deg) rotateY(" + (dx * 3) + "deg)";
      });
      card.addEventListener("mouseleave", function () {
        card.style.transform = "";
      });
    });
  }

  /* ── Footer year ───────────────────────────────────────────────── */
  var yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();
})();
