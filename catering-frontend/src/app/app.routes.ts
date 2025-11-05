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
        path: 'clients/:id',
        loadComponent: () => import('./features/clients/pages/client-detail/client-detail.component').then(m => m.ClientDetailComponent),
        canActivate: [authGuard]
    },
    {
        path: 'events/:id',
        loadComponent: () => import('./features/events/pages/event-detail/event-detail.component').then(m => m.EventDetailComponent),
        canActivate: [authGuard]
    },
    {
        path: 'proposals/builder/:functionId',
        loadComponent: () => import('./features/proposals/pages/builder/builder.component').then(m => m.BuilderComponent),
        canActivate: [authGuard]
    },
    {
        path: 'client-view/:token',
        loadComponent: () => import('./features/client-view/pages/client-view/client-view.component').then(m => m.ClientViewComponent)
    },
    {
        path: '',
        redirectTo: '/auth/register',
        pathMatch: 'full'
    }
];
