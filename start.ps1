<#
.SYNOPSIS
    kppdf-4.0 launcher — one command to start everything
.DESCRIPTION
    1. Check Node.js and npm
    2. Install dependencies (frontend + backend)
    3. Start Docker containers: kppdf-mongodb + kppdf-chromadb
       - If container exists and running on correct port — use it
       - If foreign container occupies our port — stop it
       - If container doesn't exist — create it
    4. Free ports 3000 and 4200
    5. Start backend (Express on port 3000)
    6. Start frontend (Angular on port 4200)
    7. Wait for compilation and open browser
.PARAMETER NoBrowser
    Don't open browser automatically
.NOTES
    Windows 10/11, PowerShell 5.1+
    Requires Docker Desktop to be running.
    Example: .\start.ps1
             .\start.ps1 -NoBrowser
#>

param(
    [switch]$NoBrowser
)

$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path -Parent $PSCommandPath

# ---- Container config ----
$MongoContainer = "kppdf-mongodb"
$MongoVolume   = "kppdf-mongodb-data"
$MongoImage    = "mongo:8"
$MongoPort     = "27017"

$ChromaContainer = "kppdf-chromadb"
$ChromaVolume    = "kppdf-chromadb-data"
$ChromaImage     = "chromadb/chroma:latest"
$ChromaPort      = "8000"

# ---- Status variables ----
$mongoOk  = $false
$chromaOk = $false
$backendOk  = $false
$angularReady = $false

# ---- Colors ----
function Write-Step { param([string]$Msg) Write-Host "`n[STEP] $Msg" -ForegroundColor Cyan }
function Write-OK   { param([string]$Msg) Write-Host "  OK  $Msg" -ForegroundColor Green }
function Write-Warn { param([string]$Msg) Write-Host "  !!  $Msg" -ForegroundColor Yellow }
function Write-Err  { param([string]$Msg) Write-Host "  XX  $Msg" -ForegroundColor Red }

Write-Host "kppdf-4.0 — Starting..." -ForegroundColor Magenta

# ============================================
# 1. Check Node.js
# ============================================
Write-Step "Checking Node.js..."
try {
    $nodeVer = node -v
    $npmVer  = npm -v
    Write-OK "Node.js $nodeVer, npm $npmVer"
} catch {
    Write-Err "Node.js not found. Install Node.js 22+ from https://nodejs.org"
    exit 1
}

# ============================================
# 2. Install dependencies
# ============================================
Write-Step "Installing frontend dependencies..."
Push-Location $ProjectRoot
if (-not (Test-Path "node_modules")) {
    npm install --loglevel error
    if ($LASTEXITCODE -ne 0) { Pop-Location; Write-Err "npm install (frontend) failed"; exit 1 }
    Write-OK "Frontend dependencies installed"
} else {
    Write-OK "Frontend dependencies exist — skipping"
}
Pop-Location

Write-Step "Installing backend dependencies..."
Push-Location (Join-Path $ProjectRoot "backend")
if (-not (Test-Path "node_modules")) {
    npm install --loglevel error
    if ($LASTEXITCODE -ne 0) { Pop-Location; Write-Err "npm install (backend) failed"; exit 1 }
    Write-OK "Backend dependencies installed"
} else {
    Write-OK "Backend dependencies exist — skipping"
}

if (-not (Test-Path ".env")) {
    Write-Warn "backend/.env not found. Copying from .env.example..."
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-OK "backend/.env created from .env.example"
    } else {
        Write-Warn "backend/.env.example missing — backend may not work"
    }
}
Pop-Location

# ============================================
# 3. Docker — ensure MongoDB + ChromaDB containers
# ============================================
Write-Step "Checking Docker..."

# Try to auto-start Docker Desktop if not running
$dockerReady = $false
$dockerPaths = @(
    "$env:ProgramFiles\Docker\Docker\Docker Desktop.exe",
    "${env:ProgramFiles(x86)}\Docker\Docker\Docker Desktop.exe",
    "$env:LOCALAPPDATA\Docker\Docker Desktop.exe"
)

