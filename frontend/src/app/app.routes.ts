import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { BookDetailComponent } from './features/book-detail/book-detail.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { FavoritesComponent } from './features/favorites/favorites.component';
import { CartComponent } from './features/cart/cart.component';
import { OrdersComponent } from './features/orders/orders.component';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { AccountComponent } from './features/account/account.component';
import { AdminDashboardComponent } from './features/admin/admin-dashboard/admin-dashboard.component';
import { OpenLibrarySearchComponent } from './features/books/open-library-search/open-library-search.component';
import { guestGuard } from './core/guards/guest.guard';
import { userOnlyGuard } from './core/guards/user-only.guard';
import { BookManagerComponent } from './features/admin/book-manager/book-manager.component';
import { OrderManagerComponent } from './features/admin/order-manager/order-manager.component';
import { AdminManagerComponent } from './features/admin/admin-manager/admin-manager.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'book/:id', component: BookDetailComponent },
    { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
    { path: 'register', component: RegisterComponent },

    { path: 'favorites', component: FavoritesComponent, canActivate: [authGuard, userOnlyGuard] },
    { path: 'cart', component: CartComponent, canActivate: [authGuard, userOnlyGuard] },
    { path: 'order', component: OrdersComponent, canActivate: [authGuard] },
    { path: 'account', component: AccountComponent, canActivate: [authGuard] },
    {
        path: 'dashboard', component: AdminDashboardComponent, canActivate: [adminGuard], children: [
            { path: 'books', component: BookManagerComponent },
            { path: 'orders', component: OrderManagerComponent },
            { path: 'openlibrary-search', component: OpenLibrarySearchComponent },
            { path: 'users', component: AdminManagerComponent },
            { path: '', redirectTo: 'books', pathMatch: 'full' }

        ]
    },
    { path: '**', redirectTo: '', pathMatch: 'full' },
];
