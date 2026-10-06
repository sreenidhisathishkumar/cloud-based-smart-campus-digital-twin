"""Placeholder Lambda handlers for facilities (Sprint 2). Not wired to the UI."""

from typing import Any


def get_facilities(_event: dict[str, Any] | None = None) -> dict[str, Any]:
    return {"message": "Not deployed. Local data layer is in use.", "path": "/facilities"}


def update_facility_status(_event: dict[str, Any] | None = None) -> dict[str, Any]:
    return {"message": "Not deployed. Local data layer is in use.", "path": "/facilities/{id}"}