for ($attempt = 0; $attempt -lt 2; $attempt++) {
    try {
        $dockerVer = docker version --format "{{.Server.Version}}" 2>&1
        if ($LASTEXITCODE -eq 0 -and $dockerVer) {
            Write-OK "Docker v$dockerVer available"
            $dockerReady = $true
            break
        }
    } catch { }

    # Docker not running — try to launch Docker Desktop
    if ($attempt -eq 0) {
        $dockerExe = $null
        foreach ($p in $dockerPaths) {
            if (Test-Path $p) { $dockerExe = $p; break }
        }
        if ($dockerExe) {
            Write-Warn "Docker not running. Launching Docker Desktop..."
            Start-Process $dockerExe
            Write-OK "Waiting for Docker daemon (up to 60s)..."
            $waitStart = Get-Date
            while (((Get-Date) - $waitStart).TotalSeconds -lt 60) {
                Start-Sleep -Seconds 3
                try {
                    $dv = docker version --format "{{.Server.Version}}" 2>&1
                    if ($LASTEXITCODE -eq 0 -and $dv) {
                        Write-OK "Docker v$dv ready (waited $([math]::Round(((Get-Date) - $waitStart).TotalSeconds))s)"
                        $dockerReady = $true
                        break
                    }
                } catch { }
            }
            if ($dockerReady) { break }
        }
    }
}

if (-not $dockerReady) {
    Write-Err "Docker is not running and could not be auto-started."
    Write-Err "Start Docker Desktop manually, then run .\start.ps1 again."
    Write-Err "Download: https://www.docker.com/products/docker-desktop/"
    exit 1
}

# ---- Helper: ensure our container on a specific port ----
function Ensure-Container {
    param(
        [string]$Name,
        [string]$Image,
        [string]$Port,
        [string]$Volume,
        [string[]]$ExtraArgs
    )

    $runningOnPort = docker ps --filter "publish=$Port" --format "{{.Names}}" 2>&1
    $ourRunning    = docker ps --filter "name=$Name" --filter "status=running" --format "{{.Names}}" 2>&1
    $ourExists     = docker ps -a --filter "name=$Name" --format "{{.Names}}" 2>&1

    # CASE 1: Our container is already running
    if ($ourRunning -eq $Name) {
        $portCheck = docker port $Name $Port 2>&1
        if ($LASTEXITCODE -eq 0 -and $portCheck -match ":$Port") {
            Write-OK "Container '$Name' already running on port $Port"
            return $true
        } else {
            Write-Warn "Container '$Name' running but NOT on port $Port. Recreating..."
            docker stop $Name 2>&1 | Out-Null
            docker rm -f $Name 2>&1 | Out-Null
            Start-Sleep -Seconds 1
        }
    }

    # CASE 2: Foreign container occupies our port — STOP IT
    if ($runningOnPort -and $runningOnPort -ne $Name) {
        Write-Warn "Foreign container '$runningOnPort' occupies port $Port — stopping..."
        docker stop $runningOnPort 2>&1 | Out-Null
        docker rm -f $runningOnPort 2>&1 | Out-Null
        Write-OK "Foreign container '$runningOnPort' removed"
        Start-Sleep -Seconds 2
    }

    # CASE 3: Our container exists but stopped — remove and recreate
    if ($ourExists -eq $Name) {
        Write-Warn "Removing stale '$Name' container..."
        docker rm -f $Name 2>&1 | Out-Null
    }

    # CREATE fresh container
    Write-Step "Creating '$Name' container ($Image)..."
    $args = @(
        "run", "-d",
        "--name", $Name,
        "--restart", "unless-stopped",
        "-p", "${Port}:${Port}"
    )
    if ($Volume) { $args += @("-v", "${Volume}:/data/db") }
    if ($ExtraArgs) { $args += $ExtraArgs }

    $result = docker @args $Image 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-OK "Container '$Name' created"
        return $true
    } else {
        Write-Err "Failed to create '$Name': $result"
        return $false
    }
}

