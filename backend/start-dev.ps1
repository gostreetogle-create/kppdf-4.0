# ========================================
# Backend Development Start
# 1. Проверяет Docker и запускает если нужно
# 2. Поднимает MongoDB контейнер (если не запущен)
# 3. Запускает бэкенд с tsx watch
# ========================================

$ProjectRoot = Split-Path -Parent $PSScriptRoot

Write-Host "=== BACKEND DEV START ===" -ForegroundColor Cyan

# ─── Helper: test if Docker daemon responds ──────────────────────────
function Test-DockerDaemon {
    $null = docker version 2>&1
    return ($LASTEXITCODE -eq 0)
}

# ─── Helper: test if MongoDB container exists and is running ─────────
function Test-MongoRunning {
    $result = docker ps --format "{{.Names}}" 2>&1
    if ($LASTEXITCODE -ne 0) { return $false }
    return ($result -match '\bkppdf-mongodb\b')
}

# ─── 1. Docker: проверить и запустить ────────────────────────────────
Write-Host "[1/4] Checking Docker..." -ForegroundColor Yellow

if (Get-Command docker -ErrorAction SilentlyContinue) {
    if (Test-DockerDaemon) {
        Write-Host "  Docker daemon is running" -ForegroundColor Green
    } else {
        Write-Host "  Docker daemon not responding. Starting com.docker.service..." -ForegroundColor Yellow

        # Запуск службы Docker (sc.exe обязателен: sc → Set-Content в PS!)
        sc.exe start com.docker.service 2>&1 | Out-Null

        # Если Docker Desktop не запущен — запускаем GUI
        $dockerExe = "$env:ProgramFiles\Docker\Docker\Docker Desktop.exe"
        if (Test-Path $dockerExe) {
            Write-Host "  Launching Docker Desktop..." -ForegroundColor Yellow
            Start-Process $dockerExe -WindowStyle Hidden
        }

        # Ждём daemon (до 60 секунд)
        Write-Host "  Waiting for Docker daemon (up to 60s)..." -ForegroundColor Yellow
        $waited = 0; $daemonReady = $false
        do {
            Start-Sleep -Seconds 3
            $waited += 3
            if (Test-DockerDaemon) { $daemonReady = $true; break }
        } while ($waited -lt 60)

        if ($daemonReady) {
            Write-Host "  Docker daemon is now running" -ForegroundColor Green
        } else {
            Write-Host "  ERROR: Docker daemon did not start within 60s" -ForegroundColor Red
            Write-Host "  Falling back — backend will run WITHOUT database." -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "  WARN: docker not found in PATH. Backend will run without DB." -ForegroundColor Yellow
}

# ─── 2. MongoDB: проверить и поднять контейнер ───────────────────────
Write-Host "[2/4] Checking MongoDB..." -ForegroundColor Yellow

$dockerOk = (Get-Command docker -ErrorAction SilentlyContinue) -and (Test-DockerDaemon)

if ($dockerOk) {
    if (Test-MongoRunning) {
        Write-Host "  MongoDB container (kppdf-mongodb) is running" -ForegroundColor Green
    } else {
        Write-Host "  Starting MongoDB via Docker Compose..." -ForegroundColor Yellow

        Push-Location $ProjectRoot
        try {
            docker compose up -d mongodb 2>&1 | Out-Null
            if ($LASTEXITCODE -ne 0) {
                Write-Host "  WARN: Failed to start MongoDB container" -ForegroundColor Yellow
            } else {
                Write-Host "  MongoDB container starting..." -ForegroundColor Green

                # Ждём healthy (до 30 секунд)
                Write-Host "  Waiting for MongoDB to be healthy (up to 30s)..." -ForegroundColor Yellow
                $waited = 0; $healthy = $false
                do {
                    Start-Sleep -Seconds 3
                    $waited += 3
                    $health = docker inspect kppdf-mongodb --format '{{.State.Health.Status}}' 2>&1
                    if ($LASTEXITCODE -eq 0 -and $health -eq 'healthy') {
                        $healthy = $true
                        break
                    }
                } while ($waited -lt 30)

                if ($healthy) {
                    Write-Host "  MongoDB is healthy" -ForegroundColor Green
                } else {
                    Write-Host "  WARN: MongoDB may not be fully ready yet (waited ${waited}s)" -ForegroundColor Yellow
                }
            }
        } finally {
            Pop-Location
        }
    }
} else {
    Write-Host "  SKIP: Docker not available" -ForegroundColor Yellow
}

# ─── 3. Порт 3000: освободить если занят ─────────────────────────────
Write-Host "[3/4] Checking port 3000..." -ForegroundColor Yellow

$port3000 = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | Select-Object -First 1
if ($port3000) {
    Write-Host "  Port 3000 is in use (PID $($port3000.OwningProcess)). Killing..." -ForegroundColor Yellow
    Stop-Process -Id $port3000.OwningProcess -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
    Write-Host "  Port 3000 freed" -ForegroundColor Green
} else {
    Write-Host "  Port 3000 is free" -ForegroundColor Green
}

# ─── 4. Start backend ────────────────────────────────────────────────
Write-Host "[4/5] Starting backend..." -ForegroundColor Yellow

Set-Location $PSScriptRoot

Write-Host "  npm install..." -ForegroundColor Yellow
npm install 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "  WARN: npm install had errors (exit code $LASTEXITCODE)" -ForegroundColor Yellow
}

Write-Host "  Launching backend in separate window..." -ForegroundColor Green

# Start backend in a dedicated PowerShell window (user sees live logs)
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "Write-Host '=== BACKEND (kppdf-4.0) ===' -ForegroundColor Cyan; cd '$PSScriptRoot'; Write-Host 'Starting backend...' -ForegroundColor Yellow; npx tsx watch src/index.ts"
)

