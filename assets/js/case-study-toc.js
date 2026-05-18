/**
 * Sticky table of contents for case-study layout (bootstrap-toc).
 */
$(function () {
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
