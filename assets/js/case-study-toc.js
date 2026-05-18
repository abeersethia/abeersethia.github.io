/**
 * Case study page: document modals + sticky TOC (bootstrap-toc).
 */
$(function () {
  initCaseStudyDocuments();

  const $nav = $("#case-study-toc");
  const $scope = $(".case-study__body");
  if (!$nav.length || !$scope.length || typeof Toc === "undefined") return;

  Toc.init({
    $nav: $nav,
    $scope: $scope,
  });

  $("body").scrollspy({
    target: "#case-study-toc",
    offset: 120,
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

    const open = () => {
      if (dialog.open) return;
      dialog.showModal();
      const img = dialog.querySelector(".case-study-certificate__img");
      if (img && !img.complete) {
        img.addEventListener("load", () => dialog.focus(), { once: true });
      }
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
  });
}
