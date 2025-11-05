import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { CategoryManagementComponent } from './features/menu-admin/pages/category-management/category-management.component';
import { DishManagementComponent } from './features/menu-admin/pages/dish-management/dish-management.component';
import { ClientManagementComponent } from './features/clients/pages/client-management/client-management.component';

export const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('./auth/auth.routes').then(m => m.AUTH_ROUTES)
    },
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [authGuard]
    },
    {
        path: 'admin/categories',
        component: CategoryManagementComponent,
        canActivate: [authGuard]
    },
    {
        path: 'admin/dishes',
        component: DishManagementComponent,
        canActivate: [authGuard]
    },
    {
        path: 'clients',
        component: ClientManagementComponent,
        canActivate: [authGuard]
    },
    {
        path: 'proposals/builder/:functionId',
        loadComponent: () => import('./features/proposals/pages/builder/builder.component').then(m => m.ProposalBuilderComponent),
        canActivate: [authGuard]
    },
    {
        path: '',
        redirectTo: '/auth/login',
        pathMatch: 'full'
    }
];
