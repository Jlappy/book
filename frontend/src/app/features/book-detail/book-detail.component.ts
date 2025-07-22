import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute } from '@angular/router';
import { catchError, finalize, of, switchMap } from 'rxjs';

import { IBook } from '../../shared/models/book.model';
import { BookService } from '../../core/services/book.service';
import { CartService } from '../../core/services/cart.service';
import { FavoriteService } from '../../core/services/favorite.service';
import { AuthService } from '../../core/services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatSnackBarModule,
    CurrencyPipe,
  ],
  templateUrl: './book-detail.component.html',
  styleUrl: './book-detail.component.scss'
})
export class BookDetailComponent implements OnInit {
  book: IBook | null = null;
  loading = true;
  errorMessage: string | null = null;
  favorites: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private cartService: CartService,
    private favoriteService: FavoriteService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        const bookId = params.get('id');
        if (!bookId) {
          this.errorMessage = 'Không tìm thấy ID sách.';
          this.loading = false;
          return of(null);
        }

        this.loading = true;
        this.errorMessage = null;

        return this.bookService.getBookById(bookId).pipe(
          catchError(error => {
            console.error('Lỗi khi tải chi tiết sách:', error);
            this.errorMessage = 'Không thể tải chi tiết sách.';
            return of(null);
          }),
          finalize(() => this.loading = false)
        );
      })
    ).subscribe(book => {
      if (book) {
        this.book = book;
        this.favoriteService.getFavorites().subscribe({
          next: (favIds) => this.favorites = favIds,
          error: (err) => console.error('Lỗi khi tải yêu thích:', err)
        });
      } else if (!this.errorMessage) {
        this.errorMessage = 'Không tìm thấy sách.';
      }
    });
  }

  isAdmin(): boolean {
    return this.authService.getCurrentUserValue()?.role === 'admin';
  }

  isArray(value: any): boolean {
    return Array.isArray(value);
  }

  isInFavorites(bookId: string): boolean {
    return this.favorites.includes(bookId);
  }

  toggleFavorite(bookId: string): void {
    if (this.isInFavorites(bookId)) {
      this.favoriteService.removeFavorite(bookId).subscribe({
        next: () => {
          this.favorites = this.favorites.filter(id => id !== bookId);
          this.snackBar.open('Đã xóa khỏi yêu thích!', 'Đóng', { duration: 3000, panelClass: ['snackbar-success'] });
        },
        error: (err) => {
          console.error('Lỗi khi xóa khỏi yêu thích:', err);
          const errorMessage = err.error?.message || 'Không thể xóa khỏi yêu thích.';
          this.snackBar.open(errorMessage, 'Đóng', { duration: 5000, panelClass: ['snackbar-error'] });
        }
      });
    } else {
      this.favoriteService.addFavorite(bookId).subscribe({
        next: () => {
          this.favorites = [...this.favorites, bookId];
          this.snackBar.open('Đã thêm vào yêu thích!', 'Đóng', { duration: 3000, panelClass: ['snackbar-success'] });
        },
        error: (err) => {
          console.error('Lỗi khi thêm vào yêu thích:', err);
          const errorMessage = err.error?.message || 'Không thể thêm vào yêu thích.';
          this.snackBar.open(errorMessage, 'Đóng', { duration: 5000, panelClass: ['snackbar-error'] });
        }
      });
    }
  }

  addToCart(bookId: string): void {
    this.cartService.addToCart(bookId, 1).subscribe({
      next: () => {
        this.snackBar.open('Đã thêm vào giỏ hàng!', 'Đóng', { duration: 3000, panelClass: ['snackbar-success'] });
      },
      error: (err) => {
        console.error('Lỗi khi thêm vào giỏ hàng:', err);
        const errorMessage = err.error?.message || 'Không thể thêm vào giỏ hàng.';
        this.snackBar.open(errorMessage, 'Đóng', { duration: 5000, panelClass: ['snackbar-error'] });
      }
    });
  }
}
