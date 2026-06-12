import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';
import { requireRole } from './core/role.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    canActivateChild: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'ui-kit',
        loadComponent: () => import('./features/ui-kit/ui-kit.component').then(m => m.UiKitComponent)
      },
      {
        path: 'app-guide',
        loadComponent: () => import('./features/app-guide/app-guide.component').then(m => m.AppGuideComponent)
      },

      // ===== Администрирование (admin only) =====
      {
        path: 'admin',
        canActivateChild: [requireRole('admin')],
        children: [
          {
            path: 'table-templates',
            loadComponent: () => import('./features/table-templates/table-template-list.component').then(m => m.TableTemplateListComponent)
          },
          {
            path: 'table-templates/new',
            loadComponent: () => import('./features/table-templates/table-template-editor.component').then(m => m.TableTemplateEditorComponent)
          },
          {
            path: 'table-templates/:id/edit',
            loadComponent: () => import('./features/table-templates/table-template-editor.component').then(m => m.TableTemplateEditorComponent)
          },
          {
            path: 'document-templates',
            loadComponent: () => import('./features/document-templates/document-template-list.component').then(m => m.DocumentTemplateListComponent)
          },
          {
            path: 'document-templates/new',
            loadComponent: () => import('./features/document-templates/document-template-editor.component').then(m => m.DocumentTemplateEditorComponent)
          },
          {
            path: 'document-templates/:id/edit',
            loadComponent: () => import('./features/document-templates/document-template-editor.component').then(m => m.DocumentTemplateEditorComponent)
          },
          {
            path: 'feature-flags',
            loadComponent: () => import('./features/feature-flags/feature-flags.component').then(m => m.FeatureFlagsComponent)
          },
          {
            path: 'tenders',
            loadComponent: () => import('./features/admin/tender-list.component').then(m => m.TenderListComponent)
          },
          {
            path: 'status-workflows',
            loadComponent: () => import('./features/admin/status-workflow-list.component').then(m => m.StatusWorkflowListComponent)
          },
          {
            path: 'users',
            loadComponent: () => import('./features/admin/user-management.component').then(m => m.UserManagementComponent)
          },
          {
            path: 'rpp',
            loadComponent: () => import('./features/admin/rpp-list.component').then(m => m.RppListComponent)
          },
          {
            path: 'certificates',
            loadComponent: () => import('./features/admin/certificate-list.component').then(m => m.CertificateListComponent)
          },
          {
            path: 'cad-files',
            loadComponent: () => import('./features/admin/inventor-file-list.component').then(m => m.InventorFileListComponent)
          },
          {
            path: 'monitor',
            loadComponent: () => import('./features/admin/monitor-dashboard.component').then(m => m.MonitorDashboardComponent)
          },
          {
            path: 'one-c',
            loadComponent: () => import('./features/admin/one-c-integration.component').then(m => m.OneCIntegrationComponent)
          },
        ]
      },

      // ===== Справочники (admin, manager, production) =====
      {
        path: 'references',
        canActivateChild: [requireRole('admin', 'manager', 'production')],
        children: [
          {
            path: 'organizations',
            loadComponent: () => import('./features/organizations/organization-list.component').then(m => m.OrganizationListComponent)
          },
          {
            path: 'organizations/new',
            loadComponent: () => import('./features/organizations/organization-editor.component').then(m => m.OrganizationEditorComponent)
          },
          {
            path: 'organizations/:id/edit',
            loadComponent: () => import('./features/organizations/organization-editor.component').then(m => m.OrganizationEditorComponent)
          },
          {
            path: 'suppliers',
            redirectTo: '/references/organizations?role=supplier',
            pathMatch: 'full'
          },
          {
            path: 'suppliers/new',
            redirectTo: '/references/organizations/new',
            pathMatch: 'full'
          },
          {
            path: 'suppliers/:id/edit',
            redirectTo: '/references/organizations',
            pathMatch: 'full'
          },
          {
            path: 'counterparty-roles',
            loadComponent: () => import('./features/counterparty-roles/counterparty-role-list.component').then(m => m.CounterpartyRoleListComponent)
          },
          {
            path: 'counterparty-roles/new',
            loadComponent: () => import('./features/counterparty-roles/counterparty-role-editor.component').then(m => m.CounterpartyRoleEditorComponent)
          },
          {
            path: 'counterparty-roles/:id/edit',
            loadComponent: () => import('./features/counterparty-roles/counterparty-role-editor.component').then(m => m.CounterpartyRoleEditorComponent)
          },
          {
            path: 'doc-types',
            loadComponent: () => import('./features/doc-types/doc-type-list.component').then(m => m.DocTypeListComponent)
          },
          {
            path: 'clients',
            loadComponent: () => import('./features/clients/client-list.component').then(m => m.ClientListComponent)
          },
          {
            path: 'product-categories',
            loadComponent: () => import('./features/products/product-category-list.component').then(m => m.ProductCategoryListComponent)
          },
        ]
      },

      // ===== Продажи (admin, manager) =====
      {
        path: 'sales',
        canActivateChild: [requireRole('admin', 'manager')],
        children: [
          {
            path: 'cart',
            loadComponent: () => import('./features/proposal-showcase/proposal-showcase.component').then(m => m.ProposalShowcaseComponent)
          },
          {
            path: 'markup-analysis',
            loadComponent: () => import('./features/markup-analysis/markup-analysis.component').then(m => m.MarkupAnalysisComponent)
          },
          {
            path: 'proposals',
            loadComponent: () => import('./features/proposals/proposal-list.component').then(m => m.ProposalListComponent)
          },
          {
            path: 'proposals/new',
            loadComponent: () => import('./features/proposals/proposal-editor.component').then(m => m.ProposalEditorComponent)
          },
          {
            path: 'proposals/:id/edit',
            loadComponent: () => import('./features/proposals/proposal-editor.component').then(m => m.ProposalEditorComponent)
          },
          {
            path: 'contracts',
            loadComponent: () => import('./features/contracts/contract-list.component').then(m => m.ContractListComponent)
          },
          {
            path: 'contracts/new',
            loadComponent: () => import('./features/contracts/contract-editor.component').then(m => m.ContractEditorComponent)
          },
          {
            path: 'contracts/:id/edit',
            loadComponent: () => import('./features/contracts/contract-editor.component').then(m => m.ContractEditorComponent)
          },
          {
            path: 'products',
            loadComponent: () => import('./features/products/product-list.component').then(m => m.ProductListComponent)
          },
          {
            path: 'products/new',
            loadComponent: () => import('./features/products/product-editor.component').then(m => m.ProductEditorComponent)
          },
          {
            path: 'products/:id/edit',
            loadComponent: () => import('./features/products/product-editor.component').then(m => m.ProductEditorComponent)
          },
        ]
      },

      // ===== Производство (admin, production) =====
      {
        path: 'production',
        canActivateChild: [requireRole('admin', 'production')],
        children: [
          {
            path: 'work-types',
            loadComponent: () => import('./features/production/work-type-list.component').then(m => m.WorkTypeListComponent)
          },
          {
            path: 'work-centers',
            loadComponent: () => import('./features/production/work-center-list.component').then(m => m.WorkCenterListComponent)
          },
          {
            path: 'workers',
            loadComponent: () => import('./features/production/worker-list.component').then(m => m.WorkerListComponent)
          },
          {
            path: 'orders',
            loadComponent: () => import('./features/production/production-order-list.component').then(m => m.ProductionOrderListComponent)
          },
          {
            path: 'tasks',
            loadComponent: () => import('./features/production/order-task-list.component').then(m => m.OrderTaskListComponent)
          },
          {
            path: 'gantt',
            loadComponent: () => import('./features/production/gantt-chart.component').then(m => m.GanttChartComponent)
          },
        ]
      },

      // ===== Бухгалтерия (admin, accountant) =====
      {
        path: 'finance',
        canActivateChild: [requireRole('admin', 'accountant')],
        children: [
          {
            path: '',
            loadComponent: () => import('./features/finance/finance-dashboard.component').then(m => m.FinanceDashboardComponent)
          },
          {
            path: 'order-closing',
            loadComponent: () => import('./features/finance/order-closing-list.component').then(m => m.OrderClosingListComponent)
          },
          {
            path: 'reconciliation',
            loadComponent: () => import('./features/finance/reconciliation-act-list.component').then(m => m.ReconciliationActListComponent)
          },
          {
            path: 'reports',
            loadComponent: () => import('./features/finance/financial-report-list.component').then(m => m.FinancialReportListComponent)
          },
        ]
      },

      // ===== Склад и Закупки (admin, storekeeper) =====
      {
        path: 'warehouse',
        canActivateChild: [requireRole('admin', 'storekeeper')],
        children: [
          {
            path: '',
            loadComponent: () => import('./features/warehouse/warehouse-dashboard.component').then(m => m.WarehouseDashboardComponent)
          },
          {
            path: 'new',
            loadComponent: () => import('./features/warehouse/warehouse-editor.component').then(m => m.WarehouseEditorComponent)
          },
          {
            path: 'storage-items',
            loadComponent: () => import('./features/warehouse/storage-item-list.component').then(m => m.StorageItemListComponent)
          },
          // procurement (literal paths BEFORE :id)
          {
            path: 'purchase-requests',
            loadComponent: () => import('./features/warehouse/purchase-request-list.component').then(m => m.PurchaseRequestListComponent)
          },
          {
            path: 'purchase-requests/new',
            loadComponent: () => import('./features/warehouse/purchase-request-list.component').then(m => m.PurchaseRequestListComponent)
          },
          {
            path: 'purchase-requests/:id/edit',
            loadComponent: () => import('./features/warehouse/purchase-request-list.component').then(m => m.PurchaseRequestListComponent)
          },
          {
            path: 'supplier-orders',
            loadComponent: () => import('./features/warehouse/supplier-order-list.component').then(m => m.SupplierOrderListComponent)
          },
          {
            path: 'supplier-orders/new',
            loadComponent: () => import('./features/warehouse/supplier-order-list.component').then(m => m.SupplierOrderListComponent)
          },
          {
            path: 'supplier-orders/:id/edit',
            loadComponent: () => import('./features/warehouse/supplier-order-list.component').then(m => m.SupplierOrderListComponent)
          },
          {
            path: 'incoming-invoices',
            loadComponent: () => import('./features/warehouse/invoice-list.component').then(m => m.InvoiceListComponent)
          },
          {
            path: 'incoming-invoices/new',
            loadComponent: () => import('./features/warehouse/invoice-list.component').then(m => m.InvoiceListComponent)
          },
          {
            path: 'incoming-invoices/:id/edit',
            loadComponent: () => import('./features/warehouse/invoice-list.component').then(m => m.InvoiceListComponent)
          },
          // :id goes LAST
          {
            path: ':id',
            loadComponent: () => import('./features/warehouse/warehouse-detail.component').then(m => m.WarehouseDetailComponent)
          },
          {
            path: ':id/edit',
            loadComponent: () => import('./features/warehouse/warehouse-editor.component').then(m => m.WarehouseEditorComponent)
          },
        ]
      },
    ]
  },
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent)
  },
  { path: '**', redirectTo: '' }
];
