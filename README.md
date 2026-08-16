# renovate-config

Shared Renovate configuration for `gkzz` repositories.

## Preset

Use this preset from another repository with:

```json
{
  "extends": ["github>gkzz/renovate-config"]
}
```

The shared preset is defined in [`default.json`](./default.json).

## Policy

- Use Renovate's recommended defaults.
- Pin Docker image digests.
- Pin GitHub Actions to full commit SHAs while keeping the adjacent SemVer comment.
- Use the `Asia/Tokyo` timezone.
- Disable automerge by default.
- Require dependency dashboard approval before updates are opened.
- Require a 14 day minimum release age with strict internal checks.
- Add PR review notes so stability, CI, release notes, and migration impact are checked before merge.
- Group non-major GitHub Actions updates together.
- Keep major GitHub Actions updates separate.
- Add GitHub Actions specific PR body columns for update type, target, release timestamp, release age, and pending state.

Vulnerability alert PRs are assigned to `gkzz`.

## Self Monitoring

This repository has its own [`renovate.json5`](./renovate.json5):

```json5
{
  extends: ["github>gkzz/renovate-config"],
}
```

This follows the same shape as `cybozu/renovate-config`, where the repository's own Renovate config extends the shared preset it publishes.

## Validation

The GitHub Actions workflow is [`renovate-config.yml`](./.github/workflows/renovate-config.yml).

The file name is intentionally `renovate-config.yml` instead of a generic `test.yml` so the Actions list makes the workflow purpose clear.

The workflow:

- runs on pushes to `main` and `master`
- runs on pull requests
- uses Node.js 22.x
- pins pnpm to `10.34.5`
- validates both `default.json` and `renovate.json5`

The validation command is:

```sh
pnpm dlx renovate@latest renovate-config-validator default.json renovate.json5
```
