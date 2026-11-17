# Dependency update review

Renovate PRs are review candidates.
The shared preset requires Dashboard approval before creating branches or PRs and never merges them automatically.

## Routine updates

Before merging, confirm that:

- The configured release-age window has passed.
- CI has passed.
- Release notes or changelogs cover the current-to-target version range, and any required migration is complete.
- The update has a clear purpose that justifies its risk.
- The diff contains only expected dependency, digest, lockfile, or workflow changes.

Consider security fixes first.
Assess the migration cost of major updates, the value of minor updates, and the maintenance benefit of patch or digest updates.
For GitHub Actions, check resolved commits, runtimes, permissions, inputs, outputs, and workflow behavior.

## Major updates

Review breaking changes, migration instructions, runtime requirements, token use, permissions, inputs, outputs, and defaults.
Keep major updates separate from routine CI maintenance.

## Security alerts

Use GitHub's Security > Dependabot view to review security alerts.
Each consuming repository should keep Dependabot alerts and malware alerts enabled.
Keep Dependabot security updates and version updates disabled to avoid automatic PRs outside the Renovate review process.

The shared preset disables Renovate vulnerability-alert PRs because they can bypass the release-age window and Dashboard approval.
Review fixes through the normal Renovate flow unless a maintainer chooses to handle an alert manually.

## Where rules belong

Keep rules in a consuming repository when they depend on specific files, directories, package managers, dependency groups, or schedules.
Move rules into the shared preset when they should apply across repositories.
Settings that depend on the hosted Renovate execution environment belong outside the shared repository preset.
