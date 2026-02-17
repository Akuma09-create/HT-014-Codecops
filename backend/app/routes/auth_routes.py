"""Authentication routes — login endpoint."""

from fastapi import APIRouter, HTTPException, status
from ..schemas import LoginRequest, TokenResponse
from ..auth import verify_password, create_access_token
from ..data_store import store

router = APIRouter()


@router.post("/login", response_model=TokenResponse)
def login(req: LoginRequest):
    with store.lock:
        user = next((u for u in store.users if u["email"] == req.email), None)

    if not user or not verify_password(req.password, user["password"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    token = create_access_token({"sub": user["email"]})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {"id": user["id"], "name": user["name"], "email": user["email"], "role": user["role"]},
    }
