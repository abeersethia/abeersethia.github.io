/**
 * Client-side project grid filters (no page reload).
 */
(function () {
  function initProjectFilters() {
    const grid = document.getElementById("projects-grid");
    if (!grid) return;

    const buttons = document.querySelectorAll(".project-filters__btn");
    const cards = grid.querySelectorAll("[data-category]");

    if (!buttons.length || !cards.length) return;

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const filter = btn.getAttribute("data-filter");

        buttons.forEach((b) => b.classList.toggle("is-active", b === btn));

        cards.forEach((card) => {
          const col = card.closest(".col");
          if (!col) return;
          const category = card.getAttribute("data-category") || "";
          const show = filter === "all" || category === filter;
          col.classList.toggle("is-filtered-out", !show);
        });
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initProjectFilters);
  } else {
    initProjectFilters();
  }
})();
