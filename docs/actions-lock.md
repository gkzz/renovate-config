# GitHub Actions lockfiles

The optional `actions-lock` preset tracks the extension version used by verification workflows.
Renovate's built-in lockfile support controls inline digest pinning for onboarded workflows.
The preset does not disable digest pinning; repositories without compatible lockfile support keep the default pinning policy.

## Runtime requirements

Confirm that GitHub supports lockfile enforcement for the consuming repository before replacing inline SHAs with tags.
GitHub currently lists GitHub Enterprise Cloud as the availability requirement in its [setup guide](https://docs.github.com/en/actions/how-tos/secure-your-work/lock-workflow-dependencies).
For supported, onboarded workflows, the runner executes the locked commit, including checkout; verification CI checks consistency and provenance before merge.
Generating a lockfile alone does not establish that the target environment enforces it.
Keep inline SHAs where enforcement is unavailable or unconfirmed.

Use a Renovate runtime with native `actions.lock` regeneration support.
CI validates preset configuration with Renovate 44.206.2; it does not test lockfile extraction or regeneration.
Schema validation alone does not prove lockfile regeneration works.

The version of Mend-hosted Renovate is controlled by the service, independently of this repository's CI image.
Before merging a rollout, confirm the hosted version from its job logs and inspect a real dependency update PR.
That PR must update the action reference and lockfile together and pass `gh actions-lock --verify`.
This hosted update check has not yet been completed for the consuming repositories.

## Setup

Extend `actions-lock` after the default preset:

```json5
{
  extends: [
    "github>gkzz/renovate-config",
    "github>gkzz/renovate-config:actions-lock",
  ],
}
```

Install the extension, generate the initial lockfile, and verify it:

```sh
gh extension install github/gh-actions-lock
gh actions-lock
gh actions-lock --verify
```

Review and commit the workflow changes and lockfile together.
When replacing inline SHAs with version tags, check that each tag resolves to the original commit.
Add a CI job that installs the extension with a full release tag and runs `gh actions-lock --verify` with `GH_TOKEN` set to `${{ github.token }}`.
Use the [official verification workflow](https://github.com/github/gh-actions-lock/blob/main/.github/workflows/verify-lockfile.yml) as a starting point, then rerun `gh actions-lock` to onboard that workflow too.
The unpinned install above is for initial local setup; use the verification workflow's pinned version when reproducing CI locally.

Use `$/` references for same-repository actions whose remote dependencies must be locked.
To migrate existing `./` references, run `gh actions-lock --migrate-local-actions`.

## Updates

Renovate regenerates an existing lockfile when updating an action, including dependencies inside local composite actions.
No custom post-upgrade command is needed.
Manual workflow changes and new workflows still require running `gh actions-lock` and committing its output.

The preset also tracks the extension version in workflow commands written as `gh extension install github/gh-actions-lock --pin v0.4.1`.
These updates follow the shared approval, release-age, and manual merge policies.
Any workflow filename ending in `.yml` or `.yaml` under `.github/workflows/` is covered; the workflow's `name` is irrelevant.
The command must use the literal form above; shell variables, reordered options, scripts, and commands in composite actions are outside this custom manager's scope.
Keep the CI version in the workflow and refer to it from repository documentation instead of duplicating a version that Renovate will not update.

Action references use the built-in `github-actions` manager, which also discovers `action.yml` and `action.yaml` at arbitrary paths.
No repository-specific workflow names or composite action paths belong in this preset.
The consuming repository owns its initial lockfile, local-action migration, verification job, and manual workflow changes; the presets supply update policy and extension tracking.

Renovate selects its own supported extension version for regeneration.
Set `constraints.ghActionsLock` in the consuming repository only when it needs a specific version.

## Reusable workflows

`gh-actions-lock` does not lock reusable workflow call references.
Keep remote reusable workflow calls pinned to full commit SHAs and review those references separately.
The called repository's lockfile covers the actions inside its reusable workflow.

See the [Renovate manager documentation](https://docs.renovatebot.com/modules/manager/github-actions/#github-actions-lockfile-actionslock) for support details.
GitHub documents [lockfile coverage and verification](https://docs.github.com/en/actions/how-tos/secure-your-work/lock-workflow-dependencies).
