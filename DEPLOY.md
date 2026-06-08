# KPPDF 4.0 — Deployment

> Инструкция по деплою на Ubuntu-сервер (192.168.1.46)

## Архитектура

```
[Cloudflare] → Cloudflare Tunnel → [Nginx :80] → Backend :4000 (kppdf40-backend)
                                                    MongoDB :27018 (kppdf40-mongodb)
                                                    ChromaDB :8000 (kppdf40-chromadb)
```

## Порты

| Сервис      | Порт (внутри) | Порт (хост) | Контейнер          |
|-------------|---------------|-------------|--------------------|
| Backend     | 3000          | **4000**    | kppdf40-backend    |
| MongoDB     | 27017         | **27018**   | kppdf40-mongodb    |
| ChromaDB    | 8000          | **8000**    | kppdf40-chromadb   |

## Данные на сервере

| Путь | Содержимое | Безопасность |
|------|------------|--------------|
| `/opt/kppdf-4.0/` | Код приложения | 🔴 Перезаписывается при деплое |
| `/var/lib/kppdf40/mongodb/` | **База MongoDB** | 🟢 **СОХРАНЯЕТСЯ** — не трогать! |
| `/var/lib/kppdf40/media/` | **Загруженные файлы** | 🟢 **СОХРАНЯЕТСЯ** — не трогать! |
| `/var/lib/kppdf40/chromadb/` | Векторная БД | 🟡 Пока не используется |

---

## Чек-лист деплоя

Перед каждым деплоем:

- [ ] Код собран без ошибок (`npm run build`)
- [ ] Проверен линтер (`ng lint` — 0 ошибок)
- [ ] Тесты проходят (`npx vitest run` — все зелёные)
- [ ] `deploy/config.env` заполнен (секреты, SSH)
- [ ] Файлы с секретами в `.gitignore`

После деплоя:

- [ ] Backend health: `curl -sf http://localhost:4000/api/health`
- [ ] Docker контейнеры Up: `sudo docker ps`
- [ ] Nginx конфиг корректен: `sudo nginx -t`
- [ ] Сайт доступен: `curl -sf https://sport-set.ru/api/health`
- [ ] Фронтенд отдаётся: HTTP 200 на `https://sport-set.ru/`
- [ ] Логин работает: POST `/api/v1/auth/login` → JWT-токен

---

## Быстрый старт

```bash
# 1. Проверить SSH
ssh -o ConnectTimeout=10 tiit@192.168.1.46 "echo OK"

# 2. Запустить деплой
bash deploy/deploy.sh
# или:
bash deploy/deploy.sh --skip-seed    # если seed уже был
bash deploy/deploy.sh --skip-build   # если Angular уже собран

# 3. Проверить что всё работает
curl -sf https://sport-set.ru/api/health
```

---

## Полная инструкция

Подробная пошаговая инструкция по работе с сервером — в **[RUNBOOK.md](RUNBOOK.md)**:

- Подключение к серверу
- Обновление пакетов ОС
- Деплой новой версии
- Проверка работоспособности
- Аварийные процедуры
- Шпаргалка команд
- Что НЕЛЬЗЯ делать

---

## Секреты

`deploy/config.env` — конфиг деплоя (в `.gitignore`). Содержит:
- SSH-доступ (`DEPLOY_HOST`, `DEPLOY_USER`, `DEPLOY_PASSWORD`)
- JWT токены (из kppdf-3.0, чтобы старые сессии работали)
- CORS origin

Шаблон: `deploy/config.env.example` (можно коммитить).

---

## Переключение домена

При первом деплое или смене домена:

```bash
# На сервере:
sudo cp /opt/kppdf-4.0/deploy/nginx-kppdf40.conf /etc/nginx/sites-enabled/kppdf
sudo nginx -t && sudo systemctl reload nginx
```

---

## Быстрое обновление одного файла (без полного деплоя)

```bash
# С локальной машины
scp backend/src/index.ts tiit@192.168.1.46:/tmp/
ssh tiit@192.168.1.46 "sudo cp /tmp/index.ts /opt/kppdf-4.0/backend/src/index.ts && sudo docker restart kppdf40-backend"
```

> ⚠️ Временное решение. Полный деплой перезапишет файл.
