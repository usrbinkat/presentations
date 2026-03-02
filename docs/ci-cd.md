# CI/CD Pipeline — Braincraft Presentations

## Pipeline Architecture

Two GitHub Actions workflows automate building and deploying Slidev presentations:

1. **Build and Deploy** (`.github/workflows/build-and-deploy.yml`) — Builds SPAs, exports PDFs, and deploys to GitHub Pages on push to `main`.
2. **Release PDF** (`.github/workflows/release-pdf.yml`) — Creates a GitHub Release with a PDF asset when a version tag is pushed.

## How Change Detection Works

The build-and-deploy workflow uses `git diff --name-only HEAD~1` to determine what changed:

- If files in `packages/`, `shared/`, `pnpm-workspace.yaml`, or `package.json` changed, **all decks** are rebuilt (infrastructure change).
- If only files within a specific `decks/<name>/` changed, only that deck is rebuilt.
- A matrix strategy runs each deck build in parallel.

## How to Manually Trigger a Build

1. Go to the repository's **Actions** tab on GitHub.
2. Select the **Build and Deploy Presentations** workflow.
3. Click **Run workflow** and select the `main` branch.

Manual triggers rebuild **all** decks.

## How to Create a Tagged PDF Release

Push a tag matching the pattern `<deck-name>-v<version>`:

```bash
git tag hello-world-v1.0
git push origin hello-world-v1.0
```

This triggers the release workflow, which builds and exports a PDF for the named deck and attaches it to a GitHub Release.

## Troubleshooting

### PDF Export Timeouts

PDF export uses Playwright with a 60-second timeout. If slides have heavy animations or many pages, export may time out. In the build-and-deploy workflow, PDF export uses `continue-on-error: true` so SPA deployment is not blocked.

### Font Issues

The workflow installs `fonts-noto-color-emoji` for emoji rendering. If other fonts are missing, add them to the `apt-get install` step.

### Playwright Failures

The workflow runs `npx playwright install --with-deps chromium`. If this fails, check that the runner has network access and sufficient disk space. Playwright version is determined by the `@slidev/cli` dependency.

## Environment Requirements

- **Node.js**: LTS (set via `actions/setup-node`)
- **pnpm**: Version detected from `packageManager` field or `pnpm/action-setup` defaults
- **Playwright + Chromium**: Installed per-run for PDF export
- **`.npmrc`**: Contains `shamefully-hoist=true`, picked up automatically by `pnpm install`
