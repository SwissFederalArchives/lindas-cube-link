# Release Process

## Overview

lindas-cube-link follows a develop/main branching strategy with environment-based deployments using Docker image retagging.

## Branching Strategy

```
develop  ──PR──>  main  ──CI──>  Docker image  ──promote──>  TEST/INT/PROD
```

- **develop**: Active development branch. All changes go through PRs.
- **main**: Stable branch. Merging to main triggers CI build + Docker image push.
- Branch protection is enabled on both branches (require PR + 1 approval).

## Version Bumping

This repository uses [Changesets](https://github.com/changesets/changesets) for version management.

### Adding a changeset

When making a change, add a changeset file:

```bash
npx changeset
```

This creates a file in `.changeset/` describing the change and its semver bump type (patch/minor/major).

### Creating a release

When changesets accumulate on main, the `release.yaml` workflow automatically creates a "Version Packages" PR. Merging that PR:
1. Bumps the version in `package.json`
2. Updates `CHANGELOG.md`
3. Creates a Git tag (e.g., `v0.3.0`)
4. Publishes to npm (if configured)

## CI/CD Pipeline

### On push to develop or main

`ci.yaml` runs:
1. Tests (observation tests + cube metadata constraint tests)
2. Docker image build and push to `ghcr.io/swissfederalarchives/lindas-cube-link`

**Image tags produced:**
- Branch push: `develop` or `main` (branch name tag)
- Semver tag push (`v*.*.*`): `v0.3.0`, `v0.3`, `v0`
- Every push: `sha-<short-hash>`

### On push to main

`release.yaml` also runs the Changesets action to manage version PRs and releases.

## Environment Promotion

### TEST

**Manual** via GitHub Actions:

1. Go to Actions > "Deploy to TEST"
2. Enter the version tag (e.g., `main`, `sha-abc1234`, or `v0.3.0`)
3. Click "Run workflow"

This retags the specified image as `test` and saves the previous `test` as `test-previous`.

### INT

**Manual** via GitHub Actions:

1. Go to Actions > "Deploy to INT"
2. Enter the version tag to promote
3. Click "Run workflow"

This retags the image as `int` with `int-previous` backup.

### PROD

**Manual** via GitHub Actions (requires approval):

1. Go to Actions > "Deploy to PROD"
2. Enter the version tag to promote
3. Click "Run workflow"
4. **Approve** the deployment in the GitHub Environment review

This retags the image as `prod` with `prod-previous` backup. The `environment: production` setting triggers the approval gate.

## Rollback

Each environment has a one-click rollback workflow:

1. Go to Actions > "Rollback TEST" (or INT/PROD)
2. Click "Run workflow"

This swaps the current tag with the `-previous` tag. Running rollback again swaps back.

**PROD rollback** also requires environment approval.

## Typical Release Flow

1. Create feature branch from `develop`
2. Make changes, add changeset (`npx changeset`)
3. Open PR to `develop`, get review
4. Merge to `develop` (CI runs tests)
5. Open PR from `develop` to `main`, get review
6. Merge to `main` (CI builds Docker image, tagged as `main` and `sha-xxx`)
7. Deploy to TEST: Actions > "Deploy to TEST" with tag `main`
8. Verify on TEST environment
9. Deploy to INT: Actions > "Deploy to INT" with tag `main`
10. Verify on INT environment
11. Deploy to PROD: Actions > "Deploy to PROD" with tag `main`
12. Verify on PROD environment

## Image Registry

- **Registry:** `ghcr.io/swissfederalarchives/lindas-cube-link`
- **Flux** watches for tag updates and reconciles deployments in the gitops repo

## Quick Reference

| Action | How |
|--------|-----|
| Deploy to TEST | Actions > Deploy to TEST > enter tag |
| Deploy to INT | Actions > Deploy to INT > enter tag |
| Deploy to PROD | Actions > Deploy to PROD > enter tag > approve |
| Rollback TEST | Actions > Rollback TEST |
| Rollback INT | Actions > Rollback INT |
| Rollback PROD | Actions > Rollback PROD > approve |
| Add changeset | `npx changeset` |
| Check version | `node -p "require('./package.json').version"` |
