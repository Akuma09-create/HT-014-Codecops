from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from apscheduler.schedulers.background import BackgroundScheduler
from .simulator import simulate_fill_levels
from .routes import auth_routes, bin_routes, alert_routes, complaint_routes, stats_routes, task_routes

scheduler = BackgroundScheduler()


@asynccontextmanager
async def lifespan(app: FastAPI):
    scheduler.add_job(simulate_fill_levels, "interval", seconds=30)
    scheduler.start()
    print("Cleanify API started — simulator running every 30s")
    yield
    scheduler.shutdown()
    print("Cleanify API shutting down")


app = FastAPI(
    title="Cleanify API",
    description="Smart City Waste Management System — Team Codecops",
    version="1.0.1",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_routes.router, prefix="/api/auth", tags=["Auth"])
app.include_router(bin_routes.router, prefix="/api/bins", tags=["Bins"])
app.include_router(alert_routes.router, prefix="/api/alerts", tags=["Alerts"])
app.include_router(complaint_routes.router, prefix="/api/complaints", tags=["Complaints"])
app.include_router(stats_routes.router, prefix="/api/stats", tags=["Stats"])
app.include_router(task_routes.router, prefix="/api/tasks", tags=["Tasks"])


@app.get("/")
def root():
    """Health check endpoint."""
    return {"message": "Cleanify API is running", "version": "1.0.1"}
