import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { GlobalConfig } from '/usr/local/renovate/dist/config/global.js';
import { extractPackageFile } from '/usr/local/renovate/dist/modules/manager/github-actions/extract.js';
import { updateActionsLockfile } from '/usr/local/renovate/dist/modules/manager/github-actions/artifacts.js';

// Run inside the CI-pinned Renovate image, without installing repository dependencies.
const root = mkdtempSync(join(tmpdir(), 'renovate-actions-lock-'));
try {
  mkdirSync(join(root, '.github/workflows'), { recursive: true });
  writeFileSync(join(root, '.github/workflows/actions.lock'), `version: 'v0.0.3'
workflows:
  '.github/workflows/ci.yml':
    - 'actions/checkout@v7.0.1'
dependencies: {}
`);
  GlobalConfig.set({ localDir: root, platform: 'github' });
  const workflow = `name: Compatibility check
on: push
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7.0.1
      - uses: docker://alpine:3.22
  reusable:
    uses: example/workflows/.github/workflows/ci.yml@v1.2.3
`;
  const locked = await extractPackageFile(workflow, '.github/workflows/ci.yml', {});
  const action = locked.deps.find((dep) => dep.depName === 'actions/checkout');
  assert.equal(action.depType, 'action');
  assert.equal(action.digestManagedExternally, true);
  const docker = locked.deps.find((dep) => dep.depType === 'docker');
  assert.ok(docker);
  assert.notEqual(docker.digestManagedExternally, true);
  const reusable = locked.deps.find((dep) => dep.depName === 'example/workflows');
  assert.equal(reusable.depType, 'workflow');

  const unlocked = await extractPackageFile(workflow, '.github/workflows/unlocked.yml', {});
  assert.notEqual(unlocked.deps.find((dep) => dep.depName === 'actions/checkout').digestManagedExternally, true);
  assert.equal(typeof updateActionsLockfile, 'function');
  console.log('Native lockfile extraction, Docker pinning, and workflow classification checks passed.');
  console.log('Hosted Renovate regeneration still requires a real downstream update check.');
} finally {
  rmSync(root, { recursive: true, force: true });
}
