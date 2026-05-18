/**
 * Portfolio CRO interactions: copy email, scroll reveals.
 */
(function () {
  function initCopyEmail() {
    document.querySelectorAll(".js-copy-email").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const email = btn.getAttribute("data-email");
        if (!email) return;

        const original = btn.textContent;
        try {
          await navigator.clipboard.writeText(email);
          btn.textContent = "Copied!";
          btn.classList.add("is-copied");
        } catch (err) {
          btn.textContent = "Copy failed";
        }

        window.setTimeout(() => {
          btn.textContent = original;
          btn.classList.remove("is-copied");
        }, 2000);
      });
    });
  }

  /** Lazy hover-loop preview on project cards (desktop / fine pointer only). */
  function initProjectCardHoverVideo() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(hover: none)").matches) return;

    document.querySelectorAll(".project-card__media--has-hover").forEach((link) => {
      const vid = link.querySelector(".project-card__hover-video");
      if (!vid) return;

      function ensureSources() {
        if (vid.dataset.mediaReady === "1") return;
        const webm = vid.getAttribute("data-webm");
        const mp4 = vid.getAttribute("data-src");
        if (webm) {
          const s = document.createElement("source");
          s.src = webm;
          s.type = "video/webm";
          vid.appendChild(s);
        }
        if (mp4) {
          const s = document.createElement("source");
          s.src = mp4;
          s.type = "video/mp4";
          vid.appendChild(s);
        }
        vid.dataset.mediaReady = "1";
        vid.load();
      }

      function playPreview() {
        ensureSources();
        link.classList.add("is-hover-preview");
        const p = vid.play();
        if (p && typeof p.catch === "function") p.catch(() => {});
      }

      function stopPreview() {
        link.classList.remove("is-hover-preview");
        vid.pause();
        try {
          vid.currentTime = 0;
        } catch (e) {
          /* ignore */
        }
      }

      link.addEventListener("mouseenter", playPreview);
      link.addEventListener("mouseleave", stopPreview);
      link.addEventListener("focusin", playPreview);
      link.addEventListener("focusout", stopPreview);
    });
  }

  function initScrollReveal() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const items = document.querySelectorAll(".portfolio-reveal");
    if (!items.length || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    items.forEach((el) => observer.observe(el));
  }

  function init() {
    initCopyEmail();
    initProjectCardHoverVideo();
    initScrollReveal();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
