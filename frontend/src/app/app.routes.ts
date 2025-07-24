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
import { AdminDashboardComponent } from './features/admin-dashboard/admin-dashboard.component';
import { OpenLibrarySearchComponent } from './features/books/open-library-search/open-library-search.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'book/:id', component: BookDetailComponent },
    { path: 'login', component: LoginComponent, canActivate: [authGuard] },
    { path: 'register', component: RegisterComponent },
    { path: 'favorites', component: FavoritesComponent, canActivate: [authGuard] },
    { path: 'cart', component: CartComponent, canActivate: [authGuard] },
    { path: 'order', component: OrdersComponent },
    { path: 'dashboard', component: AdminDashboardComponent, canActivate: [adminGuard] },
    { path: 'account', component: AccountComponent, canActivate: [authGuard] },
    { path: 'admin/openlibrary-search', component: OpenLibrarySearchComponent, canActivate: [adminGuard] },

    { path: '**', redirectTo: '' }
];
