import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { forkJoin, of, catchError, finalize } from 'rxjs';

import { IBook } from '../../shared/models/book.model';
import { BookCardComponent } from '../../shared/components/book-card/book-card.component';
import { BookService } from '../../core/services/book.service';
import { FavoriteService } from '../../core/services/favorite.service';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';
import { SearchService } from '../../core/services/search.service';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
        CommonModule,
        BookCardComponent,
        MatPaginatorModule,
        MatSnackBarModule,
    ],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
    books: IBook[] = [];

    paginatedBooks: IBook[] = [];
    favorites: string[] = [];
    favoriteSet: Set<string> = new Set();

    totalItems: number = 0;
    pageSize = 12;
    currentPage = 1;

    loading = true;
    errorMessage: string | null = null;

    constructor(
        private bookService: BookService,
        private favoriteService: FavoriteService,
        private cartService: CartService,
        private snackBar: MatSnackBar,
        private authService: AuthService,
        private searchService: SearchService
    ) { }

    ngOnInit(): void {
        this.searchService.searchTerm$.subscribe(term => {
            if (term) {
                this.searchBooks(term);
            } else {
                this.loadInitialData();
            }
        });
    }

    loadInitialData(): void {
        this.loading = true;
        this.errorMessage = null;

        const books$ = this.bookService.getAllBooks().pipe(
            catchError(error => {
                console.error('Lỗi khi tải sách:', error);
                this.errorMessage = 'Không thể tải sách.';
                return of([] as IBook[]);
            }),
            finalize(() => this.loading = false)
        )
            .subscribe(books => {
                this.books = books;
                this.totalItems = books.length;
                this.paginate()
            })

        if (this.authService.isLoggedIn()) {
            this.favoriteService.getFavorites().pipe(
                catchError(error => {
                    console.error('Lỗi khi tải yêu thích:', error);
                    return of([] as string[]);
                })
            )
                .subscribe(favorites => {
                    this.favorites = favorites;
                    this.favoriteSet = new Set(favorites)
                })
        }
    }

    searchBooks(term: string): void {
        this.bookService.searchBooksInDb(term).subscribe(results => {
            this.books = results;
            this.totalItems = results.length;
            this.currentPage = 1;
            this.paginate();
        });
    }

    paginate(): void {
        const start = (this.currentPage - 1) * this.pageSize;
        const end = start + this.pageSize;
        this.paginatedBooks = this.books.slice(start, end);
    }

    onPageChange(event: PageEvent): void {
        this.currentPage = event.pageIndex + 1;
        this.pageSize = event.pageSize;
        this.paginate();
    }

    isInFavorites(bookId: string): boolean {
        return this.favoriteSet.has(bookId)
    }
    toggleFavorite(bookId: string): void {
        if (this.isInFavorites(bookId)) {
            this.favoriteService.removeFavorite(bookId).subscribe({
                next: () => {
                    this.favorites = this.favorites.filter(id => id !== bookId);
                    this.snackBar.open('Đã xóa khỏi danh sách yêu thích!', 'Đóng', { duration: 3000, panelClass: ['snackbar-success'] });
                },
                error: (err) => {
                    console.error('Lỗi khi xóa khỏi yêu thích:', err);
                    const errorMessage = err.error?.message || 'Không thể xóa khỏi yêu thích. Vui lòng thử lại.';
                    this.snackBar.open(errorMessage, 'Đóng', { duration: 5000, panelClass: ['snackbar-error'] });
                }
            });
        } else {
            this.favoriteService.addFavorite(bookId).subscribe({
                next: () => {
                    this.favorites = [...this.favorites, bookId];
                    this.snackBar.open('Đã thêm vào danh sách yêu thích!', 'Đóng', { duration: 3000, panelClass: ['snackbar-success'] });
                },
                error: (err) => {
                    console.error('Lỗi khi thêm vào yêu thích:', err);
                    const errorMessage = err.error?.message || 'Không thể thêm vào yêu thích. Vui lòng thử lại.';
                    this.snackBar.open(errorMessage, 'Đóng', { duration: 5000, panelClass: ['snackbar-error'] });
                }
            });
        }
    }

    addToCart(bookId: string): void {
        this.cartService.addToCart(bookId, 1).subscribe({
            next: () => {
                this.snackBar.open('Đã thêm sách vào giỏ hàng!', 'Đóng', { duration: 3000, panelClass: ['snackbar-success'] });
            },
            error: (err) => {
                console.error('Lỗi khi thêm vào giỏ hàng:', err);
                const errorMessage = err.error?.message || 'Không thể thêm vào giỏ hàng. Vui lòng thử lại.';
                this.snackBar.open(errorMessage, 'Đóng', { duration: 5000, panelClass: ['snackbar-error'] });
            }
        });
    }

    get totalPagesCalculated(): number {
        return Math.ceil(this.totalItems / this.pageSize);
    }
}