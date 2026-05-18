/**
 * liquidGL initialisation — https://github.com/naughtyduk/liquidGL
 */
(function () {
  const lg = {"snapshot":"body","resolution":1.5,"refraction":0.015,"bevel_depth":0.08,"bevel_width":0.15,"frost":1.2,"shadow":true,"specular":true,"reveal":"fade","tilt":false};
  const enabled = true;

  if (!enabled) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.documentElement.classList.add("liquid-gl-ready");
    return;
  }

  function initLiquidGL() {
    if (typeof window.liquidGL !== "function" || typeof window.html2canvas !== "function") {
      console.warn("liquidGL: missing liquidGL.js or html2canvas");
      return;
    }

    const targets = document.querySelectorAll(".liquidGL");
    if (!targets.length) return;

    window.__portfolioLiquidGL__ = window.liquidGL({
      snapshot: lg.snapshot || "body",
      target: ".liquidGL",
      resolution: lg.resolution ?? 1.5,
      refraction: lg.refraction ?? 0.015,
      bevelDepth: lg.bevel_depth ?? 0.08,
      bevelWidth: lg.bevel_width ?? 0.15,
      frost: lg.frost ?? 1.2,
      shadow: lg.shadow !== false,
      specular: lg.specular !== false,
      reveal: lg.reveal || "fade",
      tilt: lg.tilt === true,
      tiltFactor: lg.tilt_factor ?? 5,
      magnify: lg.magnify ?? 1,
      on: {
        init() {
          document.documentElement.classList.add("liquid-gl-ready");
        },
      },
    });

    const renderer = window.__liquidGLRenderer__;
    if (renderer && typeof renderer.captureSnapshot === "function") {
      const refresh = () => {
        window.setTimeout(() => renderer.captureSnapshot(), 120);
      };
      const themeObserver = new MutationObserver(refresh);
      themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-theme"],
      });
      window.addEventListener("resize", refresh, { passive: true });
    }
  }

  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", initLiquidGL);
  } else {
    initLiquidGL();
  }
})();
