import { Router } from 'express';
import mongoose from 'mongoose';
import os from 'os';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

const router = Router();
const log = logger.child({ module: 'monitor' });

/** Convert bytes to human-readable */
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/** Convert seconds to human-readable uptime */
function formatUptime(seconds: number): string {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const parts: string[] = [];
  if (d > 0) parts.push(`${d}д`);
  if (h > 0) parts.push(`${h}ч`);
  if (m > 0) parts.push(`${m}м`);
  parts.push(`${s}с`);
  return parts.join(' ');
}

/**
 * GET /api/v1/monitor
 * Полная информация о состоянии системы.
 * Доступен только админам (проверка роли — на фронте через /admin/monitor + RoleGuard).
 */
router.get('/', async (_req, res) => {
  try {
    // MongoDB status
    const dbState = mongoose.connection.readyState;
    const dbStateMap: Record<number, string> = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
    };
    const dbStatus = dbStateMap[dbState] || 'unknown';

    // Collection info (only if connected)
    let collections: { name: string; count: number }[] = [];
    if (dbState === 1) {
      const db = mongoose.connection.db;
      if (db) {
        const collNames = await db.listCollections().toArray();
        const counts = await Promise.all(
          collNames.map(async (coll) => {
            const count = await db.collection(coll.name).countDocuments();
            return { name: coll.name, count };
          })
        );
        collections = counts.sort((a, b) => a.name.localeCompare(b.name));
      }
    }

    // System info
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;

    const result = {
      status: dbState === 1 ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      environment: env.NODE_ENV,
      nodeVersion: process.version,
      platform: `${os.platform()} ${os.arch()} (${os.release()})`,
      processUptime: formatUptime(process.uptime()),
      processUptimeSeconds: Math.floor(process.uptime()),
      systemUptime: formatUptime(os.uptime()),
      memory: {
        total: formatBytes(totalMem),
        free: formatBytes(freeMem),
        used: formatBytes(usedMem),
        usedPercent: Math.round((usedMem / totalMem) * 100),
        processHeapUsed: formatBytes(process.memoryUsage().heapUsed),
        processHeapTotal: formatBytes(process.memoryUsage().heapTotal),
        processRSS: formatBytes(process.memoryUsage().rss),
      },
      cpu: {
        loadAvg1m: os.loadavg()[0].toFixed(2),
        loadAvg5m: os.loadavg()[1].toFixed(2),
        loadAvg15m: os.loadavg()[2].toFixed(2),
        cpus: os.cpus().length,
      },
      database: {
        status: dbStatus,
        host: mongoose.connection.host || '—',
        name: mongoose.connection.name || '—',
        collections: collections.length,
        totalDocuments: collections.reduce((sum, c) => sum + c.count, 0),
        collectionList: collections,
      },
    };

    res.json({ success: true, data: result, message: null });
  } catch (err) {
    log.error(err, 'Monitor endpoint error');
    res.status(500).json({ success: false, data: null, message: 'Ошибка получения данных мониторинга' });
  }
});

export default router;
