# renovate-config

Shared Renovate presets for `gkzz` repositories.

## Usage

Extend the default preset from your repository's Renovate configuration:

```json5
{
  $schema: "https://docs.renovatebot.com/renovate-schema.json",
  extends: ["github>gkzz/renovate-config"],
}
```

[`default.json`](default.json) loads the shared policy from [`renovate.json5`](renovate.json5).
Keep rules for specific files, tools, and dependency groups in the consuming repository.
This repository defines shared policy; Mend-hosted Renovate creates update PRs.

## Update policy

Updates require Dependency Dashboard approval, a 14-day release age, and manual merging.
The shared schedule is Monday in `Asia/Tokyo`.
Before merging, check CI, release notes, and the need and risk of the update.
See [the review policy](docs/review-policy.md) for review criteria and security alert settings.

## GitHub Actions

The default preset pins actions inline to commit SHAs.
Repositories using `actions.lock` can also extend the optional [`actions-lock`](actions-lock.json) preset.
See [the lockfile guide](docs/actions-lock.md) for setup and updates.

このリポジトリ自身も [renovate.json](renovate.json) で両方の preset を適用し、[actions.lock](.github/workflows/actions.lock) と[検証 CI](.github/workflows/verify-lockfile.yml) を管理します。運用手順は[ガイド](docs/actions-lock.md)を参照してください。

## Validation

[CI](.github/workflows/validate.yml) runs `actionlint` and validates all three preset files and this repository's `renovate.json` with `renovate-config-validator`.
Check each consuming repository's Renovate configuration with the validator.
