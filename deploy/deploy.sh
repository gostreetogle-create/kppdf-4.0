#!/usr/bin/env bash
# ============================================================================
# KPPDF 4.0 — Единый скрипт деплоя
# ============================================================================
# Аналогичен kppdf-3.0/deploy.sh, адаптирован под структуру 4.0:
#   - Angular 21 (standalone)
#   - Backend с tsx (без tsc build)
#   - ChromaDB добавлена
#   - Порт 4000 (чтобы не конфликтовать с 3.0)
# ============================================================================
#
# 1) ЗАПУСК ЛОКАЛЬНО (на машине разработчика):
#    bash deploy/deploy.sh
#      → собирает Angular
#      → создаёт архив kppdf-deploy.tar.gz
#      → загружает на сервер через SCP
#      → подключается по SSH и запускает деплой на сервере
#
#    Флаги:
#      bash deploy/deploy.sh --skip-build    # не пересобирать Angular
#      bash deploy/deploy.sh --skip-seed     # не запускать seed
#      bash deploy/deploy.sh --help          # справка
#
# 2) ЗАПУСК НА СЕРВЕРЕ (Ubuntu):
#    sudo bash deploy/deploy.sh [путь_к_архиву.tar.gz]
#      → распаковывает архив в /opt/kppdf-4.0/
#      → собирает Docker образ backend
#      → запускает контейнеры
#      → запускает seed
#      → проверяет health
# ============================================================================

set -euo pipefail

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; NC='\033[0m'
log()    { echo -e "${CYAN}[deploy]${NC} $*"; }
ok()     { echo -e "  ${GREEN}[OK]${NC} $*"; }
warn()   { echo -e "  ${YELLOW}[WARN]${NC} $*"; }
err()    { echo -e "  ${RED}[FAIL]${NC} $*" >&2; exit 1; }
step()   { echo; echo -e "${GREEN}━━━ $* ━━━${NC}"; }
require_cmd() { command -v "$1" >/dev/null 2>&1 || err "Команда '$1' не найдена."; }

# ============================================================================
# ЧТЕНИЕ ФЛАГОВ
# ============================================================================
SKIP_BUILD=0
SKIP_SEED=0
SHOW_HELP=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --skip-build)    SKIP_BUILD=1;    shift ;;
    --skip-seed)     SKIP_SEED=1;     shift ;;
    -h|--help)       SHOW_HELP=1;     shift ;;
    -*)
      echo "[deploy] ОШИБКА: неизвестный аргумент: $1. Используйте --help." >&2
      exit 1
      ;;
    *)
      ARCHIVE_ARG="$1"
      shift
      ;;
  esac
done

if [[ "${SHOW_HELP}" -eq 1 ]]; then
  cat <<'EOF'
╔══════════════════════════════════════════════════╗
║   KPPDF 4.0 — Deploy                            ║
╚══════════════════════════════════════════════════╝

На своём ПК:
  bash deploy/deploy.sh [--skip-build] [--skip-seed]

На сервере:
  sudo bash deploy/deploy.sh [путь_к_архиву.tar.gz]

Флаги:
  --skip-build     не пересобирать Angular
  --skip-seed      не запускать seed
  --help           справка
EOF
  exit 0
fi

# ============================================================================
# ОПРЕДЕЛЕНИЕ РЕЖИМА
# ============================================================================
if [[ -n "${ARCHIVE_ARG:-}" ]]; then
  MODE="server"
elif [[ "$(id -u)" -eq 0 ]] || [[ -f "/opt/kppdf-4.0/deploy/deploy.sh" ]]; then
  MODE="server"
elif [[ -f "$(dirname "$0")/../angular.json" ]]; then
  MODE="local"
else
  MODE="server"
fi

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

