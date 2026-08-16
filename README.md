# renovate-config

Shared Renovate configuration for repositories under `gkzz`.

This repository defines the common dependency update policy used by Renovate-managed repositories.

## Usage

Extend the shared preset from each repository's Renovate configuration:

```json5
{
  $schema: "https://docs.renovatebot.com/renovate-schema.json",

  extends: ["github>gkzz/renovate-config:default.json5"],
}
```

Repository-specific rules can be added alongside the shared preset:

```json5
{
  $schema: "https://docs.renovatebot.com/renovate-schema.json",

  extends: ["github>gkzz/renovate-config:default.json5"],

  packageRules: [
    // Repository-specific rules.
  ],
}
```

## Shared policy

The shared preset is defined in [`default.json5`](./default.json5).

It provides the common Renovate policy, including:

- Renovate's recommended configuration
- Immutable Docker digest pinning
- Immutable GitHub Actions commit SHA pinning with adjacent SemVer comments
- Dependency Dashboard approval before creating update branches and pull requests
- A 14-day minimum release age for routine updates
- Manual merge decisions instead of Renovate automerge
- Grouping of non-major GitHub Actions updates
- Separation of major GitHub Actions updates
- Additional release information in GitHub Actions pull requests
- Prioritized handling of vulnerability alerts

Repository-specific dependency grouping or file-specific rules should generally remain in the consuming repository unless they are intended to apply consistently across repositories.

## Review policy

Renovate pull requests are review candidates, not automatic approval to upgrade.

Routine updates should generally be merged when:

- the configured stability window has passed;
- CI has passed;
- release notes or changelog entries do not require migration work;
- the resulting diff contains only the expected dependency, digest, lockfile, or workflow changes.

Major updates require explicit review of breaking changes, migration instructions, runtime requirements, permissions, inputs, outputs, defaults, and other behavioral changes.

Security updates should be reviewed with higher priority once their compatibility and impact are understood.

## Validation

Changes to this repository are validated by [`.github/workflows/validate.yml`](./.github/workflows/validate.yml).

The workflow performs three complementary checks:

- validates GitHub Actions workflow files with `actionlint`;
- validates the Renovate configuration with the pinned Renovate version;
- runs Renovate in local dry-run mode to verify that configuration and dependency extraction can be processed successfully.

These checks are intended to catch configuration and workflow errors before changes to the shared preset are merged.

## Repository responsibilities

This repository contains **shared Renovate policy only**.

The execution environment for self-hosted Renovate is maintained separately in `gkzz/actions`.

In other words:

```text
gkzz/renovate-config
└── What Renovate should do
    ├── update policy
    ├── stability policy
    ├── grouping
    ├── Dependency Dashboard behavior
    └── pull request presentation

gkzz/actions
└── How Renovate is executed
    ├── GitHub Actions workflow
    ├── GitHub App authentication
    ├── Renovate runtime version
    └── self-hosted/global configuration
```

Settings that control the self-hosted Renovate process itself should not be added to the shared repository preset.

## Repository-specific configuration

Not every Renovate rule belongs in this repository.

Keep a rule in the consuming repository when it depends on repository-specific details such as:

- particular files or directories;
- package managers used only by that repository;
- dependency groups meaningful only to that repository;
- repository-specific scheduling or update behavior.

Move a rule into this shared preset when it represents a policy that should apply consistently across Renovate-managed repositories.