#!/usr/bin/env bash
set -euo pipefail

export DEBIAN_FRONTEND=noninteractive
if command -v apt-get >/dev/null 2>&1; then
    apt-get update
    apt-get install -y --no-install-recommends \
        build-essential \
        libcairo2-dev \
        libpango1.0-dev \
        libjpeg-dev \
        libgif-dev \
        librsvg2-dev
    rm -rf /var/lib/apt/lists/*
else
    echo "apt-get not found; skipping system package installation" >&2
fi
