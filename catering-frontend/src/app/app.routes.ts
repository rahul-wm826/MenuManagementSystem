import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { CategoryManagementComponent } from './features/menu-admin/pages/category-management/category-management.component';

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
        path: 'proposals',
        loadComponent: () => import('./features/proposals/pages/proposal-list/proposal-list.component').then(m => m.ProposalListComponent),
        canActivate: [authGuard]
    },
    {
        path: 'proposals/:id',
        loadComponent: () => import('./features/proposals/pages/proposal-detail/proposal-detail.component').then(m => m.ProposalDetailComponent),
        canActivate: [authGuard]
    },
    {
        path: '',
        redirectTo: '/auth/register',
        pathMatch: 'full'
    }
];
