"""Complaint routes — submit and resolve citizen complaints."""

from fastapi import APIRouter, Depends
from datetime import datetime
from ..schemas import ComplaintCreate
from ..auth import get_current_user
from ..data_store import store

router = APIRouter()


@router.get("/")
def get_complaints(user: dict = Depends(get_current_user)):
    with store.lock:
        return sorted(store.complaints, key=lambda c: c["createdAt"], reverse=True)


@router.post("/")
def create_complaint(req: ComplaintCreate, user: dict = Depends(get_current_user)):
    with store.lock:
        store._complaint_id += 1
        complaint = {
            "id": store._complaint_id,
            "userId": user["id"],
            "userName": user["name"],
            "location": req.location,
            "description": req.description,
            "status": "pending",
            "createdAt": datetime.now().isoformat(),
        }
        store.complaints.append(complaint)
        return complaint


@router.post("/{complaint_id}/resolve")
def resolve_complaint(complaint_id: int, user: dict = Depends(get_current_user)):
    with store.lock:
        c = next((c for c in store.complaints if c["id"] == complaint_id), None)
        if not c:
            return {"error": "Complaint not found"}
        c["status"] = "resolved"
        return {"message": "Complaint resolved", "complaint": c}
