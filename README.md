# renovate-config

Shared Renovate configuration for repositories under `gkzz`.

This repository defines the common dependency update policy used by Renovate-managed repositories.

## Usage

Extend the shared preset from each repository's Renovate configuration:

```json5
{
  $schema: "https://docs.renovatebot.com/renovate-schema.json",

  extends: ["github>gkzz/renovate-config"],
}
```

Repository-specific rules can be added alongside the shared preset:

```json5
{
  $schema: "https://docs.renovatebot.com/renovate-schema.json",

  extends: ["github>gkzz/renovate-config"],

  packageRules: [
    // Repository-specific rules.
  ],
}
```

## GitHub Actions lockfiles

Repositories using `.github/workflows/actions.lock` can opt in to the
[`actions-lock`](./actions-lock.json) preset **after** the default preset:

```json5
{
  extends: [
    "github>gkzz/renovate-config",
    "github>gkzz/renovate-config:actions-lock",
  ],
}
```

The default preset continues to pin actions inline. The optional preset keeps
repository actions and reusable workflows on version refs instead; Docker digest
pinning is unchanged. Existing inline SHAs are migrated when onboarding the
repository with `gh actions-lock`.

Renovate automatically regenerates an existing `actions.lock` when updating an
action, including dependencies inside local composite actions. No custom
post-upgrade command is needed. See the
[GitHub Actions manager documentation](https://docs.renovatebot.com/modules/manager/github-actions/#github-actions-lockfile-actionslock)
for the current support status and requirements.

Each consuming repository must generate and commit its initial lockfile and add
CI running `gh actions-lock --verify`. Use `$/` references for same-repository
actions whose remote dependencies must be locked. Manual workflow changes and new
workflows still require running `gh actions-lock` and committing its output.

The optional preset also tracks the extension version in workflow commands of the
form `gh extension install github/gh-actions-lock --pin v0.4.1`. These updates
retain the shared release-age, Dashboard approval, and manual merge policies.
Renovate selects its own supported extension version for lockfile regeneration;
set `constraints.ghActionsLock` in a consuming repository only if it needs a
specific version.

## Shared policy

The shared preset entry point is [`default.json`](./default.json), which extends the policy implemented in [`renovate.json5`](./renovate.json5).

[`renovate.json5`](./renovate.json5) is the source of truth for the shared Renovate policy. It contains the actual preset configuration and inline comments explaining the intent of each shared rule.

Repository-specific dependency grouping or file-specific rules should generally remain in the consuming repository unless they are intended to apply consistently across repositories.

## Review policy

Renovate pull requests are review candidates, not automatic approval to upgrade.

Routine updates should generally be merged when:

- the configured stability window has passed;
- CI has passed;
- release notes or changelog entries for the current-to-target version range do not require migration work;
- the need for the update is clear enough for its risk level, such as security priority, major-version migration value, minor-version feature or maintenance value, or routine patch/digest maintenance;
- the resulting diff contains only the expected dependency, digest, lockfile, or workflow changes.

Major updates require explicit review of breaking changes, migration instructions, runtime requirements, permissions, inputs, outputs, defaults, and other behavioral changes.

Security alerts should be reviewed in GitHub's Security -> Dependabot view. Dependency updates that remediate those alerts should still be reviewed through the normal Renovate pull request flow unless a maintainer decides to handle an alert manually.

Renovate vulnerability-alert pull requests are disabled in this shared preset because they bypass the routine update stability window and Dependency Dashboard approval. Each consuming repository should keep GitHub Dependabot alerts and malware alerts enabled for detection, while keeping Dependabot security updates and Dependabot version updates disabled to avoid automatic pull requests outside Renovate's routine update flow.

## Validation

Changes to this repository are validated by [`.github/workflows/validate.yml`](./.github/workflows/validate.yml).

The workflow performs two complementary checks:

- validates GitHub Actions workflow files with `actionlint`;
- validates [`default.json`](./default.json), [`renovate.json5`](./renovate.json5), and [`actions-lock.json`](./actions-lock.json) with `renovate-config-validator`.

These checks are intended to catch configuration and workflow errors before changes to the shared preset are merged.

Renovate itself is not run from this repository. Dependency update pull requests are expected to be created by Mend-hosted Renovate.

## Repository responsibilities

This repository contains **shared Renovate policy only**.

In other words:

```text
gkzz/renovate-config
  ├─ shared Renovate policy
  └─ validate shared presets

repository using the preset
  ├─ repository-specific Renovate config
  └─ validate repository config
```

Settings that depend on Mend-hosted Renovate execution should not be added to the shared repository preset.

## Repository-specific configuration

Not every Renovate rule belongs in this repository.

Keep a rule in the consuming repository when it depends on repository-specific details such as:

- particular files or directories;
- package managers used only by that repository;
- dependency groups meaningful only to that repository;
- repository-specific scheduling or update behavior.

Move a rule into this shared preset when it represents a policy that should apply consistently across Renovate-managed repositories.
