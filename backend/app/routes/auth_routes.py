"""Authentication routes — login endpoint."""

from fastapi import APIRouter, HTTPException, status
from ..schemas import LoginRequest, TokenResponse, CitizenRegister
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


@router.post("/register")
def register_citizen(req: CitizenRegister):
    """Register a new citizen account."""
    with store.lock:
        # Check if email already exists
        existing = next((u for u in store.users if u["email"] == req.email), None)
        if existing:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

        new_id = max(u["id"] for u in store.users) + 1
        new_user = {
            "id": new_id,
            "name": req.name,
            "email": req.email,
            "password": req.password,
            "role": "citizen",
        }
        store.users.append(new_user)

        # Initialize rewards for new citizen
        store.rewards[new_id] = {"points": 0, "history": []}

    token = create_access_token({"sub": new_user["email"]})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {"id": new_user["id"], "name": new_user["name"], "email": new_user["email"], "role": new_user["role"]},
    }
