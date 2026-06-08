// ========================================
// Upload Routes — загрузка файлов (multer)
// ========================================

import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { env } from '../config/env.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Настройка multer — сохраняем в uploads/ с уникальным именем */
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, env.UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext)
      .replace(/[^a-zA-Zа-яА-Я0-9_-]/g, '_')
      .slice(0, 40);
    const timestamp = Date.now();
    cb(null, `${name}_${timestamp}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (_req, file, cb) => {
    const allowed = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.bmp'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`Недопустимый формат: ${ext}. Разрешены: ${allowed.join(', ')}`));
    }
  },
});

const router = Router();

/**
 * POST /api/v1/upload
 * Загрузить изображение. Возвращает URL вида /uploads/filename.ext
 */
router.post('/', (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ success: false, data: null, message: `Ошибка загрузки: ${err.message}` });
      }
      return res.status(400).json({ success: false, data: null, message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, data: null, message: 'Файл не выбран' });
    }

    const url = `/uploads/${req.file.filename}`;
    res.json({ success: true, data: { url, filename: req.file.filename, size: req.file.size }, message: 'Файл загружен' });
  });
});

export default router;
