# Lumber Lab Outdoor Construction

Home/landing page for Lumber Lab Outdoor Construction, serving the Greater Portland Metropolitan Area and Southwest Washington.

## local dev

Requires Node.js 22 (see `.nvmrc`) and npm.

```sh
npm ci
npm run dev
```

## checks and production

```sh
npm run lint
npm run typecheck
npm test
npm run build
```

## deployment

The site is configured for GitHub Pages at:

https://lumberlabpdx.github.io/website/

The GitHub Actions workflow in `.github/workflows/pages.yml` builds and deploys the site when changes are pushed to `main`.
