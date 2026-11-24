/*
  Scroll reveals + FAQ accordion motion, built with GSAP + ScrollTrigger.
  Progressive enhancement: if GSAP fails to load (CDN blocked, offline),
  this file no-ops and every element stays at its normal, fully visible
  CSS state — nothing is ever hidden by CSS alone.
*/
(function () {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: "power2.out" });

  var mm = gsap.matchMedia();

  mm.add(
    {
      reduceMotion: "(prefers-reduced-motion: reduce)",
      fullMotion: "(prefers-reduced-motion: no-preference)"
    },
    function (context) {
      if (context.conditions.reduceMotion) {
        // Respect reduced motion: no scroll reveals, instant FAQ toggle only.
        return;
      }

      // ---- Hero entrance (plays once, on load, not scroll-linked) ----
      var heroEls = gsap.utils.toArray(
        ".hero-eyebrow, .hero h1, .hero .lead, .hero-actions, .trust-badges"
      );
      if (heroEls.length) {
        gsap.set(heroEls, { opacity: 0, y: 16 });
        gsap.to(heroEls, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.08,
          delay: 0.1
        });
      }

      // ---- Narrative card groups: reveal with a short stagger ----
      var staggerGroups = [".problem-card", ".reason-row", ".service-row", ".process-step", ".faq-item"];
      staggerGroups.forEach(function (selector) {
        var els = gsap.utils.toArray(selector);
        if (!els.length) return;
        gsap.set(els, { opacity: 0, y: 20 });
        ScrollTrigger.batch(els, {
          start: "top 85%",
          once: true,
          onEnter: function (batch) {
            gsap.to(batch, { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, overwrite: true });
          }
        });
      });

      // ---- Single blocks: one fade-up per element, no inner stagger ----
      var singleSelectors = [
        ".section-head",
        ".photo-banner",
        ".concept-visual",
        ".concept > .wrap > div:first-child",
        ".profile",
        ".area-badges",
        ".badge-circle-grid",
        ".cta-band h2",
        ".cta-band p"
      ];
      singleSelectors.forEach(function (selector) {
        gsap.utils.toArray(selector).forEach(function (el) {
          gsap.set(el, { opacity: 0, y: 20 });
          ScrollTrigger.create({
            trigger: el,
            start: "top 88%",
            once: true,
            onEnter: function () {
              gsap.to(el, { opacity: 1, y: 0, duration: 0.6 });
            }
          });
        });
      });

      // ---- Photo banner: subtle parallax drift while scrolling past ----
      gsap.utils.toArray(".photo-banner img").forEach(function (img) {
        gsap.fromTo(
          img,
          { yPercent: -6 },
          {
            yPercent: 6,
            ease: "none",
            scrollTrigger: {
              trigger: img.closest(".photo-banner"),
              start: "top bottom",
              end: "bottom top",
              scrub: true
            }
          }
        );
      });

      return function () {
        // matchMedia revert handles teardown; nothing extra to clean up.
      };
    }
  );

  // ---- FAQ accordion: smooth height+opacity instead of the native snap ----
  // Runs regardless of reduced-motion (height still animates, just without
  // y/opacity reveal above); reduced-motion users get a faster, simpler open.
  document.querySelectorAll(".faq-item").forEach(function (details) {
    var summary = details.querySelector("summary");
    var panel = details.querySelector("p");
    if (!summary || !panel) return;

    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.set(panel, { height: details.open ? "auto" : 0 });

    summary.addEventListener("click", function (e) {
      e.preventDefault();
      if (gsap.isTweening(panel)) return;

      if (details.open) {
        gsap.to(panel, {
          height: 0,
          opacity: 0,
          duration: reduceMotion ? 0.12 : 0.25,
          ease: "power2.inOut",
          onComplete: function () {
            details.open = false;
          }
        });
      } else {
        details.open = true;
        gsap.fromTo(
          panel,
          { height: 0, opacity: 0 },
          { height: "auto", opacity: 1, duration: reduceMotion ? 0.12 : 0.3, ease: "power2.out" }
        );
      }
    });
  });

  window.addEventListener("load", function () {
    ScrollTrigger.refresh();
  });
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () {
      ScrollTrigger.refresh();
    });
  }
})();
