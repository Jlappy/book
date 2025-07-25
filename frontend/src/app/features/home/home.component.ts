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
    favorites: IBook[] = [];
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
            })
        );

        const favorites$ = this.authService.isUser() ?
            this.favoriteService.getFavoriteBooks().pipe(
                catchError(error => {
                    console.error('Lỗi khi tải yêu thích:', error);
                    return of([] as IBook[]);
                })
            ) :
            of([] as IBook[]);

        forkJoin([books$, favorites$]).pipe(
            finalize(() => this.loading = false)
        ).subscribe(([books, favorites]) => {
            this.favorites = favorites;

            this.favoriteSet = new Set(favorites.map(f => f._id));

            this.books = books.map(book => ({
                ...book,
                isInFavorites: this.favoriteSet.has(book._id)
            }));

            this.totalItems = this.books.length;
            this.paginate();
        });
    }

    searchBooks(term: string): void {
        this.loading = true;
        this.errorMessage = null;

        const searchResults$ = this.bookService.searchBooksInDb(term).pipe(
            catchError(error => {
                console.error('Lỗi khi tìm kiếm sách:', error);
                this.errorMessage = 'Không thể tìm kiếm sách.';
                return of([] as IBook[]);
            })
        );

        const favorites$ = this.authService.isLoggedIn()
            ? this.favoriteService.getFavoriteBooks().pipe(
                catchError(error => {
                    console.error('Lỗi khi tải yêu thích trong tìm kiếm:', error);
                    return of([] as IBook[]);
                })
            )
            : of([] as IBook[]);


        forkJoin([searchResults$, favorites$]).pipe(
            finalize(() => this.loading = false)
        ).subscribe(([results, favorites]) => {
            this.favorites = favorites;
            this.favoriteSet = new Set(favorites.map(f => f._id));

            this.books = results.map(book => ({
                ...book,
                isInFavorites: this.favoriteSet.has(book._id)
            }));

            this.totalItems = this.books.length;
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

    toggleFavorite(bookId: string): void {
        // Tìm sách trong mảng `books` để cập nhật trực tiếp trạng thái `isInFavorites` của nó
        const bookToUpdate = this.books.find(book => book._id === bookId);

        if (!bookToUpdate) {
            console.warn('Không tìm thấy sách để cập nhật trạng thái yêu thích:', bookId);
            return;
        }

        if (bookToUpdate.isInFavorites) {
            this.favoriteService.removeFavorite(bookId).subscribe({
                next: () => {
                    this.favoriteSet.delete(bookId);
                    this.favorites = this.favorites.filter(book => book._id !== bookId);
                    bookToUpdate.isInFavorites = false;


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
                    this.favoriteSet.add(bookId);
                    const favoriteBook = this.books.find(book => book._id === bookId);
                    if (favoriteBook) this.favorites = [...this.favorites, favoriteBook];
                    bookToUpdate.isInFavorites = true;


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