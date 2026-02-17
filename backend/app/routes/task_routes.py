"""Task routes — admin creates tasks, workers complete them with photos."""

import os
import uuid
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from fastapi.responses import FileResponse
from datetime import datetime
from ..schemas import TaskCreate
from ..auth import get_current_user
from ..data_store import store

router = APIRouter()

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.get("/")
def get_tasks(user: dict = Depends(get_current_user)):
    """Admin sees all tasks; worker sees only their assigned tasks."""
    with store.lock:
        if user["role"] == "worker":
            return [t for t in store.tasks if t["workerId"] == user["id"]]
        return sorted(store.tasks, key=lambda t: t["assignedAt"], reverse=True)


@router.post("/")
def create_task(req: TaskCreate, user: dict = Depends(get_current_user)):
    """Admin assigns a task to a worker."""
    if user["role"] != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only admin can assign tasks")

    worker = next((u for u in store.users if u["id"] == req.worker_id and u["role"] == "worker"), None)
    if not worker:
        raise HTTPException(status_code=404, detail="Worker not found")

    with store.lock:
        store._task_id += 1
        task = {
            "id": store._task_id,
            "workerId": req.worker_id,
            "workerName": worker["name"],
            "complaintId": req.complaint_id,
            "title": req.title,
            "description": req.description,
            "location": req.location,
            "priority": req.priority,
            "status": "pending",
            "assignedAt": datetime.now().isoformat(),
            "completedAt": None,
            "completionPhotos": [],
            "completionNote": None,
        }
        store.tasks.append(task)

        # If linked to a complaint, update its status
        if req.complaint_id:
            c = next((c for c in store.complaints if c["id"] == req.complaint_id), None)
            if c:
                c["status"] = "in_progress"

        return task


@router.post("/{task_id}/start")
def start_task(task_id: int, user: dict = Depends(get_current_user)):
    """Worker marks a task as in-progress."""
    with store.lock:
        task = next((t for t in store.tasks if t["id"] == task_id), None)
        if not task:
            raise HTTPException(status_code=404, detail="Task not found")
        task["status"] = "in_progress"
        return task


@router.post("/{task_id}/upload-photo")
async def upload_completion_photo(task_id: int, file: UploadFile = File(...), user: dict = Depends(get_current_user)):
    """Worker uploads a completion photo for a task."""
    allowed = {"image/jpeg", "image/png", "image/webp", "image/gif"}
    if file.content_type not in allowed:
        raise HTTPException(400, "Only images (JPEG/PNG/WebP/GIF) are allowed")

    ext = file.filename.split(".")[-1] if "." in file.filename else "jpg"
    filename = f"task_{task_id}_{uuid.uuid4().hex}.{ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)

    content = await file.read()
    with open(filepath, "wb") as f:
        f.write(content)

    url = f"/api/tasks/media/{filename}"

    with store.lock:
        task = next((t for t in store.tasks if t["id"] == task_id), None)
        if not task:
            raise HTTPException(404, "Task not found")
        task["completionPhotos"].append(url)

    return {"url": url, "filename": filename}


@router.get("/media/{filename}")
def get_media(filename: str):
    """Serve an uploaded task photo."""
    filepath = os.path.join(UPLOAD_DIR, filename)
    if not os.path.exists(filepath):
        raise HTTPException(404, "File not found")
    return FileResponse(filepath)


@router.post("/{task_id}/complete")
def complete_task(task_id: int, user: dict = Depends(get_current_user)):
    """Worker marks a task as completed."""
    with store.lock:
        task = next((t for t in store.tasks if t["id"] == task_id), None)
        if not task:
            raise HTTPException(status_code=404, detail="Task not found")
        task["status"] = "completed"
        task["completedAt"] = datetime.now().isoformat()

        # If linked to a complaint, mark it resolved
        if task["complaintId"]:
            c = next((c for c in store.complaints if c["id"] == task["complaintId"]), None)
            if c and c["status"] != "resolved":
                c["status"] = "resolved"

        return task


@router.get("/workers")
def get_workers(user: dict = Depends(get_current_user)):
    """Get list of workers (for admin task assignment dropdown)."""
    if user["role"] != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only admin can view workers")
    with store.lock:
        workers = [{"id": u["id"], "name": u["name"], "email": u["email"]} for u in store.users if u["role"] == "worker"]
        return workers
