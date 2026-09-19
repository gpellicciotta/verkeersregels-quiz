#!/usr/bin/env python3
"""Shim forwarder for backward compatibility with generate-pwa-icons.py."""

from __future__ import annotations

import sys
from pathlib import Path

# Add scripts directory to path
SCRIPTS_DIR = Path(__file__).resolve().parent
if str(SCRIPTS_DIR) not in sys.path:
    sys.path.insert(0, str(SCRIPTS_DIR))

import importlib.util

_target = SCRIPTS_DIR / "generate-pwa-icons.py"
_spec = importlib.util.spec_from_file_location("generate_pwa_icons_impl", _target)
_mod = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_mod)

if __name__ == "__main__":
    sys.exit(_mod.main())
