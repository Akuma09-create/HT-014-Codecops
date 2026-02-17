"""Statistics routes — aggregated dashboard metrics."""

from fastapi import APIRouter, Depends
from ..auth import get_current_user
from ..data_store import store

router = APIRouter()


@router.get("/")
def get_stats(user: dict = Depends(get_current_user)):
    with store.lock:
        bins = store.bins
        alerts = store.alerts
        complaints = store.complaints
        workers = [u for u in store.users if u["role"] == "worker"]

        total_bins = len(bins)
        full_bins = sum(1 for b in bins if b["status"] in ("full", "overflow"))
        pending_alerts = sum(1 for a in alerts if a["status"] == "active")
        pending_complaints = sum(1 for c in complaints if c["status"] == "pending")
        active_workers = len(workers)
        avg_fill = round(sum(b["fillLevel"] for b in bins) / total_bins) if total_bins else 0
        collection_rate = round(100 - (full_bins / total_bins * 100)) if total_bins else 100

        return {
            "totalBins": total_bins,
            "fullBins": full_bins,
            "avgFillLevel": avg_fill,
            "pendingAlerts": pending_alerts,
            "pendingComplaints": pending_complaints,
            "activeWorkers": active_workers,
            "collectionRate": collection_rate,
            "collections": store.collections,
            "assignments": store.assignments,
        }