if [[ "${MODE}" == "local" ]]; then
  # ==========================================================================
  # ЛОКАЛЬНЫЙ РЕЖИМ — сборка + загрузка на сервер
  # ==========================================================================
  ARCHIVE_NAME="kppdf40-deploy.tar.gz"
  ARCHIVE_PATH="/tmp/${ARCHIVE_NAME}"

  echo ""
  echo "╔══════════════════════════════════════════════════╗"
  echo "║   KPPDF 4.0 — Deploy (локальный режим)          ║"
  echo "╚══════════════════════════════════════════════════╝"
  echo ""

  # ─── Чтение настроек сервера из deploy/config.env ───
  ENV_FILE="${PROJECT_DIR}/deploy/config.env"
  if [[ ! -f "${ENV_FILE}" ]]; then
    if [[ -f "${PROJECT_DIR}/deploy/config.env.example" ]]; then
      cp "${PROJECT_DIR}/deploy/config.env.example" "${ENV_FILE}"
      warn "Создан ${ENV_FILE}. Заполните его перед запуском!"
      cat "${ENV_FILE}"
      exit 1
    fi
    err "Файл deploy/config.env не найден. Скопируйте deploy/config.env.example → deploy/config.env и заполните."
  fi

  # shellcheck source=/dev/null
  source "${ENV_FILE}"

  [[ -n "${DEPLOY_HOST:-}" ]]     || err "DEPLOY_HOST не задан"
  [[ -n "${DEPLOY_USER:-}" ]]     || err "DEPLOY_USER не задан"
  [[ -n "${JWT_SECRET:-}" ]]      || err "JWT_SECRET не задан"

  REMOTE_SSH="${DEPLOY_USER}@${DEPLOY_HOST}"
  SSH_OPTS="-o ConnectTimeout=10 -o StrictHostKeyChecking=accept-new"
  SSH_CMD="ssh ${SSH_OPTS} ${REMOTE_SSH}"
  SCP_CMD="scp ${SSH_OPTS}"
  REMOTE_DIR="${REMOTE_DIR:-/opt/kppdf-4.0}"
  SSH_SUDO="echo '${DEPLOY_PASSWORD}' | sudo -S"

  echo "  Сервер:   ${DEPLOY_USER}@${DEPLOY_HOST}"
  echo "  Папка:    ${REMOTE_DIR}"
  echo "  Порт:     ${BACKEND_PORT:-4000}"
  echo "  Флаги:    skip-build=${SKIP_BUILD}, skip-seed=${SKIP_SEED}"
  echo ""

  # ─── Шаг 1: Сборка Angular ───
  step "1/4: Сборка Angular"
  if [[ "${SKIP_BUILD}" -eq 1 ]]; then
    log "Сборка пропущена (--skip-build)"
    if [[ ! -d "${PROJECT_DIR}/dist/browser" ]]; then
      err "dist/browser/ не существует. Запустите без --skip-build"
    fi
  else
    require_cmd node; require_cmd npm
    log "Собираю Angular..."
    cd "${PROJECT_DIR}"
    if ! npm run build 2>&1; then
      err "Angular build failed!"
    fi
    ok "Angular собран"
  fi

  # ─── Шаг 2: Создание архива ───
  step "2/4: Создание архива"
  rm -f "${ARCHIVE_PATH}"

  cd "${PROJECT_DIR}"

  # Собираем архив: backend, dist (frontend), shared, deploy, docker-compose
  tar czf "${ARCHIVE_PATH}" \
    --exclude='backend/node_modules' \
    --exclude='backend/dist' \
    --exclude='backend/src/__tests__' \
    --exclude='backend/.env' \
    --exclude='node_modules' \
    --exclude='.git' \
    backend/ \
    shared/ \
    dist/browser/ \
    deploy/deploy.sh \
    docker-compose.prod.yml \
    2>&1

  ARCHIVE_SIZE=$(du -h "${ARCHIVE_PATH}" | cut -f1)
  ok "Архив: ${ARCHIVE_NAME} (${ARCHIVE_SIZE})"

  # ─── Шаг 3: Подготовка .env + загрузка ───
  step "3/4: Загрузка на ${DEPLOY_HOST}"

  # Кодируем .env в base64
  ENV_CONTENT=$(cat <<EOF
JWT_SECRET=${JWT_SECRET}
JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET}
CORS_ORIGIN=${CORS_ORIGIN:-https://sport-set.ru}
KPPDF_DATA_DIR=${KPPDF_DATA_DIR:-/var/lib/kppdf40}
BACKEND_PORT=${BACKEND_PORT:-4000}
MONGODB_PORT=${MONGODB_PORT:-27018}
CHROMADB_PORT=${CHROMADB_PORT:-8000}
EOF
)
  ENV_B64=$(echo "${ENV_CONTENT}" | base64 -w0 2>/dev/null || echo "${ENV_CONTENT}" | base64)
  ok "Конфиг закодирован (base64)"

  require_cmd ssh; require_cmd scp

  ${SSH_CMD} "echo OK" >/dev/null 2>&1 || err "SSH не работает: ${REMOTE_SSH}"
  ${SSH_CMD} "${SSH_SUDO} mkdir -p ${REMOTE_DIR}" || err "Не удалось создать ${REMOTE_DIR}"
  ${SSH_CMD} "${SSH_SUDO} mkdir -p ${KPPDF_DATA_DIR:-/var/lib/kppdf40}/{mongodb,media,chromadb}" 2>/dev/null || true

  log "Загружаю архив..."
  ${SCP_CMD} "${ARCHIVE_PATH}" "${REMOTE_SSH}:/tmp/" || err "SCP не удался!"
  ok "Архив загружен в /tmp/"

  rm -f "${ARCHIVE_PATH}"

  # ─── Шаг 4: Запуск deploy.sh на сервере ───
  step "4/4: Деплой на сервере"

  log "Запускаю deploy.sh в серверном режиме..."
  echo ""

  # Пишем .env на сервере
  ${SSH_CMD} "echo '${ENV_B64}' | base64 -d > /tmp/kppdf40-env && ${SSH_SUDO} mv /tmp/kppdf40-env ${REMOTE_DIR}/.env && ${SSH_SUDO} chmod 600 ${REMOTE_DIR}/.env" 2>&1

  # Собираем флаги для серверного режима
  REMOTE_ARGS=""
  [[ "${SKIP_BUILD}" -eq 1 ]] && REMOTE_ARGS+=" --skip-build"
  [[ "${SKIP_SEED}" -eq 1 ]] && REMOTE_ARGS+=" --skip-seed"

  # Распаковываем deploy.sh из архива и запускаем
  ${SSH_CMD} "${SSH_SUDO} tar xzf /tmp/${ARCHIVE_NAME} -C ${REMOTE_DIR}/ deploy/deploy.sh && ${SSH_SUDO} bash ${REMOTE_DIR}/deploy/deploy.sh${REMOTE_ARGS} /tmp/${ARCHIVE_NAME}" 2>&1 | sed 's/^/  /'

  # Чистим архив
  ${SSH_CMD} "rm -f /tmp/${ARCHIVE_NAME}" 2>&1

  echo ""
  log "Локальный деплой завершён."

