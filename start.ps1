# Cleanify — Start Backend + Frontend

Write-Host "Starting Cleanify..." -ForegroundColor Cyan

# Start backend in background
Write-Host "Starting backend (FastAPI) on http://localhost:8000 ..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; uvicorn app.main:app --reload --host 127.0.0.1 --port 8000"

# Wait a moment for backend to start
Start-Sleep -Seconds 2

# Start frontend in background
Write-Host "Starting frontend (Vite) on http://localhost:5173 ..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; npm run dev"

Write-Host "`nBoth servers starting!" -ForegroundColor Cyan
Write-Host "  Backend:  http://localhost:8000" -ForegroundColor Yellow
Write-Host "  Frontend: http://localhost:5173" -ForegroundColor Yellow
Write-Host "  API Docs: http://localhost:8000/docs" -ForegroundColor Yellow
