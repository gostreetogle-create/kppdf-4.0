<#
.SYNOPSIS
    kppdf-4.0 — универсальный лаунчер
.DESCRIPTION
    Одна команда для запуска всего:
    1. Проверка Node.js и npm
    2. Установка зависимостей (frontend + backend)
    3. Проверка Docker и запуск MongoDB (+ ChromaDB через docker compose)
    4. Освобождение портов 3000 и 4200
    5. Запуск backend (Express на порту 3000)
    6. Запуск frontend (Angular на порту 4200)
    7. Ожидание компиляции и открытие браузера
.PARAMETER NoBrowser
    Не открывать браузер автоматически
.PARAMETER NoDocker
    Не запускать Docker/MongoDB (использовать внешнюю MongoDB)
.PARAMETER UseDockerCompose
    Использовать docker compose вместо ручного запуска контейнера
.NOTES
    Windows 10/11, PowerShell 5.1+
    Пример: .\start.ps1
            .\start.ps1 -NoDocker
            .\start.ps1 -UseDockerCompose -NoBrowser
#>

param(
    [switch]$NoBrowser,
    [switch]$NoDocker,
    [switch]$UseDockerCompose
)

$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path -Parent $PSCommandPath

# ---- Цветовые функции ----
function Write-Step { param([string]$Msg) Write-Host "`n[STEP] $Msg" -ForegroundColor Cyan }
function Write-OK   { param([string]$Msg) Write-Host "  OK $Msg" -ForegroundColor Green }
function Write-Warn { param([string]$Msg) Write-Host "  !! $Msg" -ForegroundColor Yellow }
function Write-Err  { param([string]$Msg) Write-Host "  XX $Msg" -ForegroundColor Red }

Write-Host "kppdf-4.0 - Starting..." -ForegroundColor Cyan

# ============================================
# 1. Check Node.js
# ============================================
Write-Step "Checking Node.js..."
try {
    $nodeVer = node -v
    $npmVer = npm -v
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
    Write-OK "Frontend dependencies exist"
}
Pop-Location

Write-Step "Installing backend dependencies..."
Push-Location (Join-Path $ProjectRoot "backend")
if (-not (Test-Path "node_modules")) {
    npm install --loglevel error
    if ($LASTEXITCODE -ne 0) { Pop-Location; Write-Err "npm install (backend) failed"; exit 1 }
    Write-OK "Backend dependencies installed"
} else {
    Write-OK "Backend dependencies exist"
}

if (-not (Test-Path ".env")) {
    Write-Warn "backend/.env not found. Copying from .env.example..."
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-OK "backend/.env created from .env.example"
    } else {
        Write-Warn "backend/.env.example also missing - backend may not work"
    }
}
Pop-Location

# ============================================
# 3. Docker / MongoDB
# ============================================
$ContainerName = "kppdf-mongodb"
$VolumeName = "kppdf-mongodb-data"
$MongoImage = "mongo:8"

if (-not $NoDocker) {
    Write-Step "Checking Docker..."
    $dockerAvailable = $false
    try {
        $dv = docker version --format "{{.Server.Version}}" 2>&1
        if ($LASTEXITCODE -eq 0 -and $dv) {
            Write-OK "Docker $dv"
            $dockerAvailable = $true
        } else {
            throw "Docker daemon not running"
        }
    } catch {
        Write-Warn "Docker not available. MongoDB must be started manually."
    }

    if ($dockerAvailable) {
        if ($UseDockerCompose) {
            Write-Warn "Starting MongoDB + ChromaDB via docker compose (backend manually)..."
            $composeResult = docker compose up -d mongodb chromadb 2>&1
            if ($LASTEXITCODE -eq 0) {
                Write-OK "docker compose: MongoDB + ChromaDB started"
                Start-Sleep -Seconds 5
            } else {
                Write-Warn "docker compose failed: $composeResult"
                Write-Warn "Trying manual MongoDB start..."
                $UseDockerCompose = $false
            }
        }

        if (-not $UseDockerCompose) {
            $portInUse = netstat -ano | findstr ":27017 "
            $containerOnPort = docker ps --filter "publish=27017" --format "{{.Names}}" 2>&1
            $ourContainerRunning = docker ps --filter "name=$ContainerName" --filter "status=running" --format "{{.Names}}" 2>&1
            $ourContainerExists = docker ps -a --filter "name=$ContainerName" --format "{{.Names}}" 2>&1

            if ($ourContainerRunning -match $ContainerName) {
                Write-OK "MongoDB container already running ($ContainerName)"
            } elseif ($containerOnPort) {
                Write-Warn "Port 27017 already in use by container: $containerOnPort"
                Write-OK "Using existing MongoDB on port 27017"
            } elseif ($portInUse) {
                Write-Warn "Port 27017 in use by non-Docker process."
                Write-Warn "MongoDB container not started."
            } else {
                if ($ourContainerExists) {
                    Write-Warn "Removing old MongoDB container..."
                    docker rm -f $ContainerName 2>&1 | Out-Null
                }

                Write-Warn "Starting MongoDB container..."
                $result = docker run -d --name $ContainerName --restart unless-stopped -p 27017:27017 -v ${VolumeName}:/data/db $MongoImage 2>&1
                if ($LASTEXITCODE -eq 0) {
                    Write-OK "MongoDB container started ($MongoImage)"
                    Start-Sleep -Seconds 4
                } else {
                    Write-Warn "Failed to start MongoDB: $result"
                    Write-Warn "Frontend dev will work, but API will be unavailable."
                }
            }
        }
    }
} else {
    Write-Warn "Docker skipped (use -NoDocker flag)"
}

