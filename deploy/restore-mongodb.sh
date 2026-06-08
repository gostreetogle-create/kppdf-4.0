#!/usr/bin/env bash
# ============================================================================
# KPPDF 4.0 — MongoDB Restore Script
# ============================================================================
# Восстанавливает БД из архивного дампа, созданного backup-mongodb.sh.
#
# Запуск:
#   sudo bash deploy/restore-mongodb.sh                           # восстановить latest
#   sudo bash deploy/restore-mongodb.sh /путь/k-архиву.archive    # из конкретного файла
#   sudo bash deploy/restore-mongodb.sh --list                    # показать список бэкапов
#   sudo bash deploy/restore-mongodb.sh --dry-run /path/archive   # без восстановления
# ============================================================================

set -euo pipefail

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; NC='\033[0m'
log()    { echo -e "${CYAN}[restore]${NC} $*"; }
ok()     { echo -e "  ${GREEN}[OK]${NC} $*"; }
warn()   { echo -e "  ${YELLOW}[WARN]${NC} $*"; }
err()    { echo -e "  ${RED}[FAIL]${NC} $*" >&2; exit 1; }

# ─── Конфигурация ───
CONTAINER_NAME="kppdf40-mongodb"
DB_NAME="kppdf40"
BACKUP_DIR="/var/lib/kppdf40/backups"
LATEST_LINK="${BACKUP_DIR}/kppdf40-latest.archive"
DRY_RUN=0
SHOW_LIST=0

# ─── Парсинг аргументов ───
while [[ $# -gt 0 ]]; do
  case "$1" in
    --list)    SHOW_LIST=1; shift ;;
    --dry-run) DRY_RUN=1; shift ;;
    -h|--help)
      echo "MongoDB restore for kppdf40"
      echo ""
      echo "Usage: sudo bash deploy/restore-mongodb.sh [options] [archive-path]"
      echo ""
      echo "Options:"
      echo "  --list         List available backups"
      echo "  --dry-run      Show what would be done without doing it"
      echo "  --help         This help"
      echo ""
      echo "Archive path:"
      echo "  /path/to/file.archive    Restore from specific file"
      echo "  (omitted)                Restore from latest backup (symlink)"
      exit 0
      ;;
    -*)
      err "Unknown argument: $1"
      ;;
    *)
      ARCHIVE_FILE="$1"
      shift
      ;;
  esac
done

# ─── Список бэкапов ───
if [[ "${SHOW_LIST}" -eq 1 ]]; then
  echo "Доступные бэкапы:"
  echo ""
  find "${BACKUP_DIR}" -maxdepth 1 -name "kppdf40-*.archive" -type f -printf '%T@ %p\n' 2>/dev/null \
    | sort -rn \
    | while read -r ts path; do
        name=$(basename "${path}")
        size=$(du -h "${path}" | cut -f1)
        date=$(date -d "@${ts}" +"%Y-%m-%d %H:%M" 2>/dev/null || echo "—")
        is_latest=""
        if [[ "${path}" -ef "${LATEST_LINK}" ]] 2>/dev/null; then
          is_latest=" ← latest"
        fi
        printf "  %s  %10s  %s%s\n" "${date}" "${size}" "${name}" "${is_latest}"
      done

  TOTAL=$(find "${BACKUP_DIR}" -maxdepth 1 -name "kppdf40-*.archive" -type f 2>/dev/null | wc -l)
  echo ""
  echo "Всего: ${TOTAL} бэкапов"
  echo "Папка: ${BACKUP_DIR}"
  exit 0
fi

# ─── Определяем файл для восстановления ───
if [[ -z "${ARCHIVE_FILE:-}" ]]; then
  if [[ -L "${LATEST_LINK}" ]] && [[ -f "${LATEST_LINK}" ]]; then
    ARCHIVE_FILE="${LATEST_LINK}"
    log "Использую latest: $(readlink -f "${LATEST_LINK}")"
  else
    err "Бэкап не указан и latest-симлинк не найден. Используйте: sudo bash deploy/restore-mongodb.sh /path/to/file.archive"
  fi
fi

if [[ ! -f "${ARCHIVE_FILE}" ]]; then
  err "Файл не найден: ${ARCHIVE_FILE}"
fi

ARCHIVE_SIZE=$(du -h "${ARCHIVE_FILE}" | cut -f1)

# ─── Проверка ───
if [[ "$(id -u)" -ne 0 ]]; then
  err "Запустите с sudo: sudo bash deploy/restore-mongodb.sh"
fi

if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
  err "Контейнер ${CONTAINER_NAME} не найден. Запустите docker compose up -d"
fi

if ! docker exec "${CONTAINER_NAME}" mongorestore --version >/dev/null 2>&1; then
  err "mongorestore не найден в контейнере ${CONTAINER_NAME}"
fi

# ─── Предупреждение ───
echo ""
echo "╔══════════════════════════════════════════════════════╗"
echo "║   ⚠️  ВНИМАНИЕ: будет произведено восстановление БД  ║"
echo "╚══════════════════════════════════════════════════════╝"
echo ""
echo "  Архив:       ${ARCHIVE_FILE} (${ARCHIVE_SIZE})"
echo "  База данных: ${DB_NAME}"
echo "  Источник:    ${ARCHIVE_FILE}"
echo ""

if [[ "${DRY_RUN}" -eq 1 ]]; then
  log "DRY-RUN: пропускаю. Для восстановления запустите без --dry-run"
  exit 0
fi

# Запрашиваем подтверждение
read -r -p "Введите YES для подтверждения: " CONFIRM
if [[ "${CONFIRM}" != "YES" ]]; then
  warn "Отменено пользователем"
  exit 0
fi

# ─── Восстановление ───
log "Останавливаю backend (чтобы не писал в БД во время restore)..."
docker stop kppdf40-backend 2>/dev/null || true
ok "Backend остановлен"

log "Восстанавливаю БД ${DB_NAME} из ${ARCHIVE_FILE}..."

# mongorestore --archive читает из stdin
docker exec -i "${CONTAINER_NAME}" mongorestore --archive --drop --db="${DB_NAME}" < "${ARCHIVE_FILE}" 2>&1

ok "Восстановление завершено"

log "Запускаю backend..."
docker start kppdf40-backend 2>/dev/null || true
ok "Backend запущен"

# ─── Проверка ───
sleep 3
HEALTH=$(docker exec kppdf40-backend node -e "require('http').get('http://localhost:3000/api/health', r => { let d=''; r.on('data',c=>d+=c); r.on('end',()=>process.stdout.write(d)) }).on('error',()=>process.exit(1))" 2>/dev/null || echo "ERROR")
if echo "${HEALTH}" | grep -q "ok"; then
  ok "Backend здоров: ${HEALTH:0:60}"
else
  warn "Backend не ответил после восстановления"
  warn "Проверьте: sudo docker logs kppdf40-backend --tail 20"
fi

echo ""
log "✅ Восстановление завершено."
echo ""
warn "Не забудьте проверить данные через браузер: https://sport-set.ru"
