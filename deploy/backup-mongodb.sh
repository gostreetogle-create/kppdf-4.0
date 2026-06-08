#!/usr/bin/env bash
# ============================================================================
# KPPDF 4.0 — MongoDB Backup Script
# ============================================================================
# Создаёт дамп MongoDB через docker exec и сохраняет в папку бэкапов.
# Ротация: хранит KEEP_DAYS последних бэкапов (по умолчанию 14).
#
# Запуск:
#   sudo bash deploy/backup-mongodb.sh
#   sudo bash deploy/backup-mongodb.sh --keep 30   # хранить 30 дней
#   sudo bash deploy/backup-mongodb.sh --dry-run   # без записи
#
# Автоматический запуск (cron):
#   sudo cp deploy/cron-backup /etc/cron.d/kppdf40-backup
# ============================================================================

set -euo pipefail

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; NC='\033[0m'
log()    { echo -e "${CYAN}[backup]${NC} $*"; }
ok()     { echo -e "  ${GREEN}[OK]${NC} $*"; }
warn()   { echo -e "  ${YELLOW}[WARN]${NC} $*"; }
err()    { echo -e "  ${RED}[FAIL]${NC} $*" >&2; exit 1; }

# ─── Конфигурация ───
CONTAINER_NAME="kppdf40-mongodb"
DB_NAME="kppdf40"
BACKUP_DIR="/var/lib/kppdf40/backups"
KEEP_DAYS=14
DRY_RUN=0

# ─── Парсинг аргументов ───
while [[ $# -gt 0 ]]; do
  case "$1" in
    --keep)    KEEP_DAYS="$2"; shift 2 ;;
    --dry-run) DRY_RUN=1; shift ;;
    -h|--help)
      echo "MongoDB backup for kppdf40"
      echo ""
      echo "Usage: sudo bash deploy/backup-mongodb.sh [options]"
      echo ""
      echo "Options:"
      echo "  --keep DAYS    How many days to keep backups (default: 14)"
      echo "  --dry-run      Show what would be done without doing it"
      echo "  --help         This help"
      exit 0
      ;;
    *) err "Unknown argument: $1";;
  esac
done

# ─── Проверка ───
if [[ "$(id -u)" -ne 0 ]]; then
  err "Запустите с sudo: sudo bash deploy/backup-mongodb.sh"
fi

# Проверяем, что контейнер работает
if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
  err "Контейнер ${CONTAINER_NAME} не найден. Запустите docker compose up -d"
fi

# Проверяем, что mongodump доступен
if ! docker exec "${CONTAINER_NAME}" mongodump --version >/dev/null 2>&1; then
  err "mongodump не найден в контейнере ${CONTAINER_NAME}"
fi

mkdir -p "${BACKUP_DIR}"

# ─── Дата и имя файла ───
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
BACKUP_FILE="${BACKUP_DIR}/kppdf40-${TIMESTAMP}.archive"

# ─── Бэкап ───
log "Создаю бэкап БД ${DB_NAME} из контейнера ${CONTAINER_NAME}..."

if [[ "${DRY_RUN}" -eq 1 ]]; then
  log "DRY-RUN: docker exec ${CONTAINER_NAME} mongodump --archive --db=${DB_NAME} > ${BACKUP_FILE}"
  ok "Бэкап будет создан: ${BACKUP_FILE}"
else
  # mongodump --archive выводит в stdout, перенаправляем в файл
  docker exec "${CONTAINER_NAME}" mongodump --archive --db="${DB_NAME}" > "${BACKUP_FILE}" 2>/dev/null

  # Проверяем размер
  BACKUP_SIZE=$(du -h "${BACKUP_FILE}" | cut -f1)
  ok "Бэкап создан: ${BACKUP_FILE} (${BACKUP_SIZE})"

  # Симлинк на последний бэкап (удобно для restore)
  LATEST_LINK="${BACKUP_DIR}/kppdf40-latest.archive"
  ln -sf "${BACKUP_FILE}" "${LATEST_LINK}"
  ok "Симлинк обновлён: ${LATEST_LINK} → ${BACKUP_FILE}"
fi

# ─── Ротация (удаление старых бэкапов) ───
log "Ротация: удаляю бэкапы старше ${KEEP_DAYS} дней..."

if [[ "${DRY_RUN}" -eq 1 ]]; then
  find "${BACKUP_DIR}" -maxdepth 1 -name "kppdf40-*.archive" -type f -mtime "+${KEEP_DAYS}" -print 2>/dev/null | while read -r old; do
    log "  Будет удалён: ${old}"
  done
else
  DELETED=0
  while read -r old; do
    rm -f "${old}"
    DELETED=$((DELETED + 1))
  done < <(find "${BACKUP_DIR}" -maxdepth 1 -name "kppdf40-*.archive" -type f -mtime "+${KEEP_DAYS}" -print 2>/dev/null || true)

  if [[ "${DELETED}" -gt 0 ]]; then
    ok "Удалено старых бэкапов: ${DELETED}"
  else
    ok "Старых бэкапов нет"
  fi
fi

# ─── Итог ───
echo ""
log "── Статистика ──"
TOTAL_SIZE=$(du -sh "${BACKUP_DIR}" 2>/dev/null | cut -f1)
BACKUP_COUNT=$(find "${BACKUP_DIR}" -maxdepth 1 -name "kppdf40-*.archive" -type f 2>/dev/null | wc -l)
ARCHIVE_SIZE=$(du -h "${BACKUP_FILE}" 2>/dev/null | cut -f1 || echo "—")
echo "  Папка бэкапов:  ${BACKUP_DIR}"
echo "  Файл:           ${BACKUP_FILE:-—}"
echo "  Размер:         ${ARCHIVE_SIZE}"
echo "  Всего бэкапов:  ${BACKUP_COUNT}"
echo "  Всего занято:   ${TOTAL_SIZE}"
echo "  Хранить дней:   ${KEEP_DAYS}"
echo ""

if [[ "${DRY_RUN}" -eq 1 ]]; then
  log "DRY-RUN завершён. Ничего не изменено."
else
  log "✅ Бэкап завершён."
fi