Write-OK "Continuing startup..."

# ============================================
# 4. Free ports
# ============================================
Write-Step "Checking ports..."
function Free-Port($Port) {
    $conn = netstat -ano | findstr ":$Port "
    if ($conn) {
        foreach ($line in $conn) {
            $parts = ($line -split '\s+') | Where-Object { $_ -ne '' }
            $procId = $parts[-1]
            if ($procId -and $procId -match '^\d+$' -and $procId -ne '0') {
                try {
                    $proc = Get-Process -Id $procId -ErrorAction Stop
                    if ($proc.ProcessName -ne "powershell" -or $proc.Id -ne $PID) {
                        Stop-Process -Id $procId -Force -ErrorAction Stop
                        Write-Warn "Port ${Port}: process ${procId} ($($proc.ProcessName)) killed"
                    }
                } catch {
                    Write-Warn "Port ${Port}: in use by process ${procId} (could not kill)"
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
    FilePath = "powershell"
    ArgumentList = @(
        "-NoExit",
        "-Command", "Write-Host '=== BACKEND (kppdf-4.0) ===' -ForegroundColor Cyan; cd '$backendDir'; Write-Host 'Starting backend...' -ForegroundColor Yellow; npx tsx watch src/index.ts"
    )
    PassThru = $true
}
$backendJob = Start-Process @psi

Start-Sleep -Seconds 5
Write-OK "Backend starting on http://localhost:3000"
Write-OK "API: http://localhost:3000/api/v1"
Write-OK "Swagger: http://localhost:3000/api/docs"

# ============================================
# 6. Start frontend
# ============================================
Write-Step "Starting frontend..."
Get-Process -Name "ng" -ErrorAction SilentlyContinue | Stop-Process -Force
$env:NG_CLI_ANALYTICS = "false"

$psi2 = @{
    FilePath = "powershell"
    ArgumentList = @(
        "-NoExit",
        "-Command", "Write-Host '=== FRONTEND (Angular 21) ===' -ForegroundColor Cyan; Write-Host 'Compiling...' -ForegroundColor Yellow; cd '$ProjectRoot'; npx ng serve --port 4200 --open"
    )
    PassThru = $true
}
$frontendJob = Start-Process @psi2

# ============================================
# 7. Wait for Angular, open browser
# ============================================
Write-Host "`nWaiting for Angular compilation (30-60 sec)..." -ForegroundColor Yellow
Write-Host "  Frontend will be at http://localhost:4200" -ForegroundColor Gray

$timeout = 120
$elapsed = 0
$angularReady = $false
while ($elapsed -lt $timeout) {
    Start-Sleep -Seconds 2
    $elapsed += 2
    try {
        $conn = netstat -ano | findstr ":4200 "
        if ($conn) {
            try {
                $response = Invoke-WebRequest -Uri "http://localhost:4200" -UseBasicParsing -TimeoutSec 2 -ErrorAction Stop
                if ($response.StatusCode -eq 200) {
                    $angularReady = $true
                    Write-OK "Angular compiled and ready ($($elapsed)s)"
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
    Write-Warn "Angular did not respond in ${timeout}s. Check the frontend window manually."
}

if (-not $NoBrowser -and $angularReady) {
    Write-Step "Opening browser..."
    Start-Process "http://localhost:4200"
}

# ============================================
# 8. Summary
# ============================================
Write-Host ""
Write-Host "kppdf-4.0 started!" -ForegroundColor Green
Write-Host "  Frontend: http://localhost:4200" -ForegroundColor Cyan
Write-Host "  Backend:  http://localhost:3000" -ForegroundColor Cyan
Write-Host "  API:      http://localhost:3000/api/v1" -ForegroundColor Cyan
Write-Host "  Swagger:  http://localhost:3000/api/docs" -ForegroundColor Cyan
if (-not $NoDocker) {
    Write-Host "  MongoDB:  localhost:27017" -ForegroundColor Cyan
}
Write-Host ""
Write-Host "To stop: close PowerShell windows or run stop.ps1" -ForegroundColor Gray
Write-Host "To restart: run .\start.ps1 again (ports will be freed)" -ForegroundColor Gray
