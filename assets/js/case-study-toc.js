/**
 * Case study page: document modals + sticky TOC (bootstrap-toc).
 */
const PDFJS_CDN = "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174";
const pdfRenderCache = new WeakMap();

$(function () {
  initCaseStudyDocuments();

  const $nav = $("#case-study-toc");
  const $scope = $(".case-study__body");
  if (!$nav.length || !$scope.length || typeof Toc === "undefined") return;

  // bootstrap-toc auto-inits nav[data-toggle="toc"] on the whole page; we init once on the article only.
  $nav.empty();
  Toc.init({
    $nav: $nav,
    $scope: $scope,
  });

  const getScrollOffset = () => {
    const header = document.querySelector(".portfolio-header");
    if (header) {
      return Math.ceil(header.getBoundingClientRect().bottom) + 12;
    }
    const nav = document.querySelector("body.portfolio-site .navbar");
    if (nav) {
      return Math.ceil(nav.getBoundingClientRect().bottom) + 12;
    }
    return 100;
  };

  $nav.on("click", "a.nav-link[href^='#']", function (event) {
    const id = this.getAttribute("href");
    if (!id || id === "#") return;
    const target = document.querySelector(id);
    if (!target) return;
    event.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - getScrollOffset();
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    if (history.replaceState) {
      history.replaceState(null, "", id);
    } else {
      window.location.hash = id;
    }
  });

  $("body").scrollspy({
    target: "#case-study-toc",
    offset: getScrollOffset(),
  });
});

function initCaseStudyDocuments() {
  document.querySelectorAll(".js-case-study-certificate-open").forEach((btn) => {
    const dialogId = btn.getAttribute("data-certificate-dialog");
    if (!dialogId) return;

    const dialog = document.getElementById(dialogId);
    if (!dialog || typeof dialog.showModal !== "function") return;

    const closeButtons = dialog.querySelectorAll(".js-case-study-certificate-close");
    const shell = dialog.querySelector(".case-study-certificate__shell");
    const pdfViewer = dialog.querySelector(".case-study-certificate__pdf-viewer");

    const open = () => {
      if (dialog.open) return;
      dialog.showModal();
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (pdfViewer) {
            renderCaseStudyPdf(pdfViewer);
          } else {
            const img = dialog.querySelector(".case-study-certificate__img");
            if (img && !img.complete) {
              img.addEventListener("load", () => dialog.focus(), { once: true });
            }
          }
          dialog.focus();
        });
      });
    };

    const close = () => {
      if (dialog.open) dialog.close();
    };

    btn.addEventListener("click", (event) => {
      event.preventDefault();
      open();
    });

    closeButtons.forEach((closeBtn) => {
      closeBtn.addEventListener("click", (event) => {
        event.preventDefault();
        close();
      });
    });

    if (shell) {
      shell.addEventListener("click", (event) => {
        event.stopPropagation();
      });
    }

    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) close();
    });

    dialog.addEventListener("cancel", (event) => {
      event.preventDefault();
      close();
    });

    if (pdfViewer) {
      const onResize = () => {
        if (!dialog.open) return;
        renderCaseStudyPdf(pdfViewer, { force: true });
      };
      window.addEventListener("resize", onResize);
    }
  });
}

function ensurePdfJs() {
  if (window.pdfjsLib) return Promise.resolve(window.pdfjsLib);

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `${PDFJS_CDN}/build/pdf.min.js`;
    script.async = true;
    script.onload = () => {
      if (!window.pdfjsLib) {
        reject(new Error("PDF.js failed to load"));
        return;
      }
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = `${PDFJS_CDN}/build/pdf.worker.min.js`;
      resolve(window.pdfjsLib);
    };
    script.onerror = () => reject(new Error("PDF.js failed to load"));
    document.head.appendChild(script);
  });
}

async function renderCaseStudyPdf(viewer, { force = false } = {}) {
  const pagesHost = viewer.querySelector(".case-study-certificate__pdf-pages");
  const url = viewer.dataset.src;
  if (!pagesHost || !url) return;

  const rect = viewer.getBoundingClientRect();
  const displayWidth = Math.max(rect.width - 8, 320);
  const outputScale = Math.min(window.devicePixelRatio || 1, 2.5);
  const cacheKey = `${displayWidth}@${outputScale}`;
  if (!force && pdfRenderCache.get(viewer) === cacheKey) return;

  pagesHost.innerHTML = '<p class="case-study-certificate__pdf-status">Loading preview…</p>';

  try {
    const pdfjsLib = await ensurePdfJs();
    const pdf = await pdfjsLib.getDocument({ url, disableWorker: true }).promise;
    pagesHost.innerHTML = "";
    const isMultiPage = pdf.numPages > 1;
    pagesHost.classList.toggle("case-study-certificate__pdf-pages--multi", isMultiPage);

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum += 1) {
      const page = await pdf.getPage(pageNum);
      const baseViewport = page.getViewport({ scale: 1 });
      const scale = displayWidth / baseViewport.width;
      const viewport = page.getViewport({ scale });
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d", { alpha: false });

      canvas.className = "case-study-certificate__pdf-page";
      canvas.width = Math.floor(viewport.width * outputScale);
      canvas.height = Math.floor(viewport.height * outputScale);
      canvas.style.width = "100%";
      canvas.style.height = "auto";
      canvas.setAttribute("role", "img");
      canvas.setAttribute("aria-label", `${viewer.dataset.title || "Document"} — page ${pageNum}`);

      const transform =
        outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null;

      await page.render({
        canvasContext: context,
        viewport,
        transform,
      }).promise;

      pagesHost.appendChild(canvas);
    }

    pdfRenderCache.set(viewer, cacheKey);
  } catch (err) {
    console.error("Case study PDF preview failed:", err);
    pagesHost.classList.remove("case-study-certificate__pdf-pages--multi");
    pagesHost.innerHTML = "";
    const fallback = document.createElement("iframe");
    fallback.className = "case-study-certificate__pdf-fallback";
    fallback.title = viewer.dataset.title || "PDF preview";
    fallback.src = `${url.split("#")[0]}#view=FitH`;
    pagesHost.appendChild(fallback);
  }
}
