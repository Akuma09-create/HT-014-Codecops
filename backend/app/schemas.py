"""Pydantic request & response schemas for the Cleanify API."""

from pydantic import BaseModel
from typing import Optional


class LoginRequest(BaseModel):
    email: str
    password: str


class CitizenRegister(BaseModel):
    name: str
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict


class ComplaintCreate(BaseModel):
    location: str
    description: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    media_urls: list[str] = []


class ComplaintRespond(BaseModel):
    response: str
    status: str = "in_progress"  # in_progress or resolved


class AssignmentCreate(BaseModel):
    worker_id: int
    bin_ids: list[int]


class WorkerCreate(BaseModel):
    name: str
    email: str
    password: str


class TaskCreate(BaseModel):
    worker_id: int
    complaint_id: int | None = None
    title: str
    description: str
    location: str
    latitude: float | None = None
    longitude: float | None = None
    priority: str = "medium"  # low, medium, high, urgent
