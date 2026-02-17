"""Alert routes — view and resolve bin overflow alerts."""

from fastapi import APIRouter, Depends
from ..auth import get_current_user
from ..data_store import store

router = APIRouter()


@router.get("/")
def get_alerts(user: dict = Depends(get_current_user)):
    with store.lock:
        return sorted(store.alerts, key=lambda a: a["createdAt"], reverse=True)


@router.post("/{alert_id}/resolve")
def resolve_alert(alert_id: int, user: dict = Depends(get_current_user)):
    with store.lock:
        alert = next((a for a in store.alerts if a["id"] == alert_id), None)
        if not alert:
            return {"error": "Alert not found"}
        alert["status"] = "resolved"
        # Also collect the bin
        b = next((b for b in store.bins if b["id"] == alert["binId"]), None)
        if b:
            b["fillLevel"] = 0
            b["status"] = "empty"
        return {"message": "Alert resolved", "alert": alert}
