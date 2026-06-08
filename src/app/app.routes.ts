import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/admin-layout.component').then(m => m.AdminLayoutComponent),
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
        path: 'admin/table-templates',
        loadComponent: () => import('./features/table-templates/table-template-list.component').then(m => m.TableTemplateListComponent)
      },
      {
        path: 'admin/table-templates/new',
        loadComponent: () => import('./features/table-templates/table-template-editor.component').then(m => m.TableTemplateEditorComponent)
      },
      {
        path: 'admin/table-templates/:id/edit',
        loadComponent: () => import('./features/table-templates/table-template-editor.component').then(m => m.TableTemplateEditorComponent)
      },
      {
        path: 'admin/document-templates',
        loadComponent: () => import('./features/document-templates/document-template-list.component').then(m => m.DocumentTemplateListComponent)
      },
      {
        path: 'admin/document-templates/new',
        loadComponent: () => import('./features/document-templates/document-template-editor.component').then(m => m.DocumentTemplateEditorComponent)
      },
      {
        path: 'admin/document-templates/:id/edit',
        loadComponent: () => import('./features/document-templates/document-template-editor.component').then(m => m.DocumentTemplateEditorComponent)
      },
      {
        path: 'references/organizations',
        loadComponent: () => import('./features/organizations/organization-list.component').then(m => m.OrganizationListComponent)
      },
      {
        path: 'references/organizations/new',
        loadComponent: () => import('./features/organizations/organization-editor.component').then(m => m.OrganizationEditorComponent)
      },
      {
        path: 'references/organizations/:id/edit',
        loadComponent: () => import('./features/organizations/organization-editor.component').then(m => m.OrganizationEditorComponent)
      },
      {
        path: 'references/suppliers',
        redirectTo: '/references/organizations?role=supplier',
        pathMatch: 'full'
      },
      {
        path: 'references/suppliers/new',
        redirectTo: '/references/organizations/new',
        pathMatch: 'full'
      },
      {
        path: 'references/suppliers/:id/edit',
        redirectTo: '/references/organizations',
        pathMatch: 'full'
      },
      {
        path: 'references/counterparty-roles',
        loadComponent: () => import('./features/counterparty-roles/counterparty-role-list.component').then(m => m.CounterpartyRoleListComponent)
      },
      {
        path: 'references/counterparty-roles/new',
        loadComponent: () => import('./features/counterparty-roles/counterparty-role-editor.component').then(m => m.CounterpartyRoleEditorComponent)
      },
      {
        path: 'references/counterparty-roles/:id/edit',
        loadComponent: () => import('./features/counterparty-roles/counterparty-role-editor.component').then(m => m.CounterpartyRoleEditorComponent)
      },
      {
        path: 'references/doc-types',
        loadComponent: () => import('./features/doc-types/doc-type-list.component').then(m => m.DocTypeListComponent)
      },
      {
        path: 'app-guide',
        loadComponent: () => import('./features/app-guide/app-guide.component').then(m => m.AppGuideComponent)
      },
      {
        path: 'sales/cart',
        loadComponent: () => import('./features/proposal-showcase/proposal-showcase.component').then(m => m.ProposalShowcaseComponent)
      },
      {
        path: 'sales/markup-analysis',
        loadComponent: () => import('./features/markup-analysis/markup-analysis.component').then(m => m.MarkupAnalysisComponent)
      },
      {
        path: 'sales/proposals',
        loadComponent: () => import('./features/proposals/proposal-list.component').then(m => m.ProposalListComponent)
      },
      {
        path: 'sales/proposals/new',
        loadComponent: () => import('./features/proposals/proposal-editor.component').then(m => m.ProposalEditorComponent)
      },
      {
        path: 'sales/proposals/:id/edit',
        loadComponent: () => import('./features/proposals/proposal-editor.component').then(m => m.ProposalEditorComponent)
      },
      {
        path: 'sales/contracts',
        loadComponent: () => import('./features/contracts/contract-list.component').then(m => m.ContractListComponent)
      },
      {
        path: 'sales/contracts/new',
        loadComponent: () => import('./features/contracts/contract-editor.component').then(m => m.ContractEditorComponent)
      },
      {
        path: 'sales/contracts/:id/edit',
        loadComponent: () => import('./features/contracts/contract-editor.component').then(m => m.ContractEditorComponent)
      },
      {
        path: 'sales/products',
        loadComponent: () => import('./features/products/product-list.component').then(m => m.ProductListComponent)
      },
      {
        path: 'sales/products/new',
        loadComponent: () => import('./features/products/product-editor.component').then(m => m.ProductEditorComponent)
      },
      {
        path: 'sales/products/:id/edit',
        loadComponent: () => import('./features/products/product-editor.component').then(m => m.ProductEditorComponent)
      },
      {
        path: 'references/clients',
        loadComponent: () => import('./features/clients/client-list.component').then(m => m.ClientListComponent)
      },
      {
        path: 'references/product-categories',
        loadComponent: () => import('./features/products/product-category-list.component').then(m => m.ProductCategoryListComponent)
      },
      {
        path: 'admin/feature-flags',
        loadComponent: () => import('./features/feature-flags/feature-flags.component').then(m => m.FeatureFlagsComponent)
      },
      {
        path: 'admin/tenders',
        loadComponent: () => import('./features/admin/tender-list.component').then(m => m.TenderListComponent)
      },
      {
        path: 'admin/status-workflows',
        loadComponent: () => import('./features/admin/status-workflow-list.component').then(m => m.StatusWorkflowListComponent)
      },
      {
        path: 'admin/users',
        loadComponent: () => import('./features/admin/user-management.component').then(m => m.UserManagementComponent)
      },
      {
        path: 'admin/rpp',
        loadComponent: () => import('./features/admin/rpp-list.component').then(m => m.RppListComponent)
      },
      {
        path: 'admin/certificates',
        loadComponent: () => import('./features/admin/certificate-list.component').then(m => m.CertificateListComponent)
      },
      {
        path: 'admin/cad-files',
        loadComponent: () => import('./features/admin/inventor-file-list.component').then(m => m.InventorFileListComponent)
      },
      // ===== Бухгалтерия (Фаза 4) =====
      {
        path: 'finance',
        loadComponent: () => import('./features/finance/finance-dashboard.component').then(m => m.FinanceDashboardComponent)
      },
      {
        path: 'finance/order-closing',
        loadComponent: () => import('./features/finance/order-closing-list.component').then(m => m.OrderClosingListComponent)
      },
      {
        path: 'finance/reconciliation',
        loadComponent: () => import('./features/finance/reconciliation-act-list.component').then(m => m.ReconciliationActListComponent)
      },
      {
        path: 'finance/reports',
        loadComponent: () => import('./features/finance/financial-report-list.component').then(m => m.FinancialReportListComponent)
      },
      // ===== Производство (Фаза 2) =====
      {
        path: 'production/work-types',
        loadComponent: () => import('./features/production/work-type-list.component').then(m => m.WorkTypeListComponent)
      },
      {
        path: 'production/work-centers',
        loadComponent: () => import('./features/production/work-center-list.component').then(m => m.WorkCenterListComponent)
      },
      {
        path: 'production/workers',
        loadComponent: () => import('./features/production/worker-list.component').then(m => m.WorkerListComponent)
      },
      {
        path: 'production/orders',
        loadComponent: () => import('./features/production/production-order-list.component').then(m => m.ProductionOrderListComponent)
      },
      {
        path: 'production/tasks',
        loadComponent: () => import('./features/production/order-task-list.component').then(m => m.OrderTaskListComponent)
      },
      {
        path: 'production/gantt',
        loadComponent: () => import('./features/production/gantt-chart.component').then(m => m.GanttChartComponent)
      },
      // ===== Склад и Закупки (Фаза 3) =====
      {
        path: 'warehouse',
        loadComponent: () => import('./features/warehouse/warehouse-dashboard.component').then(m => m.WarehouseDashboardComponent)
      },
      {
        path: 'warehouse/new',
        loadComponent: () => import('./features/warehouse/warehouse-editor.component').then(m => m.WarehouseEditorComponent)
      },
      {
        path: 'warehouse/storage-items',
        loadComponent: () => import('./features/warehouse/storage-item-list.component').then(m => m.StorageItemListComponent)
      },
      // procurement (literal paths BEFORE :id)
      {
        path: 'warehouse/purchase-requests',
        loadComponent: () => import('./features/warehouse/purchase-request-list.component').then(m => m.PurchaseRequestListComponent)
      },
      {
        path: 'warehouse/purchase-requests/new',
        loadComponent: () => import('./features/warehouse/purchase-request-list.component').then(m => m.PurchaseRequestListComponent)
      },
      {
        path: 'warehouse/purchase-requests/:id/edit',
        loadComponent: () => import('./features/warehouse/purchase-request-list.component').then(m => m.PurchaseRequestListComponent)
      },
      {
        path: 'warehouse/supplier-orders',
        loadComponent: () => import('./features/warehouse/supplier-order-list.component').then(m => m.SupplierOrderListComponent)
      },
      {
        path: 'warehouse/supplier-orders/new',
        loadComponent: () => import('./features/warehouse/supplier-order-list.component').then(m => m.SupplierOrderListComponent)
      },
      {
        path: 'warehouse/supplier-orders/:id/edit',
        loadComponent: () => import('./features/warehouse/supplier-order-list.component').then(m => m.SupplierOrderListComponent)
      },
      {
        path: 'warehouse/incoming-invoices',
        loadComponent: () => import('./features/warehouse/invoice-list.component').then(m => m.InvoiceListComponent)
      },
      {
        path: 'warehouse/incoming-invoices/new',
        loadComponent: () => import('./features/warehouse/invoice-list.component').then(m => m.InvoiceListComponent)
      },
      {
        path: 'warehouse/incoming-invoices/:id/edit',
        loadComponent: () => import('./features/warehouse/invoice-list.component').then(m => m.InvoiceListComponent)
      },
      // :id goes LAST
      {
        path: 'warehouse/:id',
        loadComponent: () => import('./features/warehouse/warehouse-detail.component').then(m => m.WarehouseDetailComponent)
      },
      {
        path: 'warehouse/:id/edit',
        loadComponent: () => import('./features/warehouse/warehouse-editor.component').then(m => m.WarehouseEditorComponent)
      }
    ]
  },
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent)
  },
  { path: '**', redirectTo: '' }
];
