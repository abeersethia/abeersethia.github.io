module.exports = {
  content: ["_site/**/*.html", "_site/**/*.js"],
  css: ["_site/assets/css/*.css"],
  output: "_site/assets/css/",
  skippedContentGlobs: ["_site/assets/**/*.html"],
  // Classes toggled only in JS (filters) or on <details open> must survive deploy purge.
  safelist: {
    standard: ["container", "is-active", "is-filtered-out"],
    greedy: [/^journey-/, /^project-filters/, /^portfolio-site/],
  },
};