else
  # ==========================================================================
  # СЕРВЕРНЫЙ РЕЖИМ — распаковка + Docker + seed
  # ==========================================================================
  if [[ "$(id -u)" -ne 0 ]]; then
    err "Запустите с sudo: sudo bash deploy/deploy.sh [путь_к_архиву]"
  fi

  APP_DIR="/opt/kppdf-4.0"
  DATA_DIR="${KPPDF_DATA_DIR:-/var/lib/kppdf40}"
  ARCHIVE=""

  if [[ -n "${ARCHIVE_ARG:-}" ]]; then
    ARCHIVE="${ARCHIVE_ARG}"
  elif [[ -f "${SCRIPT_DIR}/../kppdf40-deploy.tar.gz" ]]; then
    ARCHIVE="${SCRIPT_DIR}/../kppdf40-deploy.tar.gz"
  elif [[ -f "/tmp/kppdf40-deploy.tar.gz" ]]; then
    ARCHIVE="/tmp/kppdf40-deploy.tar.gz"
  else
    err "Архив не найден. Укажите путь: sudo bash deploy/deploy.sh /путь/к/kppdf40-deploy.tar.gz"
  fi

  [[ -f "${ARCHIVE}" ]] || err "Файл не существует: ${ARCHIVE}"
  ARCHIVE_SIZE=$(du -h "${ARCHIVE}" | cut -f1)

  echo ""
  echo "╔══════════════════════════════════════════════════╗"
  echo "║   KPPDF 4.0 — Deploy (серверный режим)          ║"
  echo "╚══════════════════════════════════════════════════╝"
  echo ""
  echo "  Архив:    ${ARCHIVE} (${ARCHIVE_SIZE})"
  echo "  App:      ${APP_DIR}"
  echo "  Data:     ${DATA_DIR}"
  echo ""

  # ─── Шаг 1: Распаковка ───
  step "1/5: Распаковка в ${APP_DIR}"
  mkdir -p "${APP_DIR}" "${DATA_DIR}/mongodb" "${DATA_DIR}/media" "${DATA_DIR}/chromadb"
  tar xzf "${ARCHIVE}" -C "${APP_DIR}/"

  # Копируем фронтенд из dist
  if [[ -d "${APP_DIR}/dist/browser" ]]; then
    rm -rf "${APP_DIR}/frontend"
    mkdir -p "${APP_DIR}/frontend"
    cp -r "${APP_DIR}/dist/browser/"* "${APP_DIR}/frontend/"
    rm -rf "${APP_DIR}/dist"
  fi

  ok "Архив распакован, фронтенд на месте"

  # ─── Шаг 2: .env ───
  step "2/5: Настройка .env"
  if [[ -f "${APP_DIR}/.env" ]]; then
    ok ".env получен из локального конфига"
  else
    warn ".env не найден! Создаю со случайными JWT..."
    JWT_SECRET=$(openssl rand -hex 32 2>/dev/null || echo "CHANGE_ME")
    JWT_REFRESH=$(openssl rand -hex 32 2>/dev/null || echo "CHANGE_ME")
    cat > "${APP_DIR}/.env" <<EOF
