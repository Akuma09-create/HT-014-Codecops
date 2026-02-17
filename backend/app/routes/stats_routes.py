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
        tasks = store.tasks

        total_bins = len(bins)
        full_bins = sum(1 for b in bins if b["status"] in ("full", "overflow"))
        pending_alerts = sum(1 for a in alerts if a["status"] == "active")
        pending_complaints = sum(1 for c in complaints if c["status"] == "pending")
        in_progress_complaints = sum(1 for c in complaints if c["status"] == "in_progress")
        resolved_complaints = sum(1 for c in complaints if c["status"] == "resolved")
        active_workers = len(workers)
        avg_fill = round(sum(b["fillLevel"] for b in bins) / total_bins) if total_bins else 0
        collection_rate = round(100 - (full_bins / total_bins * 100)) if total_bins else 100

        # Task stats
        total_tasks = len(tasks)
        pending_tasks = sum(1 for t in tasks if t["status"] == "pending")
        in_progress_tasks = sum(1 for t in tasks if t["status"] == "in_progress")
        completed_tasks = sum(1 for t in tasks if t["status"] == "completed")

        # Recent complaints (latest 5)
        recent_complaints = sorted(complaints, key=lambda c: c["createdAt"], reverse=True)[:5]

        # Recent tasks (latest 5)
        recent_tasks = sorted(tasks, key=lambda t: t["assignedAt"], reverse=True)[:5]

        # Workers with task counts
        worker_stats = []
        for w in workers:
            w_tasks = [t for t in tasks if t["workerId"] == w["id"]]
            worker_stats.append({
                "id": w["id"],
                "name": w["name"],
                "totalTasks": len(w_tasks),
                "completedTasks": sum(1 for t in w_tasks if t["status"] == "completed"),
                "activeTasks": sum(1 for t in w_tasks if t["status"] in ("pending", "in_progress")),
            })

        # Area-wise complaints
        area_complaints = {}
        for c in complaints:
            loc = c["location"]
            area_complaints[loc] = area_complaints.get(loc, 0) + 1

        return {
            "totalBins": total_bins,
            "fullBins": full_bins,
            "avgFillLevel": avg_fill,
            "pendingAlerts": pending_alerts,
            "pendingComplaints": pending_complaints,
            "inProgressComplaints": in_progress_complaints,
            "resolvedComplaints": resolved_complaints,
            "totalComplaints": len(complaints),
            "activeWorkers": active_workers,
            "collectionRate": collection_rate,
            "collections": store.collections,
            "assignments": store.assignments,
            "totalTasks": total_tasks,
            "pendingTasks": pending_tasks,
            "inProgressTasks": in_progress_tasks,
            "completedTasks": completed_tasks,
            "recentComplaints": recent_complaints,
            "recentTasks": recent_tasks,
            "workerStats": worker_stats,
            "areaComplaints": area_complaints,
        }
