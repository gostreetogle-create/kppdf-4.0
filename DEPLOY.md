# KPPDF 4.0 — Deployment

> Инструкция по деплою на Ubuntu-сервер (192.168.1.46) рядом с kppdf-3.0.

## Архитектура

```
[Cloudflare] → Cloudflare Tunnel → [Nginx :80] → Backend :4000 (kppdf40-backend)
                                                    MongoDB :27018 (kppdf40-mongodb)
                                                    ChromaDB :8000 (kppdf40-chromadb)
```

Проект разворачивается **на тех же серверах**, что и kppdf-3.0, но на других портах.

## Порты

| Сервис      | Порт (внутри) | Порт (хост) | Контейнер          |
|-------------|---------------|-------------|--------------------|
| Backend     | 3000          | **4000**    | kppdf40-backend    |
| MongoDB     | 27017         | **27018**   | kppdf40-mongodb    |
| ChromaDB    | 8000          | **8000**    | kppdf40-chromadb   |

## Данные на сервере

| Путь | Содержимое |
|------|------------|
| `/opt/kppdf-4.0/` | Код приложения (перезаписывается) |
| `/var/lib/kppdf40/mongodb/` | База MongoDB (сохраняется) |
| `/var/lib/kppdf40/media/` | Загруженные файлы (сохраняется) |
| `/var/lib/kppdf40/chromadb/` | Векторная БД ChromaDB |

## Быстрый старт

```bash
# 1. Проверить SSH
ssh -o ConnectTimeout=10 tiit@192.168.1.46 "echo OK"

# 2. Запустить деплой
bash deploy/deploy.sh

# 3. Для обновления (без seed)
bash deploy/deploy.sh --skip-seed
```

## Переключение домена

После успешного деплоя:

```bash
# На сервере — обновить Nginx (используем готовый конфиг из проекта)
# deploy/nginx-kppdf40.conf уже содержит правильную конфигурацию
sudo cp /opt/kppdf-4.0/deploy/nginx-kppdf40.conf /etc/nginx/sites-enabled/kppdf
sudo nginx -t && sudo systemctl reload nginx

# Остановить старый проект
cd /opt/kppdf-3.0 && sudo docker compose -f docker-compose.prod.yml down
```

## Секреты

`deploy/config.env` — конфиг деплоя (в .gitignore). Содержит:
- SSH-доступ (из kppdf-3.0)
- JWT токены (те же, что в kppdf-3.0 — чтобы старые сессии не сломались)
- CORS origin
