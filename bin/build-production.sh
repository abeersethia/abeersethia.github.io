#!/usr/bin/env bash
# Mirrors .github/workflows/deploy.yml build steps for local parity with github.io.
set -euo pipefail
cd "$(dirname "$0")/.."

export JEKYLL_ENV=production

echo "Building site (JEKYLL_ENV=production)..."
bundle exec jekyll build

echo "Purging unused CSS (same as GitHub Actions deploy)..."
npx --yes purgecss -c purgecss.config.js

echo "Done. Output: _site/ (serve with: bundle exec jekyll serve --skip-initial-build --no-watch)"
