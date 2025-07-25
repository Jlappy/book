import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BookCardComponent } from '../../shared/components/book-card/book-card.component';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { IBook } from '../../shared/models/book.model';
import { BookService } from '../../core/services/book.service';
import { FavoriteService } from '../../core/services/favorite.service';
import { CartService } from '../../core/services/cart.service';
import { catchError, finalize, forkJoin, of } from 'rxjs';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [
    CommonModule,
    BookCardComponent,
    MatPaginatorModule,
    MatSnackBarModule
  ],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss'
})
export class FavoritesComponent implements OnInit {
  favoriteBooks: IBook[] = [];
  favoriteSet: Set<string> = new Set();

  paginatedFavorites: IBook[] = [];

  totalItems: number = 0;
  pageSize = 12;

  currentPage = 1;
  loading = true;

  errorMessage: string | null = null;

  constructor(
    private bookService: BookService,
    private favoriteService: FavoriteService,
    private cartService: CartService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadFavoriteBooks();
  }

  loadFavoriteBooks(): void {
    this.loading = true;
    this.errorMessage = null;

    this.favoriteService.getFavoriteBooks().pipe(
      catchError(error => {
        console.error('Lỗi khi tải sách yêu thích:', error);
        this.errorMessage = 'Không thể tải danh sách yêu thích.';
        return of([] as IBook[]);
      }),
      finalize(() => this.loading = false)
    ).subscribe((books: IBook[]) => {
      this.favoriteBooks = books;
      this.favoriteSet = new Set(books.map(b => b._id));
      this.totalItems = books.length;
      this.paginate();
    });
  }


  paginate(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedFavorites = this.favoriteBooks.slice(start, end);
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.paginate();
  }

  isInFavorites(bookId: string): boolean {
    return this.favoriteSet.has(bookId);
  }

  toggleFavorite(bookId: string): void {
    if (this.isInFavorites(bookId)) {
      this.favoriteService.removeFavorite(bookId).subscribe(() => {
        this.favoriteBooks = this.favoriteBooks.filter(book => book._id !== bookId);
        this.favoriteSet.delete(bookId);
        this.totalItems = this.favoriteBooks.length;
        this.paginate();
        this.snackBar.open('Đã xoá khỏi yêu thích!', 'Đóng', { duration: 3000 });
      });
    } else {
      this.favoriteService.addFavorite(bookId).subscribe(() => {
        this.bookService.getBookById(bookId).subscribe(book => {
          if (book) {
            this.favoriteBooks.push(book);
            this.favoriteSet.add(bookId);
            this.totalItems = this.favoriteBooks.length;
            this.paginate();
            this.snackBar.open('Đã thêm vào yêu thích!', 'Đóng', { duration: 3000 });
          }
        });
      });
    }
  }

  addToCart(bookId: string): void {
    this.cartService.addToCart(bookId, 1).subscribe({
      next: () => this.snackBar.open('Đã thêm vào giỏ hàng!', 'Đóng', { duration: 3000 }),
      error: () => this.snackBar.open('Lỗi khi thêm vào giỏ hàng.', 'Đóng', { duration: 5000 })
    });
  }
}