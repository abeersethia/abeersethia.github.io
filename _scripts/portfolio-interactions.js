---
permalink: /assets/js/portfolio-interactions.js
---
/**
 * Minimal portfolio interactions — copy email only.
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
          btn.textContent = "Copied";
          btn.classList.add("is-copied");
        } catch (err) {
          btn.textContent = "Failed";
        }

        window.setTimeout(() => {
          btn.textContent = original;
          btn.classList.remove("is-copied");
        }, 2000);
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCopyEmail);
  } else {
    initCopyEmail();
  }
})();
