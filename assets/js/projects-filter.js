/**
 * Client-side project grid filters (no page reload).
 * Supports deep links: /projects/#research
 */
(function () {
  function applyProjectFilter(filter, buttons, cards) {
    buttons.forEach((b) => {
      b.classList.toggle("is-active", b.getAttribute("data-filter") === filter);
    });

    cards.forEach((card) => {
      const col = card.closest(".col");
      if (!col) return;
      const category = card.getAttribute("data-category") || "";
      const show = filter === "all" || category === filter;
      col.classList.toggle("is-filtered-out", !show);
    });
  }

  function initProjectFilters() {
    const grid = document.getElementById("projects-grid");
    if (!grid) return;

    const buttons = document.querySelectorAll(".project-filters__btn");
    const cards = grid.querySelectorAll("[data-category]");

    if (!buttons.length || !cards.length) return;

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const filter = btn.getAttribute("data-filter");
        applyProjectFilter(filter, buttons, cards);
      });
    });

    const hash = window.location.hash.replace(/^#/, "");
    if (hash) {
      const match = Array.from(buttons).find((b) => b.getAttribute("data-filter") === hash);
      if (match) {
        applyProjectFilter(hash, buttons, cards);
      }
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initProjectFilters);
  } else {
    initProjectFilters();
  }
})();
