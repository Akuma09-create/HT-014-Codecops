"""Bin management routes — list bins & trigger collections."""

from fastapi import APIRouter, Depends
from ..auth import get_current_user
from ..data_store import store

router = APIRouter()


@router.get("/")
def get_bins(user: dict = Depends(get_current_user)):
    with store.lock:
        return store.bins.copy()


@router.post("/{bin_id}/collect")
def collect_bin(bin_id: int, user: dict = Depends(get_current_user)):
    with store.lock:
        b = next((b for b in store.bins if b["id"] == bin_id), None)
        if not b:
            return {"error": "Bin not found"}
        b["fillLevel"] = 0
        b["status"] = "empty"
        # Resolve related active alerts
        for a in store.alerts:
            if a["binId"] == bin_id and a["status"] == "active":
                a["status"] = "resolved"
        return {"message": f"Bin {bin_id} collected", "bin": b}
