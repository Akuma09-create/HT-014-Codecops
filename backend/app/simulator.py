"""Bin fill-level simulator — mimics real IoT sensor data updates."""

import random
from datetime import datetime
from .data_store import store


def simulate_fill_levels():
    """Increase bin fill levels randomly every 30 seconds to simulate real sensors."""
    with store.lock:
        for b in store.bins:
            increase = random.randint(0, 8)
            b["fillLevel"] = min(100, b["fillLevel"] + increase)

            if b["fillLevel"] >= 90:
                b["status"] = "overflow"
            elif b["fillLevel"] >= 75:
                b["status"] = "full"
            elif b["fillLevel"] >= 40:
                b["status"] = "half"
            else:
                b["status"] = "empty"

            # Auto-create alert when fill >= 80
            if b["fillLevel"] >= 80:
                existing = any(
                    a["binId"] == b["id"] and a["status"] == "active"
                    for a in store.alerts
                )
                if not existing:
                    store._alert_id += 1
                    store.alerts.append({
                        "id": store._alert_id,
                        "binId": b["id"],
                        "location": b["location"],
                        "area": b["area"],
                        "fillLevel": b["fillLevel"],
                        "type": "overflow" if b["fillLevel"] >= 90 else "high_fill",
                        "status": "active",
                        "createdAt": datetime.now().isoformat(),
                    })
