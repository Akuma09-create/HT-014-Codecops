// ── Mock data for frontend-only rendering (mirrors backend seed data) ──

export const bins = [
  { id: 1, location: "MG Road & Brigade Rd Junction", area: "Central", fillLevel: 82, status: "full", lastCollected: "2026-02-16T08:30:00", sensorBattery: 78 },
  { id: 2, location: "Koramangala 4th Block", area: "South", fillLevel: 45, status: "half", lastCollected: "2026-02-16T08:30:00", sensorBattery: 92 },
  { id: 3, location: "Indiranagar 100ft Road", area: "East", fillLevel: 91, status: "overflow", lastCollected: "2026-02-16T08:30:00", sensorBattery: 65 },
  { id: 4, location: "Rajajinagar 1st Block", area: "West", fillLevel: 23, status: "empty", lastCollected: "2026-02-16T08:30:00", sensorBattery: 88 },
  { id: 5, location: "Hebbal Flyover", area: "North", fillLevel: 67, status: "half", lastCollected: "2026-02-16T08:30:00", sensorBattery: 71 },
  { id: 6, location: "Jayanagar 4th Block", area: "South", fillLevel: 95, status: "overflow", lastCollected: "2026-02-16T08:30:00", sensorBattery: 54 },
  { id: 7, location: "Whitefield Main Road", area: "East", fillLevel: 38, status: "empty", lastCollected: "2026-02-16T08:30:00", sensorBattery: 96 },
  { id: 8, location: "Malleshwaram 8th Cross", area: "West", fillLevel: 56, status: "half", lastCollected: "2026-02-16T08:30:00", sensorBattery: 83 },
  { id: 9, location: "Yelahanka New Town", area: "North", fillLevel: 12, status: "empty", lastCollected: "2026-02-16T08:30:00", sensorBattery: 97 },
  { id: 10, location: "Commercial Street", area: "Central", fillLevel: 78, status: "full", lastCollected: "2026-02-16T08:30:00", sensorBattery: 62 },
  { id: 11, location: "BTM Layout 2nd Stage", area: "South", fillLevel: 88, status: "full", lastCollected: "2026-02-16T08:30:00", sensorBattery: 45 },
  { id: 12, location: "Marathahalli Bridge", area: "East", fillLevel: 34, status: "empty", lastCollected: "2026-02-16T08:30:00", sensorBattery: 90 },
  { id: 13, location: "Vijayanagar BDA Complex", area: "West", fillLevel: 61, status: "half", lastCollected: "2026-02-16T08:30:00", sensorBattery: 76 },
  { id: 14, location: "RT Nagar Main Road", area: "North", fillLevel: 49, status: "half", lastCollected: "2026-02-16T08:30:00", sensorBattery: 81 },
  { id: 15, location: "Residency Road", area: "Central", fillLevel: 72, status: "half", lastCollected: "2026-02-16T08:30:00", sensorBattery: 58 },
];

export const alerts = bins
  .filter(b => b.fillLevel >= 80)
  .map((b, i) => ({
    id: i + 1,
    binId: b.id,
    location: b.location,
    area: b.area,
    fillLevel: b.fillLevel,
    type: b.fillLevel >= 90 ? "overflow" : "high_fill",
    status: "active",
    createdAt: "2026-02-17T06:00:00",
  }));

export const complaints = [
  { id: 1, userId: 4, userName: "Amit Patel", location: "BTM Layout 2nd Stage", description: "Garbage overflow since 2 days", status: "pending", createdAt: "2026-02-15T10:30:00" },
  { id: 2, userId: 4, userName: "Amit Patel", location: "Koramangala 4th Block", description: "Stray dogs tearing garbage bags", status: "in_progress", createdAt: "2026-02-14T14:20:00" },
  { id: 3, userId: 4, userName: "Amit Patel", location: "MG Road", description: "Bin is damaged and leaking", status: "resolved", createdAt: "2026-02-13T09:15:00" },
];

export const workers = [
  { id: 2, name: "Ravi Kumar", email: "worker1@cleanify.com", role: "worker", assignedBins: [1, 5, 10] },
  { id: 3, name: "Priya Sharma", email: "worker2@cleanify.com", role: "worker", assignedBins: [6, 11] },
];

export const collectionsOverTime = [
  { day: "Mon", collections: 12 },
  { day: "Tue", collections: 18 },
  { day: "Wed", collections: 15 },
  { day: "Thu", collections: 22 },
  { day: "Fri", collections: 19 },
  { day: "Sat", collections: 25 },
  { day: "Sun", collections: 8 },
];

export const fillDistribution = [
  { range: "0-25%", count: bins.filter(b => b.fillLevel <= 25).length },
  { range: "26-50%", count: bins.filter(b => b.fillLevel > 25 && b.fillLevel <= 50).length },
  { range: "51-75%", count: bins.filter(b => b.fillLevel > 50 && b.fillLevel <= 75).length },
  { range: "76-100%", count: bins.filter(b => b.fillLevel > 75).length },
];

export const stats = {
  totalBins: bins.length,
  fullBins: bins.filter(b => ["full", "overflow"].includes(b.status)).length,
  avgFillLevel: Math.round(bins.reduce((s, b) => s + b.fillLevel, 0) / bins.length),
  pendingAlerts: alerts.filter(a => a.status === "active").length,
  pendingComplaints: complaints.filter(c => c.status === "pending").length,
  activeWorkers: workers.length,
  collectionRate: 87,
};
