"""Pydantic request & response schemas for the Cleanify API."""

from pydantic import BaseModel
from typing import Optional


class LoginRequest(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict


class ComplaintCreate(BaseModel):
    location: str
    description: str


class AssignmentCreate(BaseModel):
    worker_id: int
    bin_ids: list[int]