# ---- MongoDB ----
$mongoCreated = Ensure-Container -Name $MongoContainer -Image $MongoImage -Port $MongoPort -Volume $MongoVolume `
    -ExtraArgs @("-e", "MONGO_INITDB_DATABASE=kppdf-4.0")

if ($mongoCreated) {
    Write-OK "Waiting for MongoDB to be ready..."
    Start-Sleep -Seconds 5

    # Verify MongoDB
    for ($i = 0; $i -lt 5; $i++) {
        try {
            $ping = docker exec $MongoContainer mongosh --quiet --eval "db.runCommand({ping:1})" 2>&1
            if ($LASTEXITCODE -eq 0 -and $ping -match '"ok"\s*:\s*1') {
                Write-OK "MongoDB: ping OK"
                $mongoOk = $true
                break
            }
        } catch { }
        if ($i -lt 4) { Start-Sleep -Seconds 2 }
    }
    if (-not $mongoOk) {
        Write-Warn "MongoDB: ping failed — container may still be starting"
    }
}

# ---- ChromaDB ----
$chromaCreated = Ensure-Container -Name $ChromaContainer -Image $ChromaImage -Port $ChromaPort -Volume "" `
    -ExtraArgs @("-v", "${ChromaVolume}:/chroma/chroma", "-e", "IS_PERSISTENT=TRUE", "-e", "ANONYMIZED_TELEMETRY=FALSE")

if ($chromaCreated) {
    Write-OK "Waiting for ChromaDB to be ready..."
    Start-Sleep -Seconds 3

    # Verify ChromaDB
    for ($i = 0; $i -lt 5; $i++) {
        try {
            $hb = Invoke-WebRequest -Uri "http://localhost:${ChromaPort}/api/v2/heartbeat" -UseBasicParsing -TimeoutSec 3 -ErrorAction Stop
            if ($hb.StatusCode -eq 200) {
                Write-OK "ChromaDB: heartbeat OK"
                $chromaOk = $true
                break
            }
        } catch { }
        if ($i -lt 4) { Start-Sleep -Seconds 2 }
    }
    if (-not $chromaOk) {
        Write-Warn "ChromaDB: heartbeat failed — container may still be starting"
    }
}

# ============================================
# 4. Free ports 3000, 4200
# ============================================
Write-Step "Checking ports..."

function Free-Port($Port) {
    $conn = netstat -ano | Select-String ":$Port "
    if ($conn) {
        foreach ($line in $conn) {
            $parts = ($line -split '\s+') | Where-Object { $_ -ne '' }
            $procId = $parts[-1]
            if ($procId -and $procId -match '^\d+$' -and $procId -ne '0') {
                try {
                    $proc = Get-Process -Id $procId -ErrorAction Stop
                    if ($proc.ProcessName -ne "powershell" -or $proc.Id -ne $PID) {
                        Stop-Process -Id $procId -Force -ErrorAction Stop
                        Write-Warn "Port ${Port}: killed process ${procId} ($($proc.ProcessName))"
                    }
                } catch {
                    Write-Warn "Port ${Port}: in use by process ${procId} — could not kill"
                }
            }
        }
        Start-Sleep -Seconds 1
    } else {
        Write-OK "Port $Port is free"
    }
}
Free-Port 3000
Free-Port 4200

# ============================================
# 5. Start backend
# ============================================
Write-Step "Starting backend..."
$backendDir = Join-Path $ProjectRoot "backend"
Get-Process -Name "tsx" -ErrorAction SilentlyContinue | Stop-Process -Force

$psi = @{
    FilePath     = "powershell"
    ArgumentList = @(
        "-NoExit",
        "-Command",
        "Write-Host '=== BACKEND (kppdf-4.0) ===' -ForegroundColor Cyan; cd '$backendDir'; Write-Host 'Starting backend...' -ForegroundColor Yellow; npx tsx watch src/index.ts"
    )
    PassThru     = $true
}
$backendJob = Start-Process @psi

Start-Sleep -Seconds 5
Write-OK "Backend starting on http://localhost:3000"
Write-OK "API:     http://localhost:3000/api/v1"
Write-OK "Swagger: http://localhost:3000/api/docs"

# ============================================
# 6. Start frontend
# ============================================
Write-Step "Starting frontend..."
Get-Process -Name "ng" -ErrorAction SilentlyContinue | Stop-Process -Force
$env:NG_CLI_ANALYTICS = "false"

$psi2 = @{
    FilePath     = "powershell"
    ArgumentList = @(
        "-NoExit",
        "-Command",
        "Write-Host '=== FRONTEND (Angular 21) ===' -ForegroundColor Cyan; Write-Host 'Compiling...' -ForegroundColor Yellow; cd '$ProjectRoot'; npx ng serve --port 4200 --open"
    )
    PassThru     = $true
}
$frontendJob = Start-Process @psi2