Write-Host "  Backend window opened" -ForegroundColor Green
Write-Host "  Backend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "  Health:  http://localhost:3000/api/health" -ForegroundColor Cyan

# ─── 5. Connection checks ───────────────────────────────────────────
Write-Host ""
Write-Host "[5/5] Checking connections..." -ForegroundColor Yellow

# --- MongoDB ---
$mongoOk = $false
if ($dockerOk) {
    Write-Host "  Verifying MongoDB..." -ForegroundColor Gray
    try {
        $ping = docker exec kppdf-mongodb mongosh --quiet --eval "db.runCommand({ping:1})" 2>&1
        if ($LASTEXITCODE -eq 0 -and $ping -match '"ok"\s*:\s*1') {
            Write-Host "  MongoDB: ping OK" -ForegroundColor Green
            $mongoOk = $true
        } else {
            Write-Host "  MongoDB: ping FAILED — $ping" -ForegroundColor Red
        }
    } catch {
        Write-Host "  MongoDB: not reachable — $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "  MongoDB: skipped (Docker not available)" -ForegroundColor Yellow
}

# --- Backend API (health check) ---
$backendOk = $false
$apiWait = 0
$apiTimeout = 30
Write-Host "  Waiting for backend health endpoint..." -ForegroundColor Gray
while ($apiWait -lt $apiTimeout) {
    try {
        $apiResp = Invoke-WebRequest -Uri "http://localhost:3000/api/health" -UseBasicParsing -TimeoutSec 2 -ErrorAction Stop
        if ($apiResp.StatusCode -eq 200) {
            Write-Host "  Backend: health OK" -ForegroundColor Green
            $backendOk = $true
            break
        }
    } catch {
        Start-Sleep -Seconds 2
        $apiWait += 2
        if ($apiWait % 6 -eq 0) {
            Write-Host "  Waiting... (${apiWait}s)" -ForegroundColor Gray
        }
    }
}
if (-not $backendOk) {
    Write-Host "  Backend: not responding (waited ${apiTimeout}s)" -ForegroundColor Red
}

# ─── Summary ────────────────────────────────────────────────────────
Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
if ($backendOk) {
    Write-Host "  Backend dev server started!" -ForegroundColor Green
} else {
    Write-Host "  Backend may still be starting..." -ForegroundColor Yellow
}
Write-Host "  URL:     http://localhost:3000" -ForegroundColor Cyan
Write-Host "  Health:  http://localhost:3000/api/health" -ForegroundColor Cyan
Write-Host "  Swagger: http://localhost:3000/api/docs" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Connection status:" -ForegroundColor Gray
if ($mongoOk) {
    Write-Host "    [OK] MongoDB — connected (kppdf-mongodb)" -ForegroundColor Green
} elseif ($dockerOk) {
    Write-Host "    [!!] MongoDB — not connected" -ForegroundColor Red
} else {
    Write-Host "    [--] MongoDB — skipped (no Docker)" -ForegroundColor Yellow
}
if ($backendOk) {
    Write-Host "    [OK] Backend  — connected" -ForegroundColor Green
} else {
    Write-Host "    [!!] Backend  — not connected" -ForegroundColor Red
}
Write-Host ""
Write-Host "  Close the BACKEND window to stop the server" -ForegroundColor Gray
Write-Host "==========================================" -ForegroundColor Cyan
