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

# ─── 4. Бэкенд ──────────────────────────────────────────────────────
Write-Host "[4/4] Starting backend..." -ForegroundColor Yellow

Set-Location $PSScriptRoot

Write-Host "  npm install..." -ForegroundColor Yellow
npm install 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "  WARN: npm install had errors (exit code $LASTEXITCODE)" -ForegroundColor Yellow
}

Write-Host "  Starting tsx watch..." -ForegroundColor Green
Write-Host "  Backend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "  Health:  http://localhost:3000/api/health" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

npx tsx watch src/index.ts