# ============================================
# 7. Wait for Angular compilation
# ============================================
Write-Host "`nWaiting for Angular compilation (30-60 sec)..." -ForegroundColor Yellow
Write-Host "  Frontend will be available at http://localhost:4200" -ForegroundColor Gray

$timeout = 120
$elapsed = 0
while ($elapsed -lt $timeout) {
    Start-Sleep -Seconds 2
    $elapsed += 2
    try {
        $conn = netstat -ano | Select-String ":4200 "
        if ($conn) {
            try {
                $response = Invoke-WebRequest -Uri "http://localhost:4200" -UseBasicParsing -TimeoutSec 2 -ErrorAction Stop
                if ($response.StatusCode -eq 200) {
                    $angularReady = $true
                    Write-OK "Angular compiled and ready (${elapsed}s)"
                    break
                }
            } catch { }
        }
    } catch { }

    if ($elapsed % 10 -eq 0) {
        Write-Warn "  Waiting for Angular... (${elapsed}s)"
    }
}

if (-not $angularReady) {
    Write-Warn "Angular did not respond within ${timeout}s. Check the frontend window."
}

if (-not $NoBrowser -and $angularReady) {
    Write-Step "Opening browser..."
    Start-Process "http://localhost:4200"
}

# ============================================
# 8. Connection checks
# ============================================
Write-Host ""
Write-Step "Checking connections..."

# Backend API
$apiWait = 0
$apiTimeout = 30
while ($apiWait -lt $apiTimeout) {
    try {
        $apiResp = Invoke-WebRequest -Uri "http://localhost:3000/api/health" -UseBasicParsing -TimeoutSec 2 -ErrorAction Stop
        if ($apiResp.StatusCode -eq 200) {
            Write-OK "Backend API: connected (http://localhost:3000/api/health)"
            $backendOk = $true
            break
        }
    } catch {
        Start-Sleep -Seconds 2
        $apiWait += 2
    }
}
if (-not $backendOk) {
    Write-Warn "Backend API: not responding (waited ${apiTimeout}s) — check backend window"
}

# ============================================
# 9. Summary
# ============================================
Write-Host ""
Write-Host "kppdf-4.0 started!" -ForegroundColor Green
Write-Host "  Frontend: http://localhost:4200" -ForegroundColor Cyan
Write-Host "  Backend:  http://localhost:3000" -ForegroundColor Cyan
Write-Host "  API:      http://localhost:3000/api/v1" -ForegroundColor Cyan
Write-Host "  Swagger:  http://localhost:3000/api/docs" -ForegroundColor Cyan
Write-Host "  MongoDB:  localhost:27017 (container: $MongoContainer)" -ForegroundColor Cyan
Write-Host "  ChromaDB: localhost:8000 (container: $ChromaContainer)" -ForegroundColor Cyan
Write-Host ""
Write-Host "Connection status:" -ForegroundColor Gray
if ($mongoOk) {
    Write-Host "  [OK] MongoDB  — ping OK ($MongoContainer)" -ForegroundColor Green
} else {
    Write-Host "  [!!] MongoDB  — not responding" -ForegroundColor Red
}
if ($chromaOk) {
    Write-Host "  [OK] ChromaDB — heartbeat OK ($ChromaContainer)" -ForegroundColor Green
} else {
    Write-Host "  [!!] ChromaDB — not responding" -ForegroundColor Red
}
if ($backendOk) {
    Write-Host "  [OK] Backend  — connected" -ForegroundColor Green
} else {
    Write-Host "  [!!] Backend  — not connected" -ForegroundColor Red
}
if ($angularReady) {
    Write-Host "  [OK] Frontend — connected" -ForegroundColor Green
} else {
    Write-Host "  [!!] Frontend — not connected" -ForegroundColor Red
}
Write-Host ""
Write-Host "Data is persistent in Docker volumes:" -ForegroundColor Gray
Write-Host "  $MongoVolume" -ForegroundColor Gray
Write-Host "  $ChromaVolume" -ForegroundColor Gray
Write-Host ""
Write-Host "To stop: close PowerShell windows, or run: docker stop $MongoContainer $ChromaContainer" -ForegroundColor Gray
Write-Host "To restart: .\start.ps1 (containers will be reused)" -ForegroundColor Gray
