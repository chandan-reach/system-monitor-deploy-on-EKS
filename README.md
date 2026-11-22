# DevOps Monitor

A database-free system monitoring dashboard.

## Stack
- Frontend: HTML, CSS, vanilla JavaScript, served by Express on port 3000
- Backend: Flask + psutil on port 5000
- Metrics: CPU, RAM, disk, network counters, Flask process uptime
- No database

## Run backend (PowerShell)
```powershell
cd backend
python -m venv .venv
.venv\\Scripts\\Activate.ps1
python -m pip install -r requirements.txt
python app.py
```

## Run frontend (second PowerShell)
```powershell
cd frontend
npm install
npm start
```
Open http://localhost:3000

## API endpoints
- GET /api/health
- GET /api/metrics

The frontend calls http://localhost:5000. For a deployed environment, update API_BASE in frontend/public/app.js and configure CORS to allow the frontend origin.
