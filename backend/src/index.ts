// ========================================
// Backend Entry Point
// ========================================

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { env } from './config/env.js';
import { connectDB, disconnectDB } from './config/db.js';
import { errorHandler, notFoundHandler } from './middleware/error-handler.js';
import { logger } from './utils/logger.js';
import { setupSwagger } from './docs/swagger.js';
import authRoutes from './modules/auth.routes.js';
import organizationRoutes from './modules/organization.routes.js';
import counterpartyRoleRoutes from './modules/counterparty-role.routes.js';
import productRoutes from './modules/product.routes.js';
import productCategoryRoutes from './modules/product-category.routes.js';
import clientRoutes from './modules/client.routes.js';
import docTypeRoutes from './modules/doc-type.routes.js';
import documentTemplateRoutes from './modules/document-template.routes.js';
import workCenterRoutes from './modules/work-center.routes.js';
import workerRoutes from './modules/worker.routes.js';
import productionOrderRoutes from './modules/production-order.routes.js';
import tableTemplateRoutes from './modules/table-template.routes.js';
import certificateRoutes from './modules/certificate.routes.js';
import contractRoutes from './modules/contract.routes.js';
import commercialProposalRoutes from './modules/commercial-proposal.routes.js';
import financialReportRoutes from './modules/financial-report.routes.js';
import inventorFileRoutes from './modules/inventor-file.routes.js';
import invoiceRoutes from './modules/invoice.routes.js';
import orderClosingRoutes from './modules/order-closing.routes.js';
import productComponentRoutes from './modules/product-component.routes.js';
import purchaseRequestRoutes from './modules/purchase-request.routes.js';
import reconciliationActRoutes from './modules/reconciliation-act.routes.js';
import roleRoutes from './modules/role.routes.js';
import rppRoutes from './modules/rpp.routes.js';
import statusWorkflowRoutes from './modules/status-workflow.routes.js';
import storageItemRoutes from './modules/storage-item.routes.js';
import supplierOrderRoutes from './modules/supplier-order.routes.js';
import tenderRoutes from './modules/tender.routes.js';
import userRoutes from './modules/user.routes.js';
import warehouseRoutes from './modules/warehouse.routes.js';
import workTypeRoutes from './modules/work-type.routes.js';
import inventoryRoutes from './modules/inventory.routes.js';

import uploadRoutes from './modules/upload.routes.js';
import { User } from './modules/user.model.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const log = logger.child({ module: 'server' });

// Security middleware
app.set('trust proxy', 1); // доверять Nginx (X-Forwarded-For для rate-limit)
app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(cookieParser());
app.use(express.json({ limit: '1mb' }));

// Rate limiting for auth routes (5 попыток за 15 минут)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 5,                   // не больше 5 запросов за окно
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, data: null, message: 'Слишком много запросов. Попробуйте позже.' },
});

// Static files (uploads)
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));

// Routes — rate-limit только на логин
app.use('/api/v1/auth/login', authLimiter);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/organizations', organizationRoutes);
app.use('/api/v1/counterparty-roles', counterpartyRoleRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/product-categories', productCategoryRoutes);
app.use('/api/v1/clients', clientRoutes);
app.use('/api/v1/doc-types', docTypeRoutes);
app.use('/api/v1/document-templates', documentTemplateRoutes);
app.use('/api/v1/work-centers', workCenterRoutes);
app.use('/api/v1/workers', workerRoutes);
app.use('/api/v1/production-orders', productionOrderRoutes);
app.use('/api/v1/table-templates', tableTemplateRoutes);

// New CRUD routes
app.use('/api/v1/certificates', certificateRoutes);
app.use('/api/v1/contracts', contractRoutes);
app.use('/api/v1/commercial-proposals', commercialProposalRoutes);
app.use('/api/v1/financial-reports', financialReportRoutes);
app.use('/api/v1/inventor-files', inventorFileRoutes);
app.use('/api/v1/invoices', invoiceRoutes);
app.use('/api/v1/order-closings', orderClosingRoutes);
app.use('/api/v1/product-components', productComponentRoutes);
app.use('/api/v1/purchase-requests', purchaseRequestRoutes);
app.use('/api/v1/reconciliation-acts', reconciliationActRoutes);
app.use('/api/v1/roles', roleRoutes);
app.use('/api/v1/rpp', rppRoutes);
app.use('/api/v1/status-workflows', statusWorkflowRoutes);
app.use('/api/v1/storage-items', storageItemRoutes);
app.use('/api/v1/supplier-orders', supplierOrderRoutes);
app.use('/api/v1/tenders', tenderRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/warehouses', warehouseRoutes);
app.use('/api/v1/work-types', workTypeRoutes);
app.use('/api/v1/inventory', inventoryRoutes);

// File upload
app.use('/api/v1/upload', uploadRoutes);

// Swagger docs
setupSwagger(app);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use(notFoundHandler);

// Error handler
app.use(errorHandler);

// Start
let dbConnected = false;

async function start() {
  // Пробуем подключиться к MongoDB, но не падаем если недоступна
  try {
    await connectDB();
    dbConnected = true;

    // Создаём admin по умолчанию, если нет пользователей
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      await User.create({
        username: 'admin',
        password: 'admin123',
        displayName: 'Администратор',
        email: 'admin@project-core.local',
        role: 'admin',
        permissions: ['*']
      });
      logger.child({ module: 'seed' }).info('Admin user created (admin / admin123)');
    }
  } catch (err) {
    log.warn(err, 'MongoDB unavailable — running without database. Auth and CRUD endpoints will return 503.');
  }

  const server = app.listen(env.PORT, () => {
    log.info(`Running on http://localhost:${env.PORT}`);
    log.info(`Environment: ${env.NODE_ENV}`);
    if (!dbConnected) log.warn('MongoDB: DISCONNECTED');
  });

  // Graceful shutdown
  const shutdown = async (signal: string) => {
    log.warn(`Received ${signal}. Shutting down gracefully...`);
    server.close(async () => {
      if (dbConnected) await disconnectDB();
      log.info('Shut down complete.');
      process.exit(0);
    });
  };
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

start();
