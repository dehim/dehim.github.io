# OpenClaw Project Status

## Project Goal

Build and publish a static personal game site MVP for `dehim.github.io`, starting with a playable Snake game.

## Project Locations

- Work directory: `/shareVolume/workspaces/dehim.github.io`
- Branch: `game-site-mvp`
- Repository: `git@github.com:dehim/dehim.github.io.git`
- Site: `https://dehim.github.io`
- SSH deploy key path: `/shareVolume/config/ssh/id_ed25519`

This project intentionally keeps GitHub's standard SSH remote URL. The container SSH configuration must ensure that `git@github.com` uses the deploy key above.

## Operating Rules

- Work on the `game-site-mvp` branch unless Dehim says otherwise.
- Do not clone this repository to another directory.
- Do not modify `main` directly.
- Do not push without explicit approval.
- Do not commit until Dehim reviews and approves the current changes.
- Before pushing, check repository status, remote configuration, SSH deploy key access, and expected branch target.
- Preserve unrelated user changes if the working tree is dirty.
- Preserve the Jekyll + Beautiful Jekyll build chain.
- Do not introduce npm, Vite, React, Vue, or other new build tools for the MVP unless explicitly approved.
- Do not modify `.github/workflows/ci.yml`, `Gemfile`, `beautiful-jekyll-theme.gemspec`, `Appraisals`, `_layouts/base.html`, `_includes/head.html`, or `_includes/nav.html` unless explicitly approved.
- Prefer small, reviewable changes and verify the static site before publishing.

## Current Status

- Branch: `game-site-mvp`
- Latest commit: `6d98dac Add static game site MVP with Snake`
- Working tree: clean before creating this status file
- Push status: not pushed yet
- Current requested change: create `OPENCLAW_PROJECT.md` only, then run `git status --short`

## Completed

- Created static game site MVP structure.
- Added Snake game page at `games/snake/index.html`.
- Added Snake game logic at `games/snake/game.js`.
- Added Snake-specific styling at `games/snake/style.css`.
- Added arcade/site styling at `assets/css/arcade.css`.
- Created commit `6d98dac Add static game site MVP with Snake`.

## Todo

- Run push preflight checks.
- Check remote.
- Check SSH deploy key.
- Push `game-site-mvp`.
- View GitHub Actions.
- Verify GitHub Pages.
