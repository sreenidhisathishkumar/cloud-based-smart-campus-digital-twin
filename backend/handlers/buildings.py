"""
Sprint 1 placeholder for AWS Lambda handlers.

These functions will become Lambda entry points in Sprint 5.
They are not wired to the UI yet. The frontend uses src/services.
"""

from typing import Any


def get_buildings(_event: dict[str, Any] | None = None) -> dict[str, Any]:
    return {
        "message": "Not deployed. Use the local frontend data layer until Sprint 5.",
        "path": "/buildings",
    }
