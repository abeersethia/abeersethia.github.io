/**
 * Client-side project grid filters (no page reload).
 * Cards use data-categories="slug-one slug-two" (see project front matter).
 * Deep links: /projects/#research
 */
(function () {
  const GRID_ID = "projects-grid";
  const TOOLBAR_SELECTOR = ".work-page .project-filters";
  const CARD_SELECTOR = "[data-categories], [data-category]";

  function getCardCategories(card) {
    const raw =
      card.getAttribute("data-categories") || card.getAttribute("data-category") || "";
    return raw.trim().split(/\s+/).filter(Boolean);
  }

  function cardMatchesFilter(categories, filter) {
    if (filter === "all") return true;
    return categories.includes(filter);
  }

  function applyProjectFilter(filter, buttons, cards) {
    buttons.forEach((b) => {
      b.classList.toggle("is-active", b.getAttribute("data-filter") === filter);
    });

    cards.forEach((card) => {
      const col = card.closest(".col");
      if (!col) return;
      const show = cardMatchesFilter(getCardCategories(card), filter);
      col.classList.toggle("is-filtered-out", !show);
    });
  }

  function setFilterHash(filter) {
    if (filter === "all") {
      history.replaceState(null, "", window.location.pathname + window.location.search);
      return;
    }
    history.replaceState(null, "", `#${encodeURIComponent(filter)}`);
  }

  function initProjectFilters() {
    const grid = document.getElementById(GRID_ID);
    if (!grid) return;

    const toolbar = document.querySelector(TOOLBAR_SELECTOR);
    const buttons = toolbar
      ? toolbar.querySelectorAll(".project-filters__btn")
      : document.querySelectorAll(".project-filters__btn");
    const cards = grid.querySelectorAll(CARD_SELECTOR);

    if (!buttons.length || !cards.length) return;

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const filter = btn.getAttribute("data-filter");
        applyProjectFilter(filter, buttons, cards);
        setFilterHash(filter);
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
