"""In-memory data store — singleton pattern with thread-safe access."""

import threading
from datetime import datetime


class DataStore:
    """Thread-safe in-memory data store — no database required."""

    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self):
        if self._initialized:
            return
        self._initialized = True
        self.lock = threading.Lock()
        self._seed()

    def _seed(self):
        # Demo users
        self.users = [
            {"id": 1, "name": "Admin User", "email": "admin@cleanify.com", "password": "admin123", "role": "admin"},
            {"id": 2, "name": "Ravi Kumar", "email": "worker1@cleanify.com", "password": "worker123", "role": "worker"},
            {"id": 3, "name": "Priya Sharma", "email": "worker2@cleanify.com", "password": "worker123", "role": "worker"},
            {"id": 4, "name": "Amit Patel", "email": "citizen@cleanify.com", "password": "citizen123", "role": "citizen"},
        ]

        # 15 smart bins across Bangalore
        # Baramati city areas
        areas = ["Central", "South", "East", "West", "North"]
        locations = [
            ("Baramati Bus Stand", "Central"),
            ("Bhigwan Road Chowk", "South"),
            ("Nira River Bridge", "East"),
            ("Katewadi Phata", "West"),
            ("Jalochi Road", "North"),
            ("Market Yard Baramati", "Central"),
            ("Shivaji Chowk", "South"),
            ("Phaltan Road", "West"),
            ("Indapur Highway Junction", "East"),
            ("Baramati Krishi Vidyapeeth", "North"),
            ("Malegaon Chowk", "Central"),
            ("Supe Road", "South"),
            ("Morgaon Road", "East"),
            ("Station Road Baramati", "West"),
            ("Karhati Phata", "North"),
        ]

        import random
        random.seed(42)

        self.bins = []
        for i, (loc, area) in enumerate(locations, 1):
            fill = random.randint(5, 95)
            if fill >= 90:
                status = "overflow"
            elif fill >= 75:
                status = "full"
            elif fill >= 40:
                status = "half"
            else:
                status = "empty"
            self.bins.append({
                "id": i,
                "location": loc,
                "area": area,
                "fillLevel": fill,
                "status": status,
                "lastCollected": "2026-02-16T08:30:00",
                "sensorBattery": random.randint(40, 100),
            })

        # Alerts
        self.alerts = []
        self._alert_id = 0
        for b in self.bins:
            if b["fillLevel"] >= 80:
                self._alert_id += 1
                self.alerts.append({
                    "id": self._alert_id,
                    "binId": b["id"],
                    "location": b["location"],
                    "area": b["area"],
                    "fillLevel": b["fillLevel"],
                    "type": "overflow" if b["fillLevel"] >= 90 else "high_fill",
                    "status": "active",
                    "createdAt": datetime.now().isoformat(),
                })

        # Complaints
        self.complaints = [
            {"id": 1, "userId": 4, "userName": "Amit Patel", "location": "Supe Road",
             "description": "Garbage overflow since 2 days", "status": "pending",
             "createdAt": "2026-02-15T10:30:00"},
            {"id": 2, "userId": 4, "userName": "Amit Patel", "location": "Market Yard Baramati",
             "description": "Stray dogs tearing garbage bags", "status": "in_progress",
             "createdAt": "2026-02-14T14:20:00"},
            {"id": 3, "userId": 4, "userName": "Amit Patel", "location": "Shivaji Chowk",
             "description": "Bin is damaged and leaking", "status": "resolved",
             "createdAt": "2026-02-13T09:15:00"},
        ]
        self._complaint_id = 3

        # Rewards — points earned per citizen
        self.rewards = {
            4: {"points": 150, "level": "Silver", "history": [
                {"action": "Complaint submitted", "points": 50, "date": "2026-02-15T10:30:00"},
                {"action": "Complaint submitted", "points": 50, "date": "2026-02-14T14:20:00"},
                {"action": "Complaint resolved", "points": 50, "date": "2026-02-13T09:15:00"},
            ]}
        }

        # Worker assignments
        self.assignments = [
            {"workerId": 2, "workerName": "Ravi Kumar", "binIds": [1, 5, 10], "status": "active", "assignedAt": "2026-02-17T06:00:00"},
            {"workerId": 3, "workerName": "Priya Sharma", "binIds": [6, 11], "status": "active", "assignedAt": "2026-02-17T06:00:00"},
        ]

        # Tasks assigned by admin to workers
        self.tasks = [
            {
                "id": 1, "workerId": 2, "workerName": "Ravi Kumar", "complaintId": 1,
                "title": "Clear overflow at Supe Road",
                "description": "Garbage overflow reported by citizen. Clear the area and sanitize.",
                "location": "Supe Road",
                "priority": "high", "status": "in_progress",
                "assignedAt": "2026-02-16T08:00:00", "completedAt": None,
                "completionPhotos": [],
                "completionNote": None,
            },
            {
                "id": 2, "workerId": 3, "workerName": "Priya Sharma", "complaintId": 2,
                "title": "Clean Market Yard area",
                "description": "Stray dogs tearing garbage bags. Clean area and install better bins.",
                "location": "Market Yard Baramati",
                "priority": "medium", "status": "completed",
                "assignedAt": "2026-02-15T07:00:00", "completedAt": "2026-02-15T14:30:00",
                "completionPhotos": [],
                "completionNote": "Area cleaned and new covered bins installed.",
            },
        ]
        self._task_id = 2

        # Collection history
        self.collections = [
            {"day": "Mon", "collections": 12},
            {"day": "Tue", "collections": 18},
            {"day": "Wed", "collections": 15},
            {"day": "Thu", "collections": 22},
            {"day": "Fri", "collections": 19},
            {"day": "Sat", "collections": 25},
            {"day": "Sun", "collections": 8},
        ]


store = DataStore()
