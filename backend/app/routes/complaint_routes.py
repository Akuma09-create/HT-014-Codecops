"""Complaint routes — submit, respond, and resolve citizen complaints."""

import os
import uuid
import base64
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from fastapi.responses import JSONResponse
from datetime import datetime
from typing import Optional
from ..schemas import ComplaintCreate, ComplaintRespond
from ..auth import get_current_user
from ..data_store import store

router = APIRouter()

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.get("/")
def get_complaints(user: dict = Depends(get_current_user)):
    """Admin/worker sees all complaints; citizen sees only their own."""
    with store.lock:
        if user["role"] == "citizen":
            data = [c for c in store.complaints if c["userId"] == user["id"]]
        else:
            data = list(store.complaints)
        return sorted(data, key=lambda c: c["createdAt"], reverse=True)


@router.post("/upload-media")
async def upload_media(file: UploadFile = File(...), user: dict = Depends(get_current_user)):
    """Upload a photo or video and return its URL."""
    allowed = {"image/jpeg", "image/png", "image/webp", "image/gif", "video/mp4", "video/webm", "video/quicktime"}
    if file.content_type not in allowed:
        raise HTTPException(400, "Only images (JPEG/PNG/WebP/GIF) and videos (MP4/WebM) are allowed")

    ext = file.filename.split(".")[-1] if "." in file.filename else "bin"
    filename = f"{uuid.uuid4().hex}.{ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)

    content = await file.read()
    with open(filepath, "wb") as f:
        f.write(content)

    return {"url": f"/api/complaints/media/{filename}", "filename": filename}


@router.get("/media/{filename}")
def get_media(filename: str):
    """Serve an uploaded media file."""
    from fastapi.responses import FileResponse
    filepath = os.path.join(UPLOAD_DIR, filename)
    if not os.path.exists(filepath):
        raise HTTPException(404, "File not found")
    return FileResponse(filepath)


def _award_points(user_id: int, action: str, points: int):
    """Award reward points to a citizen."""
    if user_id not in store.rewards:
        store.rewards[user_id] = {"points": 0, "level": "Bronze", "history": []}
    r = store.rewards[user_id]
    r["points"] += points
    r["history"].insert(0, {"action": action, "points": points, "date": datetime.now().isoformat()})
    # Update level
    if r["points"] >= 500:
        r["level"] = "Platinum"
    elif r["points"] >= 300:
        r["level"] = "Gold"
    elif r["points"] >= 100:
        r["level"] = "Silver"
    else:
        r["level"] = "Bronze"


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
            "latitude": req.latitude,
            "longitude": req.longitude,
            "mediaUrls": req.media_urls,
            "status": "pending",
            "response": None,
            "respondedAt": None,
            "createdAt": datetime.now().isoformat(),
        }
        store.complaints.append(complaint)

        # Award 50 points for submitting a complaint
        _award_points(user["id"], "Complaint submitted", 50)
        if req.media_urls:
            _award_points(user["id"], "Photo/video attached", 20)
        if req.latitude and req.longitude:
            _award_points(user["id"], "Location shared", 10)

        return complaint


@router.post("/{complaint_id}/respond")
def respond_complaint(complaint_id: int, req: ComplaintRespond, user: dict = Depends(get_current_user)):
    """Admin responds to a complaint with a message and status update."""
    if user["role"] != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only admin can respond")
    with store.lock:
        c = next((c for c in store.complaints if c["id"] == complaint_id), None)
        if not c:
            raise HTTPException(status_code=404, detail="Complaint not found")
        c["response"] = req.response
        c["status"] = req.status
        c["respondedAt"] = datetime.now().isoformat()

        # Award citizen bonus points when their complaint is resolved
        if req.status == "resolved":
            _award_points(c["userId"], "Complaint resolved", 50)

        return {"message": "Response sent", "complaint": c}


@router.post("/{complaint_id}/resolve")
def resolve_complaint(complaint_id: int, user: dict = Depends(get_current_user)):
    with store.lock:
        c = next((c for c in store.complaints if c["id"] == complaint_id), None)
        if not c:
            return {"error": "Complaint not found"}
        c["status"] = "resolved"
        _award_points(c["userId"], "Complaint resolved", 50)
        return {"message": "Complaint resolved", "complaint": c}


@router.get("/rewards")
def get_rewards(user: dict = Depends(get_current_user)):
    """Get reward points for the current citizen."""
    with store.lock:
        r = store.rewards.get(user["id"], {"points": 0, "level": "Bronze", "history": []})
        return {
            "userId": user["id"],
            "points": r["points"],
            "level": r["level"],
            "history": r["history"],
            "milestones": [
                {"level": "Bronze", "minPoints": 0, "reward": "Badge on profile"},
                {"level": "Silver", "minPoints": 100, "reward": "Priority complaint handling"},
                {"level": "Gold", "minPoints": 300, "reward": "Monthly recognition certificate"},
                {"level": "Platinum", "minPoints": 500, "reward": "City clean champion award"},
            ]
        }
