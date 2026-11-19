# GitHub Actions dependency updates

This repository records action dependencies in `.github/workflows/actions.lock`.

- This repository applies the shared `github>gkzz/renovate-config:actions-lock` preset. Confirm that the first Renovate action update also updates the lockfile before merging it.
- Review the workflow changes and resolved commits before merging.
- The verification workflow checks the lockfile on pull requests, pushes to `main`, and manual dispatches.

For setup and manual changes, follow the official documentation:

- [Install the extension and generate or update the lockfile](https://docs.github.com/en/actions/how-tos/secure-your-work/lock-workflow-dependencies).
- [Verify the lockfile and troubleshoot errors](https://github.com/github/gh-actions-lock#readme).

Before adding local composite actions with action dependencies, follow the official guide's
[local action instructions](https://docs.github.com/en/actions/how-tos/secure-your-work/lock-workflow-dependencies#3-generate-the-lockfile).
