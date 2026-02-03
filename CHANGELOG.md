# lindas-cube-link Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- Deploy/rollback workflows using image retagging pattern (deploy-test, deploy-int, deploy-prod, rollback-test, rollback-int, rollback-prod)
- CODEOWNERS file (@rareba @psiotwo)
- Develop branch workflow for code review process
- CI triggers for develop branch and pull requests
- RELEASE.md documenting the full release process

### Fixed
- Replaced tibdex/github-app-token with default GITHUB_TOKEN in release workflow (old Zazuko config required missing GH_APP_ID/GH_PRIVATE_KEY secrets)

## [0.2.4] - Previous Release

See git history for previous changes.
