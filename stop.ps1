<#
.SYNOPSIS
    kppdf-4.0 — stop all processes
.DESCRIPTION
    Stops frontend, backend and optionally Docker containers
.PARAMETER StopDocker
    Stop and remove Docker containers (kppdf-mongodb, kppdf-chromadb)
#>

param(
    [switch]$StopDocker
)

$ErrorActionPreference = "SilentlyContinue"
$ProjectRoot = Split-Path -Parent $PSCommandPath

Write-Host "kppdf-4.0 - Stopping..." -ForegroundColor Cyan

# Frontend (ng)
$ngProcess = Get-Process -Name "ng" -ErrorAction SilentlyContinue
if ($ngProcess) {
    $ngProcess | Stop-Process -Force
    Write-Host "  Frontend (ng) stopped" -ForegroundColor Green
} else {
    Write-Host "  Frontend not running" -ForegroundColor Gray
}

# Backend (tsx)
$tsxProcess = Get-Process -Name "tsx" -ErrorAction SilentlyContinue
if ($tsxProcess) {
    $tsxProcess | Stop-Process -Force
    Write-Host "  Backend (tsx) stopped" -ForegroundColor Green
} else {
    Write-Host "  Backend not running" -ForegroundColor Gray
}

# Node processes related to kppdf
$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -match "kppdf" }
if ($nodeProcesses) {
    $nodeProcesses | Stop-Process -Force
    Write-Host "  Node processes (kppdf) stopped" -ForegroundColor Green
}

# Docker
if ($StopDocker) {
    Write-Host ""
    Write-Host "Stopping Docker containers..." -ForegroundColor Yellow

    $composeFile = Join-Path $ProjectRoot "docker-compose.yml"
    if (Test-Path $composeFile) {
        Push-Location $ProjectRoot
        $composeResult = docker compose down 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  Docker Compose: containers stopped" -ForegroundColor Green
        } else {
            Write-Host "  docker compose down: $composeResult" -ForegroundColor Yellow
        }
        Pop-Location
    }

    $containers = @("kppdf-mongodb", "kppdf-chromadb", "kppdf-backend")
    foreach ($name in $containers) {
        $exists = docker ps -a --filter "name=$name" --format "{{.Names}}" 2>&1
        if ($exists -match $name) {
            docker stop $name 2>$null
            docker rm $name 2>$null
            Write-Host "  Container $name removed" -ForegroundColor Green
        }
    }
}

Write-Host "`nProject stopped." -ForegroundColor Green
