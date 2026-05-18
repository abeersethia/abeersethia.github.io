---
permalink: /assets/js/journey-filter.js
---
/**
 * Client-side journey timeline filters (education / industry / research).
 */
(function () {
  function initJourneyFilters() {
    const timeline = document.getElementById("journey-timeline");
    if (!timeline) return;

    const buttons = document.querySelectorAll("[data-journey-filter]");
    const entries = timeline.querySelectorAll(".journey-entry--root[data-category]");

    if (!buttons.length || !entries.length) return;

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const filter = btn.getAttribute("data-journey-filter");

        buttons.forEach((b) => b.classList.toggle("is-active", b === btn));

        entries.forEach((entry) => {
          const category = entry.getAttribute("data-category") || "";
          const show = filter === "all" || category === filter;
          entry.classList.toggle("is-filtered-out", !show);
        });
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initJourneyFilters);
  } else {
    initJourneyFilters();
  }
})();
