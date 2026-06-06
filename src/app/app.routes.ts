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
        loadComponent: () => import('./features/cart/cart.component').then(m => m.CartComponent)
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
      }
    ]
  },
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent)
  },
  { path: '**', redirectTo: '' }
];
