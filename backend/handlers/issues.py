"""Placeholder Lambda handlers. Not deployed."""

from typing import Any


def get_issues(_event: dict[str, Any] | None = None) -> dict[str, Any]:
    return {"message": "Not deployed.", "path": "/issues"}


def create_issue(_event: dict[str, Any] | None = None) -> dict[str, Any]:
    return {"message": "Not deployed.", "path": "/issues"}


def update_issue(_event: dict[str, Any] | None = None) -> dict[str, Any]:
    return {"message": "Not deployed.", "path": "/issues/{id}"}


def get_events(_event: dict[str, Any] | None = None) -> dict[str, Any]:
    return {"message": "Not deployed.", "path": "/events"}
