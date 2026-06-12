import { Router } from 'express';
import { OneCSettings, OneCSyncLog } from './one-c.model.js';
import { logger } from '../utils/logger.js';

const router = Router();
const log = logger.child({ module: 'one-c' });

/**
 * GET /api/v1/one-c/settings
 * Получить настройки интеграции с 1С (пароль не возвращается).
 */
router.get('/settings', async (_req, res) => {
  try {
    let settings = await OneCSettings.findOne().lean();
    if (!settings) {
      settings = await OneCSettings.create({
        enabled: false,
        baseUrl: '',
        username: '',
        password: '',
        mode: 'http',
        syncIntervalMinutes: 0,
      });
    }
    // Не возвращаем пароль
    const { password, ...safeSettings } = settings;
    res.json({ success: true, data: safeSettings, message: null });
  } catch (err) {
    log.error(err, 'Failed to get 1C settings');
    res.status(500).json({ success: false, data: null, message: 'Ошибка получения настроек 1С' });
  }
});

/**
 * PUT /api/v1/one-c/settings
 * Обновить настройки интеграции с 1С.
 */
router.put('/settings', async (req, res) => {
  try {
    const { enabled, baseUrl, username, password, mode, syncIntervalMinutes } = req.body;

    let settings = await OneCSettings.findOne();
    if (!settings) {
      settings = new OneCSettings();
    }

    if (enabled !== undefined) settings.enabled = enabled;
    if (baseUrl !== undefined) settings.baseUrl = baseUrl;
    if (username !== undefined) settings.username = username;
    if (password !== undefined && password !== '') settings.password = password;
    if (mode !== undefined) settings.mode = mode;
    if (syncIntervalMinutes !== undefined) settings.syncIntervalMinutes = syncIntervalMinutes;

    await settings.save();

    const { password: _, ...safeSettings } = settings.toObject();
    res.json({ success: true, data: safeSettings, message: 'Настройки сохранены' });
  } catch (err) {
    log.error(err, 'Failed to update 1C settings');
    res.status(500).json({ success: false, data: null, message: 'Ошибка сохранения настроек 1С' });
  }
});

/**
 * POST /api/v1/one-c/sync
 * Запустить синхронизацию с 1С вручную.
 */
router.post('/sync', async (req, res) => {
  try {
    const settings = await OneCSettings.findOne();
    if (!settings?.enabled) {
      return res.status(400).json({ success: false, data: null, message: 'Интеграция с 1С отключена в настройках' });
    }

    const { direction = 'import', entities = ['counterparties', 'nomenclature', 'documents'] } = req.body;

    // TODO: Реальная интеграция с 1С HTTP-сервисом
    // Здесь должен быть HTTP-запрос к 1С с Basic Auth
    // const response = await fetch(`${settings.baseUrl}/${direction}`, {
    //   headers: { Authorization: 'Basic ' + Buffer.from(`${settings.username}:${settings.password}`).toString('base64') }
    // });

    // Заглушка — имитация успешной синхронизации
    const result = {
      success: true,
      direction,
      entities,
      processed: 0,
      errors: 0,
      messages: ['Синхронизация с 1С запущена. Реальная интеграция требует настройки HTTP-сервиса на стороне 1С.'],
      timestamp: new Date().toISOString(),
    };

    // Пишем в лог
    await OneCSyncLog.create({
      direction,
      entities,
      processed: result.processed,
      errors: result.errors,
      messages: result.messages,
      status: 'ok',
    });

    // Обновляем статус последней синхронизации
    settings.lastSyncAt = new Date();
    settings.lastSyncStatus = 'ok';
    settings.lastSyncMessage = result.messages[0];
    await settings.save();

    res.json({ success: true, data: result, message: null });
  } catch (err) {
    log.error(err, '1C sync failed');
    res.status(500).json({ success: false, data: null, message: 'Ошибка синхронизации с 1С' });
  }
});

/**
 * GET /api/v1/one-c/sync-log
 * Получить журнал синхронизаций.
 */
router.get('/sync-log', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 200);
    const logs = await OneCSyncLog.find().sort({ createdAt: -1 }).limit(limit).lean();
    res.json({ success: true, data: logs, message: null });
  } catch (err) {
    log.error(err, 'Failed to get sync log');
    res.status(500).json({ success: false, data: null, message: 'Ошибка получения журнала синхронизации' });
  }
});

/**
 * POST /api/v1/one-c/import
 * Импорт данных из 1С (обработка входящего пакета).
 */
router.post('/import', async (_req, res) => {
  // Заглушка: эндпоинт для приёма данных от 1С
  res.json({
    success: true,
    data: { received: true, message: 'Эндпоинт импорта готов к приёму данных от 1С' },
    message: null,
  });
});

export default router;