JWT_SECRET=${JWT_SECRET}
JWT_REFRESH_SECRET=${JWT_REFRESH}
CORS_ORIGIN=https://sport-set.ru
KPPDF_DATA_DIR=${DATA_DIR}
BACKEND_PORT=4000
MONGODB_PORT=27018
CHROMADB_PORT=8000
EOF
    chmod 600 "${APP_DIR}/.env"
    warn ".env создан со случайными JWT"
  fi

  # Создаём .env.production для backend
  source "${APP_DIR}/.env"
  cat > "${APP_DIR}/backend/.env.production" <<EOF
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:${MONGODB_PORT:-27018}/kppdf40
JWT_SECRET=${JWT_SECRET}
JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET}
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=${CORS_ORIGIN:-https://sport-set.ru}
NODE_ENV=production
EOF

  # Чистим архив
  rm -f "${ARCHIVE}"

  # ─── Шаг 3: Docker ───
  step "3/5: Docker сборка и запуск"
  require_cmd docker

  if [[ ! -f "${APP_DIR}/docker-compose.prod.yml" ]]; then
    err "docker-compose.prod.yml не найден в ${APP_DIR}"
  fi

  cd "${APP_DIR}"

  log "Останавливаю старые контейнеры..."
  docker compose -f docker-compose.prod.yml down 2>/dev/null || true

  if [[ "${SKIP_BUILD}" -eq 1 ]]; then
    log "Docker build пропущен (--skip-build)"
  else
    log "Собираю Docker образы (может занять 2-5 минут)..."
    docker compose -f docker-compose.prod.yml build --no-cache backend 2>&1
  fi

  log "Запускаю контейнеры..."
  docker compose -f docker-compose.prod.yml up -d 2>&1
  ok "Docker compose запущен"

  # ─── Шаг 4: Ожидание backend ───
  step "4/5: Ожидание backend"
  log "Жду готовности (до 90 секунд)..."
  BACKEND_READY=0
  for i in $(seq 1 18); do
    sleep 5
    HEALTH=$(curl -sf "http://localhost:${BACKEND_PORT:-4000}/api/health" 2>/dev/null || echo "")
    if echo "${HEALTH}" | grep -q '"status":"ok"'; then
      ok "Backend готов!"
      BACKEND_READY=1
      break
    fi
    if [[ $((i % 3)) -eq 0 ]]; then
      log "  Ждём... ($(( i * 5 ))с)"
    fi
  done

  if [[ "${BACKEND_READY}" -eq 0 ]]; then
    warn "Backend не ответил. Проверьте: docker logs kppdf40-backend --tail 50"
  fi

  # ─── Шаг 4.5: Seed (если бэкенд готов и не пропущен) ───
  if [[ "${SKIP_SEED}" -eq 1 ]]; then
    log "Seed пропущен (--skip-seed)"
  elif [[ "${BACKEND_READY}" -eq 1 ]]; then
    log "Запускаю seed (docker exec kppdf40-backend npx tsx src/seed.ts --force)..."
    SEED_OUTPUT=$(docker exec kppdf40-backend npx tsx src/seed.ts --force 2>&1) && SEED_OK=1 || SEED_OK=0
    echo "${SEED_OUTPUT}" | while IFS= read -r line; do echo "  ${line}"; done
    if [[ "${SEED_OK}" -eq 1 ]]; then
      SEED_COUNT=$(echo "${SEED_OUTPUT}" | grep -o '[0-9]\+ записей' | grep -o '[0-9]\+' | tail -1)
      ok "Seed выполнен: ${SEED_COUNT:-?} записей"
    else
      warn "Seed завершился с ошибкой (возможно, данные уже есть)"
    fi
  else
    warn "Seed пропущен — бэкенд не готов"
  fi

  # ─── Шаг 5: Проверка ───
  step "5/5: Проверка"

  echo ""
  echo "── Backend ──"
  HEALTH=$(curl -sf "http://localhost:${BACKEND_PORT:-4000}/api/health" 2>/dev/null || echo "ERROR")
  if [[ "${HEALTH}" != "ERROR" ]]; then
    ok "Health: ${HEALTH:0:80}"
  else
    warn "Health check не ответил"
  fi

  echo ""
  echo "── Docker контейнеры ──"
  docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" 2>/dev/null | tail -n +2 | while IFS= read -r line; do
    if echo "${line}" | grep -q "Up"; then ok "  ${line}"; else warn "  ${line}"; fi
  done

  # Итог
  echo ""
  echo "╔══════════════════════════════════════════════════╗"
  echo "║     ✅ Деплой завершён!                         ║"
  echo "╚══════════════════════════════════════════════════╝"
  echo ""
  echo "  API:      http://localhost:${BACKEND_PORT:-4000}/api/health"
  echo "  Frontend: /opt/kppdf-4.0/frontend/ (через Nginx)"
  echo "  Логин:    admin"
  echo "  Пароль:   admin123"
  echo ""

fi
