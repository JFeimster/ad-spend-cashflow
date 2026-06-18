/*
  Ad Spend Cash Flow Calculator Landing Page JS
  Lightweight enhancements only: mobile nav, sticky header state, reveal animations, CTA tracking hooks.
*/

(function () {
  "use strict";

  const header = document.querySelector("[data-sticky-header]");
  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector("#site-nav");
  const year = document.querySelector("#current-year");

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  function updateHeaderState() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }

  updateHeaderState();
  window.addEventListener("scroll", updateHeaderState, { passive: true });

  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      const isOpen = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    nav.addEventListener("click", function (event) {
      const target = event.target;
      if (!(target instanceof Element)) return;

      if (target.matches("a")) {
        nav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        nav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  const revealItems = Array.from(document.querySelectorAll(".reveal"));

  if ("IntersectionObserver" in window && revealItems.length) {
    const observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealItems.forEach(function (item) {
      observer.observe(item);
    });
  } else {
    revealItems.forEach(function (item) {
      item.classList.add("is-visible");
    });
  }

  /*
    CTA tracking hook.
    Replace console logging with your analytics provider, such as:
    gtag("event", "cta_click", { event_category: "landing_page", event_label: label });
  */
  document.addEventListener("click", function (event) {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const tracked = target.closest("[data-track]");
    if (!tracked) return;

    const label = tracked.getAttribute("data-track") || "unknown_cta";

    if (typeof window.gtag === "function") {
      window.gtag("event", "cta_click", {
        event_category: "landing_page",
        event_label: label
      });
    } else {
      console.info("[CTA click]", label);
    }
  });
})();
