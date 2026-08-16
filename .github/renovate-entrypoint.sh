#!/usr/bin/env bash
set -euo pipefail

cd /workspace

renovate-config-validator default.json5 renovate.json5
